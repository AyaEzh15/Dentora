<?php

use App\Http\Controllers\Api\V1\InvoiceController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\PrescriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('invoices', [InvoiceController::class, 'index'])
        ->middleware('permission:billing.view');
    Route::post('invoices', [InvoiceController::class, 'store'])
        ->middleware('permission:billing.create');
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])
        ->middleware('permission:billing.view');
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'pdf'])
        ->middleware('permission:billing.view');
    Route::put('invoices/{invoice}', [InvoiceController::class, 'update'])
        ->middleware('permission:billing.create');

    Route::get('payments', [PaymentController::class, 'index'])
        ->middleware('permission:payments.view');
    Route::post('payments', [PaymentController::class, 'store'])
        ->middleware('permission:payments.create');

    Route::get('prescriptions', [PrescriptionController::class, 'index'])
        ->middleware('permission:prescriptions.view');
    Route::post('prescriptions', [PrescriptionController::class, 'store'])
        ->middleware('permission:prescriptions.create');
    Route::get('prescriptions/{prescription}', [PrescriptionController::class, 'show'])
        ->middleware('permission:prescriptions.view');
    Route::get('prescriptions/{prescription}/pdf', [PrescriptionController::class, 'pdf'])
        ->middleware('permission:prescriptions.view');
    Route::put('prescriptions/{prescription}', [PrescriptionController::class, 'update'])
        ->middleware('permission:prescriptions.create');
});
