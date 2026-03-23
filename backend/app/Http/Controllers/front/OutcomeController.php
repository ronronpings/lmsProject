<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\OutcomeStoreRequest;
use App\Http\Requests\Account\OutcomeUpdateRequest;
use App\Models\Outcome;
use Illuminate\Http\Request;

class OutcomeController extends Controller
{
    //This method return all outcomes
    public function index(Request $request) {

      //since sorting is already implemented, we can just get the outcomes
      //and the sort_order will handle the order
       $outcomes = Outcome::where('course_id', $request->integer('course_id'))->orderBy('sort_order', 'asc')->get();

       return response()->json([
         'status' => 200,
         'data' => $outcomes,
       ],200);
    }
    public function store(OutcomeStoreRequest $request) {
      $data = $request->validated();
      $data['sort_order'] = 1000;
      $outcome = Outcome::create($data);

       return response()->json([
        'message' => 'Outcome created successfully.',
        'data' => $outcome
    ], 201);
    }
    public function update(OutcomeUpdateRequest $request, $id) {
        $outcome = Outcome::findOrFail($id);
        $data = $request->validated();
        $data['sort_order'] = 1000;
        $outcome->update($data);

        return response()->json([
         'message'=> 'Outcome updated successfully',
         'data'=> $outcome->fresh()
        ],200);
    }
    public function destroy($id) {
      $outcome = Outcome::findOrFail($id);
      $outcome->delete();

      return response()->json([
        'status' => 200,
        'message' => 'Outcome deleted Successfully'
      ],200);
    }
    public function sortOutcomes(Request $request) {
      
      foreach($request->text as $key => $value){
        $outcome = Outcome::findOrFail($value['id']); //find the id of the outcome
        $outcome->sort_order = $key; //update the sort order
        $outcome->save(); //save the changes
      }
      return response()->json([
        'status' => 200,
        'message' => 'Order updated successfully'
      ],200);

    }
}
