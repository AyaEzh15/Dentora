<?php

namespace App\Repositories\Contracts;

use App\Models\MedicalRecord;

interface MedicalRecordRepositoryInterface
{
    public function findForPatient(int $clinicId, int $patientId): ?MedicalRecord;

    public function upsert(array $data): MedicalRecord;
}
