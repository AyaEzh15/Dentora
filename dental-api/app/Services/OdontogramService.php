<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\OdontogramRepositoryInterface;
use Illuminate\Support\Collection;

class OdontogramService
{
    public function __construct(
        private OdontogramRepositoryInterface $odontogram,
        private PatientService $patients
    ) {}

    public function get(User $user, int $patientId): Collection
    {
        $this->patients->get($user, $patientId);

        return $this->odontogram->forPatient((int) $user->clinic_id, $patientId);
    }

    public function sync(User $user, int $patientId, array $teeth): Collection
    {
        $this->patients->get($user, $patientId);

        foreach ($teeth as $tooth) {
            $this->odontogram->upsertTooth([
                'clinic_id' => $user->clinic_id,
                'patient_id' => $patientId,
                'tooth_number' => $tooth['tooth_number'],
                'condition' => $tooth['condition'],
                'notes' => $tooth['notes'] ?? null,
            ]);
        }

        return $this->get($user, $patientId);
    }
}
