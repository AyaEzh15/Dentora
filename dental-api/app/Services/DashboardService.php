<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Enums\InvoiceStatus;
use App\Enums\UserRole;
use App\Models\Invoice;
use App\Models\Prescription;
use App\Models\User;
use App\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Repositories\Contracts\PatientRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;

class DashboardService
{
    public function __construct(
        private AppointmentRepositoryInterface $appointments,
        private PatientRepositoryInterface $patients,
        private UserRepositoryInterface $users
    ) {}

    public function getOverview(User $user): array
    {
        if ($user->hasRole(UserRole::ADMIN->value)) {
            return $this->getAdminOverview($user);
        }

        return $this->getOperationalOverview($user);
    }

    private function getOperationalOverview(User $user): array
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
            'mode' => 'operational',
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

    private function getAdminOverview(User $user): array
    {
        $clinicId = (int) $user->clinic_id;
        $dentists = $this->users->dentistsForClinic($clinicId, false);
        $monthStart = now()->startOfMonth();
        $monthEnd = now()->endOfMonth();

        $invoicesThisMonth = Invoice::query()
            ->forClinic($clinicId)
            ->whereBetween('issued_at', [$monthStart, $monthEnd])
            ->where('status', '!=', InvoiceStatus::CANCELLED);

        return [
            'mode' => 'admin',
            'kpis' => [
                'dentistsTotal' => $dentists->count(),
                'staffTotal' => User::query()->forClinic($clinicId)->count(),
                'patientsTotal' => $this->patients->countForClinic($clinicId),
                'invoicesThisMonth' => (clone $invoicesThisMonth)->count(),
                'revenueThisMonth' => (float) (clone $invoicesThisMonth)->sum('paid_amount'),
                'prescriptionsThisMonth' => Prescription::query()
                    ->forClinic($clinicId)
                    ->whereBetween('prescribed_at', [$monthStart, $monthEnd])
                    ->count(),
                'templatesMissing' => $dentists
                    ->filter(fn (User $dentist) => ! $dentist->prescription_template_path || ! $dentist->invoice_template_path)
                    ->count(),
            ],
            'dentists' => $dentists,
        ];
    }
}
