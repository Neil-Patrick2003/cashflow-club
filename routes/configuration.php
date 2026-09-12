<?php

use App\Http\Controllers\Configuration\ChapterController;
use App\Http\Controllers\Configuration\LevelRequirementController;
use App\Http\Controllers\Configuration\MembershipLevelController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:administer'])->group(function () {
    Route::redirect('configuration', '/configuration/chapters')->name('configuration.index');

    Route::get('configuration/chapters', [ChapterController::class, 'index'])->name('chapters.index');
    Route::post('configuration/chapters', [ChapterController::class, 'store'])->name('chapters.store');
    Route::patch('configuration/chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
    Route::delete('configuration/chapters/{chapter}', [ChapterController::class, 'destroy'])->name('chapters.destroy');

    Route::get('configuration/membership-levels', [MembershipLevelController::class, 'index'])->name('membership-levels.index');
    Route::post('configuration/membership-levels', [MembershipLevelController::class, 'store'])->name('membership-levels.store');
    Route::patch('configuration/membership-levels/{membershipLevel}', [MembershipLevelController::class, 'update'])->name('membership-levels.update');
    Route::delete('configuration/membership-levels/{membershipLevel}', [MembershipLevelController::class, 'destroy'])->name('membership-levels.destroy');

    Route::post('configuration/membership-levels/{membershipLevel}/requirements', [LevelRequirementController::class, 'store'])->name('level-requirements.store');
    Route::patch('configuration/level-requirements/{levelRequirement}', [LevelRequirementController::class, 'update'])->name('level-requirements.update');
    Route::delete('configuration/level-requirements/{levelRequirement}', [LevelRequirementController::class, 'destroy'])->name('level-requirements.destroy');
});
