<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    'allowed_origins' => array_filter([
        'http://localhost:3000',
        'http://localhost:5173',
        env('APP_FRONTEND_URL'),
    ]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
    ],

    'exposed_headers' => [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
    ],

    'max_age' => 86400,

    'supports_credentials' => true,

];
