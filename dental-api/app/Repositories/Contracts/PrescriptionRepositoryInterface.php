<?php

namespace App\Repositories\Contracts;

use App\Models\Prescription;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PrescriptionRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator;

    public function findForClinic(int $clinicId, int $id): ?Prescription;

    public function nextNumber(int $clinicId): string;

    public function create(array $data): Prescription;

    public function update(Prescription $prescription, array $data): Prescription;

    public function syncItems(Prescription $prescription, array $items): Prescription;
}
