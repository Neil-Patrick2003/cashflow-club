<?php

namespace Database\Seeders;

use App\Enums\RequirementType;
use App\Models\MembershipLevel;
use Illuminate\Database\Seeder;

/**
 * Placeholder ladder to work against. Run with
 * `php artisan db:seed --class=MembershipLevelSeeder`; DatabaseSeeder leaves it
 * out so it never touches real data.
 */
class MembershipLevelSeeder extends Seeder
{
    /**
     * Seed the membership levels and their requirements.
     */
    public function run(): void
    {
        $levels = [
            ['name' => 'Player', 'rank_order' => 1, 'games' => 3, 'assessment' => false],
            ['name' => 'Facilitator', 'rank_order' => 2, 'games' => 10, 'assessment' => true],
            ['name' => 'Mentor', 'rank_order' => 3, 'games' => 25, 'assessment' => true],
        ];

        foreach ($levels as $level) {
            $membershipLevel = MembershipLevel::firstOrCreate(
                ['name' => $level['name']],
                ['rank_order' => $level['rank_order']],
            );

            $membershipLevel->requirements()->firstOrCreate(
                ['type' => RequirementType::EligibleGames],
                ['int_value' => $level['games']],
            );

            if ($level['assessment']) {
                $membershipLevel->requirements()->firstOrCreate(
                    ['type' => RequirementType::Assessment],
                );
            }
        }
    }
}
