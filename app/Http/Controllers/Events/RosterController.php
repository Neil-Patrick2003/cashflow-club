<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Inertia\Inertia;
use Inertia\Response;

class RosterController extends Controller
{
    /**
     * Show who is turning up to the given game, and work the door off it.
     *
     * The seats are listed in the order they were claimed, each with what its
     * holder owes and whether they have arrived, so the club can register the
     * money and the arrivals from this page alone.
     */
    public function show(Game $game): Response
    {
        return Inertia::render('games/roster', [
            'game' => $game->load(['event.chapter', 'masterFacilitator']),
            'seats' => $game->registrations()
                ->with([
                    'user:id,name,email,membership_level_id',
                    'user.membershipLevel:id,name',
                    'payment',
                    'attendance',
                ])
                ->oldest('id')
                ->get(),
        ]);
    }
}
