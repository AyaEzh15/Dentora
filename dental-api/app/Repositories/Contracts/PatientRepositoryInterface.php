<?php

namespace App\Repositories\Contracts;

use App\Models\Patient;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PatientRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator;

    public function findForClinic(int $clinicId, int $id): ?Patient;

    public function create(array $data): Patient;

    public function update(Patient $patient, array $data): Patient;

    public function nextFileNumber(int $clinicId): string;

    public function countForClinic(int $clinicId, array $filters = []): int;

    public function searchForClinic(int $clinicId, string $term, int $limit = 10, array $filters = []): Collection;
}
