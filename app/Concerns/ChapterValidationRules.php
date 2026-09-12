<?php

namespace App\Concerns;

use App\Models\Chapter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ChapterValidationRules
{
    /**
     * Get the validation rules used to validate a chapter.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function chapterRules(?Chapter $chapter = null): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Chapter::class)->ignore($chapter),
            ],
            'city' => ['required', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
