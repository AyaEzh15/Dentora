<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payments\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Services\PaymentService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $payments
    ) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::paginated(
            $this->payments->paginate($request->user(), $request->all()),
            PaymentResource::class
        );
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = $this->payments->create($request->user(), $request->validated());

        return ApiResponse::success(new PaymentResource($payment), 'Paiement enregistré.', 201);
    }
}
