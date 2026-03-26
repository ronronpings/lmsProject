<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\LessonStoreRequest;
use App\Http\Requests\Account\LessonUpdateRequest;
use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class LessonController extends Controller
{
    
    public function index(Request $request){
      
    }

    public function store(LessonStoreRequest $request){
        $data = $request->validated();
        $data['sort_order'] = 1000;
        $lesson = Lesson::create($data);

        return response()->json([
            'message' => 'Lesson created successfully.',
            'data' => $lesson
        ], 201);
    }

    //fetch Data on lesson edit page
    public function show($id){
        $lesson = Lesson::with('chapter')->findOrFail($id);

        return response()->json([
            'data' => $lesson
        ], 200);
    }


    //update Lesson 
    public function update(LessonUpdateRequest $request, $id){
        $lesson = Lesson::findOrFail($id);
        $data = $request->validated();
        $data['is_free_preview'] = ($request->is_free_preview) ? 'yes' : 'no';
        $lesson->update($data);
        return response()->json([
            'message' => 'Lesson updated successfully.',
            'data' => $lesson->fresh()
        ], 200);
    }
      public function destroy($id) {
      $lesson = Lesson::findOrFail($id);

      $chapterId = $lesson->chapter_id;
      $lesson->delete();
      $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();

      return response()->json([
        'status' => 200,
        'message' => 'Lesson deleted Successfully',
        'data' => $chapter
      ],200);
    }

    //This method will upload lesson video
      public function saveLessonVideo(Request $request, $id ){
        $lesson = Lesson::findOrFail($id);
        $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi,wmv|max:102400',
        ]);
        
        //delete the old image if it exists
        if($lesson->video != ""){
            if(File::exists(public_path('uploads/course/videos'.$lesson->video))){
                File::delete(public_path('uploads/course/videos'.$lesson->video));
            }
        }

        $video = $request->video; 
        $ext = $video->getClientOriginalExtension(); //get the extension of the image(ex, png,jpg,gif)
        $videoName = strtotime('now').'-'.$id.'.'.$ext; //create a unique name for the image
        $video->move(public_path('uploads/course/videos'), $videoName); //move the image to the uploads/course folder
       
        $lesson->video = $videoName;
        $lesson->save();

        return response()->json([
            'status' => 201,
            'message' => 'Video uploaded successfully',
            'data' => $lesson->fresh()
        ],200);

    }

   public function sortLessons(Request $request) {
    $chapterId = $request->chapter_id;
    
    // Safety check: ensure 'text' is an array
    if (!is_array($request->text)) {
        return response()->json(['message' => 'Invalid data'], 400);
    }

    foreach($request->text as $key => $value){
        // Using update directly is slightly more efficient for bulk operations
        Lesson::where('id', $value['id'])->update(['sort_order' => $key]);
    }

    // Load the chapter with reordered lessons to update the frontend state
    $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();
    
    return response()->json([
        'status' => 200,
        'message' => 'Order updated successfully',
        'data' => $chapter
    ], 200);
}
public function sortChapters(Request $request) {
    $courseId = $request->course_id; // Changed to course_id
    
    if (!is_array($request->text)) {
        return response()->json(['message' => 'Invalid data'], 400);
    }

    foreach($request->text as $key => $value){
        Chapter::where('id', $value['id'])->update(['sort_order' => $key]);
    }


    $chapters = Chapter::where('course_id', $courseId)
        ->with('lessons')
        ->orderBy('sort_order', 'asc')
        ->get();
    
    return response()->json([
        'status' => 200,
        'message' => 'Chapters reordered successfully',
        'data' => $chapters
    ], 200);
}

}
