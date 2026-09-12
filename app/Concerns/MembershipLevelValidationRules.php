<?php

namespace App\Concerns;

use App\Enums\RequirementType;
use App\Models\MembershipLevel;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait MembershipLevelValidationRules
{
    /**
     * Get the validation rules used to validate a membership level.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function membershipLevelRules(?MembershipLevel $level = null): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(MembershipLevel::class)->ignore($level),
            ],
            'rank_order' => ['required', 'integer', 'min:1'],
            'requirements' => ['array'],
            'requirements.*.type' => [
                'required',
                'distinct',
                Rule::enum(RequirementType::class),
            ],
            'requirements.*.int_value' => [
                'integer',
                'min:1',
                'required_if:requirements.*.type,'.RequirementType::EligibleGames->value,
                'prohibited_if:requirements.*.type,'.RequirementType::Assessment->value,
            ],
        ];
    }
}
