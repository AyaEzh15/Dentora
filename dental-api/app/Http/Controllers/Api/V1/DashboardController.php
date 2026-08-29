<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Services\DashboardService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $overview = $this->dashboardService->getOverview($request->user());

        return ApiResponse::success([
            'kpis' => $overview['kpis'],
            'todayAppointments' => AppointmentResource::collection($overview['todayAppointments'])->resolve(),
            'statusBreakdown' => $overview['statusBreakdown'],
        ]);
    }
}
