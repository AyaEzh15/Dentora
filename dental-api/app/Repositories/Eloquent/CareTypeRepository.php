<?php

namespace App\Repositories\Eloquent;

use App\Models\CareType;
use App\Repositories\Contracts\CareTypeRepositoryInterface;
use Illuminate\Support\Collection;

class CareTypeRepository implements CareTypeRepositoryInterface
{
    public function allActive(): Collection
    {
        return CareType::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function all(): Collection
    {
        return CareType::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function find(int $id): ?CareType
    {
        return CareType::query()->find($id);
    }

    public function findActive(int $id): ?CareType
    {
        return CareType::query()
            ->where('is_active', true)
            ->find($id);
    }

    public function findBySlug(string $slug): ?CareType
    {
        return CareType::query()->where('slug', $slug)->first();
    }

    public function create(array $data): CareType
    {
        return CareType::query()->create($data);
    }

    public function update(CareType $careType, array $data): CareType
    {
        $careType->update($data);

        return $careType->fresh();
    }

    public function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        return CareType::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists();
    }

    public function nextSortOrder(): int
    {
        return ((int) CareType::query()->max('sort_order')) + 1;
    }
}
