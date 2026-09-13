<?php

namespace Database\Factories;

use App\Enums\GameStatus;
use App\Enums\GameType;
use App\Models\Event;
use App\Models\Game;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * A regular session: free for members, paid by non-members, no master
     * facilitator.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $event = Event::factory();

        return [
            'code' => 'Game #'.fake()->unique()->numberBetween(100, 999),
            'event_id' => $event,
            'chapter_id' => fn (array $attributes) => Event::find($attributes['event_id'])?->chapter_id,
            'type' => GameType::Regular,
            'schedule_at' => '13:00',
            'member_price' => 0,
            'non_member_price' => 800,
            'capacity' => 20,
            'master_facilitator_id' => null,
            'status' => GameStatus::Scheduled,
        ];
    }

    /**
     * Indicate that the game is a facilitated SRT session: everyone pays, the
     * smaller capacity seats tables of four, and a master facilitator runs it.
     */
    public function srt(): static
    {
        return $this->state(fn (array $attributes) => [
            'code' => 'SRT #'.fake()->unique()->numberBetween(1, 99),
            'type' => GameType::Srt,
            'schedule_at' => '09:00',
            'member_price' => 2000,
            'non_member_price' => 2500,
            'capacity' => 16,
            'master_facilitator_id' => User::factory(),
        ]);
    }
}
