<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\LessonStoreRequest;
use App\Http\Requests\Account\LessonUpdateRequest;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    //
    public function store(LessonStoreRequest $request){
        $data = $request->validated();
        $data['sort_order'] = 1000;
        $lesson = Lesson::create($data);

        return response()->json([
            'message' => 'Lesson created successfully.',
            'data' => $lesson
        ], 201);
    }
    public function update(LessonUpdateRequest $request, $id){
        $lesson = Lesson::findOrFail($id);
        $data = $request->validated();
        $data['is_free_preview'] = ($request->is_free_preview == 'false') ? 'no' : 'yes';
        $lesson->update($data);
        return response()->json([
            'message' => 'Lesson updated successfully.',
            'data' => $lesson->fresh()
        ], 200);
    }
      public function destroy($id) {
      $lesson = Lesson::findOrFail($id);
      $lesson->delete();

      return response()->json([
        'status' => 200,
        'message' => 'Lesson deleted Successfully'
      ],200);
    }
}
