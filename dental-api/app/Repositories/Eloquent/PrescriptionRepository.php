<?php

namespace App\Repositories\Eloquent;

use App\Models\Prescription;
use App\Repositories\Contracts\PrescriptionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PrescriptionRepository implements PrescriptionRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator
    {
        $query = Prescription::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist', 'items']);

        if (! empty($filters['patient_id'])) {
            $query->where('patient_id', $filters['patient_id']);
        }

        if (! empty($filters['dentist_id'])) {
            $query->where('dentist_id', $filters['dentist_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('prescribed_at')->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function findForClinic(int $clinicId, int $id): ?Prescription
    {
        return Prescription::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist', 'consultation', 'items'])
            ->find($id);
    }

    public function nextNumber(int $clinicId): string
    {
        $year = now()->year;
        $count = Prescription::query()
            ->forClinic($clinicId)
            ->whereYear('prescribed_at', $year)
            ->count() + 1;

        return sprintf('ORD-%d-%04d', $year, $count);
    }

    public function create(array $data): Prescription
    {
        $prescription = Prescription::query()->create($data);

        return $prescription->load(['patient', 'dentist', 'items']);
    }

    public function update(Prescription $prescription, array $data): Prescription
    {
        $prescription->update($data);

        return $prescription->fresh(['patient', 'dentist', 'consultation', 'items']);
    }

    public function syncItems(Prescription $prescription, array $items): Prescription
    {
        $prescription->items()->delete();

        foreach ($items as $item) {
            $prescription->items()->create([
                'medication' => $item['medication'],
                'dosage' => $item['dosage'] ?? null,
                'frequency' => $item['frequency'] ?? null,
                'duration' => $item['duration'] ?? null,
                'quantity' => max(1, (int) ($item['quantity'] ?? 1)),
                'instructions' => $item['instructions'] ?? null,
            ]);
        }

        return $prescription->fresh(['patient', 'dentist', 'consultation', 'items']);
    }
}
