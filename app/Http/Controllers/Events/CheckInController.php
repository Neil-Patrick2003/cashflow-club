<?php

namespace App\Http\Controllers\Events;

use App\Enums\CheckInMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Events\CheckInStoreRequest;
use App\Models\Game;
use App\Models\MembershipCard;
use App\Models\Registration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CheckInController extends Controller
{
    /**
     * Record that the holder of a scanned card turned up to the given game.
     *
     * The card carries a token and nothing else, so the door learns who it
     * belongs to here rather than from the card itself. Whatever the seat
     * still owes is not the door's business: someone who is registered is let
     * in, and the money is collected off the roster afterwards.
     */
    public function store(CheckInStoreRequest $request, Game $game): RedirectResponse
    {
        $card = MembershipCard::query()
            ->with('user')
            ->where('token', $request->validated('token'))
            ->first();

        if (! $card) {
            $this->reject(__('That code is not a membership card.'));
        }

        $seat = $game->registrations()->whereBelongsTo($card->user)->first();

        if (! $seat) {
            $this->reject(__(':name has no seat at this game.', ['name' => $card->user->name]));
        }

        /* A card waved twice at a queue that moved on is the same arrival, so
           the first reading is the one that stands. */
        if ($seat->attendance()->exists()) {
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => __(':name is already checked in.', ['name' => $card->user->name]),
            ]);

            return back();
        }

        $this->recordArrival($seat, $request->user()->id);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __(':name checked in.', ['name' => $card->user->name]),
        ]);

        return back();
    }

    /**
     * Write the arrival against the seat, as read off the member's own card.
     */
    private function recordArrival(Registration $seat, int $recordedBy): void
    {
        $seat->attendance()->create([
            'checked_in_at' => now(),
            'method' => CheckInMethod::Qr,
            'recorded_by' => $recordedBy,
        ]);
    }

    /**
     * Turn a card the door cannot admit into an error on the page.
     */
    private function reject(string $message): never
    {
        throw ValidationException::withMessages(['token' => $message]);
    }
}
