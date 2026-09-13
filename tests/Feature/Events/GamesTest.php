<?php

use App\Enums\GameType;
use App\Models\Event;
use App\Models\Game;
use App\Models\Seminar;
use App\Models\User;

/**
 * The payload for a regular session: free for members, paid by non-members,
 * larger capacity, no master facilitator.
 *
 * @return array<string, mixed>
 */
function regularGame(array $overrides = []): array
{
    return [
        'code' => 'Game #246',
        'type' => 'REGULAR',
        'schedule_at' => '13:00',
        'member_price' => '0',
        'non_member_price' => '800',
        'capacity' => '20',
        'status' => 'SCHEDULED',
        ...$overrides,
    ];
}

/**
 * The payload for an SRT session: everyone pays, the smaller capacity seats
 * tables of four, and a master facilitator runs it.
 *
 * @return array<string, mixed>
 */
function srtGame(array $overrides = []): array
{
    return [
        'code' => 'SRT #023',
        'type' => 'SRT',
        'schedule_at' => '09:00',
        'member_price' => '2000',
        'non_member_price' => '2500',
        'capacity' => '16',
        'status' => 'SCHEDULED',
        ...$overrides,
    ];
}

test('admins can add a regular game to a game day', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();

    $response = $this->post(route('games.store', $event), regularGame());

    $response->assertRedirect(route('events.index'));
    $this->assertDatabaseHas('games', [
        'event_id' => $event->id,
        'chapter_id' => $event->chapter_id,
        'code' => 'Game #246',
        'type' => 'REGULAR',
        'member_price' => '0.00',
        'non_member_price' => '800.00',
        'capacity' => 20,
        'master_facilitator_id' => null,
    ]);
});

test('admins can add an SRT game under a master facilitator', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    $facilitator = User::factory()->create();

    $response = $this->post(route('games.store', $event), srtGame([
        'master_facilitator_id' => $facilitator->id,
    ]));

    $response->assertRedirect(route('events.index'));
    $this->assertDatabaseHas('games', [
        'event_id' => $event->id,
        'code' => 'SRT #023',
        'type' => 'SRT',
        'member_price' => '2000.00',
        'capacity' => 16,
        'master_facilitator_id' => $facilitator->id,
    ]);
});

test('an SRT game needs a master facilitator', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();

    $response = $this->post(route('games.store', $event), srtGame());

    $response->assertInvalid(['master_facilitator_id']);
    $this->assertDatabaseCount('games', 0);
});

test('a regular game rejects a master facilitator', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    $facilitator = User::factory()->create();

    $response = $this->post(route('games.store', $event), regularGame([
        'master_facilitator_id' => $facilitator->id,
    ]));

    $response->assertInvalid(['master_facilitator_id']);
    $this->assertDatabaseCount('games', 0);
});

test('a game cannot be saved without its', function (string $field) {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();

    $response = $this->post(
        route('games.store', $event),
        collect(regularGame())->except($field)->all()
    );

    $response->assertInvalid([$field]);
    $this->assertDatabaseCount('games', 0);
})->with(['code', 'type', 'schedule_at', 'member_price', 'non_member_price', 'capacity', 'status']);

test('a game code is used only once', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    Game::factory()->for($event)->create(['code' => 'Game #246']);

    $response = $this->post(route('games.store', $event), regularGame());

    $response->assertInvalid(['code' => 'The code has already been taken.']);
    $this->assertDatabaseCount('games', 1);
});

test('an event already holding seminars can take a game too', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    Seminar::factory()->for($event)->create();

    $response = $this->post(route('games.store', $event), regularGame());

    $response->assertRedirect(route('events.index'));
    $this->assertDatabaseHas('games', [
        'event_id' => $event->id,
        'code' => 'Game #246',
    ]);
    expect($event->seminars)->toHaveCount(1);
});

test('turning an SRT game into a regular one drops its facilitator', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->srt()->create();

    $response = $this->patch(route('games.update', $game), regularGame([
        'code' => $game->code,
    ]));

    $response->assertRedirect(route('events.index'));
    expect($game->fresh())
        ->type->toBe(GameType::Regular)
        ->master_facilitator_id->toBeNull();
});

test('admins can delete a game', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();

    $response = $this->delete(route('games.destroy', $game));

    $response->assertRedirect(route('events.index'));
    $this->assertModelMissing($game);
});

test('members who are not admins cannot add a game', function () {
    $this->actingAs(User::factory()->create());
    $event = Event::factory()->create();

    $response = $this->post(route('games.store', $event), regularGame());

    $response->assertForbidden();
    $this->assertDatabaseCount('games', 0);
});
