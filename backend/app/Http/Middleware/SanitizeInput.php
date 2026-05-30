<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    public function handle(Request $request, Closure $next): Response
    {
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH'], true)) {
            $sanitized = $this->sanitizeArray($request->all());
            $request->merge($sanitized);
        }

        return $next($request);
    }

    private function sanitizeArray(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = strip_tags(trim($value));
            } elseif (is_array($value)) {
                $data[$key] = $this->sanitizeArray($value);
            }
        }

        return $data;
    }
}
