<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\ClinicResource;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());
        $user = $result['user']->loadMissing(['clinic', 'roles', 'permissions']);

        return ApiResponse::success(
            $this->sessionPayload($user, $result['token']),
            'Connexion réussie.'
        );
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing(['clinic', 'roles', 'permissions']);

        return ApiResponse::success(
            $this->sessionPayload($user),
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return ApiResponse::success(null, 'Déconnexion réussie.');
    }

    private function sessionPayload($user, ?string $token = null): array
    {
        $payload = [
            'user' => new UserResource($user),
            'clinic' => $user->clinic ? new ClinicResource($user->clinic) : null,
            'roles' => $user->getRoleNames()->values(),
            'permissions' => $user->getAllPermissions()->pluck('name')->values(),
        ];

        if ($token !== null) {
            $payload['token'] = $token;
            $payload['tokenType'] = 'Bearer';
        }

        return $payload;
    }
}
