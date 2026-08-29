<?php

namespace App\Models;

use App\Enums\TreatmentPhaseStatus;
use App\Enums\TreatmentPlanStatus;
use App\Models\Concerns\BelongsToClinic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TreatmentPlan extends Model
{
    use BelongsToClinic;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'dentist_id',
        'title',
        'description',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => TreatmentPlanStatus::class,
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

    public function phases(): HasMany
    {
        return $this->hasMany(TreatmentPlanPhase::class)->orderBy('sort_order');
    }

    public function progressPercent(): int
    {
        $phases = $this->relationLoaded('phases') ? $this->phases : $this->phases()->get();

        if ($phases->isEmpty()) {
            return 0;
        }

        $done = $phases->where('status', TreatmentPhaseStatus::COMPLETED)->count();

        return (int) round(($done / $phases->count()) * 100);
    }
}
