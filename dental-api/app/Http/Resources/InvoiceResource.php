<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Invoice */
class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'patientId' => $this->patient_id,
            'dentistId' => $this->dentist_id,
            'consultationId' => $this->consultation_id,
            'issuedAt' => $this->issued_at?->toIso8601String(),
            'status' => $this->status?->value,
            'statusLabel' => $this->status?->label(),
            'subtotal' => (float) $this->subtotal,
            'taxAmount' => (float) $this->tax_amount,
            'total' => (float) $this->total,
            'paidAmount' => (float) $this->paid_amount,
            'remainingAmount' => $this->remainingAmount(),
            'notes' => $this->notes,
            'patient' => new PatientSummaryResource($this->whenLoaded('patient')),
            'dentist' => new UserResource($this->whenLoaded('dentist')),
            'items' => InvoiceItemResource::collection($this->whenLoaded('items')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
