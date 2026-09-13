<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Http\Requests\Events\SeminarStoreRequest;
use App\Http\Requests\Events\SeminarUpdateRequest;
use App\Models\Event;
use App\Models\Seminar;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class SeminarController extends Controller
{
    /**
     * Add a seminar to the given event.
     */
    public function store(SeminarStoreRequest $request, Event $event): RedirectResponse
    {
        $event->seminars()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Seminar added.')]);

        return to_route('events.index');
    }

    /**
     * Update the given seminar.
     */
    public function update(SeminarUpdateRequest $request, Seminar $seminar): RedirectResponse
    {
        $seminar->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Seminar updated.')]);

        return to_route('events.index');
    }

    /**
     * Delete the given seminar.
     */
    public function destroy(Seminar $seminar): RedirectResponse
    {
        $seminar->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Seminar deleted.')]);

        return to_route('events.index');
    }
}
