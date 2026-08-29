<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function markLoggedIn(User $user): User;

    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator;

    public function findForClinic(int $clinicId, int $id): ?User;

    public function create(array $data): User;

    public function update(User $user, array $data): User;

    public function dentistsForClinic(int $clinicId): Collection;
}
