<?php

use App\Http\Controllers\Api\V1\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:dashboard.view'])
    ->get('dashboard', DashboardController::class);
