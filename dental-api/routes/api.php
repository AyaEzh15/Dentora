<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    require __DIR__.'/api/auth.php';
    require __DIR__.'/api/dashboard.php';
    require __DIR__.'/api/patients.php';
    require __DIR__.'/api/appointments.php';
    require __DIR__.'/api/care-types.php';
    require __DIR__.'/api/clinical.php';
    require __DIR__.'/api/finance.php';
    require __DIR__.'/api/users.php';
});
