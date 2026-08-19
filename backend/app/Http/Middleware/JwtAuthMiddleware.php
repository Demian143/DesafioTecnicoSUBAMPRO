<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthMiddleware
{
    public function __construct(private JwtService $jwt) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if ($token === null) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $decoded = $this->jwt->decodeToken($token);

        if ($decoded === null) {
            return response()->json(['message' => 'Invalid or expired token.'], 401);
        }

        $user = User::query()
            ->whereKey($decoded['sub'] ?? null)
            ->where('ativo', true)
            ->first();

        if ($user === null) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $request->setUserResolver(fn (): User => $user);

        return $next($request);
    }
}
