<?php

namespace App\Repositories\Eloquent;

use App\Models\Clinic;
use App\Repositories\Contracts\ClinicRepositoryInterface;

class ClinicRepository implements ClinicRepositoryInterface
{
    public function findActive(int $id): ?Clinic
    {
        return Clinic::query()
            ->where('id', $id)
            ->where('is_active', true)
            ->first();
    }
}
