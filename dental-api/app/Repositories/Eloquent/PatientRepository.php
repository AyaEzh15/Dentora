<?php

namespace App\Repositories\Eloquent;

use App\Models\Patient;
use App\Repositories\Contracts\PatientRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PatientRepository implements PatientRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator
    {
        $query = Patient::query()
            ->forClinic($clinicId)
            ->with(['appointments' => fn ($q) => $q->orderByDesc('start_at')]);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('file_number', 'like', "%{$search}%")
                    ->orWhere('cin', 'like', "%{$search}%");
            });
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        $this->applyDentistScope($query, $filters);

        return $query
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function findForClinic(int $clinicId, int $id): ?Patient
    {
        return Patient::query()
            ->forClinic($clinicId)
            ->with(['appointments' => fn ($q) => $q->with('dentist')->orderByDesc('start_at')])
            ->find($id);
    }

    public function create(array $data): Patient
    {
        return Patient::query()->create($data);
    }

    public function update(Patient $patient, array $data): Patient
    {
        $patient->update($data);

        return $patient->fresh(['appointments.dentist']);
    }

    public function nextFileNumber(int $clinicId): string
    {
        $count = Patient::query()->forClinic($clinicId)->count() + 1;

        return 'PT-'.str_pad((string) $count, 4, '0', STR_PAD_LEFT);
    }

    public function countForClinic(int $clinicId, array $filters = []): int
    {
        $query = Patient::query()->forClinic($clinicId);
        $this->applyDentistScope($query, $filters);

        return $query->count();
    }

    public function searchForClinic(int $clinicId, string $term, int $limit = 10, array $filters = []): Collection
    {
        $query = Patient::query()
            ->forClinic($clinicId)
            ->where('is_active', true);

        $term = trim($term);

        if ($term !== '') {
            $query->where(function ($q) use ($term) {
                $q->where('first_name', 'like', "%{$term}%")
                    ->orWhere('last_name', 'like', "%{$term}%")
                    ->orWhere('phone', 'like', "%{$term}%")
                    ->orWhere('file_number', 'like', "%{$term}%");
            });
        }

        $this->applyDentistScope($query, $filters);

        return $query
            ->orderBy('last_name')
            ->limit($limit)
            ->get();
    }

    private function applyDentistScope($query, array $filters): void
    {
        if (empty($filters['dentist_id'])) {
            return;
        }

        $dentistId = (int) $filters['dentist_id'];

        $query->where(function ($q) use ($dentistId) {
            $q->where('created_by', $dentistId)
                ->orWhereHas('appointments', fn ($appointments) => $appointments->where('dentist_id', $dentistId));
        });
    }
}
