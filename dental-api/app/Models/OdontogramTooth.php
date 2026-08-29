<?php

namespace App\Models;

use App\Enums\ToothCondition;
use App\Models\Concerns\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OdontogramTooth extends Model
{
    use BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'tooth_number',
        'condition',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'condition' => ToothCondition::class,
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
