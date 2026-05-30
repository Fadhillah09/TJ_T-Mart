<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'ApiSuccessResponse',
    properties: [
        new OA\Property(property: 'success', type: 'boolean', example: true),
        new OA\Property(property: 'message', type: 'string', example: 'OK'),
        new OA\Property(property: 'data', type: 'object'),
    ]
)]
#[OA\Schema(
    schema: 'ApiErrorResponse',
    properties: [
        new OA\Property(property: 'success', type: 'boolean', example: false),
        new OA\Property(property: 'message', type: 'string', example: 'Validasi gagal.'),
        new OA\Property(property: 'errors', type: 'object'),
    ]
)]
#[OA\Schema(
    schema: 'LoginRequest',
    required: ['email', 'password'],
    properties: [
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'customer@tjmart.com'),
        new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password'),
    ]
)]
#[OA\Schema(
    schema: 'RegisterRequest',
    required: ['name', 'email', 'password', 'password_confirmation'],
    properties: [
        new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john@example.com'),
        new OA\Property(property: 'password', type: 'string', format: 'password', example: 'Password1a'),
        new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'Password1a'),
        new OA\Property(property: 'phone', type: 'string', example: '081234567890'),
        new OA\Property(property: 'nomor_kamar', type: 'string', example: 'A-101'),
        new OA\Property(property: 'penghuni_asrama', type: 'boolean', example: true),
    ]
)]
#[OA\Schema(
    schema: 'CartItemRequest',
    required: ['produk_id', 'quantity'],
    properties: [
        new OA\Property(property: 'produk_id', type: 'integer', example: 1),
        new OA\Property(property: 'quantity', type: 'integer', minimum: 1, example: 2),
    ]
)]
#[OA\Schema(
    schema: 'UpdateCartItemRequest',
    required: ['quantity'],
    properties: [
        new OA\Property(property: 'quantity', type: 'integer', minimum: 1, example: 3),
    ]
)]
#[OA\Schema(
    schema: 'CheckoutRequest',
    required: ['tipe_layanan', 'metode_pembayaran', 'items'],
    properties: [
        new OA\Property(property: 'tipe_layanan', type: 'string', enum: ['pickup', 'delivery'], example: 'delivery'),
        new OA\Property(property: 'metode_pembayaran', type: 'string', enum: ['COD', 'MIDTRANS'], example: 'COD'),
        new OA\Property(property: 'alamat_pengantaran', type: 'string', example: 'Asrama TJ Blok A Kamar 101'),
        new OA\Property(
            property: 'items',
            type: 'array',
            items: new OA\Items(
                required: ['produk_id', 'quantity'],
                properties: [
                    new OA\Property(property: 'produk_id', type: 'integer', example: 1),
                    new OA\Property(property: 'quantity', type: 'integer', example: 2),
                ]
            )
        ),
    ]
)]
#[OA\Schema(
    schema: 'GalonRequest',
    required: ['nama_galon', 'jumlah', 'metode_pembayaran', 'metode_pengiriman'],
    properties: [
        new OA\Property(property: 'nama_galon', type: 'string', enum: ['Galon Baru + Isi', 'Galon 19L (Isi Ulang)'], example: 'Galon 19L (Isi Ulang)'),
        new OA\Property(property: 'jumlah', type: 'integer', minimum: 1, maximum: 50, example: 2),
        new OA\Property(property: 'metode_pembayaran', type: 'string', enum: ['COD', 'MIDTRANS'], example: 'COD'),
        new OA\Property(property: 'metode_pengiriman', type: 'string', enum: ['ambil', 'antar'], example: 'antar'),
        new OA\Property(property: 'catatan', type: 'string', example: 'Antar ke kamar A-101'),
    ]
)]
#[OA\Schema(
    schema: 'TokenRequest',
    required: ['nominal', 'metode_pembayaran'],
    properties: [
        new OA\Property(property: 'nominal', type: 'integer', enum: [20000, 50000, 100000, 200000, 500000], example: 50000),
        new OA\Property(property: 'metode_pembayaran', type: 'string', enum: ['COD', 'MIDTRANS'], example: 'COD'),
    ]
)]
#[OA\Schema(
    schema: 'AbsensiRequest',
    required: ['koordinat_absen'],
    properties: [
        new OA\Property(property: 'koordinat_absen', type: 'string', example: '-6.200000,106.816666', description: 'Format: latitude,longitude'),
    ]
)]
#[OA\Schema(
    schema: 'UpdateOrderStatusRequest',
    required: ['status'],
    properties: [
        new OA\Property(property: 'status', type: 'string', enum: ['pending', 'processing', 'delivering', 'completed', 'cancelled'], example: 'processing'),
        new OA\Property(property: 'kurir_id', type: 'integer', example: 3, description: 'Required when status=delivering'),
    ]
)]
#[OA\Schema(
    schema: 'UpdateGalonStatusRequest',
    required: ['status'],
    properties: [
        new OA\Property(property: 'status', type: 'string', enum: ['pending', 'paid', 'delivering', 'completed', 'cancelled'], example: 'delivering'),
    ]
)]
class OpenApiSpec
{
}
