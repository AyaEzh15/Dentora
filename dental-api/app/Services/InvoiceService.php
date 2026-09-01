<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Enums\UserRole;
use App\Models\Invoice;
use App\Models\User;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class InvoiceService
{
    public function __construct(
        private InvoiceRepositoryInterface $invoices,
        private PatientService $patients,
        private ConsultationService $consultations
    ) {}

    public function paginate(User $user, array $filters = []): LengthAwarePaginator
    {
        return $this->invoices->paginateForClinic(
            (int) $user->clinic_id,
            $this->scopeForActor($user, $filters)
        );
    }

    public function get(User $user, int $id): Invoice
    {
        $invoice = $this->invoices->findForClinic((int) $user->clinic_id, $id);

        if (! $invoice || ! $this->canAccess($user, $invoice)) {
            throw new NotFoundHttpException('Facture introuvable.');
        }

        return $invoice;
    }

    public function create(User $user, array $data): Invoice
    {
        $this->patients->get($user, (int) $data['patient_id']);

        $items = $data['items'] ?? [];
        unset($data['items']);

        if (! empty($data['consultation_id'])) {
            $consultation = $this->consultations->get($user, (int) $data['consultation_id']);

            if ((int) $consultation->patient_id !== (int) $data['patient_id']) {
                throw ValidationException::withMessages([
                    'consultation_id' => ['Cette consultation n\'appartient pas à ce patient.'],
                ]);
            }

            if ($this->invoices->findByConsultation($consultation->id)) {
                throw ValidationException::withMessages([
                    'consultation_id' => ['Une facture existe déjà pour cette consultation.'],
                ]);
            }

            $data['dentist_id'] = $data['dentist_id'] ?? $consultation->dentist_id;

            if (! $items) {
                $items = $consultation->procedures->map(fn ($procedure) => [
                    'care_type_id' => $procedure->care_type_id,
                    'description' => $procedure->careType?->name ?? 'Acte',
                    'tooth_number' => $procedure->tooth_number,
                    'quantity' => $procedure->quantity,
                    'unit_price' => 0,
                ])->all();
            }
        }

        if ($user->hasRole(UserRole::DENTIST->value)) {
            $data['dentist_id'] = $user->id;
        }

        $data['clinic_id'] = $user->clinic_id;
        $data['created_by'] = $user->id;
        $data['issued_at'] = $data['issued_at'] ?? now();
        $data['status'] = $data['status'] ?? InvoiceStatus::ISSUED->value;
        $data['number'] = $this->invoices->nextNumber((int) $user->clinic_id);
        $data['subtotal'] = 0;
        $data['tax_amount'] = 0;
        $data['total'] = 0;
        $data['paid_amount'] = 0;

        $invoice = $this->invoices->create($data);

        if ($items) {
            $invoice = $this->invoices->syncItems($invoice, $items);
        }

        return $this->applyPaymentStatus($invoice);
    }

    public function update(User $user, int $id, array $data): Invoice
    {
        $invoice = $this->get($user, $id);

        if (in_array($invoice->status, [InvoiceStatus::PAID, InvoiceStatus::CANCELLED], true)) {
            throw ValidationException::withMessages([
                'status' => ['Cette facture ne peut plus être modifiée.'],
            ]);
        }

        $items = $data['items'] ?? null;
        unset($data['items'], $data['number'], $data['paid_amount'], $data['subtotal'], $data['total']);

        if ($user->hasRole(UserRole::DENTIST->value)) {
            unset($data['dentist_id']);
        }

        $invoice = $this->invoices->update($invoice, $data);

        if (is_array($items)) {
            $invoice = $this->invoices->syncItems($invoice, $items);
        }

        return $this->applyPaymentStatus($invoice);
    }

    public function applyPaymentStatus(Invoice $invoice): Invoice
    {
        if ($invoice->status === InvoiceStatus::CANCELLED) {
            return $invoice;
        }

        $invoice = $this->invoices->refreshTotals($invoice);
        $paid = (float) $invoice->paid_amount;
        $total = (float) $invoice->total;

        $status = match (true) {
            $paid <= 0 => $invoice->status === InvoiceStatus::DRAFT ? InvoiceStatus::DRAFT : InvoiceStatus::ISSUED,
            $total > 0 && $paid >= $total => InvoiceStatus::PAID,
            default => InvoiceStatus::PARTIALLY_PAID,
        };

        return $this->invoices->update($invoice, ['status' => $status->value]);
    }

    private function scopeForActor(User $user, array $filters): array
    {
        if ($user->hasRole(UserRole::DENTIST->value)) {
            $filters['dentist_id'] = $user->id;
        }

        return $filters;
    }

    private function canAccess(User $user, Invoice $invoice): bool
    {
        if (! $user->hasRole(UserRole::DENTIST->value)) {
            return true;
        }

        if ((int) $invoice->dentist_id === (int) $user->id) {
            return true;
        }

        return $invoice->patient->consultations()->where('dentist_id', $user->id)->exists()
            || $invoice->patient->appointments()->where('dentist_id', $user->id)->exists();
    }
}
