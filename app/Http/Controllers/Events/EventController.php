<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Http\Requests\Events\EventStoreRequest;
use App\Http\Requests\Events\EventUpdateRequest;
use App\Models\Chapter;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Show the club calendar.
     */
    public function index(): Response
    {
        $today = today()->toDateString();

        return Inertia::render('events/index', [
            'events' => Event::query()
                ->with([
                    'chapter',
                    'games' => fn ($query) => $query->with('masterFacilitator')->orderBy('schedule_at'),
                    'seminars' => fn ($query) => $query->orderBy('starts_at'),
                ])
                /* The calendar looks forward only: an event that has run
                   drops off it, and the next one leads. */
                ->where('date', '>=', $today)
                ->orderBy('date')
                ->orderBy('start_time')
                ->get(),
            'chapters' => Chapter::query()->active()->orderBy('name')->get(),
            'facilitators' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created event.
     */
    public function store(EventStoreRequest $request): RedirectResponse
    {
        Event::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event added.')]);

        return to_route('events.index');
    }

    /**
     * Update the given event.
     */
    public function update(EventUpdateRequest $request, Event $event): RedirectResponse
    {
        $event->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event updated.')]);

        return to_route('events.index');
    }

    /**
     * Delete the given event and everything scheduled inside it.
     */
    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event deleted.')]);

        return to_route('events.index');
    }
}
