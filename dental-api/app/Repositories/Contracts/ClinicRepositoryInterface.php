<?php

namespace App\Repositories\Contracts;

use App\Models\Clinic;

interface ClinicRepositoryInterface
{
    public function findActive(int $id): ?Clinic;
}
