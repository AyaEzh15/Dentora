<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Repositories\Contracts\PatientRepositoryInterface;

class DashboardService
{
    public function __construct(
        private AppointmentRepositoryInterface $appointments,
        private PatientRepositoryInterface $patients
    ) {}

    public function getOverview(User $user): array
    {
        $clinicId = (int) $user->clinic_id;
        $scope = $user->hasRole(UserRole::DENTIST->value) ? ['dentist_id' => $user->id] : [];
        $todayAppointments = $this->appointments->todayForClinic($clinicId, $scope);
        $statusCounts = $this->appointments->countByStatusForRange(
            $clinicId,
            now()->startOfMonth()->toDateTimeString(),
            now()->endOfMonth()->toDateTimeString(),
            $scope
        );

        return [
            'kpis' => [
                'appointmentsToday' => $todayAppointments->count(),
                'patientsWaiting' => $todayAppointments
                    ->where('status', AppointmentStatus::IN_PROGRESS)
                    ->count(),
                'patientsTotal' => $this->patients->countForClinic($clinicId, $scope),
                'upcomingToday' => $todayAppointments
                    ->whereIn('status', [
                        AppointmentStatus::PENDING,
                        AppointmentStatus::CONFIRMED,
                    ])
                    ->count(),
            ],
            'todayAppointments' => $todayAppointments,
            'statusBreakdown' => $statusCounts,
        ];
    }
}
