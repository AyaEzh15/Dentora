<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patients\StorePatientRequest;
use App\Http\Requests\Patients\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Services\PatientService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function __construct(
        private PatientService $patientService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $patients = $this->patientService->paginate($request->user(), $request->all());

        return ApiResponse::paginated($patients, PatientResource::class);
    }

    public function search(Request $request): JsonResponse
    {
        $patients = $this->patientService->search($request->user(), (string) $request->query('q', ''));

        return ApiResponse::success(PatientResource::collection($patients)->resolve());
    }

    public function show(Request $request, int $patient): JsonResponse
    {
        return ApiResponse::success(
            new PatientResource($this->patientService->get($request->user(), $patient))
        );
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $patient = $this->patientService->create($request->user(), $request->validated());

        return ApiResponse::success(new PatientResource($patient), 'Patient créé avec succès.', 201);
    }

    public function update(UpdatePatientRequest $request, int $patient): JsonResponse
    {
        $updated = $this->patientService->update($request->user(), $patient, $request->validated());

        return ApiResponse::success(new PatientResource($updated), 'Patient mis à jour.');
    }
}
