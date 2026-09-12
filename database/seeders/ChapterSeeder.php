<?php

namespace Database\Seeders;

use App\Models\Chapter;
use Illuminate\Database\Seeder;

/**
 * Opt-in starter chapters. Run with `php artisan db:seed --class=ChapterSeeder`;
 * DatabaseSeeder deliberately leaves it out so it never touches real data.
 */
class ChapterSeeder extends Seeder
{
    /**
     * Seed the chapters table.
     */
    public function run(): void
    {
        $chapters = [
            ['name' => 'Metro Manila Chapter', 'city' => 'Quezon City'],
            ['name' => 'Cebu Chapter', 'city' => 'Cebu City'],
            ['name' => 'Davao Chapter', 'city' => 'Davao City'],
        ];

        foreach ($chapters as $chapter) {
            Chapter::firstOrCreate(['name' => $chapter['name']], $chapter);
        }
    }
}
