<?php

namespace App\Concerns;

use App\Enums\EventType;
use App\Models\Chapter;
use App\Models\Event;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait EventValidationRules
{
    /**
     * Get the validation rules used to validate an event.
     *
     * The type is the kind of occasion, not what the event holds: that follows
     * from the games and seminars scheduled inside it.
     *
     * Times arrive as `HH:MM` from the browser and come back from the database
     * with seconds, so both shapes are accepted.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function eventRules(?Event $event = null): array
    {
        /* The calendar cannot be scheduled backwards. An event already in the
           past keeps the date it ran on, so its other details stay editable. */
        $keepsItsDate = $event !== null
            && $this->input('date') === $event->date->toDateString();

        return [
            'chapter_id' => ['required', Rule::exists(Chapter::class, 'id')],
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(EventType::class)],
            'date' => [
                'required',
                'date',
                Rule::when(! $keepsItsDate, ['after_or_equal:today']),
            ],
            'start_time' => ['required', 'date_format:H:i,H:i:s'],
            'end_time' => ['required', 'date_format:H:i,H:i:s', 'after:start_time'],
        ];
    }
}
