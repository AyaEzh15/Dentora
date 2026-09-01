<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Invoice */
class InvoiceSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'patientId' => $this->patient_id,
            'status' => $this->status?->value,
            'statusLabel' => $this->status?->label(),
            'total' => (float) $this->total,
            'paidAmount' => (float) $this->paid_amount,
            'remainingAmount' => $this->remainingAmount(),
            'issuedAt' => $this->issued_at?->toIso8601String(),
            'patient' => new PatientSummaryResource($this->whenLoaded('patient')),
        ];
    }
}
