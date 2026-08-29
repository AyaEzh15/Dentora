<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\User;
use App\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Repositories\Contracts\PatientRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AppointmentService
{
    public function __construct(
        private AppointmentRepositoryInterface $appointments,
        private PatientRepositoryInterface $patients,
        private UserRepositoryInterface $users
    ) {}

    public function paginate(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->appointments->paginateForClinic((int) $user->clinic_id, $this->scopeForActor($user, $filters));
    }

    public function calendar(User $user, array $filters = []): Collection
    {
        $from = $filters['from'] ?? now()->startOfWeek()->toDateTimeString();
        $to = $filters['to'] ?? now()->endOfWeek()->toDateTimeString();

        return $this->appointments->forRange((int) $user->clinic_id, $from, $to, $this->scopeForActor($user, $filters));
    }

    public function get(User $user, int $id): Appointment
    {
        $appointment = $this->appointments->findForClinic((int) $user->clinic_id, $id);

        if (! $appointment || ! $this->canAccessAppointment($user, $appointment)) {
            throw new NotFoundHttpException('Rendez-vous introuvable.');
        }

        return $appointment;
    }

    public function create(User $user, array $data): Appointment
    {
        if ($user->hasRole(UserRole::DENTIST->value)) {
            $data['dentist_id'] = $user->id;
        }

        $this->assertPatientInClinic($user, (int) $data['patient_id']);
        $this->assertDentistInClinic($user, (int) $data['dentist_id']);
        $this->ensureDentistIsAvailable((int) $data['dentist_id'], $data['start_at'], $data['end_at']);

        $data['clinic_id'] = $user->clinic_id;
        $data['created_by'] = $user->id;
        $data['status'] = $data['status'] ?? AppointmentStatus::PENDING->value;

        return $this->appointments->create($data);
    }

    public function update(User $user, int $id, array $data): Appointment
    {
        $appointment = $this->get($user, $id);

        if (isset($data['patient_id'])) {
            $this->assertPatientInClinic($user, (int) $data['patient_id']);
        }

        if ($user->hasRole(UserRole::DENTIST->value)) {
            unset($data['dentist_id']);
        } elseif (isset($data['dentist_id'])) {
            $this->assertDentistInClinic($user, (int) $data['dentist_id']);
        }

        if (($data['status'] ?? null) === AppointmentStatus::CANCELLED->value) {
            $data['cancelled_at'] = $data['cancelled_at'] ?? now();
        }

        $scheduleChanged = isset($data['dentist_id']) || isset($data['start_at']) || isset($data['end_at']);

        if ($scheduleChanged) {
            $dentistId = $data['dentist_id'] ?? $appointment->dentist_id;
            $startAt = $data['start_at'] ?? $appointment->start_at->toDateTimeString();
            $endAt = $data['end_at'] ?? $appointment->end_at->toDateTimeString();
            $this->ensureDentistIsAvailable((int) $dentistId, $startAt, $endAt, $appointment->id);
        }

        return $this->appointments->update($appointment, $data);
    }

    public function cancel(User $user, int $id, ?string $reason = null): Appointment
    {
        $appointment = $this->get($user, $id);

        return $this->appointments->update($appointment, [
            'status' => AppointmentStatus::CANCELLED->value,
            'cancelled_at' => now(),
            'cancel_reason' => $reason,
        ]);
    }

    private function scopeForActor(User $user, array $filters = []): array
    {
        if ($user->hasRole(UserRole::DENTIST->value)) {
            $filters['dentist_id'] = $user->id;
        }

        return $filters;
    }

    private function canAccessAppointment(User $user, Appointment $appointment): bool
    {
        if ($user->hasRole(UserRole::DENTIST->value)) {
            return (int) $appointment->dentist_id === (int) $user->id;
        }

        return true;
    }

    private function ensureDentistIsAvailable(int $dentistId, string $startAt, string $endAt, ?int $ignoreId = null): void
    {
        if ($this->appointments->overlapping($dentistId, $startAt, $endAt, $ignoreId)) {
            throw ValidationException::withMessages([
                'start_at' => ['Ce créneau chevauche un autre rendez-vous du dentiste.'],
            ]);
        }
    }

    private function assertPatientInClinic(User $user, int $patientId): void
    {
        $patient = $this->patients->findForClinic((int) $user->clinic_id, $patientId);

        if (! $patient) {
            throw ValidationException::withMessages([
                'patient_id' => ['Ce patient n\'appartient pas à votre cabinet.'],
            ]);
        }

        if ($user->hasRole(UserRole::DENTIST->value)) {
            $ownsPatient = (int) $patient->created_by === (int) $user->id
                || $patient->appointments()->where('dentist_id', $user->id)->exists();

            if (! $ownsPatient) {
                throw ValidationException::withMessages([
                    'patient_id' => ['Vous ne pouvez planifier un rendez-vous que pour vos patients.'],
                ]);
            }
        }
    }

    private function assertDentistInClinic(User $user, int $dentistId): void
    {
        $dentist = $this->users->findForClinic((int) $user->clinic_id, $dentistId);

        if (! $dentist) {
            throw ValidationException::withMessages([
                'dentist_id' => ['Ce praticien n\'appartient pas à votre cabinet.'],
            ]);
        }
    }
}
