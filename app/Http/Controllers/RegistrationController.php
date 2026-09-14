<?php

namespace App\Http\Controllers;

use App\Enums\GameStatus;
use App\Enums\PaymentStatus;
use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    /**
     * Claim the signed-in member a seat at the given game.
     *
     * How they get in and what they owe is worked out here rather than sent
     * up, so nobody can register themselves at a price of their choosing. A
     * seat that owes money opens a pending payment; one covered by membership
     * has nothing to collect and so opens none.
     */
    public function store(Request $request, Game $game): RedirectResponse
    {
        $user = $request->user();

        $game->loadMissing('event')->loadCount('registrations');

        if ($game->status === GameStatus::Cancelled) {
            $this->reject(__('This game has been cancelled.'));
        }

        if ($game->event->date->isBefore(today())) {
            $this->reject(__('This game has already been played.'));
        }

        if ($game->registrations()->whereBelongsTo($user)->exists()) {
            $this->reject(__('You are already registered for this game.'));
        }

        if ($game->registrations_count >= $game->capacity) {
            $this->reject(__('This game is full.'));
        }

        $registration = $game->registrations()->create([
            ...$game->entryFor($user),
            'user_id' => $user->id,
        ]);

        if ((float) $registration->price_due > 0) {
            $registration->payment()->create([
                'amount' => $registration->price_due,
                'status' => PaymentStatus::Pending,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Seat reserved.')]);

        return back();
    }

    /**
     * Turn a seat the member cannot take into an error on the page.
     */
    protected function reject(string $message): never
    {
        throw ValidationException::withMessages(['game' => $message]);
    }
}
