<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\front\Requirement;
use Illuminate\Http\Request;

class RequirementController extends Controller
{
    //
    public function index(Request $request){
        $requirements = Requirement::where('course_id', $request->integer('course_id'))->get();

       return response()->json([
         'status' => 200,
         'data' => $requirements,
       ],200);
    }
   
}
