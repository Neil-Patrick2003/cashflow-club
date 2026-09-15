<?php

namespace App\Models;

use App\Enums\CheckInMethod;
use Database\Factories\AttendanceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Proof that the holder of one seat actually turned up.
 *
 * Kept apart from the seat and its payment: a no-show keeps both, and a member
 * whose money is still owed is let in all the same.
 *
 * @property int $id
 * @property int $registration_id
 * @property Carbon $checked_in_at
 * @property CheckInMethod $method
 * @property int|null $recorded_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['registration_id', 'checked_in_at', 'method', 'recorded_by'])]
class Attendance extends Model
{
    /** @use HasFactory<AttendanceFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'checked_in_at' => 'datetime',
            'method' => CheckInMethod::class,
        ];
    }

    /**
     * The seat that was taken up.
     *
     * @return BelongsTo<Registration, $this>
     */
    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }

    /**
     * The admin who worked the door, if that account still exists.
     *
     * @return BelongsTo<User, $this>
     */
    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
