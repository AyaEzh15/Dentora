<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consultations\StoreConsultationRequest;
use App\Http\Requests\Consultations\UpdateConsultationRequest;
use App\Http\Resources\ConsultationResource;
use App\Services\ConsultationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function __construct(
        private ConsultationService $consultations
    ) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::paginated(
            $this->consultations->paginate($request->user(), $request->all()),
            ConsultationResource::class
        );
    }

    public function show(Request $request, int $consultation): JsonResponse
    {
        return ApiResponse::success(
            new ConsultationResource($this->consultations->get($request->user(), $consultation))
        );
    }

    public function store(StoreConsultationRequest $request): JsonResponse
    {
        $consultation = $this->consultations->create($request->user(), $request->validated());

        return ApiResponse::success(new ConsultationResource($consultation), 'Consultation enregistrée.', 201);
    }

    public function update(UpdateConsultationRequest $request, int $consultation): JsonResponse
    {
        $updated = $this->consultations->update($request->user(), $consultation, $request->validated());

        return ApiResponse::success(new ConsultationResource($updated), 'Consultation mise à jour.');
    }
}
