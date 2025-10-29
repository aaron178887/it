<?php

return [
    'ssr' => [
        'enabled' => env('INERTIA_SSR_ENABLED', true),
        'url'     => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
        // Bezpečné pro oba názvy souboru (ssr.mjs i ssr.js):
        'bundle'  => file_exists(base_path('bootstrap/ssr/ssr.mjs'))
            ? base_path('bootstrap/ssr/ssr.mjs')
            : base_path('bootstrap/ssr/ssr.js'),
    ],
];
