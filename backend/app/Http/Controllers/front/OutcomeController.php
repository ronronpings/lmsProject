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

    
       $outcomes = Outcome::where('course_id', $request->integer('course_id'))->get();

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
}
