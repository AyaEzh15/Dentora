<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Payment */
class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoiceId' => $this->invoice_id,
            'amount' => (float) $this->amount,
            'method' => $this->method?->value,
            'methodLabel' => $this->method?->label(),
            'paidAt' => $this->paid_at?->toIso8601String(),
            'reference' => $this->reference,
            'notes' => $this->notes,
            'invoice' => new InvoiceSummaryResource($this->whenLoaded('invoice')),
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
