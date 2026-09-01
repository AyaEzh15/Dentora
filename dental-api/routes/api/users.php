<?php

use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('users/dentists', [UserController::class, 'dentists'])
        ->middleware('permission:users.view|appointments.view');
    Route::get('users', [UserController::class, 'index'])
        ->middleware('permission:users.view');
    Route::post('users', [UserController::class, 'store'])
        ->middleware('permission:users.manage');
    Route::get('users/{user}', [UserController::class, 'show'])
        ->middleware('permission:users.view');
    Route::put('users/{user}', [UserController::class, 'update'])
        ->middleware('permission:users.manage');
    Route::post('users/{user}/templates', [UserController::class, 'templates'])
        ->middleware('permission:users.manage');
});
