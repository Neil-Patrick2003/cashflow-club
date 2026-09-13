<?php

namespace App\Http\Requests\Events;

use App\Concerns\SeminarValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SeminarStoreRequest extends FormRequest
{
    use SeminarValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->seminarRules();
    }
}
