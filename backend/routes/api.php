<?php

namespace App\Http\Controllers\Api; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\CourierController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\AuthController as ApiAuthController; 
use App\Http\Controllers\AuthController as WebAuthController;

Route::post('/login', [ApiAuthController::class, 'login']);
Route::post('/login-kurir', [ApiAuthController::class, 'loginKurir']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    
    Route::get('/user', function (Request $request) {
        return $request->user()->load('role', 'karyawanProfile');
    });

    Route::middleware('role:Kurir')->group(function () {
        Route::get('/kurir/profile', [CourierController::class, 'getProfile']);
        
        Route::patch('/kurir/order/{id}/status', [CourierController::class, 'updateDeliveryStatus']);
        Route::get('/kurir/my-payroll', [PayrollController::class, 'myGaji']); 
        
        Route::post('/kurir/check-in', [CourierController::class, 'checkIn']);
        Route::post('/kurir/check-out', [CourierController::class, 'checkOut']);
    });

    Route::middleware('role:Super Admin')->group(function () {
        Route::get('/admin/payroll/kurir-list', [PayrollController::class, 'getKurirForPayroll']);
        Route::post('/admin/payroll/store', [PayrollController::class, 'storeGaji']);
    });
});