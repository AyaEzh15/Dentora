<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoices\StoreInvoiceRequest;
use App\Http\Requests\Invoices\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Services\DocumentPdfService;
use App\Services\InvoiceService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(
        private InvoiceService $invoices,
        private DocumentPdfService $pdfs
    ) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::paginated(
            $this->invoices->paginate($request->user(), $request->all()),
            InvoiceResource::class
        );
    }

    public function show(Request $request, int $invoice): JsonResponse
    {
        return ApiResponse::success(
            new InvoiceResource($this->invoices->get($request->user(), $invoice))
        );
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $invoice = $this->invoices->create($request->user(), $request->validated());

        return ApiResponse::success(new InvoiceResource($invoice), 'Facture enregistrée.', 201);
    }

    public function update(UpdateInvoiceRequest $request, int $invoice): JsonResponse
    {
        $updated = $this->invoices->update($request->user(), $invoice, $request->validated());

        return ApiResponse::success(new InvoiceResource($updated), 'Facture mise à jour.');
    }

    public function pdf(Request $request, int $invoice)
    {
        $model = $this->invoices->get($request->user(), $invoice);

        return response($this->pdfs->invoice($model), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$model->number.'.pdf"',
        ]);
    }
}
