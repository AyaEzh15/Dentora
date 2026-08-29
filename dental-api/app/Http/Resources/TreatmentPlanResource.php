<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TreatmentPlan */
class TreatmentPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patientId' => $this->patient_id,
            'dentistId' => $this->dentist_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status?->value,
            'statusLabel' => $this->status?->label(),
            'progressPercent' => $this->progressPercent(),
            'patient' => new PatientSummaryResource($this->whenLoaded('patient')),
            'dentist' => new UserResource($this->whenLoaded('dentist')),
            'phases' => TreatmentPlanPhaseResource::collection($this->whenLoaded('phases')),
            'updatedAt' => $this->updated_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
