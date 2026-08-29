<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\MedicalRecord */
class MedicalRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patientId' => $this->patient_id,
            'bloodType' => $this->blood_type,
            'allergies' => $this->allergies,
            'chronicDiseases' => $this->chronic_diseases,
            'currentMedications' => $this->current_medications,
            'surgicalHistory' => $this->surgical_history,
            'dentalHistory' => $this->dental_history,
            'notes' => $this->notes,
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
