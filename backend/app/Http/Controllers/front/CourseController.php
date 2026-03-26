<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;

use App\Http\Requests\Account\CourseStoreRequest;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Language;
use App\Models\Lesson;
use App\Models\Levels;
use Auth;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;


class CourseController extends Controller
{   
    //This method will return all course for a specific user
    public function index(){

    }
    public function store(CourseStoreRequest $request){
    $data = $request->validated();
       
    $data['status'] = 0;
    $data['user_id'] = Auth::id();

    $course = Course::create($data);

    return response()->json([
        'message' => 'Course created successfully.',
        'data' => $course
    ], 201);
    }


    public function show($id){
        $course = Course::with(['chapters', 'chapters.lessons'])->find($id);

        if($course == null){
            return response()->json([
                'status' => 404,
                'message' => 'Course not found',
            ]);
        }

         return response()->json([
            'status' => 200,
            'data'=> $course
        ],200);
    }

    //retrieve level/language/categories
    public function retrieve(){
        $categories = Category::all();
        $levels = Levels::all();
        $languages = Language::all();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ],200);
    }
    public function update(CourseStoreRequest $request, $id){
        $course = Course::findOrFail($id);
        $data = $request->validated();
       
        $course->update($data);

        return response()->json([
         'message'=> 'Course updated successfully',
         'data'=> $course->fresh()
        ],200);
    }
    //upload Image
    public function saveCourseImage(Request $request, $id ){
        $course = Course::findOrFail($id);
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        //delete the old image if it exists
        if($course->image != ""){
            if(File::exists(public_path('uploads/course/'.$course->image))){
                File::delete(public_path('uploads/course/'.$course->image));
            }
            if(File::exists(public_path('uploads/course/small/'.$course->image))){
                File::delete(public_path('uploads/course/small/'.$course->image));
            }
        }

        $image = $request->image; 
        $ext = $image->getClientOriginalExtension(); //get the extension of the image(ex, png,jpg,gif)
        $imageName = strtotime('now').'-'.$id.'.'.$ext; //create a unique name for the image
        
        $image->move(public_path('uploads/course'), $imageName); //move the image to the uploads/course folder

        //Create small Thumbnail
        $manager = new ImageManager(Driver::class); //initialize the image manager
        $image = $manager->read(public_path('uploads/course/'.$imageName)); //read the image
        //crop the best fitting
        $image->cover(750,450); //crop the image to the best fitting
        $image->save(public_path('uploads/course/small/'.$imageName)); //save the image to the uploads/course/small folder

        $course->image = $imageName;
        $course->save();

        return response()->json([
            'status' => 201,
            'message' => 'Image uploaded successfully',
            'data' => $course->fresh()
        ],200);

    }

    //publish course change Status
    public function publishCoursechangeStatus(Request $request, $id){
        $course = Course::findOrFail($id);
        $course->status = $request->status;
        $course->save();

        $message = ($course->status == 1) ?'Course published successfully':'Course unpublished successfully';

        return response()->json([
            'status' => 200,
            'message' => $message,
            'data' => $course->fresh()
        ],200);
    }

    public function destroy($id, Request $request){
  
      $course = Course::with('chapters.lessons')
        ->where('id', $id)
        ->where('user_id', $request->user()->id)
        ->firstOrFail();

        foreach ($course->chapters as $chapter) {
            foreach ($chapter->lessons as $lesson) {
                if (!empty($lesson->video)) {
                    $videoPath = public_path('uploads/course/videos/' . $lesson->video);
                    if (File::exists($videoPath)) {
                        File::delete($videoPath);
                    }
                }
            }
        }

        if (!empty($course->image)) {
            $small = public_path('uploads/course/small/' . $course->image);
            $full  = public_path('uploads/course/' . $course->image);

            if (File::exists($small)) File::delete($small);
            if (File::exists($full)) File::delete($full);
        }

        $deletedId = $course->id;
        $course->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Course deleted successfully',
            'data' => ['id' => $deletedId],
        ], 200);
    }
}
