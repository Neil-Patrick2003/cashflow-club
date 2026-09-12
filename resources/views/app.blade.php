<!DOCTYPE html>
{{-- The club runs one theme, the night theme, so `dark` is fixed here. --}}
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline style so the ink background paints before app.css loads --}}
        <style>
            html {
                background-color: #090014;
            }
        </style>

        {{-- The club seal, generated from public/cashflow-logo.png --}}
        <link rel="icon" href="/favicon.ico" sizes="32x32 96x96">
        <link rel="icon" href="/cashflow-logo-96.png" type="image/png" sizes="96x96">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
