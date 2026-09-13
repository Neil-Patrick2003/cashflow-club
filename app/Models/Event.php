<?php

namespace App\Models;

use App\Enums\EventType;
use Database\Factories\EventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A chapter's calendar entry. Its type says what kind of occasion it is; what
 * it holds is separate, and it can carry any number of games, any number of
 * seminars, or both on the same day.
 *
 * @property int $id
 * @property int $chapter_id
 * @property string $title
 * @property EventType $type
 * @property Carbon $date
 * @property string $start_time
 * @property string $end_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['chapter_id', 'title', 'type', 'date', 'start_time', 'end_time'])]
class Event extends Model
{
    /** @use HasFactory<EventFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => EventType::class,
            'date' => 'date',
        ];
    }

    /**
     * The chapter running the event.
     *
     * @return BelongsTo<Chapter, $this>
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    /**
     * The games played at the event.
     *
     * @return HasMany<Game, $this>
     */
    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }

    /**
     * The seminars held at the event.
     *
     * @return HasMany<Seminar, $this>
     */
    public function seminars(): HasMany
    {
        return $this->hasMany(Seminar::class);
    }
}
