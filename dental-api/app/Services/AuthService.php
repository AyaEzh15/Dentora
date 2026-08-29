<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $users
    ) {}

    /**
     * @return array{user: User, token: string}
     */
    public function login(array $credentials): array
    {
        $user = $this->users->findByEmail($credentials['email']);

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Ce compte est désactivé. Contactez l\'administrateur.'],
            ]);
        }

        if ($user->clinic && ! $user->clinic->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Ce cabinet n\'est plus actif.'],
            ]);
        }

        $user->tokens()->delete();

        $tokenName = ($credentials['remember'] ?? false) ? 'web-remember' : 'web';
        $token = $user->createToken($tokenName)->plainTextToken;

        return [
            'user' => $this->users->markLoggedIn($user),
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
