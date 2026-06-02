<?php

use App\Http\Controllers\Api\AbsensiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\GalonTransactionController;
use App\Http\Controllers\Api\KategoriProdukController;
use App\Http\Controllers\Api\LokasiDeliveryController;
use App\Http\Controllers\Api\MartController;
use App\Http\Controllers\Api\NotifikasiController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\RiwayatPembelianController;
use App\Http\Controllers\Api\TokenTransactionController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MasterKamarController;


Route::middleware('throttle:auth')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

Route::get('/auth/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed', 'throttle:auth'])
    ->name('verification.verify');

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);
    Route::post('/auth/email/resend', [AuthController::class, 'resendVerification'])
        ->middleware('throttle:auth');
    Route::get('/auth/me', [AuthController::class, 'me'])->middleware('verified');
});

Route::middleware(['auth:sanctum', 'verified', 'throttle:api'])->group(function () {
    Route::middleware('throttle:public')->group(function () {
        Route::get('/mart', [MartController::class, 'index']);
        Route::get('/mart/{id}', [MartController::class, 'show']);
        Route::get('/produk', [ProdukController::class, 'index']);
        Route::get('/produk/{id}', [ProdukController::class, 'show']);
        Route::get('/kategori', [KategoriProdukController::class, 'index']);
        Route::get('/banner', [BannerController::class, 'index']);
    });

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);
    Route::get('/riwayat-pembelian', [RiwayatPembelianController::class, 'index']);
    Route::post('/riwayat-pembelian', [RiwayatPembelianController::class, 'store']);
    Route::get('/riwayat-pembelian/{id}', [RiwayatPembelianController::class, 'show']);
    Route::get('/galon', [GalonTransactionController::class, 'index']);
    Route::post('/galon', [GalonTransactionController::class, 'store']);
    Route::get('/token', [TokenTransactionController::class, 'index']);
    Route::post('/token', [TokenTransactionController::class, 'store']);
    Route::get('/notifikasi', [NotifikasiController::class, 'index']);
    Route::put('/notifikasi/{id}/read', [NotifikasiController::class, 'markAsRead']);
    Route::put('/notifikasi/read-all', [NotifikasiController::class, 'markAllRead']);

    Route::post('/absensi', [AbsensiController::class, 'store'])
        ->middleware('role:admin,superadmin,kurir');

    Route::middleware('role:admin,superadmin')->group(function () {
        Route::get('/admin/produk', [ProdukController::class, 'adminIndex']);
        Route::post('/admin/produk', [ProdukController::class, 'store']);
        Route::put('/admin/produk/{id}', [ProdukController::class, 'update']);
        Route::delete('/admin/produk/{id}', [ProdukController::class, 'destroy']);
        Route::get('/admin/riwayat-pembelian', [RiwayatPembelianController::class, 'adminIndex']);
        Route::put('/admin/riwayat-pembelian/{id}/status', [RiwayatPembelianController::class, 'updateStatus']);
        Route::get('/admin/galon', [GalonTransactionController::class, 'adminIndex']);
        Route::put('/admin/galon/{id}/status', [GalonTransactionController::class, 'updateStatus']);
        Route::get('/admin/absensi', [AbsensiController::class, 'index']);
    });
});
