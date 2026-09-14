<?php

use App\Models\Chapter;
use App\Models\Event;
use App\Models\Game;
use App\Models\MembershipLevel;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('games.index'));

    $response->assertRedirect(route('login'));
});

test('members who are not admins can see the games coming up', function () {
    $this->actingAs(User::factory()->create());
    $event = Event::factory()->create(['date' => today()->addWeek()]);
    Game::factory()->for($event)->create(['code' => 'Game #246']);

    $response = $this->get(route('games.index'));

    $response->assertOk();
    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('games/index')
            ->has('games', 1)
            ->where('games.0.code', 'Game #246')
    );
});

test('the schedule leaves out games whose event has already run', function () {
    $this->actingAs(User::factory()->create());
    Game::factory()
        ->for(Event::factory()->create(['date' => today()->subDay()]))
        ->create(['code' => 'Game #111']);
    Game::factory()
        ->for(Event::factory()->create(['date' => today()]))
        ->create(['code' => 'Game #222']);

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('games', 1)
            ->where('games.0.code', 'Game #222')
    );
});

test('the schedule runs soonest first, then by the time of day', function () {
    $this->actingAs(User::factory()->create());
    $later = Event::factory()->create(['date' => today()->addMonth()]);
    $sooner = Event::factory()->create(['date' => today()->addWeek()]);
    Game::factory()->for($later)->create(['code' => 'Next month']);
    Game::factory()->for($sooner)->create(['code' => 'Afternoon', 'schedule_at' => '13:00']);
    Game::factory()->for($sooner)->create(['code' => 'Morning', 'schedule_at' => '09:00']);

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('games.0.code', 'Morning')
            ->where('games.1.code', 'Afternoon')
            ->where('games.2.code', 'Next month')
    );
});

test('a game carries the day, the place and the facilitator running it', function () {
    $this->actingAs(User::factory()->create());
    $event = Event::factory()->create(['date' => today()->addWeek()]);
    Game::factory()->for($event)->srt()->create();

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('games.0.event.date', $event->date->toISOString())
            ->has('games.0.event.chapter')
            ->has('games.0.master_facilitator')
    );
});

test('the filter offers the chapters with a game still to come, by name', function () {
    $this->actingAs(User::factory()->create());
    $alpha = Chapter::factory()->create(['name' => 'Alpha Chapter']);
    $zulu = Chapter::factory()->create(['name' => 'Zulu Chapter']);
    $quiet = Chapter::factory()->create(['name' => 'Quiet Chapter']);
    Game::factory()->for(Event::factory()->for($zulu)->create(['date' => today()->addWeek()]))->create();
    Game::factory()->for(Event::factory()->for($alpha)->create(['date' => today()->addWeek()]))->create();
    /* A chapter whose only game has been played has nothing to filter to. */
    Game::factory()->for(Event::factory()->for($quiet)->create(['date' => today()->subWeek()]))->create();

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('chapters', 2)
            ->where('chapters.0.name', 'Alpha Chapter')
            ->where('chapters.1.name', 'Zulu Chapter')
            ->where('chapter', null)
    );
});

test('a chapter in the query narrows the schedule to that chapter', function () {
    $this->actingAs(User::factory()->create());
    $chosen = Chapter::factory()->create();
    $other = Chapter::factory()->create();
    Game::factory()
        ->for(Event::factory()->for($chosen)->create(['date' => today()->addWeek()]))
        ->create(['code' => 'Chosen game']);
    Game::factory()
        ->for(Event::factory()->for($other)->create(['date' => today()->addWeek()]))
        ->create(['code' => 'Other game']);

    $response = $this->get(route('games.index', ['chapter' => $chosen->id]));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('games', 1)
            ->where('games.0.code', 'Chosen game')
            ->where('chapter', $chosen->id)
    );
});

test('the schedule names the level a member is priced at', function () {
    $level = MembershipLevel::factory()->create(['name' => 'VIP']);
    $this->actingAs(User::factory()->create(['membership_level_id' => $level->id]));
    Game::factory()->for(Event::factory()->create(['date' => today()->addWeek()]))->create();

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('membershipLevel', 'VIP')
    );
});
