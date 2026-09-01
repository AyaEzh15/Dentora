<?php

namespace App\Models;

use App\Models\Concerns\BelongsToClinic;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use BelongsToClinic, HasApiTokens, HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'clinic_id',
        'name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'avatar_path',
        'prescription_template_path',
        'invoice_template_path',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function guardName(): string
    {
        return 'web';
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'dentist_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'dentist_id');
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class, 'dentist_id');
    }
}
