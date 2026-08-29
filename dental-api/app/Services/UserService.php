<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserService
{
    public function __construct(
        private UserRepositoryInterface $users
    ) {}

    public function paginate(User $actor, array $filters = []): LengthAwarePaginator
    {
        return $this->users->paginateForClinic((int) $actor->clinic_id, $filters);
    }

    public function get(User $actor, int $id): User
    {
        $user = $this->users->findForClinic((int) $actor->clinic_id, $id);

        if (! $user) {
            throw new NotFoundHttpException('Membre du personnel introuvable.');
        }

        return $user;
    }

    public function create(User $actor, array $data): User
    {
        $role = $data['role'] ?? UserRole::SECRETARY->value;
        unset($data['role']);

        $data['clinic_id'] = $actor->clinic_id;
        $data['name'] = trim(($data['first_name'] ?? '').' '.($data['last_name'] ?? ''));
        $data['is_active'] = $data['is_active'] ?? true;

        $user = $this->users->create($data);
        $user->syncRoles([$role]);

        return $user->load('roles');
    }

    public function update(User $actor, int $id, array $data): User
    {
        $user = $this->get($actor, $id);
        $role = $data['role'] ?? null;
        unset($data['role']);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        if (isset($data['first_name']) || isset($data['last_name'])) {
            $data['name'] = trim(($data['first_name'] ?? $user->first_name).' '.($data['last_name'] ?? $user->last_name));
        }

        $user = $this->users->update($user, $data);

        if ($role) {
            $user->syncRoles([$role]);
        }

        return $user->load('roles');
    }

    public function dentists(User $actor): Collection
    {
        $dentists = $this->users->dentistsForClinic((int) $actor->clinic_id);

        if ($dentists->isEmpty() && $actor->hasRole(UserRole::ADMIN->value)) {
            return collect([$actor]);
        }

        return $dentists;
    }

    public function assertNotLastAdmin(User $target, ?string $nextRole = null): void
    {
        if (! $target->hasRole(UserRole::ADMIN->value)) {
            return;
        }

        if ($nextRole && $nextRole === UserRole::ADMIN->value) {
            return;
        }

        $admins = User::query()
            ->forClinic((int) $target->clinic_id)
            ->role(UserRole::ADMIN->value)
            ->count();

        if ($admins <= 1) {
            throw ValidationException::withMessages([
                'role' => ['Impossible de retirer le dernier administrateur du cabinet.'],
            ]);
        }
    }
}
