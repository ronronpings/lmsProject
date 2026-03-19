<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;

use App\Http\Requests\Account\CourseStoreRequest;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Levels;
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
}
