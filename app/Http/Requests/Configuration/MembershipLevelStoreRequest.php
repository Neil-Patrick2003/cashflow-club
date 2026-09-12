<?php

namespace App\Http\Requests\Configuration;

use App\Concerns\MembershipLevelValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class MembershipLevelStoreRequest extends FormRequest
{
    use MembershipLevelValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->membershipLevelRules();
    }
}
