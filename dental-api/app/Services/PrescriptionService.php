<?php

namespace App\Services;

use App\Enums\PrescriptionStatus;
use App\Enums\UserRole;
use App\Models\Prescription;
use App\Models\User;
use App\Repositories\Contracts\PrescriptionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PrescriptionService
{
    public function __construct(
        private PrescriptionRepositoryInterface $prescriptions,
        private PatientService $patients,
        private ConsultationService $consultations
    ) {}

    public function paginate(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->prescriptions->paginateForClinic(
            (int) $user->clinic_id,
            $this->scopeForActor($user, $filters)
        );
    }

    public function get(User $user, int $id): Prescription
    {
        $prescription = $this->prescriptions->findForClinic((int) $user->clinic_id, $id);

        if (! $prescription || ! $this->canAccess($user, $prescription)) {
            throw new NotFoundHttpException('Ordonnance introuvable.');
        }

        return $prescription;
    }

    public function create(User $user, array $data): Prescription
    {
        $this->patients->get($user, (int) $data['patient_id']);

        if (! empty($data['consultation_id'])) {
            $consultation = $this->consultations->get($user, (int) $data['consultation_id']);

            if ((int) $consultation->patient_id !== (int) $data['patient_id']) {
                throw ValidationException::withMessages([
                    'consultation_id' => ['Cette consultation n\'appartient pas à ce patient.'],
                ]);
            }

            $data['dentist_id'] = $data['dentist_id'] ?? $consultation->dentist_id;
        }

        if ($user->hasRole(UserRole::DENTIST->value) || empty($data['dentist_id'])) {
            $data['dentist_id'] = $data['dentist_id'] ?? $user->id;
        }

        $items = $data['items'] ?? [];
        unset($data['items']);

        $data['clinic_id'] = $user->clinic_id;
        $data['created_by'] = $user->id;
        $data['prescribed_at'] = $data['prescribed_at'] ?? now();
        $data['status'] = $data['status'] ?? PrescriptionStatus::ISSUED->value;
        $data['number'] = $this->prescriptions->nextNumber((int) $user->clinic_id);

        $prescription = $this->prescriptions->create($data);

        if ($items) {
            $prescription = $this->prescriptions->syncItems($prescription, $items);
        }

        return $prescription;
    }

    public function update(User $user, int $id, array $data): Prescription
    {
        $prescription = $this->get($user, $id);

        if ($user->hasRole(UserRole::DENTIST->value)) {
            unset($data['dentist_id']);
        }

        $items = $data['items'] ?? null;
        unset($data['items'], $data['number']);

        $prescription = $this->prescriptions->update($prescription, $data);

        if (is_array($items)) {
            $prescription = $this->prescriptions->syncItems($prescription, $items);
        }

        return $prescription;
    }

    private function scopeForActor(User $user, array $filters): array
    {
        if ($user->hasRole(UserRole::DENTIST->value)) {
            $filters['dentist_id'] = $user->id;
        }

        return $filters;
    }

    private function canAccess(User $user, Prescription $prescription): bool
    {
        if (! $user->hasRole(UserRole::DENTIST->value)) {
            return true;
        }

        return (int) $prescription->dentist_id === (int) $user->id;
    }
}
