<?php

namespace App\Repositories\Eloquent;

use App\Models\OdontogramTooth;
use App\Repositories\Contracts\OdontogramRepositoryInterface;
use Illuminate\Support\Collection;

class OdontogramRepository implements OdontogramRepositoryInterface
{
    public function forPatient(int $clinicId, int $patientId): Collection
    {
        return OdontogramTooth::query()
            ->forClinic($clinicId)
            ->where('patient_id', $patientId)
            ->orderBy('tooth_number')
            ->get();
    }

    public function upsertTooth(array $data): void
    {
        OdontogramTooth::query()->updateOrCreate(
            [
                'patient_id' => $data['patient_id'],
                'tooth_number' => $data['tooth_number'],
            ],
            $data
        );
    }
}
