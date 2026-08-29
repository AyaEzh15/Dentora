<?php

namespace App\Repositories\Contracts;

use App\Models\Appointment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AppointmentRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator;

    public function findForClinic(int $clinicId, int $id): ?Appointment;

    public function create(array $data): Appointment;

    public function update(Appointment $appointment, array $data): Appointment;

    public function overlapping(int $dentistId, string $startAt, string $endAt, ?int $ignoreId = null): bool;

    public function forRange(int $clinicId, string $from, string $to, array $filters = []): Collection;

    public function todayForClinic(int $clinicId, array $filters = []): Collection;

    public function countTodayByStatus(int $clinicId, array $statuses): int;

    public function countByStatusForRange(int $clinicId, string $from, string $to, array $filters = []): Collection;
}
