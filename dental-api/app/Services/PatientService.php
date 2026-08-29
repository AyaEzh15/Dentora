<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Patient;
use App\Models\User;
use App\Repositories\Contracts\PatientRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PatientService
{
    public function __construct(
        private PatientRepositoryInterface $patients
    ) {}

    public function paginate(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->patients->paginateForClinic((int) $user->clinic_id, $this->scopeForActor($user, $filters));
    }

    public function get(User $user, int $id): Patient
    {
        $patient = $this->patients->findForClinic((int) $user->clinic_id, $id);

        if (! $patient || ! $this->canAccessPatient($user, $patient)) {
            throw new NotFoundHttpException('Patient introuvable.');
        }

        return $patient;
    }

    public function create(User $user, array $data): Patient
    {
        $data['clinic_id'] = $user->clinic_id;
        $data['created_by'] = $user->id;
        $data['file_number'] = $this->patients->nextFileNumber((int) $user->clinic_id);

        return $this->patients->create($data);
    }

    public function update(User $user, int $id, array $data): Patient
    {
        $patient = $this->get($user, $id);

        return $this->patients->update($patient, $data);
    }

    public function search(User $user, string $term): Collection
    {
        $limit = trim($term) === '' ? 50 : 20;

        return $this->patients->searchForClinic((int) $user->clinic_id, $term, $limit, $this->scopeForActor($user));
    }

    private function scopeForActor(User $user, array $filters = []): array
    {
        if ($user->hasRole(UserRole::DENTIST->value)) {
            $filters['dentist_id'] = $user->id;
        }

        return $filters;
    }

    public function canAccessPatient(User $user, Patient $patient): bool
    {
        if (! $user->hasRole(UserRole::DENTIST->value)) {
            return true;
        }

        if ((int) $patient->created_by === (int) $user->id) {
            return true;
        }

        return $patient->appointments()->where('dentist_id', $user->id)->exists();
    }
}
