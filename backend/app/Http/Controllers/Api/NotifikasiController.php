<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class NotifikasiController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }

    public function markAsRead(string $id): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }
}
