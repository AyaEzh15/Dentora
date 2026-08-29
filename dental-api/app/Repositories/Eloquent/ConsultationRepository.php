<?php

namespace App\Repositories\Eloquent;

use App\Models\Consultation;
use App\Repositories\Contracts\ConsultationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ConsultationRepository implements ConsultationRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator
    {
        $query = Consultation::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist', 'careType', 'procedures.careType']);

        if (! empty($filters['patient_id'])) {
            $query->where('patient_id', $filters['patient_id']);
        }

        if (! empty($filters['dentist_id'])) {
            $query->where('dentist_id', $filters['dentist_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('consulted_at')->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function findForClinic(int $clinicId, int $id): ?Consultation
    {
        return Consultation::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist', 'careType', 'appointment', 'procedures.careType'])
            ->find($id);
    }

    public function findByAppointment(int $appointmentId): ?Consultation
    {
        return Consultation::query()
            ->where('appointment_id', $appointmentId)
            ->with(['patient', 'dentist', 'careType', 'procedures.careType'])
            ->first();
    }

    public function create(array $data): Consultation
    {
        $consultation = Consultation::query()->create($data);

        return $consultation->load(['patient', 'dentist', 'careType', 'procedures.careType']);
    }

    public function update(Consultation $consultation, array $data): Consultation
    {
        $consultation->update($data);

        return $consultation->fresh(['patient', 'dentist', 'careType', 'procedures.careType']);
    }

    public function syncProcedures(Consultation $consultation, array $procedures): Consultation
    {
        $consultation->procedures()->delete();

        foreach ($procedures as $procedure) {
            $consultation->procedures()->create($procedure);
        }

        return $consultation->fresh(['patient', 'dentist', 'careType', 'procedures.careType']);
    }
}
