<?php

use App\Models\Event;
use App\Models\Game;
use App\Models\Seminar;
use App\Models\User;

test('admins can add a seminar to an event', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();

    $response = $this->post(route('seminars.store', $event), [
        'title' => 'Building your first passive income',
        'starts_at' => '10:00',
        'capacity' => '40',
        'member_only' => '1',
    ]);

    $response->assertRedirect(route('events.index'));
    $this->assertDatabaseHas('seminars', [
        'event_id' => $event->id,
        'title' => 'Building your first passive income',
        'capacity' => 40,
        'member_only' => true,
    ]);
});

test('an event already holding games can take a seminar too', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    Game::factory()->for($event)->create();

    $response = $this->post(route('seminars.store', $event), [
        'title' => 'Building your first passive income',
        'starts_at' => '10:00',
        'capacity' => '40',
        'member_only' => '0',
    ]);

    $response->assertRedirect(route('events.index'));
    $this->assertDatabaseHas('seminars', [
        'event_id' => $event->id,
        'title' => 'Building your first passive income',
    ]);
    expect($event->games)->toHaveCount(1);
});

test('a seminar cannot be saved without its', function (string $field) {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();

    $response = $this->post(route('seminars.store', $event), collect([
        'title' => 'Building your first passive income',
        'starts_at' => '10:00',
        'capacity' => '40',
        'member_only' => '0',
    ])->except($field)->all());

    $response->assertInvalid([$field]);
    $this->assertDatabaseCount('seminars', 0);
})->with(['title', 'starts_at', 'capacity', 'member_only']);

test('admins can open a seminar to non-members', function () {
    $this->actingAs(User::factory()->admin()->create());
    $seminar = Seminar::factory()->memberOnly()->create();

    $response = $this->patch(route('seminars.update', $seminar), [
        'title' => $seminar->title,
        'starts_at' => '11:00',
        'capacity' => '25',
        'member_only' => '0',
    ]);

    $response->assertRedirect(route('events.index'));
    expect($seminar->fresh())
        ->member_only->toBeFalse()
        ->capacity->toBe(25);
});

test('admins can delete a seminar', function () {
    $this->actingAs(User::factory()->admin()->create());
    $seminar = Seminar::factory()->create();

    $response = $this->delete(route('seminars.destroy', $seminar));

    $response->assertRedirect(route('events.index'));
    $this->assertModelMissing($seminar);
});

test('members who are not admins cannot add a seminar', function () {
    $this->actingAs(User::factory()->create());
    $event = Event::factory()->create();

    $response = $this->post(route('seminars.store', $event), [
        'title' => 'Building your first passive income',
        'starts_at' => '10:00',
        'capacity' => '40',
        'member_only' => '0',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('seminars', 0);
});

test('a seminar needs at least one seat', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();

    $response = $this->post(route('seminars.store', $event), [
        'title' => 'Building your first passive income',
        'starts_at' => '10:00',
        'capacity' => '0',
        'member_only' => '0',
    ]);

    $response->assertInvalid(['capacity']);
    $this->assertDatabaseCount('seminars', 0);
});
