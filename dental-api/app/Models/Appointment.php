<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use App\Models\Concerns\BelongsToClinic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use BelongsToClinic, HasFactory;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'dentist_id',
        'start_at',
        'end_at',
        'status',
        'reason',
        'notes',
        'cancelled_at',
        'cancel_reason',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'status' => AppointmentStatus::class,
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

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
