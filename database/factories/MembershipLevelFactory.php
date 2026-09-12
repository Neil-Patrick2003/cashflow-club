<?php

namespace Database\Factories;

use App\Models\MembershipLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MembershipLevel>
 */
class MembershipLevelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word().' Level',
            'rank_order' => fake()->unique()->numberBetween(1, 100),
        ];
    }
}
