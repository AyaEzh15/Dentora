<?php

use App\Http\Controllers\Api\V1\AppointmentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('appointments/calendar', [AppointmentController::class, 'calendar'])
        ->middleware('permission:appointments.view');
    Route::get('appointments', [AppointmentController::class, 'index'])
        ->middleware('permission:appointments.view');
    Route::post('appointments', [AppointmentController::class, 'store'])
        ->middleware('permission:appointments.create');
    Route::get('appointments/{appointment}', [AppointmentController::class, 'show'])
        ->middleware('permission:appointments.view');
    Route::put('appointments/{appointment}', [AppointmentController::class, 'update'])
        ->middleware('permission:appointments.update');
    Route::post('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])
        ->middleware('permission:appointments.cancel');
});
