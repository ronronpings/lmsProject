<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\Account\LoginRequest;
use App\Http\Requests\Account\RegisterRequest;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    //
    public function register(RegisterRequest $request){

        $data = $request->validated();

        // Hash password before saving
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json([
            'status' => 201,
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }
}
