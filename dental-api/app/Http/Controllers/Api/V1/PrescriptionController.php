<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Prescriptions\StorePrescriptionRequest;
use App\Http\Requests\Prescriptions\UpdatePrescriptionRequest;
use App\Http\Resources\PrescriptionResource;
use App\Services\DocumentPdfService;
use App\Services\PrescriptionService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function __construct(
        private PrescriptionService $prescriptions,
        private DocumentPdfService $pdfs
    ) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::paginated(
            $this->prescriptions->paginate($request->user(), $request->all()),
            PrescriptionResource::class
        );
    }

    public function show(Request $request, int $prescription): JsonResponse
    {
        return ApiResponse::success(
            new PrescriptionResource($this->prescriptions->get($request->user(), $prescription))
        );
    }

    public function store(StorePrescriptionRequest $request): JsonResponse
    {
        $prescription = $this->prescriptions->create($request->user(), $request->validated());

        return ApiResponse::success(new PrescriptionResource($prescription), 'Ordonnance enregistrée.', 201);
    }

    public function update(UpdatePrescriptionRequest $request, int $prescription): JsonResponse
    {
        $updated = $this->prescriptions->update($request->user(), $prescription, $request->validated());

        return ApiResponse::success(new PrescriptionResource($updated), 'Ordonnance mise à jour.');
    }

    public function pdf(Request $request, int $prescription)
    {
        $model = $this->prescriptions->get($request->user(), $prescription);

        return response($this->pdfs->prescription($model), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$model->number.'.pdf"',
        ]);
    }
}
