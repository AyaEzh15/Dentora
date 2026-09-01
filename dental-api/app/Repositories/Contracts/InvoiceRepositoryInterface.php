<?php

namespace App\Repositories\Contracts;

use App\Models\Invoice;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface InvoiceRepositoryInterface
{
    public function paginateForClinic(int $clinicId, array $filters = []): LengthAwarePaginator;

    public function findForClinic(int $clinicId, int $id): ?Invoice;

    public function findByConsultation(int $consultationId): ?Invoice;

    public function nextNumber(int $clinicId): string;

    public function create(array $data): Invoice;

    public function update(Invoice $invoice, array $data): Invoice;

    public function syncItems(Invoice $invoice, array $items): Invoice;

    public function refreshTotals(Invoice $invoice): Invoice;
}
