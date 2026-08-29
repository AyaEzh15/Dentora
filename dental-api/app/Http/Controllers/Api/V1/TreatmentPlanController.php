<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\TreatmentPlans\StoreTreatmentPlanRequest;
use App\Http\Requests\TreatmentPlans\UpdateTreatmentPlanRequest;
use App\Http\Resources\TreatmentPlanResource;
use App\Services\TreatmentPlanService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TreatmentPlanController extends Controller
{
    public function __construct(
        private TreatmentPlanService $plans
    ) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::paginated(
            $this->plans->paginate($request->user(), $request->all()),
            TreatmentPlanResource::class
        );
    }

    public function show(Request $request, int $treatmentPlan): JsonResponse
    {
        return ApiResponse::success(
            new TreatmentPlanResource($this->plans->get($request->user(), $treatmentPlan))
        );
    }

    public function store(StoreTreatmentPlanRequest $request): JsonResponse
    {
        $plan = $this->plans->create($request->user(), $request->validated());

        return ApiResponse::success(new TreatmentPlanResource($plan), 'Plan de traitement créé.', 201);
    }

    public function update(UpdateTreatmentPlanRequest $request, int $treatmentPlan): JsonResponse
    {
        $updated = $this->plans->update($request->user(), $treatmentPlan, $request->validated());

        return ApiResponse::success(new TreatmentPlanResource($updated), 'Plan de traitement mis à jour.');
    }
}
