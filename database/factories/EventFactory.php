<?php

namespace Database\Factories;

use App\Enums\EventType;
use App\Models\Chapter;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'chapter_id' => Chapter::factory(),
            'title' => fake()->sentence(3),
            'type' => EventType::GameDay,
            'date' => fake()->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
            'start_time' => '13:00',
            'end_time' => '18:00',
        ];
    }

    /**
     * Indicate that the event is a one-off special occasion.
     */
    public function specialEvent(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => EventType::SpecialEvent,
        ]);
    }

    /**
     * Indicate that the event is an orientation for prospective members.
     */
    public function orientation(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => EventType::Orientation,
        ]);
    }
}
