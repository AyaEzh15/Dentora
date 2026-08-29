<?php

namespace App\Services;

use App\Models\CareType;
use App\Models\User;
use App\Repositories\Contracts\CareTypeRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CareTypeService
{
    public function __construct(
        private CareTypeRepositoryInterface $careTypes
    ) {}

    public function list(User $user, bool $includeInactive = false): Collection
    {
        if ($includeInactive && $user->can('care-types.manage')) {
            return $this->careTypes->all();
        }

        return $this->careTypes->allActive();
    }

    public function get(int $id): CareType
    {
        $careType = $this->careTypes->find($id);

        if (! $careType) {
            throw new NotFoundHttpException('Type de soin introuvable.');
        }

        return $careType;
    }

    public function create(array $data): CareType
    {
        $data['slug'] = $this->uniqueSlug($data['name']);
        $data['sort_order'] = $data['sort_order'] ?? $this->careTypes->nextSortOrder();
        $data['is_active'] = $data['is_active'] ?? true;

        return $this->careTypes->create($data);
    }

    public function update(int $id, array $data): CareType
    {
        $careType = $this->get($id);

        if (isset($data['name']) && $data['name'] !== $careType->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $careType->id);
        }

        return $this->careTypes->update($careType, $data);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'soin';
        $slug = $base;
        $index = 2;

        while ($this->careTypes->slugExists($slug, $ignoreId)) {
            $slug = "{$base}-{$index}";
            $index++;
        }

        return $slug;
    }
}
