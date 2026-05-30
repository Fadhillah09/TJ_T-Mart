<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class RiwayatPembelianController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }

    public function store(): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }

    public function adminIndex(): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }

    public function updateStatus(string $id): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }
}
