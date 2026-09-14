<?php

use App\Http\Controllers\GameScheduleController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    /* Open to every member: the admin side of games lives in events.php. */
    Route::get('games', [GameScheduleController::class, 'index'])->name('games.index');
    Route::post('games/{game}/registrations', [RegistrationController::class, 'store'])
        ->name('registrations.store');
});

require __DIR__.'/configuration.php';
require __DIR__.'/events.php';
require __DIR__.'/payments.php';
require __DIR__.'/settings.php';
