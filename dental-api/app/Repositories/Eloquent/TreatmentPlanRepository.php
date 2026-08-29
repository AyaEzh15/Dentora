<?php

namespace App\Repositories\Eloquent;

use App\Models\TreatmentPlan;
use App\Repositories\Contracts\TreatmentPlanRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TreatmentPlanRepository implements TreatmentPlanRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator
    {
        $query = TreatmentPlan::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist', 'phases.items.careType']);

        if (! empty($filters['patient_id'])) {
            $query->where('patient_id', $filters['patient_id']);
        }

        if (! empty($filters['dentist_id'])) {
            $query->where('dentist_id', $filters['dentist_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('updated_at')->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function findForClinic(int $clinicId, int $id): ?TreatmentPlan
    {
        return TreatmentPlan::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist', 'phases.items.careType'])
            ->find($id);
    }

    public function create(array $data): TreatmentPlan
    {
        $plan = TreatmentPlan::query()->create($data);

        return $plan->load(['patient', 'dentist', 'phases.items.careType']);
    }

    public function update(TreatmentPlan $plan, array $data): TreatmentPlan
    {
        $plan->update($data);

        return $plan->fresh(['patient', 'dentist', 'phases.items.careType']);
    }

    public function replacePhases(TreatmentPlan $plan, array $phases): TreatmentPlan
    {
        $plan->phases()->delete();

        foreach ($phases as $index => $phase) {
            $created = $plan->phases()->create([
                'title' => $phase['title'],
                'description' => $phase['description'] ?? null,
                'sort_order' => $phase['sort_order'] ?? ($index + 1),
                'status' => $phase['status'] ?? 'PENDING',
            ]);

            foreach ($phase['items'] ?? [] as $item) {
                $created->items()->create($item);
            }
        }

        return $plan->fresh(['patient', 'dentist', 'phases.items.careType']);
    }
}
