<?php

namespace App\Concerns;

use App\Enums\RequirementType;
use App\Models\LevelRequirement;
use App\Models\MembershipLevel;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait LevelRequirementValidationRules
{
    /**
     * Get the validation rules used to validate a level requirement.
     *
     * `int_value` is the threshold for requirements measured by a number, and
     * must stay empty for the pass/fail ones.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function levelRequirementRules(MembershipLevel $level, ?LevelRequirement $requirement = null): array
    {
        $type = $this->enum('type', RequirementType::class);

        return [
            'type' => [
                'required',
                Rule::enum(RequirementType::class),
                Rule::unique(LevelRequirement::class)
                    ->where('level_id', $level->id)
                    ->ignore($requirement),
            ],
            'int_value' => [
                'integer',
                'min:1',
                Rule::requiredIf(fn (): bool => $type?->needsValue() === true),
                Rule::prohibitedIf(fn (): bool => $type !== null && ! $type->needsValue()),
            ],
        ];
    }
}
