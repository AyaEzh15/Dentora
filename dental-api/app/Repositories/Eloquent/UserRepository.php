<?php

namespace App\Repositories\Eloquent;

use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email): ?User
    {
        return User::query()
            ->with(['clinic', 'roles', 'permissions'])
            ->where('email', $email)
            ->first();
    }

    public function markLoggedIn(User $user): User
    {
        $user->forceFill(['last_login_at' => now()])->save();

        return $user->fresh(['clinic', 'roles', 'permissions']);
    }

    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator
    {
        $query = User::query()
            ->forClinic($clinicId)
            ->with('roles');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['role'])) {
            $query->role($filters['role']);
        }

        return $query->orderBy('name')->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function findForClinic(int $clinicId, int $id): ?User
    {
        return User::query()
            ->forClinic($clinicId)
            ->with('roles')
            ->find($id);
    }

    public function create(array $data): User
    {
        return User::query()->create($data)->load('roles');
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh('roles');
    }

    public function dentistsForClinic(int $clinicId): Collection
    {
        return User::query()
            ->forClinic($clinicId)
            ->where('is_active', true)
            ->role(UserRole::DENTIST->value)
            ->orderBy('name')
            ->get();
    }
}
