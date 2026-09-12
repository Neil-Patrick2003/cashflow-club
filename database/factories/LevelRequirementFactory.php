<?php

namespace Database\Factories;

use App\Enums\RequirementType;
use App\Models\LevelRequirement;
use App\Models\MembershipLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LevelRequirement>
 */
class LevelRequirementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'level_id' => MembershipLevel::factory(),
            'type' => RequirementType::EligibleGames,
            'int_value' => fake()->numberBetween(1, 20),
        ];
    }

    /**
     * Indicate that the requirement is the pass/fail facilitator assessment.
     */
    public function assessment(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => RequirementType::Assessment,
            'int_value' => null,
        ]);
    }
}
