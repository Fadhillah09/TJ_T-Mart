<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

/**
 * OpenAPI path definitions for TJ-T-Mart API endpoints.
 * Controllers implement the logic; this class documents the HTTP contract.
 */
#[OA\Post(
    path: '/auth/register',
    operationId: 'authRegister',
    tags: ['Auth'],
    summary: 'Register a new customer account',
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: '#/components/schemas/RegisterRequest')
    ),
    responses: [
        new OA\Response(response: 201, description: 'Registration successful', content: new OA\JsonContent(ref: '#/components/schemas/ApiSuccessResponse')),
        new OA\Response(response: 422, description: 'Validation error', content: new OA\JsonContent(ref: '#/components/schemas/ApiErrorResponse')),
    ]
)]
#[OA\Post(
    path: '/auth/login',
    operationId: 'authLogin',
    tags: ['Auth'],
    summary: 'Login and obtain Bearer token',
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: '#/components/schemas/LoginRequest')
    ),
    responses: [
        new OA\Response(response: 200, description: 'Login successful'),
        new OA\Response(response: 401, description: 'Invalid credentials'),
        new OA\Response(response: 429, description: 'Account locked'),
    ]
)]
#[OA\Post(path: '/auth/logout', operationId: 'authLogout', tags: ['Auth'], summary: 'Revoke current token', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Logout successful')])]
#[OA\Post(path: '/auth/logout-all', operationId: 'authLogoutAll', tags: ['Auth'], summary: 'Revoke all tokens', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'All sessions terminated')])]
#[OA\Get(path: '/auth/me', operationId: 'authMe', tags: ['Auth'], summary: 'Get authenticated profile', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Profile retrieved'), new OA\Response(response: 403, description: 'Email not verified')])]
#[OA\Get(path: '/produk', operationId: 'produkIndex', tags: ['Produk', 'Public'], summary: 'List active products', security: [['sanctum' => []]], parameters: [
    new OA\Parameter(name: 'kategori_id', in: 'query', schema: new OA\Schema(type: 'integer')),
    new OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string')),
    new OA\Parameter(name: 'mart_id', in: 'query', schema: new OA\Schema(type: 'integer')),
], responses: [new OA\Response(response: 200, description: 'Paginated product list')])]
#[OA\Get(path: '/produk/{id}', operationId: 'produkShow', tags: ['Produk', 'Public'], summary: 'Product detail', security: [['sanctum' => []]], parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))], responses: [new OA\Response(response: 200, description: 'Product detail'), new OA\Response(response: 404, description: 'Not found')])]
#[OA\Get(path: '/cart', operationId: 'cartIndex', tags: ['Cart'], summary: 'Get cart', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Cart with total_harga')])]
#[OA\Post(path: '/cart', operationId: 'cartStore', tags: ['Cart'], summary: 'Add to cart', security: [['sanctum' => []]], requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/CartItemRequest')), responses: [new OA\Response(response: 201, description: 'Item added'), new OA\Response(response: 422, description: 'Insufficient stock')])]
#[OA\Put(path: '/cart/{id}', operationId: 'cartUpdate', tags: ['Cart'], summary: 'Update cart item quantity', security: [['sanctum' => []]], parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))], requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(properties: [new OA\Property(property: 'quantity', type: 'integer', minimum: 1)])), responses: [new OA\Response(response: 200, description: 'Cart updated')])]
#[OA\Delete(path: '/cart/{id}', operationId: 'cartDestroy', tags: ['Cart'], summary: 'Remove cart item', security: [['sanctum' => []]], parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))], responses: [new OA\Response(response: 200, description: 'Item removed')])]
#[OA\Get(path: '/riwayat-pembelian', operationId: 'ordersIndex', tags: ['Orders'], summary: 'List user orders', security: [['sanctum' => []]], parameters: [new OA\Parameter(name: 'status', in: 'query', schema: new OA\Schema(type: 'string'))], responses: [new OA\Response(response: 200, description: 'Paginated orders')])]
#[OA\Post(path: '/riwayat-pembelian', operationId: 'ordersStore', tags: ['Orders'], summary: 'Checkout — create order', description: 'Server-side pricing, stock deduction, cart clear in DB transaction.', security: [['sanctum' => []]], requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/CheckoutRequest')), responses: [new OA\Response(response: 201, description: 'Order created'), new OA\Response(response: 422, description: 'Stock insufficient')])]
#[OA\Get(path: '/riwayat-pembelian/{id}', operationId: 'ordersShow', tags: ['Orders'], summary: 'Order detail', security: [['sanctum' => []]], parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))], responses: [new OA\Response(response: 200, description: 'Order detail'), new OA\Response(response: 403, description: 'Forbidden')])]
#[OA\Get(path: '/galon', operationId: 'galonIndex', tags: ['Galon'], summary: 'List galon transactions', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Galon history')])]
#[OA\Post(path: '/galon', operationId: 'galonStore', tags: ['Galon'], summary: 'Create galon order', security: [['sanctum' => []]], requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/GalonRequest')), responses: [new OA\Response(response: 201, description: 'Galon order created')])]
#[OA\Get(path: '/token', operationId: 'tokenIndex', tags: ['Token'], summary: 'List token purchases', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Token history')])]
#[OA\Post(path: '/token', operationId: 'tokenStore', tags: ['Token'], summary: 'Purchase electricity token', security: [['sanctum' => []]], requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/TokenRequest')), responses: [new OA\Response(response: 201, description: 'Token generated instantly')])]
#[OA\Post(path: '/absensi', operationId: 'absensiStore', tags: ['Absensi'], summary: 'Check in / check out', security: [['sanctum' => []]], requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/AbsensiRequest')), responses: [new OA\Response(response: 201, description: 'Check-in recorded'), new OA\Response(response: 409, description: 'Already complete today')])]
#[OA\Get(path: '/notifikasi', operationId: 'notifikasiIndex', tags: ['Notifikasi'], summary: 'List notifications', description: 'Includes unread_count in meta.', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Notification list')])]
#[OA\Put(path: '/notifikasi/{id}/read', operationId: 'notifikasiMarkRead', tags: ['Notifikasi'], summary: 'Mark notification read', security: [['sanctum' => []]], parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))], responses: [new OA\Response(response: 200, description: 'Marked read'), new OA\Response(response: 404, description: 'Not found')])]
#[OA\Put(path: '/notifikasi/read-all', operationId: 'notifikasiMarkAllRead', tags: ['Notifikasi'], summary: 'Mark all notifications read', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'All marked read')])]
#[OA\Get(path: '/admin/produk', operationId: 'adminProdukIndex', tags: ['Admin', 'Produk'], summary: 'Admin: list products', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Admin product list')])]
#[OA\Post(path: '/admin/produk', operationId: 'adminProdukStore', tags: ['Admin', 'Produk'], summary: 'Admin: create product', security: [['sanctum' => []]], responses: [new OA\Response(response: 201, description: 'Product created')])]
#[OA\Get(path: '/admin/riwayat-pembelian', operationId: 'adminOrdersIndex', tags: ['Admin', 'Orders'], summary: 'Admin: list all orders', security: [['sanctum' => []]], parameters: [
    new OA\Parameter(name: 'status', in: 'query', schema: new OA\Schema(type: 'string')),
    new OA\Parameter(name: 'mart_id', in: 'query', schema: new OA\Schema(type: 'integer')),
    new OA\Parameter(name: 'date_from', in: 'query', schema: new OA\Schema(type: 'string', format: 'date')),
    new OA\Parameter(name: 'date_to', in: 'query', schema: new OA\Schema(type: 'string', format: 'date')),
], responses: [new OA\Response(response: 200, description: 'Admin orders')])]
#[OA\Put(path: '/admin/riwayat-pembelian/{id}/status', operationId: 'adminOrdersUpdateStatus', tags: ['Admin', 'Orders'], summary: 'Admin: update order status', security: [['sanctum' => []]], parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))], requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(ref: '#/components/schemas/UpdateOrderStatusRequest')), responses: [new OA\Response(response: 200, description: 'Status updated')])]
#[OA\Get(path: '/admin/galon', operationId: 'adminGalonIndex', tags: ['Admin', 'Galon'], summary: 'Admin: list galon orders', security: [['sanctum' => []]], responses: [new OA\Response(response: 200, description: 'Admin galon list')])]
#[OA\Put(path: '/admin/galon/{id}/status', operationId: 'adminGalonUpdateStatus', tags: ['Admin', 'Galon'], summary: 'Admin: update galon status', security: [['sanctum' => []]], parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))], requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(properties: [new OA\Property(property: 'status', type: 'string', enum: ['pending', 'paid', 'delivering', 'completed', 'cancelled'])])), responses: [new OA\Response(response: 200, description: 'Status updated')])]
#[OA\Get(path: '/admin/absensi', operationId: 'adminAbsensiIndex', tags: ['Admin', 'Absensi'], summary: 'Admin: list attendance', security: [['sanctum' => []]], parameters: [
    new OA\Parameter(name: 'user_id', in: 'query', schema: new OA\Schema(type: 'integer')),
    new OA\Parameter(name: 'tanggal', in: 'query', schema: new OA\Schema(type: 'string', format: 'date')),
    new OA\Parameter(name: 'status', in: 'query', schema: new OA\Schema(type: 'string', enum: ['tepat_waktu', 'terlambat', 'mangkir'])),
], responses: [new OA\Response(response: 200, description: 'Attendance list')])]
class ApiPaths
{
}
