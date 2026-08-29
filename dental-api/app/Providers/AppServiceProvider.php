<?php

namespace App\Providers;

use App\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Repositories\Contracts\ClinicRepositoryInterface;
use App\Repositories\Contracts\PatientRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\AppointmentRepository;
use App\Repositories\Eloquent\ClinicRepository;
use App\Repositories\Eloquent\PatientRepository;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(ClinicRepositoryInterface::class, ClinicRepository::class);
        $this->app->bind(PatientRepositoryInterface::class, PatientRepository::class);
        $this->app->bind(AppointmentRepositoryInterface::class, AppointmentRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
