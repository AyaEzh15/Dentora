<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Appointment */
class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patientId' => $this->patient_id,
            'dentistId' => $this->dentist_id,
            'careTypeId' => $this->care_type_id,
            'startAt' => $this->start_at?->toIso8601String(),
            'endAt' => $this->end_at?->toIso8601String(),
            'status' => $this->status?->value,
            'statusLabel' => $this->status?->label(),
            'reason' => $this->careType?->name ?? $this->reason,
            'notes' => $this->notes,
            'cancelledAt' => $this->cancelled_at?->toIso8601String(),
            'cancelReason' => $this->cancel_reason,
            'patient' => new PatientSummaryResource($this->whenLoaded('patient')),
            'dentist' => new UserResource($this->whenLoaded('dentist')),
            'careType' => new CareTypeResource($this->whenLoaded('careType')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
