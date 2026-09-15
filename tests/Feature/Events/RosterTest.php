<?php

use App\Enums\AccessMethod;
use App\Enums\CheckInMethod;
use App\Enums\PaymentStatus;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\Game;
use App\Models\MembershipLevel;
use App\Models\Payment;
use App\Models\Registration;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $game = Game::factory()->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertRedirect(route('login'));
});

test('members who are not admins cannot open a roster', function () {
    $this->actingAs(User::factory()->create());
    $game = Game::factory()->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertForbidden();
});

test('admins see who is turning up and what each seat owes', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    $seat = Registration::factory()
        ->for($game)
        ->for(User::factory()->create(['name' => 'Ben Uy', 'email' => 'ben@example.com']))
        ->paid()
        ->create();
    Payment::factory()->for($seat)->create(['amount' => 2000]);

    $response = $this->get(route('games.roster', $game));

    $response->assertOk();
    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('games/roster')
            ->where('game.id', $game->id)
            ->has('seats', 1)
            ->where('seats.0.user.name', 'Ben Uy')
            ->where('seats.0.user.email', 'ben@example.com')
            ->where('seats.0.access_method', AccessMethod::Paid->value)
            ->where('seats.0.payment.status', PaymentStatus::Pending->value)
    );
});

test('a seat covered by membership is listed with no payment to collect', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    Registration::factory()->for($game)->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('seats', 1)
            ->where('seats.0.access_method', AccessMethod::Membership->value)
            ->where('seats.0.payment', null)
    );
});

test('the roster leaves out seats at other games', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    Registration::factory()->for($game)->create();
    Registration::factory()->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertInertia(fn (AssertableInertia $page) => $page->has('seats', 1));
});

test('the roster runs in the order the seats were claimed', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    Registration::factory()
        ->for($game)
        ->for(User::factory()->create(['name' => 'First in']))
        ->create();
    Registration::factory()
        ->for($game)
        ->for(User::factory()->create(['name' => 'Second in']))
        ->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('seats.0.user.name', 'First in')
            ->where('seats.1.user.name', 'Second in')
    );
});

test('the roster carries the day, the place and the facilitator running the game', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create(['date' => today()->addWeek()]);
    $game = Game::factory()->for($event)->srt()->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('game.event.date', $event->date->toISOString())
            ->has('game.event.chapter')
            ->has('game.master_facilitator')
    );
});

test('a seat carries the level the club counts its holder at', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    $level = MembershipLevel::factory()->create(['name' => 'Mentor']);
    Registration::factory()
        ->for($game)
        ->for(User::factory()->for($level, 'membershipLevel')->create())
        ->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('seats.0.user.membership_level.name', 'Mentor')
    );
});

test('a guest is listed with no level, which is what makes them a guest', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    Registration::factory()->for($game)->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('seats.0.user.membership_level', null)
    );
});

test('a seat carries how and when its holder was checked in', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    $seat = Registration::factory()->for($game)->create();
    Attendance::factory()->for($seat)->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('seats.0.attendance.method', CheckInMethod::Qr->value)
            ->has('seats.0.attendance.checked_in_at')
    );
});

test('a seat nobody has checked in carries no attendance', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    Registration::factory()->for($game)->create();

    $response = $this->get(route('games.roster', $game));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('seats.0.attendance', null)
    );
});
