<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * @OA\Info(
 *   title="TJ-T-Mart API",
 *   version="1.0.0",
 *   description="REST API for TJ-T-Mart — Dormitory Mini-Mart System"
 * )
 *
 * @OA\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   type="http",
 *   scheme="bearer",
 *   bearerFormat="JWT"
 * )
 *
 * @OA\Server(url=L5_SWAGGER_CONST_HOST, description="API Server")
 */
abstract class Controller
{
    use ApiResponse, AuthorizesRequests;
}
