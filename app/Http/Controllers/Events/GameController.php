<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Http\Requests\Events\GameStoreRequest;
use App\Http\Requests\Events\GameUpdateRequest;
use App\Models\Event;
use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Add a game to the given event. The chapter comes from the event, so the
     * two can never drift apart.
     */
    public function store(GameStoreRequest $request, Event $event): RedirectResponse
    {
        $event->games()->create([
            ...$request->validated(),
            'chapter_id' => $event->chapter_id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Game added.')]);

        return to_route('events.index');
    }

    /**
     * Update the given game.
     */
    public function update(GameUpdateRequest $request, Game $game): RedirectResponse
    {
        $game->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Game updated.')]);

        return to_route('events.index');
    }

    /**
     * Delete the given game.
     */
    public function destroy(Game $game): RedirectResponse
    {
        $game->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Game deleted.')]);

        return to_route('events.index');
    }
}
