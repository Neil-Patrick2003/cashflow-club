<?php

namespace App\Http\Controllers;

use App\Enums\GameStatus;
use App\Enums\RequirementType;
use App\Models\Event;
use App\Models\Game;
use App\Models\LevelRequirement;
use App\Models\MembershipLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ProgressController extends Controller
{
    /**
     * Show the member what the next level asks of them and how far along they
     * are. The club configures the requirements, so nothing about them is
     * decided here beyond counting what the member has already played.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $level = MembershipLevel::query()
            /* ELIGIBLE_GAMES sorts ahead of ASSESSMENT, which is the order
               they are asked of a member. */
            ->with(['requirements' => fn ($query) => $query->orderByDesc('type')])
            /* The next rung up from the one they hold, or the first rung for
               someone who holds none. */
            ->when(
                $user->membershipLevel,
                fn ($query, MembershipLevel $held) => $query->where('rank_order', '>', $held->rank_order),
            )
            ->orderBy('rank_order')
            ->first();

        $games = $this->gamesPlayedBy($request);
        $played = $games->where('counts')->count();

        return Inertia::render('progress/index', [
            'level' => $level,
            'requirements' => $this->progressToward($level, $played),
            'games' => $games,
            'played' => $played,
        ]);
    }

    /**
     * Every game the member has turned up to, latest first. A game counts
     * wherever it was played; one the club called off counts for nobody.
     *
     *
     * @return Collection<int, array<string, mixed>>
     */
    private function gamesPlayedBy(Request $request): Collection
    {
        return Game::query()
            ->whereHas('registrations', fn ($query) => $query->whereBelongsTo($request->user()))
            ->whereRelation('event', 'date', '<', today()->toDateString())
            ->with('event.chapter')
            ->orderByDesc(Event::select('date')->whereColumn('events.id', 'games.event_id'))
            ->orderByDesc('schedule_at')
            ->get()
            ->map($this->playedGame(...));
    }

    /**
     * One played game as the page reads it.
     *
     * @return array<string, mixed>
     */
    private function playedGame(Game $game): array
    {
        return array_merge($game->toArray(), [
            'counts' => $game->status !== GameStatus::Cancelled,
        ]);
    }

    /**
     * Each of the level's requirements with how far the member has got toward
     * it.
     *
     * @return Collection<int, array<string, mixed>>
     */
    private function progressToward(?MembershipLevel $level, int $played): Collection
    {
        if ($level === null) {
            return collect();
        }

        $counted = $level->requirements->where('type', RequirementType::EligibleGames);

        /* The assessment is the last thing asked of a member, so it stays shut
           until everything that can be counted has been. */
        $isUnlocked = $counted->every(fn (LevelRequirement $requirement) => $played >= $requirement->int_value);

        return $level->requirements->map(
            fn (LevelRequirement $requirement) => $this->requirementProgress($requirement, $played, $isUnlocked),
        );
    }

    /**
     * One requirement with how far the member has got toward it. Only counted
     * requirements carry a number; the assessment is locked or it is not.
     *
     * @return array<string, mixed>
     */
    private function requirementProgress(LevelRequirement $requirement, int $played, bool $isUnlocked): array
    {
        $isCounted = $requirement->type->needsValue();

        return array_merge($requirement->toArray(), [
            'progress' => $isCounted ? $played : null,
            'is_met' => $isCounted && $played >= $requirement->int_value,
            'is_locked' => ! $isCounted && ! $isUnlocked,
        ]);
    }
}
