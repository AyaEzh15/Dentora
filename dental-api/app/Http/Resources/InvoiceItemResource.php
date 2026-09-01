<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\InvoiceItem */
class InvoiceItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'careTypeId' => $this->care_type_id,
            'description' => $this->description,
            'toothNumber' => $this->tooth_number,
            'quantity' => $this->quantity,
            'unitPrice' => (float) $this->unit_price,
            'lineTotal' => (float) $this->line_total,
            'careType' => new CareTypeResource($this->whenLoaded('careType')),
        ];
    }
}
