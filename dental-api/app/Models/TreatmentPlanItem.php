<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TreatmentPlanItem extends Model
{
    protected $fillable = [
        'treatment_plan_phase_id',
        'care_type_id',
        'tooth_number',
        'notes',
        'status',
        'estimated_price',
    ];

    protected function casts(): array
    {
        return [
            'estimated_price' => 'decimal:2',
        ];
    }

    public function phase(): BelongsTo
    {
        return $this->belongsTo(TreatmentPlanPhase::class, 'treatment_plan_phase_id');
    }

    public function careType(): BelongsTo
    {
        return $this->belongsTo(CareType::class);
    }
}
