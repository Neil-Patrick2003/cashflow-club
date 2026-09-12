<?php

namespace App\Http\Requests\Configuration;

use App\Concerns\ChapterValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChapterStoreRequest extends FormRequest
{
    use ChapterValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->chapterRules();
    }
}
