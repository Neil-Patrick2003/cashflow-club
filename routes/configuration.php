<?php

use App\Http\Controllers\Configuration\ChapterController;
use App\Http\Controllers\Configuration\ConfigurationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:administer'])->group(function () {
    Route::get('configuration', [ConfigurationController::class, 'index'])->name('configuration.index');

    Route::post('configuration/chapters', [ChapterController::class, 'store'])->name('chapters.store');
    Route::patch('configuration/chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
    Route::delete('configuration/chapters/{chapter}', [ChapterController::class, 'destroy'])->name('chapters.destroy');
});
