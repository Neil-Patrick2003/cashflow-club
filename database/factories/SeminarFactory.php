<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Seminar;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Seminar>
 */
class SeminarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event_id' => Event::factory(),
            'title' => fake()->sentence(4),
            'starts_at' => '10:00',
            'capacity' => 40,
            'member_only' => false,
        ];
    }

    /**
     * Indicate that the seminar is open to members only.
     */
    public function memberOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'member_only' => true,
        ]);
    }
}
