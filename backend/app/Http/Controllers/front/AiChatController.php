<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AiChatController extends Controller
{
    public function chat(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);

        $apiKey = env('GROQ_API_KEY');
        $model = env('GROQ_MODEL', 'llama-3.1-8b-instant');

        if (empty($apiKey)) {
            return response()->json([
                'status' => false,
                'message' => 'Groq API key is not configured.',
            ], 500);
        }

        $course = Course::with([
            'level',
            'language',
            'category',
            'outcomes',
            'requirements',
            'chapters.lessons',
        ])->find($validated['course_id']);

        if (!$course) {
            return response()->json([
                'status' => false,
                'message' => 'Course not found.',
            ], 404);
        }

        $description = $this->plainText($course->description);
        $outcomes = $course->outcomes
            ->pluck('text')
            ->filter()
            ->values()
            ->all();
        $requirements = $course->requirements
            ->pluck('text')
            ->filter()
            ->values()
            ->all();
        $chapters = $course->chapters->map(function ($chapter) {
            return [
                'title' => $chapter->title,
                'lessons' => $chapter->lessons->pluck('title')->filter()->values()->all(),
            ];
        })->values()->all();

      $systemPrompt = "You are an AI course assistant for an LMS course page.\n"
            ."Answer in a helpful, concise, student-friendly way.\n"
            ."Only use the course information provided below.\n"
            ."If the user asks something not covered by the course data, say that the detail is not available yet.\n"
            ."Do not invent pricing, schedules, certificates, instructors, or hidden features.\n"
            ."When appropriate, use short bullet points.\n"
            ."Keep the tone supportive and clear.";  

        $courseContext = [
            'title' => $course->title,
            'category' => $course->category?->name,
            'level' => $course->level?->name,
            'language' => $course->language?->name,
            'description' => $description,
            'outcomes' => $outcomes,
            'requirements' => $requirements,
            'chapters' => $chapters,
            'price' => $course->price
        ];

        try {
            $response = Http::withToken($apiKey)
                ->acceptJson()
                ->timeout(30)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => $model,
                    'temperature' => 0.4,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt,
                        ],
                        [
                            'role' => 'user',
                            'content' => "Course data:\n".json_encode($courseContext, JSON_PRETTY_PRINT)."\n\nStudent question:\n".$validated['message'],
                        ],
                    ],
                ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Unable to reach the AI service right now.',
                'error' => app()->isLocal() ? $e->getMessage() : null,
            ], 502);
        }

        if (!$response->successful()) {
            return response()->json([
                'status' => false,
                'message' => 'AI service request failed.',
                'error' => app()->isLocal() ? $response->json() : null,
            ], $response->status());
        }

        $reply = data_get($response->json(), 'choices.0.message.content');

        if (!$reply) {
            return response()->json([
                'status' => false,
                'message' => 'AI service returned an empty response.',
            ], 502);
        }

        return response()->json([
            'status' => true,
            'message' => 'AI reply generated successfully.',
            'reply' => trim($reply),
        ]);
    }

    private function plainText(?string $value): string
    {
        if (!$value) {
            return '';
        }

        return Str::of(strip_tags(html_entity_decode($value)))
            ->replaceMatches('/\s+/', ' ')
            ->trim()
            ->toString();
    }
}
