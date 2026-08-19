<?php

namespace App\Http\Controllers;

use App\Services\JwtService;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(private JwtService $jwtService) {}

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->firstWhere('email', $credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        $token = $this->jwtService->generateToken([
            'sub' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'iat' => now()->timestamp,
            'exp' => now()->addSeconds(config('services.jwt.expiry'))->timestamp,
        ]);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => config('services.jwt.expiry'),
            ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user);
    }
}
