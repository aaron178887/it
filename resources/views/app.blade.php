<!doctype html>
<html lang="{{ str_replace('_','-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  {{-- TITLE + description pro SEO --}}
  <title>IT Globe – Výkonná IT infrastruktura, hosting a správa serverů</title>
  <title inertia>IT Globe – Výkonná IT infrastruktura, hosting a správa serverů</title>
  <meta name="description" content="IT Globe – profesionální hosting, výkonné VPS, Kubernetes a kompletní správu serverů s nepřetržitým dohledem 24/7. Spolehlivá a bezpečná IT řešení na míru.">
  <meta name="keywords" content="IT infrastruktura, hosting, správa serverů, VPS, Kubernetes">
  <meta name="theme-color" content="#F52130">
  <meta name="robots" content="index,follow">

  {{-- Canonical --}}
  <link rel="canonical" href="{{ url()->current() }}">

  {{-- Favicons --}}
  <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">
  <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32x32.png') }}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon-16x16.png') }}">
  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">
  <link rel="manifest" href="{{ asset('site.webmanifest') }}">

  {{-- Open Graph --}}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="IT Globe">
  <meta property="og:locale" content="cs_CZ">
  <meta property="og:title" content="IT Globe – Výkonná IT infrastruktura, hosting a správa serverů">
  <meta property="og:description" content="Profesionální hosting, výkonné VPS, Kubernetes a kompletní správu serverů s nepřetržitým dohledem 24/7. Spolehlivá a bezpečná IT řešení na míru.">
  <meta property="og:url" content="{{ config('app.url', 'https://itglobe.eu') }}">
  <meta property="og:image" content="{{ asset('images/home_hero.jpg') }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="IT Globe – Výkonná IT infrastruktura">

  {{-- Twitter / X card --}}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="IT Globe – Výkonná IT infrastruktura, hosting a správa serverů">
  <meta name="twitter:description" content="Profesionální hosting, výkonné VPS, Kubernetes a kompletní správu serverů s nepřetržitým dohledem 24/7. Spolehlivá a bezpečná IT řešení na míru.">
  <meta name="twitter:image" content="{{ asset('images/home_hero.jpg') }}">

  {{-- Google Fonts (non-blocking) --}}
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Sora:wght@600;700&display=swap">
  <link rel="stylesheet" media="print" onload="this.media='all'" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Sora:wght@600;700&display=swap">
  <noscript>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Sora:wght@600;700&display=swap">
  </noscript>

  {{-- ✅ Preload LCP hero obrázku --}}
  <link rel="preload" as="image" href="/images/home_hero.jpg" fetchpriority="high">

  @php
    $base    = rtrim(config('app.url', url('/')), '/');
    $ogImage = asset('images/home_hero.jpg');
    $logo    = asset('images/logo.png');

    $orgJson = [
      '@context' => 'https://schema.org',
      '@type'    => 'Organization',
      'name'     => 'IT Globe',
      'url'      => $base . '/',
      'logo'     => $logo,
      'contactPoint' => [[
        '@type' => 'ContactPoint',
        'contactType' => 'customer support',
        'availableLanguage' => ['cs','en'],
      ]],
    ];

    $siteJson = [
      '@context' => 'https://schema.org',
      '@type'    => 'WebSite',
      'name'     => 'IT Globe',
      'url'      => $base . '/',
    ];

    $pageJson = [
      '@context' => 'https://schema.org',
      '@type'    => 'WebPage',
      'url'      => url()->current(),
      'name'     => 'IT Globe – Výkonná IT infrastruktura, hosting a správa serverů',
      'inLanguage' => 'cs-CZ',
      'description' => 'Profesionální hosting, výkonné VPS, Kubernetes a kompletní správu serverů s nepřetržitým dohledem 24/7. Spolehlivá a bezpečná IT řešení na míru.',
      'primaryImageOfPage' => [
        '@type'  => 'ImageObject',
        'url'    => $ogImage,
        'width'  => 1200,
        'height' => 630,
      ],
    ];
  @endphp

  {{-- Schema.org JSON-LD (bez Blade výrazů uvnitř) --}}
  <script type="application/ld+json">{!! json_encode($orgJson, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) !!}</script>
  <script type="application/ld+json">{!! json_encode($siteJson, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) !!}</script>
  <script type="application/ld+json">{!! json_encode($pageJson, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) !!}</script>

  {{-- Vite + Inertia --}}
  @vite('resources/js/app.js')
  @inertiaHead
</head>
<body class="antialiased">
  @inertia
</body>
</html>
