<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class MartController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['message' => 'ok']);
    }
}
