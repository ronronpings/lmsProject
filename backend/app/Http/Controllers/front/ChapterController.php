<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chapter;
use App\Models\Course;
use App\Http\Requests\Account\ChapterStoreRequest;
use App\Http\Requests\Account\ChapterUpdateRequest;

class ChapterController extends Controller
{
    //
     public function index(Request $request) {

      //since sorting is already implemented, we can just get the chapters
      //and the sort_order will handle the order
       $chapters = Chapter::where('course_id', $request->integer('course_id'))->orderBy('sort_order', 'asc')->get();

       return response()->json([
         'status' => 200,
         'data' => $chapters,
       ],200);
    }

      
    public function store(ChapterStoreRequest $request) {
      $data = $request->validated();
      $data['sort_order'] = 1000;
      $chapter = Chapter::create($data);

       return response()->json([
        'message' => 'Chapter created successfully.',
        'data' => $chapter
    ], 201);
    }
    public function update(ChapterUpdateRequest $request, $id) {
        $chapter = Chapter::findOrFail($id);
        $data = $request->validated();
        $data['sort_order'] = 1000;
        $chapter->update($data);

        return response()->json([
         'message'=> 'Chapter updated successfully',
         'data'=> $chapter->fresh()
        ],200);
    }
    public function destroy($id) {  
      $chapter = Chapter::findOrFail($id);
      $chapter->delete();

      return response()->json([
        'status' => 200,
        'message' => 'Chapter deleted Successfully'
      ],200);
    }
    public function sortChapters(Request $request) {
      
      foreach($request->text as $key => $value){
        $chapter = Chapter::findOrFail($value['id']); //find the id of the chapter
        $chapter->sort_order = $key; //update the sort order
        $chapter->save(); //save the changes
      }
      return response()->json([
        'status' => 200,
        'message' => 'Order updated successfully'
      ],200);

    }
}
