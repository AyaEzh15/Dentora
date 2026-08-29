<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Consultation */
class ConsultationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patientId' => $this->patient_id,
            'dentistId' => $this->dentist_id,
            'appointmentId' => $this->appointment_id,
            'careTypeId' => $this->care_type_id,
            'consultedAt' => $this->consulted_at?->toIso8601String(),
            'status' => $this->status?->value,
            'statusLabel' => $this->status?->label(),
            'chiefComplaint' => $this->chief_complaint,
            'clinicalExam' => $this->clinical_exam,
            'diagnosis' => $this->diagnosis,
            'treatmentNotes' => $this->treatment_notes,
            'recommendations' => $this->recommendations,
            'patient' => new PatientSummaryResource($this->whenLoaded('patient')),
            'dentist' => new UserResource($this->whenLoaded('dentist')),
            'careType' => new CareTypeResource($this->whenLoaded('careType')),
            'procedures' => ConsultationProcedureResource::collection($this->whenLoaded('procedures')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
