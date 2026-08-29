<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CareTypes\StoreCareTypeRequest;
use App\Http\Requests\CareTypes\UpdateCareTypeRequest;
use App\Http\Resources\CareTypeResource;
use App\Services\CareTypeService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CareTypeController extends Controller
{
    public function __construct(
        private CareTypeService $careTypeService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $careTypes = $this->careTypeService->list(
            $request->user(),
            $request->boolean('all')
        );

        return ApiResponse::success(CareTypeResource::collection($careTypes)->resolve());
    }

    public function store(StoreCareTypeRequest $request): JsonResponse
    {
        $careType = $this->careTypeService->create($request->validated());

        return ApiResponse::success(new CareTypeResource($careType), 'Type de soin créé.', 201);
    }

    public function update(UpdateCareTypeRequest $request, int $careType): JsonResponse
    {
        $updated = $this->careTypeService->update($careType, $request->validated());

        return ApiResponse::success(new CareTypeResource($updated), 'Type de soin mis à jour.');
    }
}
