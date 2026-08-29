<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ConsultationProcedure */
class ConsultationProcedureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'careTypeId' => $this->care_type_id,
            'toothNumber' => $this->tooth_number,
            'quantity' => $this->quantity,
            'notes' => $this->notes,
            'careType' => new CareTypeResource($this->whenLoaded('careType')),
        ];
    }
}
