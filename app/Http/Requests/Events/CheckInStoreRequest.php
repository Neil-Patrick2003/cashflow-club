<?php

namespace App\Http\Requests\Events;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CheckInStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            /* Whatever the camera read. Which card it belongs to, if any, is
               the controller's to work out. */
            'token' => ['required', 'string', 'max:64'],
        ];
    }
}
