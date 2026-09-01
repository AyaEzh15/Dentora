<?php

namespace App\Repositories\Eloquent;

use App\Models\Invoice;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class InvoiceRepository implements InvoiceRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator
    {
        $query = Invoice::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist', 'items.careType', 'payments']);

        if (! empty($filters['patient_id'])) {
            $query->where('patient_id', $filters['patient_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['dentist_id'])) {
            $dentistId = $filters['dentist_id'];
            $query->where(function ($q) use ($dentistId) {
                $q->where('dentist_id', $dentistId)
                    ->orWhereHas('patient.consultations', fn ($c) => $c->where('dentist_id', $dentistId))
                    ->orWhereHas('patient.appointments', fn ($a) => $a->where('dentist_id', $dentistId));
            });
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('number', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($patient) use ($search) {
                        $patient->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('file_number', 'like', "%{$search}%");
                    });
            });
        }

        return $query->orderByDesc('issued_at')->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function findForClinic(int $clinicId, int $id): ?Invoice
    {
        return Invoice::query()
            ->forClinic($clinicId)
            ->with(['patient', 'dentist', 'consultation', 'items.careType', 'payments'])
            ->find($id);
    }

    public function findByConsultation(int $consultationId): ?Invoice
    {
        return Invoice::query()
            ->where('consultation_id', $consultationId)
            ->with(['patient', 'dentist', 'items.careType', 'payments'])
            ->first();
    }

    public function nextNumber(int $clinicId): string
    {
        $year = now()->year;
        $count = Invoice::query()
            ->forClinic($clinicId)
            ->whereYear('issued_at', $year)
            ->count() + 1;

        return sprintf('FAC-%d-%04d', $year, $count);
    }

    public function create(array $data): Invoice
    {
        $invoice = Invoice::query()->create($data);

        return $invoice->load(['patient', 'dentist', 'items.careType', 'payments']);
    }

    public function update(Invoice $invoice, array $data): Invoice
    {
        $invoice->update($data);

        return $invoice->fresh(['patient', 'dentist', 'consultation', 'items.careType', 'payments']);
    }

    public function syncItems(Invoice $invoice, array $items): Invoice
    {
        $invoice->items()->delete();

        foreach ($items as $item) {
            $quantity = max(1, (int) ($item['quantity'] ?? 1));
            $unitPrice = round((float) ($item['unit_price'] ?? 0), 2);

            $invoice->items()->create([
                'care_type_id' => $item['care_type_id'] ?? null,
                'description' => $item['description'],
                'tooth_number' => $item['tooth_number'] ?? null,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'line_total' => round($quantity * $unitPrice, 2),
            ]);
        }

        return $this->refreshTotals($invoice);
    }

    public function refreshTotals(Invoice $invoice): Invoice
    {
        $invoice->load(['items', 'payments']);

        $subtotal = round((float) $invoice->items->sum('line_total'), 2);
        $paid = round((float) $invoice->payments->sum('amount'), 2);

        $invoice->update([
            'subtotal' => $subtotal,
            'tax_amount' => 0,
            'total' => $subtotal,
            'paid_amount' => $paid,
        ]);

        return $invoice->fresh(['patient', 'dentist', 'consultation', 'items.careType', 'payments']);
    }
}
