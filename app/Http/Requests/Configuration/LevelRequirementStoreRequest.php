<?php

namespace App\Http\Requests\Configuration;

use App\Concerns\LevelRequirementValidationRules;
use App\Models\MembershipLevel;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LevelRequirementStoreRequest extends FormRequest
{
    use LevelRequirementValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var MembershipLevel $level */
        $level = $this->route('membershipLevel');

        return $this->levelRequirementRules($level);
    }
}
