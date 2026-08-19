<?php 

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Carbon\Carbon;
use Illuminate\Support\Facades\Config;

class JwtService
{
    protected string $secret;
    protected string $algorithm;
    protected int $expiry;

    public function __construct()
    {
        $this->secret = Config::get('services.jwt.secret');
        $this->expiry = (int)Config::get('services.jwt.expiry');
        $this->algorithm = Config::get('services.jwt.algorithm');
    }

    public function generateToken(array $payload): string
    {
        $issuedAt = Carbon::now()->timestamp;
        $expirationTime = $issuedAt + $this->expiry;

        $tokenPayload = array_merge($payload, [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
        ]);

        return JWT::encode($tokenPayload, $this->secret, $this->algorithm);
    }

    public function decodeToken(string $token): array | null
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algorithm));
            return (array)$decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function isExpired(string $token): bool
    {
        $decoded = $this->decodeToken($token);
        if ($decoded === null) {
            return true;
        }

        $expirationTime = $decoded['exp'] ?? 0;
        return Carbon::now()->timestamp > $expirationTime;
    }

    public function refreshToken(string $token): string | null
    {
        $decoded = $this->decodeToken($token);
        if ($decoded === null || $this->isExpired($token)) {
            return null;
        }

        unset($decoded['iat'], $decoded['exp']);
        return $this->generateToken($decoded);
    }

    public function isValid(string $token): bool
    {
        $decoded = $this->decodeToken($token);
        return $decoded !== null && !$this->isExpired($token);
    }
}