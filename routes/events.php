<?php

use App\Http\Controllers\Events\EventController;
use App\Http\Controllers\Events\GameController;
use App\Http\Controllers\Events\SeminarController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:administer'])->group(function () {
    Route::get('events', [EventController::class, 'index'])->name('events.index');
    Route::post('events', [EventController::class, 'store'])->name('events.store');
    Route::patch('events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [EventController::class, 'destroy'])->name('events.destroy');

    Route::post('events/{event}/games', [GameController::class, 'store'])->name('games.store');
    Route::patch('games/{game}', [GameController::class, 'update'])->name('games.update');
    Route::delete('games/{game}', [GameController::class, 'destroy'])->name('games.destroy');

    Route::post('events/{event}/seminars', [SeminarController::class, 'store'])->name('seminars.store');
    Route::patch('seminars/{seminar}', [SeminarController::class, 'update'])->name('seminars.update');
    Route::delete('seminars/{seminar}', [SeminarController::class, 'destroy'])->name('seminars.destroy');
});
