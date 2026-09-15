<?php

use App\Models\Chapter;
use App\Models\MembershipCard;
use App\Models\MembershipLevel;
use App\Models\User;
use Illuminate\Database\QueryException;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('card.show'));

    $response->assertRedirect(route('login'));
});

test('registering issues the member their card', function () {
    $this->travelTo('2026-02-03');

    $this->post(route('register.store'), [
        'name' => 'Bryan Dela Cruz',
        'email' => 'bryan@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::firstWhere('email', 'bryan@example.com');
    expect($user->membershipCard)->not->toBeNull()
        ->number->toBe("CFC-P{$user->id}-2026");
});

test('a member sees their card, their level and the code the door scans', function () {
    $this->travelTo('2026-02-03');
    $level = MembershipLevel::factory()->create(['name' => 'VIP']);
    $user = User::factory()->create(['membership_level_id' => $level->id]);
    $this->actingAs($user);

    $response = $this->get(route('card.show'));

    $response->assertOk();
    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('card/index')
            ->where('card.number', "CFC-P{$user->id}-2026")
            ->where('membershipLevel', 'VIP')
            ->has('qr')
    );
});

test('the code on the card carries the token rather than the page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('card.show'));

    $response->assertInertia(fn (AssertableInertia $page) => $page->missing('card.token'));
    $response->assertDontSee($user->membershipCard->token);
});

test('a member who joined before the club issued cards gets one on first look', function () {
    $user = User::factory()->create();
    $user->membershipCard->delete();
    /* Signed in fresh, the way a request arrives, rather than carrying the
       card the factory had already loaded. */
    $this->actingAs($user->fresh());

    $response = $this->get(route('card.show'));

    $response->assertOk();
    $this->assertDatabaseHas('membership_cards', ['user_id' => $user->id]);
});

test('the card names the chapter the member calls home', function () {
    $chapter = Chapter::factory()->create(['name' => 'Cebu Chapter']);
    $user = User::factory()->create();
    $user->membershipCard->update(['chapter_id' => $chapter->id]);
    $this->actingAs($user);

    $response = $this->get(route('card.show'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('card.chapter.name', 'Cebu Chapter')
    );
});

test('no two members carry the same card', function () {
    $one = User::factory()->create();
    $two = User::factory()->create();

    expect($one->membershipCard->number)->not->toBe($two->membershipCard->number)
        ->and($one->membershipCard->token)->not->toBe($two->membershipCard->token);
});

test('a member cannot be issued a second card', function () {
    $user = User::factory()->create();

    expect(fn () => MembershipCard::issueTo($user))->toThrow(QueryException::class);
});
