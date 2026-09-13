<?php

namespace App\Models;

use Database\Factories\SeminarFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One seminar inside an event.
 *
 * @property int $id
 * @property int $event_id
 * @property string $title
 * @property string $starts_at
 * @property int $capacity
 * @property bool $member_only
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'starts_at', 'capacity', 'member_only'])]
class Seminar extends Model
{
    /** @use HasFactory<SeminarFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
            'member_only' => 'boolean',
        ];
    }

    /**
     * The event the seminar belongs to.
     *
     * @return BelongsTo<Event, $this>
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
