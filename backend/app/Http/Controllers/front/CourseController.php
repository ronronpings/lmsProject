<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;

use App\Http\Requests\Account\CourseStoreRequest;
use App\Models\Course;
use Auth;
use Illuminate\Http\Request;

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
}
