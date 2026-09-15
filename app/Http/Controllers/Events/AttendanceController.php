<?php

namespace App\Http\Controllers\Events;

use App\Enums\CheckInMethod;
use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Record that the holder of the given seat turned up.
     *
     * The door's fallback for a card that will not scan, so it is ticked off
     * the roster by hand. Checking in twice is the same as checking in once:
     * the second scan of a queue that moved on leaves the first arrival time
     * alone rather than resetting it.
     */
    public function store(Request $request, Registration $registration): RedirectResponse
    {
        $registration->attendance()->firstOrCreate([], [
            'checked_in_at' => now(),
            'method' => CheckInMethod::Manual,
            'recorded_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Checked in.')]);

        return back();
    }

    /**
     * Take back a check-in recorded against the wrong seat.
     *
     * Only the attendance goes: the seat and whatever it owes are untouched,
     * because turning up and paying are separate records.
     */
    public function destroy(Registration $registration): RedirectResponse
    {
        $registration->attendance()->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Check-in undone.')]);

        return back();
    }
}
