<?php

namespace Database\Factories;

use App\Enums\CheckInMethod;
use App\Models\Attendance;
use App\Models\Registration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * Someone scanned in at the door, which is how most of them arrive.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'registration_id' => Registration::factory(),
            'checked_in_at' => now(),
            'method' => CheckInMethod::Qr,
            'recorded_by' => null,
        ];
    }

    /**
     * Indicate that the club ticked this one off the roster by hand.
     */
    public function manual(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => CheckInMethod::Manual,
        ]);
    }
}
