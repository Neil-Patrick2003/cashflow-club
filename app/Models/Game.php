<?php

namespace App\Models;

use App\Enums\GameStatus;
use App\Enums\GameType;
use Database\Factories\GameFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One game session inside an event.
 *
 * @property int $id
 * @property string $code
 * @property int $event_id
 * @property int $chapter_id
 * @property GameType $type
 * @property string $schedule_at
 * @property string $member_price
 * @property string $non_member_price
 * @property int $capacity
 * @property int|null $master_facilitator_id
 * @property GameStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'code',
    'chapter_id',
    'type',
    'schedule_at',
    'member_price',
    'non_member_price',
    'capacity',
    'master_facilitator_id',
    'status',
])]
class Game extends Model
{
    /** @use HasFactory<GameFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => GameType::class,
            'status' => GameStatus::class,
            'capacity' => 'integer',
            'member_price' => 'decimal:2',
            'non_member_price' => 'decimal:2',
        ];
    }

    /**
     * Only facilitated sessions carry a master facilitator.
     */
    protected static function booted(): void
    {
        static::saving(function (Game $game): void {
            if (! $game->type->isFacilitated()) {
                $game->master_facilitator_id = null;
            }
        });
    }

    /**
     * The event the game belongs to.
     *
     * @return BelongsTo<Event, $this>
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * The chapter running the game, carried over from its event.
     *
     * @return BelongsTo<Chapter, $this>
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    /**
     * The facilitator running an SRT session.
     *
     * @return BelongsTo<User, $this>
     */
    public function masterFacilitator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'master_facilitator_id');
    }
}
