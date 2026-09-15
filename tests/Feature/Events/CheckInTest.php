<?php

use App\Enums\CheckInMethod;
use App\Models\Attendance;
use App\Models\Game;
use App\Models\Registration;
use App\Models\User;

/**
 * Claim the given member a seat at the given game and hand back the token
 * their card carries, which is all a scan has to go on.
 */
function scannableSeat(Game $game, User $member): string
{
    Registration::factory()->for($game)->for($member)->create();

    return $member->membershipCard->token;
}

test('guests are redirected to the login page', function () {
    $game = Game::factory()->create();

    $response = $this->post(route('games.check-ins.store', $game), ['token' => 'anything']);

    $response->assertRedirect(route('login'));
});

test('members who are not admins cannot scan anyone in', function () {
    $member = User::factory()->create();
    $this->actingAs($member);
    $game = Game::factory()->create();
    $token = scannableSeat($game, $member);

    $response = $this->post(route('games.check-ins.store', $game), ['token' => $token]);

    $response->assertForbidden();
    expect(Attendance::count())->toBe(0);
});

test('a scan with no token is rejected', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();

    $response = $this->post(route('games.check-ins.store', $game), []);

    $response->assertInvalid(['token']);
});

test('a scanned card records its holder as arrived, marked as read off the card', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);
    $game = Game::factory()->create();
    $member = User::factory()->create();
    $token = scannableSeat($game, $member);

    $response = $this->post(route('games.check-ins.store', $game), ['token' => $token]);

    $response->assertRedirect();
    $attendance = Attendance::sole();
    expect($attendance->registration->user_id)->toBe($member->id)
        ->and($attendance->method)->toBe(CheckInMethod::Qr)
        ->and($attendance->recorded_by)->toBe($admin->id);
});

test('a code that belongs to no card is refused', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();

    $response = $this->post(route('games.check-ins.store', $game), ['token' => 'not-a-card']);

    $response->assertInvalid(['token' => 'That code is not a membership card.']);
    expect(Attendance::count())->toBe(0);
});

test('a card whose holder has no seat at this game is refused by name', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    $member = User::factory()->create(['name' => 'Ben Uy']);
    /* Registered for a different game, so this door is not theirs. */
    scannableSeat(Game::factory()->create(), $member);

    $response = $this->post(route('games.check-ins.store', $game), [
        'token' => $member->membershipCard->token,
    ]);

    $response->assertInvalid(['token' => 'Ben Uy has no seat at this game.']);
    expect(Attendance::count())->toBe(0);
});

test('a card scanned twice is the one arrival, at the time it was first read', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    $member = User::factory()->create();
    $token = scannableSeat($game, $member);

    $this->travelTo(now()->subHour());
    $this->post(route('games.check-ins.store', $game), ['token' => $token]);
    $firstReading = Attendance::sole()->checked_in_at;

    $this->travelBack();
    $response = $this->post(route('games.check-ins.store', $game), ['token' => $token]);

    $response->assertValid();
    expect(Attendance::count())->toBe(1)
        ->and(Attendance::sole()->checked_in_at->timestamp)->toBe($firstReading->timestamp);
});

test('a seat is let in on a scan even while it still owes the club money', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    $member = User::factory()->create();
    $seat = Registration::factory()->for($game)->for($member)->paid()->create();
    $seat->payment()->create(['amount' => $seat->price_due]);

    $response = $this->post(route('games.check-ins.store', $game), [
        'token' => $member->membershipCard->token,
    ]);

    $response->assertValid();
    expect($seat->attendance()->exists())->toBeTrue();
});
