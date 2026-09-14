<?php

namespace App\Models;

use App\Enums\AccessMethod;
use Database\Factories\RegistrationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * One person's seat at one game.
 *
 * @property int $id
 * @property int $user_id
 * @property int $game_id
 * @property AccessMethod $access_method
 * @property string $price_due
 * @property string $qr_token
 * @property int|null $voucher_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'game_id', 'access_method', 'price_due', 'qr_token', 'voucher_id'])]
#[Hidden(['qr_token'])]
class Registration extends Model
{
    /** @use HasFactory<RegistrationFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'access_method' => AccessMethod::class,
            'price_due' => 'decimal:2',
        ];
    }

    /**
     * Every seat is scanned in on its own token, so one is minted here rather
     * than left to each caller to remember.
     */
    protected static function booted(): void
    {
        static::creating(function (Registration $registration): void {
            $registration->qr_token ??= Str::random(40);
        });
    }

    /**
     * The person holding the seat.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The game the seat is at.
     *
     * @return BelongsTo<Game, $this>
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    /**
     * What the seat owes, if it owes anything. A seat covered by membership
     * has nothing to collect and so carries no payment.
     *
     * @return HasOne<Payment, $this>
     */
    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
