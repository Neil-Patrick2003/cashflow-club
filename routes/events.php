<?php

use App\Http\Controllers\Events\AttendanceController;
use App\Http\Controllers\Events\CheckInController;
use App\Http\Controllers\Events\EventController;
use App\Http\Controllers\Events\GameController;
use App\Http\Controllers\Events\RosterController;
use App\Http\Controllers\Events\SeminarController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:administer'])->group(function () {
    Route::get('events', [EventController::class, 'index'])->name('events.index');
    Route::post('events', [EventController::class, 'store'])->name('events.store');
    Route::patch('events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('events/{event}', [EventController::class, 'destroy'])->name('events.destroy');

    /* Who is turning up to one game, which is the admin's read of it. */
    Route::get('games/{game}/roster', [RosterController::class, 'show'])->name('games.roster');

    /* Working the door off that roster. A scanned card is matched to its seat
       here; a card that will not scan is ticked off the seat itself. */
    Route::post('games/{game}/check-ins', [CheckInController::class, 'store'])->name('games.check-ins.store');
    Route::post('registrations/{registration}/attendance', [AttendanceController::class, 'store'])
        ->name('registrations.attendance.store');
    Route::delete('registrations/{registration}/attendance', [AttendanceController::class, 'destroy'])
        ->name('registrations.attendance.destroy');

    Route::post('events/{event}/games', [GameController::class, 'store'])->name('games.store');
    Route::patch('games/{game}', [GameController::class, 'update'])->name('games.update');
    Route::delete('games/{game}', [GameController::class, 'destroy'])->name('games.destroy');

    Route::post('events/{event}/seminars', [SeminarController::class, 'store'])->name('seminars.store');
    Route::patch('seminars/{seminar}', [SeminarController::class, 'update'])->name('seminars.update');
    Route::delete('seminars/{seminar}', [SeminarController::class, 'destroy'])->name('seminars.destroy');
});
