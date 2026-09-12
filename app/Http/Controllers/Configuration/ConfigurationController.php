<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Inertia\Inertia;
use Inertia\Response;

class ConfigurationController extends Controller
{
    /**
     * Show the system configuration page.
     */
    public function index(): Response
    {
        return Inertia::render('configuration/index', [
            'chapters' => Chapter::query()->orderBy('name')->get(),
        ]);
    }
}
