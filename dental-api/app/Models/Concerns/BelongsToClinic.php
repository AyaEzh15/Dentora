<?php

namespace App\Models\Concerns;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToClinic
{
    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    public function scopeForClinic(Builder $query, int $clinicId): Builder
    {
        return $query->where('clinic_id', $clinicId);
    }
}
