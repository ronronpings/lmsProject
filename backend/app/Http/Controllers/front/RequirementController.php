<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use Illuminate\Http\Request;
use App\Http\Requests\Account\RequirementStroreRequest;
use App\Http\Requests\Account\RequirementUpdateRequest;


class RequirementController extends Controller
{
    //
    public function index(Request $request) {
       $requirements = Requirement::where('course_id', $request->integer('course_id'))->get();
       return response()->json([
         'status' => 200,
         'data' => $requirements,
       ],200);
    }
    public function store(RequirementStroreRequest $request) {
      $data = $request->validated();
      $data['sort_order'] = 1000;
      $requirement = Requirement::create($data);

       return response()->json([
        'message' => 'Requirement created successfully.',
        'data' => $requirement
    ], 201);
    }
    public function update(RequirementUpdateRequest $request, $id) {
        $requirement = Requirement::findOrFail($id);
        $data = $request->validated();
        $data['sort_order'] = 1000;
        $requirement->update($data);

        return response()->json([
         'message'=> 'Requirement updated successfully',
         'data'=> $requirement->fresh()
        ],200);
    }
    public function destroy($id) {
      $requirement = Requirement::findOrFail($id);
      $requirement->delete();

      return response()->json([
        'status' => 200,
        'message' => 'Requirement deleted Successfully'
      ],200);
    }
   
}
