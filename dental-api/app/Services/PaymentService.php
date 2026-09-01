<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentMethod;
use App\Models\Payment;
use App\Models\User;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    public function __construct(
        private PaymentRepositoryInterface $payments,
        private InvoiceService $invoices
    ) {}

    public function paginate(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->payments->paginateForClinic((int) $user->clinic_id, $filters);
    }

    public function create(User $user, array $data): Payment
    {
        $invoice = $this->invoices->get($user, (int) $data['invoice_id']);

        if (in_array($invoice->status, [InvoiceStatus::CANCELLED, InvoiceStatus::PAID], true)) {
            throw ValidationException::withMessages([
                'invoice_id' => ['Cette facture n\'accepte plus de paiement.'],
            ]);
        }

        $amount = round((float) $data['amount'], 2);
        $remaining = round($invoice->remainingAmount(), 2);

        if ($amount <= 0) {
            throw ValidationException::withMessages([
                'amount' => ['Le montant doit être supérieur à 0.'],
            ]);
        }

        if ($amount > $remaining) {
            throw ValidationException::withMessages([
                'amount' => ['Le montant dépasse le reste à payer ('.$remaining.' MAD).'],
            ]);
        }

        $payment = $this->payments->create([
            'clinic_id' => $user->clinic_id,
            'invoice_id' => $invoice->id,
            'amount' => $amount,
            'method' => $data['method'] ?? PaymentMethod::CASH->value,
            'paid_at' => $data['paid_at'] ?? now(),
            'reference' => $data['reference'] ?? null,
            'notes' => $data['notes'] ?? null,
            'created_by' => $user->id,
        ]);

        $this->invoices->applyPaymentStatus($invoice->fresh());

        return $payment->fresh(['invoice.patient', 'invoice.dentist']);
    }
}
