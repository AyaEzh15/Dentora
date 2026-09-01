<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Prescription */
class PrescriptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'patientId' => $this->patient_id,
            'dentistId' => $this->dentist_id,
            'consultationId' => $this->consultation_id,
            'prescribedAt' => $this->prescribed_at?->toIso8601String(),
            'status' => $this->status?->value,
            'statusLabel' => $this->status?->label(),
            'notes' => $this->notes,
            'patient' => new PatientSummaryResource($this->whenLoaded('patient')),
            'dentist' => new UserResource($this->whenLoaded('dentist')),
            'items' => PrescriptionItemResource::collection($this->whenLoaded('items')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
