<?php

namespace App\Repositories\Eloquent;

use App\Models\MedicalRecord;
use App\Repositories\Contracts\MedicalRecordRepositoryInterface;

class MedicalRecordRepository implements MedicalRecordRepositoryInterface
{
    public function findForPatient(int $clinicId, int $patientId): ?MedicalRecord
    {
        return MedicalRecord::query()
            ->forClinic($clinicId)
            ->where('patient_id', $patientId)
            ->first();
    }

    public function upsert(array $data): MedicalRecord
    {
        return MedicalRecord::query()->updateOrCreate(
            ['patient_id' => $data['patient_id']],
            $data
        );
    }
}
