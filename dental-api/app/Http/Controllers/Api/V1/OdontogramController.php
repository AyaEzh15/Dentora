<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinical\SyncOdontogramRequest;
use App\Http\Resources\OdontogramToothResource;
use App\Services\OdontogramService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OdontogramController extends Controller
{
    public function __construct(
        private OdontogramService $odontogram
    ) {}

    public function show(Request $request, int $patient): JsonResponse
    {
        return ApiResponse::success(
            OdontogramToothResource::collection($this->odontogram->get($request->user(), $patient))->resolve()
        );
    }

    public function sync(SyncOdontogramRequest $request, int $patient): JsonResponse
    {
        $teeth = $this->odontogram->sync($request->user(), $patient, $request->validated('teeth'));

        return ApiResponse::success(
            OdontogramToothResource::collection($teeth)->resolve(),
            'Odontogramme enregistré.'
        );
    }
}
