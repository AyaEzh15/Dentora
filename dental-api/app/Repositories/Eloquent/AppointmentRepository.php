<?php

namespace App\Repositories\Eloquent;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Repositories\Contracts\AppointmentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AppointmentRepository implements AppointmentRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator
    {
        return $this->filteredQuery($clinicId, $filters)
            ->orderBy('start_at')
            ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function findForClinic(int $clinicId, int $id): ?Appointment
    {
        return Appointment::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist'])
            ->find($id);
    }

    public function create(array $data): Appointment
    {
        $appointment = Appointment::query()->create($data);

        return $appointment->load(['patient', 'dentist']);
    }

    public function update(Appointment $appointment, array $data): Appointment
    {
        $appointment->update($data);

        return $appointment->fresh(['patient', 'dentist']);
    }

    public function overlapping(int $dentistId, string $startAt, string $endAt, ?int $ignoreId = null): bool
    {
        return Appointment::query()
            ->where('dentist_id', $dentistId)
            ->whereNotIn('status', [
                AppointmentStatus::CANCELLED->value,
                AppointmentStatus::NO_SHOW->value,
            ])
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->where('start_at', '<', $endAt)
            ->where('end_at', '>', $startAt)
            ->exists();
    }

    public function forRange(int $clinicId, string $from, string $to, array $filters = []): Collection
    {
        $query = Appointment::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist'])
            ->where('start_at', '<', $to)
            ->where('end_at', '>', $from);

        if (! empty($filters['dentist_id'])) {
            $query->where('dentist_id', $filters['dentist_id']);
        }

        return $query->orderBy('start_at')->get();
    }

    public function todayForClinic(int $clinicId, array $filters = []): Collection
    {
        $query = Appointment::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist'])
            ->whereDate('start_at', now()->toDateString());

        if (! empty($filters['dentist_id'])) {
            $query->where('dentist_id', $filters['dentist_id']);
        }

        return $query->orderBy('start_at')->get();
    }

    public function countTodayByStatus(int $clinicId, array $statuses): int
    {
        return Appointment::query()
            ->forClinic($clinicId)
            ->whereDate('start_at', now()->toDateString())
            ->whereIn('status', $statuses)
            ->count();
    }

    public function countByStatusForRange(int $clinicId, string $from, string $to, array $filters = []): Collection
    {
        $query = Appointment::query()
            ->forClinic($clinicId)
            ->where('start_at', '>=', $from)
            ->where('start_at', '<', $to);

        if (! empty($filters['dentist_id'])) {
            $query->where('dentist_id', $filters['dentist_id']);
        }

        return $query
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');
    }

    private function filteredQuery(int $clinicId, array $filters)
    {
        $query = Appointment::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['dentist_id'])) {
            $query->where('dentist_id', $filters['dentist_id']);
        }

        if (! empty($filters['patient_id'])) {
            $query->where('patient_id', $filters['patient_id']);
        }

        if (! empty($filters['from'])) {
            $query->where('start_at', '>=', $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->where('start_at', '<=', $filters['to']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('reason', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($patient) use ($search) {
                        $patient->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('file_number', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }
}
