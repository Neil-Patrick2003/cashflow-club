<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Event;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GameScheduleController extends Controller
{
    /**
     * Show every game a member can still turn up to, soonest first, each with
     * what it would cost this particular member and, if they have already
     * claimed a seat, what that seat still owes.
     *
     * A `chapter` in the query narrows the list to that one chapter. Only
     * chapters with a game still to come are offered, so picking one from the
     * filter never lands on an empty page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = today()->toDateString();
        $chapterId = $request->integer('chapter') ?: null;

        return Inertia::render('games/index', [
            'chapters' => Chapter::query()
                ->whereIn('id', Game::query()
                    ->whereRelation('event', 'date', '>=', $today)
                    ->select('chapter_id'))
                ->orderBy('name')
                ->get(),
            'chapter' => $chapterId,
            /* Named so a paying member is told whose price they are being
               shown, rather than a bare figure. */
            'membershipLevel' => $user->membershipLevel?->name,
            'games' => Game::query()
                ->with([
                    'event.chapter',
                    'masterFacilitator',
                    /* Only this member's own seat, with whatever it owes. */
                    'registrations' => fn ($query) => $query->whereBelongsTo($user)->with('payment'),
                ])
                ->withCount('registrations')
                ->whereRelation('event', 'date', '>=', $today)
                /* Games carry their event's chapter, so the filter reads the
                   game itself rather than joining back through the event. */
                ->when($chapterId, fn ($query, $id) => $query->where('chapter_id', $id))
                /* Games are stored against an event, so the day they run on
                   comes from there; the time they start comes from the game. */
                ->orderBy(Event::select('date')->whereColumn('events.id', 'games.event_id'))
                ->orderBy('schedule_at')
                ->get()
                ->map(function (Game $game) use ($user): array {
                    $registration = $game->registrations->first();
                    $game->unsetRelation('registrations');

                    return [
                        ...$game->toArray(),
                        'entry' => $game->entryFor($user),
                        'registration' => $registration,
                    ];
                }),
        ]);
    }
}
