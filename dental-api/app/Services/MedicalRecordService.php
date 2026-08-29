<?php

namespace App\Services;

use App\Models\MedicalRecord;
use App\Models\User;
use App\Repositories\Contracts\MedicalRecordRepositoryInterface;

class MedicalRecordService
{
    public function __construct(
        private MedicalRecordRepositoryInterface $records,
        private PatientService $patients
    ) {}

    public function get(User $user, int $patientId): ?MedicalRecord
    {
        $this->patients->get($user, $patientId);

        return $this->records->findForPatient((int) $user->clinic_id, $patientId);
    }

    public function upsert(User $user, int $patientId, array $data): MedicalRecord
    {
        $this->patients->get($user, $patientId);

        $data['clinic_id'] = $user->clinic_id;
        $data['patient_id'] = $patientId;

        return $this->records->upsert($data);
    }
}
