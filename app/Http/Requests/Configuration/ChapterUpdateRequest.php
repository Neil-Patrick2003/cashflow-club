<?php

namespace App\Http\Requests\Configuration;

use App\Concerns\ChapterValidationRules;
use App\Models\Chapter;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChapterUpdateRequest extends FormRequest
{
    use ChapterValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Chapter $chapter */
        $chapter = $this->route('chapter');

        return $this->chapterRules($chapter);
    }
}
