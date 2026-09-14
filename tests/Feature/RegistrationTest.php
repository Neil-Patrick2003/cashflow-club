<?php

use App\Enums\AccessMethod;
use App\Enums\GameStatus;
use App\Enums\PaymentStatus;
use App\Models\Event;
use App\Models\Game;
use App\Models\MembershipLevel;
use App\Models\Payment;
use App\Models\Registration;
use App\Models\User;

/**
 * Someone the club counts as a member: membership is holding a level.
 */
function member(): User
{
    return User::factory()->create([
        'membership_level_id' => MembershipLevel::factory(),
    ]);
}

/**
 * A game on an event that has not run yet.
 */
function upcomingGame(array $overrides = []): Game
{
    return Game::factory()
        ->for(Event::factory()->create(['date' => today()->addWeek()]))
        ->create($overrides);
}

test('guests are redirected to the login page', function () {
    $game = upcomingGame();

    $response = $this->post(route('registrations.store', $game));

    $response->assertRedirect(route('login'));
});

test('a member walks into a game their membership covers', function () {
    $this->actingAs($user = member());
    $game = upcomingGame(['member_price' => 0, 'non_member_price' => 800]);

    $this->post(route('registrations.store', $game));

    expect(Registration::sole())
        ->user_id->toBe($user->id)
        ->game_id->toBe($game->id)
        ->access_method->toBe(AccessMethod::Membership)
        ->price_due->toBe('0.00');
});

test('a member pays the member price for a game their membership does not cover', function () {
    $this->actingAs(member());
    $game = upcomingGame(['member_price' => 2000, 'non_member_price' => 2500]);

    $this->post(route('registrations.store', $game));

    expect(Registration::sole())
        ->access_method->toBe(AccessMethod::Paid)
        ->price_due->toBe('2000.00');
});

test('someone without a membership pays the guest price', function () {
    $this->actingAs(User::factory()->create());
    $game = upcomingGame(['member_price' => 0, 'non_member_price' => 800]);

    $this->post(route('registrations.store', $game));

    expect(Registration::sole())
        ->access_method->toBe(AccessMethod::Paid)
        ->price_due->toBe('800.00');
});

test('every seat is given its own token to scan in on', function () {
    $game = upcomingGame(['capacity' => 5]);
    $this->actingAs(member());
    $this->post(route('registrations.store', $game));
    $this->actingAs(member());
    $this->post(route('registrations.store', $game));

    $tokens = Registration::pluck('qr_token');

    expect($tokens)->toHaveCount(2)
        ->and($tokens->unique())->toHaveCount(2)
        ->and($tokens->first())->not->toBeEmpty();
});

test('a member cannot take two seats at the same game', function () {
    $this->actingAs($user = member());
    $game = upcomingGame();
    Registration::factory()->for($user)->for($game)->create();

    $response = $this->post(route('registrations.store', $game));

    $response->assertInvalid(['game' => 'You are already registered for this game.']);
    expect(Registration::count())->toBe(1);
});

test('a full game turns a member away', function () {
    $this->actingAs(member());
    $game = upcomingGame(['capacity' => 1]);
    Registration::factory()->for($game)->create();

    $response = $this->post(route('registrations.store', $game));

    $response->assertInvalid(['game' => 'This game is full.']);
    expect(Registration::count())->toBe(1);
});

test('a cancelled game takes no registrations', function () {
    $this->actingAs(member());
    $game = upcomingGame(['status' => GameStatus::Cancelled]);

    $response = $this->post(route('registrations.store', $game));

    $response->assertInvalid(['game' => 'This game has been cancelled.']);
    expect(Registration::count())->toBe(0);
});

test('a game that has already been played takes no registrations', function () {
    $this->actingAs(member());
    $game = Game::factory()
        ->for(Event::factory()->create(['date' => today()->subDay()]))
        ->create();

    $response = $this->post(route('registrations.store', $game));

    $response->assertInvalid(['game' => 'This game has already been played.']);
    expect(Registration::count())->toBe(0);
});

test('the schedule shows a member what the game would cost them', function () {
    $this->actingAs($user = member());
    $game = upcomingGame(['member_price' => 2000, 'non_member_price' => 2500]);
    Registration::factory()->for($game)->create();

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn ($page) => $page->where('games.0.entry.access_method', 'PAID')
            ->where('games.0.entry.price_due', '2000.00')
            ->where('games.0.registrations_count', 1)
            ->where('games.0.registration', null)
    );
});

test('the schedule says what the member owes on a seat they hold', function () {
    $this->actingAs($user = member());
    $game = upcomingGame(['member_price' => 2000]);
    $registration = Registration::factory()->for($user)->for($game)->paid(2000)->create();
    Payment::factory()->for($registration)->create(['amount' => 2000]);

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn ($page) => $page->where('games.0.registration.access_method', 'PAID')
            ->where('games.0.registration.payment.status', 'PENDING')
            ->where('games.0.registration.payment.amount', '2000.00')
    );
});

test('a seat covered by membership comes back with no payment on it', function () {
    $this->actingAs($user = member());
    $game = upcomingGame();
    Registration::factory()->for($user)->for($game)->create();

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn ($page) => $page->where('games.0.registration.access_method', 'MEMBERSHIP')
            ->where('games.0.registration.payment', null)
    );
});

test('the door token is kept off the page', function () {
    $this->actingAs($user = member());
    $game = upcomingGame();
    Registration::factory()->for($user)->for($game)->create();

    $response = $this->get(route('games.index'));

    $response->assertInertia(
        fn ($page) => $page->missing('games.0.registration.qr_token')
    );
});

test('a seat that owes money opens a pending payment for it', function () {
    $this->actingAs(member());
    $game = upcomingGame(['member_price' => 2000, 'non_member_price' => 2500]);

    $this->post(route('registrations.store', $game));

    expect(Payment::sole())
        ->registration_id->toBe(Registration::sole()->id)
        ->amount->toBe('2000.00')
        ->status->toBe(PaymentStatus::Pending)
        ->method->toBeNull()
        ->paid_at->toBeNull();
});

test('a seat covered by membership has nothing to collect', function () {
    $this->actingAs(member());
    $game = upcomingGame(['member_price' => 0, 'non_member_price' => 800]);

    $this->post(route('registrations.store', $game));

    expect(Registration::sole()->access_method)->toBe(AccessMethod::Membership)
        ->and(Payment::count())->toBe(0);
});

test('a guest paying the guest price opens a pending payment too', function () {
    $this->actingAs(User::factory()->create());
    $game = upcomingGame(['member_price' => 0, 'non_member_price' => 800]);

    $this->post(route('registrations.store', $game));

    expect(Payment::sole())
        ->amount->toBe('800.00')
        ->status->toBe(PaymentStatus::Pending);
});

test('a rejected registration opens no payment', function () {
    $this->actingAs(member());
    $game = upcomingGame(['status' => GameStatus::Cancelled, 'member_price' => 2000]);

    $this->post(route('registrations.store', $game));

    expect(Registration::count())->toBe(0)
        ->and(Payment::count())->toBe(0);
});
