<?php

namespace App\Http\Requests\Configuration;

use App\Concerns\LevelRequirementValidationRules;
use App\Models\LevelRequirement;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LevelRequirementUpdateRequest extends FormRequest
{
    use LevelRequirementValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var LevelRequirement $requirement */
        $requirement = $this->route('levelRequirement');

        return $this->levelRequirementRules($requirement->level, $requirement);
    }
}
