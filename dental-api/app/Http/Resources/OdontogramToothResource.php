<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\OdontogramTooth */
class OdontogramToothResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'toothNumber' => $this->tooth_number,
            'condition' => $this->condition?->value,
            'conditionLabel' => $this->condition?->label(),
            'notes' => $this->notes,
        ];
    }
}
