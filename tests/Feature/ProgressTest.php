<?php

use App\Enums\GameStatus;
use App\Models\Chapter;
use App\Models\Event;
use App\Models\Game;
use App\Models\LevelRequirement;
use App\Models\MembershipLevel;
use App\Models\Registration;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

/**
 * A game whose day has been and gone, with the given member in a seat.
 *
 * @param  array<string, mixed>  $overrides
 */
function gamePlayedBy(User $member, string $date, array $overrides = [], ?Chapter $chapter = null): Game
{
    $event = Event::factory()
        ->for($chapter ?? Chapter::factory())
        ->create(['date' => $date]);

    $game = Game::factory()->for($event)->create($overrides);
    Registration::factory()->for($member)->for($game)->create();

    return $game;
}

test('guests are redirected to the login page', function () {
    $response = $this->get(route('progress.index'));

    $response->assertRedirect(route('login'));
});

test('a member holding no level works toward the first rung', function () {
    $this->actingAs(User::factory()->create());
    MembershipLevel::factory()->create(['name' => 'Gold VIP', 'rank_order' => 2]);
    MembershipLevel::factory()->create(['name' => 'VIP', 'rank_order' => 1]);

    $response = $this->get(route('progress.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('progress/index')
            ->where('level.name', 'VIP')
    );
});

test('a member works toward the level above the one they hold', function () {
    $vip = MembershipLevel::factory()->create(['name' => 'VIP', 'rank_order' => 1]);
    MembershipLevel::factory()->create(['name' => 'Gold VIP', 'rank_order' => 2]);
    $this->actingAs(User::factory()->create(['membership_level_id' => $vip->id]));

    $response = $this->get(route('progress.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('level.name', 'Gold VIP')
    );
});

test('a member at the top of the ladder has no level to work toward', function () {
    $top = MembershipLevel::factory()->create(['rank_order' => 3]);
    $this->actingAs(User::factory()->create(['membership_level_id' => $top->id]));

    $response = $this->get(route('progress.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('level', null)
            ->has('requirements', 0)
    );
});

test('only games whose day has passed count toward the next level', function () {
    $this->actingAs($member = User::factory()->create());
    MembershipLevel::factory()->create(['rank_order' => 1]);
    gamePlayedBy($member, today()->subWeek()->toDateString(), ['code' => 'Game #245']);
    gamePlayedBy($member, today()->addWeek()->toDateString(), ['code' => 'Game #250']);

    $response = $this->get(route('progress.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('games', 1)
            ->where('games.0.code', 'Game #245')
            ->where('played', 1)
    );
});

test('a game played at another chapter counts the same, latest first', function () {
    $this->actingAs($member = User::factory()->create());
    MembershipLevel::factory()->create(['rank_order' => 1]);
    gamePlayedBy($member, today()->subMonth()->toDateString(), ['code' => 'Game #219'], Chapter::factory()->create(['name' => 'Cebu Chapter']));
    gamePlayedBy($member, today()->subWeek()->toDateString(), ['code' => 'SRT #019'], Chapter::factory()->create(['name' => 'Makati Chapter']));

    $response = $this->get(route('progress.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('games.0.code', 'SRT #019')
            ->where('games.1.code', 'Game #219')
            ->where('games.1.event.chapter.name', 'Cebu Chapter')
            ->where('played', 2)
    );
});

test('a game the club called off is listed but counts for nobody', function () {
    $this->actingAs($member = User::factory()->create());
    MembershipLevel::factory()->create(['rank_order' => 1]);
    gamePlayedBy($member, today()->subWeek()->toDateString(), ['status' => GameStatus::Cancelled]);

    $response = $this->get(route('progress.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('games', 1)
            ->where('games.0.counts', false)
            ->where('played', 0)
    );
});

test('a games requirement carries how far the member has got toward it', function () {
    $this->actingAs($member = User::factory()->create());
    $level = MembershipLevel::factory()->create(['rank_order' => 1]);
    LevelRequirement::factory()->for($level, 'level')->create(['int_value' => 2]);
    gamePlayedBy($member, today()->subWeek()->toDateString());

    $response = $this->get(route('progress.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('requirements', 1)
            ->where('requirements.0.progress', 1)
            ->where('requirements.0.is_met', false)
    );
});

test('the assessment stays locked until the games asked for are played', function (int $played, bool $isLocked) {
    $this->actingAs($member = User::factory()->create());
    $level = MembershipLevel::factory()->create(['rank_order' => 1]);
    LevelRequirement::factory()->for($level, 'level')->create(['int_value' => 2]);
    LevelRequirement::factory()->for($level, 'level')->assessment()->create();

    foreach (range(1, $played) as $week) {
        gamePlayedBy($member, today()->subWeeks($week)->toDateString());
    }

    $response = $this->get(route('progress.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('requirements.1.type', 'ASSESSMENT')
            ->where('requirements.1.is_locked', $isLocked)
            ->where('requirements.1.progress', null)
    );
})->with([[1, true], [2, false]]);
