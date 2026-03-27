<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Levels;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    //
    public function fetchCategories()
    {
        $categories = Category::where('status', 1)->get();
        return response()->json([
            'status' => true,
            'message' => 'Categories fetched successfully',
            'data' => $categories,
        ]);
    }
    public function fetchLevels(){
        $levels = Levels::where('status', 1)->get();
        return response()->json([
            'status' => true,
            'message' => 'Levels fetched successfully',
            'data' => $levels,
        ]);
    }
    public function fetchLanguages(){
        $languages = Language::where('status', 1)->get();
        return response()->json([
            'status' => true,
            'message' => 'Languages fetched successfully',
            'data' => $languages,
        ]);
    }
    public function fetchAllCourses(){
        $courses = Course::where('status', 1)->where('is_featured', 'yes')->with(['level', 'language', 'category'])->get();
        return response()->json([
            'status' => true,
            'message' => 'Courses fetched successfully',
            'data' => $courses,
        ]);
    }

    public function courses(Request $request){
        $courses = Course::where('status', 1)->with(['level', 'language', 'category'])->orderBy('created_at', 'desc');
        //filter courses by keyword
        if($request->keyword){
            $courses = $courses->where('title', 'like', '%'.$request->keyword.'%');
        }
        //filter course by category 
        if(!empty($request->category)){
            //convert string of category id into array
            $categotyArr = explode(',', $request->category);
            $courses = $courses->whereIn('category_id', $categotyArr);
        }
        //filter course by level
         if(!empty($request->level)){
            //convert string of category id into array
            $levelArr = explode(',', $request->level);
            $courses = $courses->whereIn('level_id', $levelArr);
        }
        //filter by language 
        if (!empty($request->language)) {
            $languageArr = explode(',', $request->language);
            $courses = $courses->whereIn('language_id', $languageArr);
        }
        
        if(!empty($request->sort)){
          $sortArr = ['asc', 'desc'];
          if(in_array($request->sort, $sortArr)){
            $courses = $courses->orderBy('created_at', $request->sort);
          }else{
            $courses = $courses->orderBy('created_at', 'desc');
          }
        }
        
        $courses = $courses->get();


        return response()->json([
            'status' => true,
            'message' => 'Courses fetched successfully',
            'data' => $courses,
        ]);
    }
     
}
