<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface OdontogramRepositoryInterface
{
    public function forPatient(int $clinicId, int $patientId): Collection;

    public function upsertTooth(array $data): void;
}
