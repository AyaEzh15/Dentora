<?php

namespace App\Repositories\Eloquent;

use App\Models\Payment;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator
    {
        $query = Payment::query()
            ->forClinic($clinicId)
            ->with(['invoice.patient', 'invoice.dentist']);

        if (! empty($filters['patient_id'])) {
            $query->whereHas('invoice', fn ($q) => $q->where('patient_id', $filters['patient_id']));
        }

        if (! empty($filters['invoice_id'])) {
            $query->where('invoice_id', $filters['invoice_id']);
        }

        if (! empty($filters['method'])) {
            $query->where('method', $filters['method']);
        }

        return $query->orderByDesc('paid_at')->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function create(array $data): Payment
    {
        $payment = Payment::query()->create($data);

        return $payment->load(['invoice.patient', 'invoice.dentist']);
    }
}
