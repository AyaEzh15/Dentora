<?php

namespace App\Providers;

use App\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Repositories\Contracts\CareTypeRepositoryInterface;
use App\Repositories\Contracts\ClinicRepositoryInterface;
use App\Repositories\Contracts\ConsultationRepositoryInterface;
use App\Repositories\Contracts\MedicalRecordRepositoryInterface;
use App\Repositories\Contracts\OdontogramRepositoryInterface;
use App\Repositories\Contracts\PatientRepositoryInterface;
use App\Repositories\Contracts\TreatmentPlanRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\AppointmentRepository;
use App\Repositories\Eloquent\CareTypeRepository;
use App\Repositories\Eloquent\ClinicRepository;
use App\Repositories\Eloquent\ConsultationRepository;
use App\Repositories\Eloquent\MedicalRecordRepository;
use App\Repositories\Eloquent\OdontogramRepository;
use App\Repositories\Eloquent\PatientRepository;
use App\Repositories\Eloquent\TreatmentPlanRepository;
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
        $this->app->bind(CareTypeRepositoryInterface::class, CareTypeRepository::class);
        $this->app->bind(MedicalRecordRepositoryInterface::class, MedicalRecordRepository::class);
        $this->app->bind(OdontogramRepositoryInterface::class, OdontogramRepository::class);
        $this->app->bind(ConsultationRepositoryInterface::class, ConsultationRepository::class);
        $this->app->bind(TreatmentPlanRepositoryInterface::class, TreatmentPlanRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
