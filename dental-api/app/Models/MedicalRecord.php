<?php

namespace App\Models;

use App\Models\Concerns\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    use BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'blood_type',
        'allergies',
        'chronic_diseases',
        'current_medications',
        'surgical_history',
        'dental_history',
        'notes',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
