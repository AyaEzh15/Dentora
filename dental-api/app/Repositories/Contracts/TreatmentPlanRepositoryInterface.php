<?php

namespace App\Repositories\Contracts;

use App\Models\TreatmentPlan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TreatmentPlanRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator;

    public function findForClinic(int $clinicId, int $id): ?TreatmentPlan;

    public function create(array $data): TreatmentPlan;

    public function update(TreatmentPlan $plan, array $data): TreatmentPlan;

    public function replacePhases(TreatmentPlan $plan, array $phases): TreatmentPlan;
}
