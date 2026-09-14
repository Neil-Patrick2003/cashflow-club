<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:administer'])->group(function () {
    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::patch('payments/{payment}', [PaymentController::class, 'update'])->name('payments.update');
});
