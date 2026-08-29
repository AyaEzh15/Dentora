<?php

use App\Http\Controllers\Api\V1\PatientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('patients/search', [PatientController::class, 'search'])
        ->middleware('permission:patients.view');
    Route::get('patients', [PatientController::class, 'index'])
        ->middleware('permission:patients.view');
    Route::post('patients', [PatientController::class, 'store'])
        ->middleware('permission:patients.create');
    Route::get('patients/{patient}', [PatientController::class, 'show'])
        ->middleware('permission:patients.view')
        ->name('patients.show');
    Route::put('patients/{patient}', [PatientController::class, 'update'])
        ->middleware('permission:patients.update');
});
