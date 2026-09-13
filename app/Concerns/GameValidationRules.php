<?php

namespace App\Concerns;

use App\Enums\GameStatus;
use App\Enums\GameType;
use App\Models\Game;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait GameValidationRules
{
    /**
     * Get the validation rules used to validate a game.
     *
     * A master facilitator belongs to SRT sessions only: regular games run
     * without one, so sending it there is rejected rather than ignored.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function gameRules(?Game $game = null): array
    {
        $type = $this->enum('type', GameType::class);

        return [
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Game::class)->ignore($game),
            ],
            'type' => ['required', Rule::enum(GameType::class)],
            'schedule_at' => ['required', 'date_format:H:i,H:i:s'],
            'member_price' => ['required', 'numeric', 'min:0'],
            'non_member_price' => ['required', 'numeric', 'min:0'],
            'capacity' => ['required', 'integer', 'min:1'],
            'master_facilitator_id' => [
                'integer',
                Rule::exists(User::class, 'id'),
                Rule::requiredIf(fn (): bool => $type?->isFacilitated() === true),
                Rule::prohibitedIf(fn (): bool => $type !== null && ! $type->isFacilitated()),
            ],
            'status' => ['required', Rule::enum(GameStatus::class)],
        ];
    }
}
