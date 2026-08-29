<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultationProcedure extends Model
{
    protected $fillable = [
        'consultation_id',
        'care_type_id',
        'tooth_number',
        'quantity',
        'notes',
    ];

    public function consultation(): BelongsTo
    {
        return $this->belongsTo(Consultation::class);
    }

    public function careType(): BelongsTo
    {
        return $this->belongsTo(CareType::class);
    }
}
