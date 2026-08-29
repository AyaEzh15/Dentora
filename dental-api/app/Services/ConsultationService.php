<?php

namespace App\Services;

use App\Enums\ConsultationStatus;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\User;
use App\Repositories\Contracts\ConsultationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ConsultationService
{
    public function __construct(
        private ConsultationRepositoryInterface $consultations,
        private PatientService $patients
    ) {}

    public function paginate(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->consultations->paginateForClinic(
            (int) $user->clinic_id,
            $this->scopeForActor($user, $filters)
        );
    }

    public function get(User $user, int $id): Consultation
    {
        $consultation = $this->consultations->findForClinic((int) $user->clinic_id, $id);

        if (! $consultation || ! $this->canAccess($user, $consultation)) {
            throw new NotFoundHttpException('Consultation introuvable.');
        }

        return $consultation;
    }

    public function create(User $user, array $data): Consultation
    {
        $this->patients->get($user, (int) $data['patient_id']);

        if ($user->hasRole(UserRole::DENTIST->value) || empty($data['dentist_id'])) {
            $data['dentist_id'] = $data['dentist_id'] ?? $user->id;
        }

        $procedures = $data['procedures'] ?? [];
        unset($data['procedures']);

        $data['clinic_id'] = $user->clinic_id;
        $data['created_by'] = $user->id;
        $data['status'] = $data['status'] ?? ConsultationStatus::COMPLETED->value;
        $data['consulted_at'] = $data['consulted_at'] ?? now();

        $consultation = $this->consultations->create($data);

        if ($procedures) {
            $consultation = $this->consultations->syncProcedures($consultation, $procedures);
        }

        return $consultation;
    }

    public function createFromAppointment(User $user, Appointment $appointment): Consultation
    {
        $existing = $this->consultations->findByAppointment($appointment->id);

        if ($existing) {
            return $existing;
        }

        $consultation = $this->consultations->create([
            'clinic_id' => $appointment->clinic_id,
            'patient_id' => $appointment->patient_id,
            'dentist_id' => $appointment->dentist_id,
            'appointment_id' => $appointment->id,
            'care_type_id' => $appointment->care_type_id,
            'consulted_at' => $appointment->start_at,
            'status' => ConsultationStatus::DRAFT->value,
            'chief_complaint' => $appointment->reason,
            'created_by' => $user->id,
        ]);

        if ($appointment->care_type_id) {
            $consultation = $this->consultations->syncProcedures($consultation, [
                [
                    'care_type_id' => $appointment->care_type_id,
                    'quantity' => 1,
                ],
            ]);
        }

        return $consultation;
    }

    public function update(User $user, int $id, array $data): Consultation
    {
        $consultation = $this->get($user, $id);

        if ($user->hasRole(UserRole::DENTIST->value)) {
            unset($data['dentist_id']);
        }

        $procedures = $data['procedures'] ?? null;
        unset($data['procedures']);

        $consultation = $this->consultations->update($consultation, $data);

        if (is_array($procedures)) {
            $consultation = $this->consultations->syncProcedures($consultation, $procedures);
        }

        return $consultation;
    }

    private function scopeForActor(User $user, array $filters): array
    {
        if ($user->hasRole(UserRole::DENTIST->value)) {
            $filters['dentist_id'] = $user->id;
        }

        return $filters;
    }

    private function canAccess(User $user, Consultation $consultation): bool
    {
        if (! $user->hasRole(UserRole::DENTIST->value)) {
            return true;
        }

        return (int) $consultation->dentist_id === (int) $user->id;
    }
}
