<?php

namespace App\Repositories\Contracts;

use App\Models\Consultation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ConsultationRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator;

    public function findForClinic(int $clinicId, int $id): ?Consultation;

    public function findByAppointment(int $appointmentId): ?Consultation;

    public function create(array $data): Consultation;

    public function update(Consultation $consultation, array $data): Consultation;

    public function syncProcedures(Consultation $consultation, array $procedures): Consultation;
}
