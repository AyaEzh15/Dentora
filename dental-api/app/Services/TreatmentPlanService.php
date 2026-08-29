<?php

namespace App\Services;

use App\Enums\TreatmentPlanStatus;
use App\Enums\UserRole;
use App\Models\TreatmentPlan;
use App\Models\User;
use App\Repositories\Contracts\TreatmentPlanRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TreatmentPlanService
{
    public function __construct(
        private TreatmentPlanRepositoryInterface $plans,
        private PatientService $patients
    ) {}

    public function paginate(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->plans->paginateForClinic((int) $user->clinic_id, $this->scopeForActor($user, $filters));
    }

    public function get(User $user, int $id): TreatmentPlan
    {
        $plan = $this->plans->findForClinic((int) $user->clinic_id, $id);

        if (! $plan || ! $this->canAccess($user, $plan)) {
            throw new NotFoundHttpException('Plan de traitement introuvable.');
        }

        return $plan;
    }

    public function create(User $user, array $data): TreatmentPlan
    {
        $this->patients->get($user, (int) $data['patient_id']);

        if ($user->hasRole(UserRole::DENTIST->value) || empty($data['dentist_id'])) {
            $data['dentist_id'] = $data['dentist_id'] ?? $user->id;
        }

        $phases = $data['phases'] ?? [];
        unset($data['phases']);

        $data['clinic_id'] = $user->clinic_id;
        $data['created_by'] = $user->id;
        $data['status'] = $data['status'] ?? TreatmentPlanStatus::DRAFT->value;

        $plan = $this->plans->create($data);

        if ($phases) {
            $plan = $this->plans->replacePhases($plan, $phases);
        }

        return $plan;
    }

    public function update(User $user, int $id, array $data): TreatmentPlan
    {
        $plan = $this->get($user, $id);

        if ($user->hasRole(UserRole::DENTIST->value)) {
            unset($data['dentist_id']);
        }

        $phases = $data['phases'] ?? null;
        unset($data['phases']);

        $plan = $this->plans->update($plan, $data);

        if (is_array($phases)) {
            $plan = $this->plans->replacePhases($plan, $phases);
        }

        return $plan;
    }

    private function scopeForActor(User $user, array $filters): array
    {
        if ($user->hasRole(UserRole::DENTIST->value)) {
            $filters['dentist_id'] = $user->id;
        }

        return $filters;
    }

    private function canAccess(User $user, TreatmentPlan $plan): bool
    {
        if (! $user->hasRole(UserRole::DENTIST->value)) {
            return true;
        }

        return (int) $plan->dentist_id === (int) $user->id;
    }
}
