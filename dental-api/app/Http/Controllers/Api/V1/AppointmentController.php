<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Appointments\StoreAppointmentRequest;
use App\Http\Requests\Appointments\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Services\AppointmentService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        private AppointmentService $appointmentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $appointments = $this->appointmentService->paginate($request->user(), $request->all());

        return ApiResponse::paginated($appointments, AppointmentResource::class);
    }

    public function calendar(Request $request): JsonResponse
    {
        $appointments = $this->appointmentService->calendar($request->user(), $request->all());

        return ApiResponse::success(AppointmentResource::collection($appointments)->resolve());
    }

    public function show(Request $request, int $appointment): JsonResponse
    {
        return ApiResponse::success(
            new AppointmentResource($this->appointmentService->get($request->user(), $appointment))
        );
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $appointment = $this->appointmentService->create($request->user(), $request->validated());

        return ApiResponse::success(new AppointmentResource($appointment), 'Rendez-vous créé.', 201);
    }

    public function update(UpdateAppointmentRequest $request, int $appointment): JsonResponse
    {
        $updated = $this->appointmentService->update($request->user(), $appointment, $request->validated());

        return ApiResponse::success(new AppointmentResource($updated), 'Rendez-vous mis à jour.');
    }

    public function cancel(Request $request, int $appointment): JsonResponse
    {
        $cancelled = $this->appointmentService->cancel(
            $request->user(),
            $appointment,
            $request->input('reason')
        );

        return ApiResponse::success(new AppointmentResource($cancelled), 'Rendez-vous annulé.');
    }
}
