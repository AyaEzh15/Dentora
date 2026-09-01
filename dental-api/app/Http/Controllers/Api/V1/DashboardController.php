<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\UserResource;
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

        if (($overview['mode'] ?? '') === 'admin') {
            return ApiResponse::success([
                'mode' => 'admin',
                'kpis' => $overview['kpis'],
                'dentists' => UserResource::collection($overview['dentists'])->resolve(),
            ]);
        }

        return ApiResponse::success([
            'mode' => 'operational',
            'kpis' => $overview['kpis'],
            'todayAppointments' => AppointmentResource::collection($overview['todayAppointments'])->resolve(),
            'statusBreakdown' => $overview['statusBreakdown'],
        ]);
    }
}
