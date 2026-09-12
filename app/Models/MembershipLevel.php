<?php

namespace App\Models;

use Database\Factories\MembershipLevelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A membership level members progress through, lowest rank order first.
 *
 * @property int $id
 * @property string $name
 * @property int $rank_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'rank_order'])]
class MembershipLevel extends Model
{
    /** @use HasFactory<MembershipLevelFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rank_order' => 'integer',
        ];
    }

    /**
     * The requirements a member must meet to reach this level.
     *
     * @return HasMany<LevelRequirement, $this>
     */
    public function requirements(): HasMany
    {
        return $this->hasMany(LevelRequirement::class, 'level_id');
    }
}
