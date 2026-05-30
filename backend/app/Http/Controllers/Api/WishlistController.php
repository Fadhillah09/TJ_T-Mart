<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class WishlistController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }

    public function store(): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }

    public function destroy(string $id): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }
}
