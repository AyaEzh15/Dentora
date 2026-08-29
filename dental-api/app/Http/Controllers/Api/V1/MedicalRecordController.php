<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinical\UpsertMedicalRecordRequest;
use App\Http\Resources\MedicalRecordResource;
use App\Services\MedicalRecordService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function __construct(
        private MedicalRecordService $medicalRecords
    ) {}

    public function show(Request $request, int $patient): JsonResponse
    {
        $record = $this->medicalRecords->get($request->user(), $patient);

        return ApiResponse::success($record ? new MedicalRecordResource($record) : null);
    }

    public function upsert(UpsertMedicalRecordRequest $request, int $patient): JsonResponse
    {
        $record = $this->medicalRecords->upsert($request->user(), $patient, $request->validated());

        return ApiResponse::success(new MedicalRecordResource($record), 'Dossier médical enregistré.');
    }
}
