<?php

use App\Http\Controllers\Api\LokasiDeliveryController;
use App\Http\Controllers\Api\MasterKamarController;
use Illuminate\Support\Facades\Route;

Route::get('/lokasi', [LokasiDeliveryController::class, 'index']);
Route::get('/kamar', [MasterKamarController::class, 'index']);