<?php

use App\Http\Controllers\Api\V1\CareTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('care-types', [CareTypeController::class, 'index'])
        ->middleware('permission:appointments.view');
    Route::post('care-types', [CareTypeController::class, 'store'])
        ->middleware('permission:care-types.manage');
    Route::put('care-types/{careType}', [CareTypeController::class, 'update'])
        ->middleware('permission:care-types.manage');
});
