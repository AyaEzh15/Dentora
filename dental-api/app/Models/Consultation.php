<?php

namespace App\Models;

use App\Enums\ConsultationStatus;
use App\Models\Concerns\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Consultation extends Model
{
    use BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'dentist_id',
        'appointment_id',
        'care_type_id',
        'consulted_at',
        'status',
        'chief_complaint',
        'clinical_exam',
        'diagnosis',
        'treatment_notes',
        'recommendations',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'consulted_at' => 'datetime',
            'status' => ConsultationStatus::class,
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function dentist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dentist_id');
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function careType(): BelongsTo
    {
        return $this->belongsTo(CareType::class);
    }

    public function procedures(): HasMany
    {
        return $this->hasMany(ConsultationProcedure::class);
    }
}
