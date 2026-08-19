<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Models\User;
use App\Services\JwtService;
use Illuminate\Support\Facades\Auth;

class JwtAuthMiddleware
{   
    public function __construct(private JwtService $jwt)
    {
    }

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'error' => 'Unauthorized: missing Bearer token'
                ], 401);
        }

        if (! $this->jwt->isValid($token)) {
            return response()->json(['message' => 'Invalid token structure'], 401);
        }

        $decoded = $this->jwt->decodeToken($token);

        if (!$decoded) {
            return response()->json(['message' => 'Invalid or corrupted token'], 401);
        }
        // Talvez ocorra um erro aqui, pois o método isExpired espera uma string, mas está sendo passado um array. Talvez seja necessário passar o token original para a verificação de expiração.
        if ($this->jwt->isExpired($decoded['token'])) {
            return response()->json(['message' => 'Token has expired'], 401);
        }

        $user = User::query()->firstWhere('id', $decoded['sub'] ?? null);

        if (! $user) {
            return response()->json([
                'message' => 'User not found or no longer exists',
            ], 401);
        }

        $request->setUserResolver(fn () => $user);
        Auth::login($user);

        return $next($request);
    }
}
