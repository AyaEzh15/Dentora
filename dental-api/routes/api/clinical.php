<?php

use App\Http\Controllers\Api\V1\ConsultationController;
use App\Http\Controllers\Api\V1\MedicalRecordController;
use App\Http\Controllers\Api\V1\OdontogramController;
use App\Http\Controllers\Api\V1\TreatmentPlanController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('patients/{patient}/medical-record', [MedicalRecordController::class, 'show'])
        ->middleware('permission:patients.view');
    Route::put('patients/{patient}/medical-record', [MedicalRecordController::class, 'upsert'])
        ->middleware('permission:patients.update');

    Route::get('patients/{patient}/odontogram', [OdontogramController::class, 'show'])
        ->middleware('permission:odontogram.view');
    Route::put('patients/{patient}/odontogram', [OdontogramController::class, 'sync'])
        ->middleware('permission:odontogram.update');

    Route::get('consultations', [ConsultationController::class, 'index'])
        ->middleware('permission:consultations.view');
    Route::post('consultations', [ConsultationController::class, 'store'])
        ->middleware('permission:consultations.create');
    Route::get('consultations/{consultation}', [ConsultationController::class, 'show'])
        ->middleware('permission:consultations.view');
    Route::put('consultations/{consultation}', [ConsultationController::class, 'update'])
        ->middleware('permission:consultations.update');

    Route::get('treatment-plans', [TreatmentPlanController::class, 'index'])
        ->middleware('permission:treatments.view');
    Route::post('treatment-plans', [TreatmentPlanController::class, 'store'])
        ->middleware('permission:treatments.create');
    Route::get('treatment-plans/{treatmentPlan}', [TreatmentPlanController::class, 'show'])
        ->middleware('permission:treatments.view');
    Route::put('treatment-plans/{treatmentPlan}', [TreatmentPlanController::class, 'update'])
        ->middleware('permission:treatments.update');
});
