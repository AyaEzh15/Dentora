<?php

namespace App\Repositories\Contracts;

use App\Models\CareType;
use Illuminate\Support\Collection;

interface CareTypeRepositoryInterface
{
    public function allActive(): Collection;

    public function all(): Collection;

    public function find(int $id): ?CareType;

    public function findActive(int $id): ?CareType;

    public function findBySlug(string $slug): ?CareType;

    public function create(array $data): CareType;

    public function update(CareType $careType, array $data): CareType;

    public function slugExists(string $slug, ?int $ignoreId = null): bool;

    public function nextSortOrder(): int;
}
