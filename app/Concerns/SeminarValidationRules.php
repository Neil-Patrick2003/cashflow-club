<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait SeminarValidationRules
{
    /**
     * Get the validation rules used to validate a seminar.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function seminarRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date_format:H:i,H:i:s'],
            'capacity' => ['required', 'integer', 'min:1'],
            'member_only' => ['required', 'boolean'],
        ];
    }
}
