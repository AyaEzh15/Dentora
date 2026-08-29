<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Patient */
class PatientSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'fileNumber' => $this->file_number,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'name' => $this->name,
            'phone' => $this->phone,
        ];
    }
}
