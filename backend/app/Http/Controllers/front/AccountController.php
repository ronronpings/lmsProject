<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
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
    public function login(LoginRequest $request){

    $data = $request->validated();
   
    
    if(!Auth::attempt($data)){
        return response()->json([
            'message' => 'Invalid Credentials.',
            'errors' => [
                'email' => ['Email or password is incorrect.']
            ],
        ],422);
    }
    $user = Auth::user();
    $token = $user->createToken('api-token')->plainTextToken;
    return response()->json([
        'message' => 'Login successful.',
        'user' => $user,
        'access_token' => $token,
    ],201);
    }
}
