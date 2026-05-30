<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RefreshSanctumAuthentication
{
    /**
     * Force Sanctum to re-resolve the user from the bearer token on every request.
     * Prevents revoked tokens from being accepted via cached guard state.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->bearerToken()) {
            auth('sanctum')->forgetUser();
        }

        return $next($request);
    }
}
