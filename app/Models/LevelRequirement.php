<?php

namespace App\Models;

use App\Enums\RequirementType;
use Database\Factories\LevelRequirementFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One condition on a membership level.
 *
 * @property int $id
 * @property int $level_id
 * @property RequirementType $type
 * @property int|null $int_value
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['level_id', 'type', 'int_value'])]
class LevelRequirement extends Model
{
    /** @use HasFactory<LevelRequirementFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => RequirementType::class,
            'int_value' => 'integer',
        ];
    }

    /**
     * Keep the threshold in step with the type: only counted requirements
     * carry a number, so the pass/fail ones drop theirs on the way in.
     */
    protected static function booted(): void
    {
        static::saving(function (LevelRequirement $requirement): void {
            if (! $requirement->type->needsValue()) {
                $requirement->int_value = null;
            }
        });
    }

    /**
     * The level this requirement belongs to.
     *
     * @return BelongsTo<MembershipLevel, $this>
     */
    public function level(): BelongsTo
    {
        return $this->belongsTo(MembershipLevel::class, 'level_id');
    }
}
