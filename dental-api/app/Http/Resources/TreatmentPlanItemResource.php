<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TreatmentPlanItem */
class TreatmentPlanItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'careTypeId' => $this->care_type_id,
            'toothNumber' => $this->tooth_number,
            'notes' => $this->notes,
            'status' => $this->status,
            'estimatedPrice' => $this->estimated_price,
            'careType' => new CareTypeResource($this->whenLoaded('careType')),
        ];
    }
}
