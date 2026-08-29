<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\TreatmentPlanPhase */
class TreatmentPlanPhaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'sortOrder' => $this->sort_order,
            'status' => $this->status?->value,
            'statusLabel' => $this->status?->label(),
            'items' => TreatmentPlanItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
