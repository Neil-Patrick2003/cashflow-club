<?php

namespace Database\Factories;

use App\Enums\AccessMethod;
use App\Models\Game;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Registration>
 */
class RegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * A member taking their included seat at a regular game.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'game_id' => Game::factory(),
            'access_method' => AccessMethod::Membership,
            'price_due' => 0,
            'voucher_id' => null,
        ];
    }

    /**
     * Indicate that the seat was paid for rather than covered.
     */
    public function paid(float $priceDue = 800): static
    {
        return $this->state(fn (array $attributes) => [
            'access_method' => AccessMethod::Paid,
            'price_due' => $priceDue,
        ]);
    }
}
