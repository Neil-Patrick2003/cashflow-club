<?php

use App\Enums\EventType;
use App\Models\Chapter;
use App\Models\Event;
use App\Models\Game;
use App\Models\Seminar;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('events.index'));

    $response->assertRedirect(route('login'));
});

test('members who are not admins cannot open the calendar', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get(route('events.index'));

    $response->assertForbidden();
});

test('admins see the calendar soonest first, with what each event holds', function () {
    $this->actingAs(User::factory()->admin()->create());
    $sooner = Event::factory()->create(['title' => 'Next Week', 'date' => today()->addWeek()]);
    Event::factory()->create(['title' => 'Next Month', 'date' => today()->addMonth()]);
    Game::factory()->for($sooner)->create();
    Seminar::factory()->for($sooner)->create();

    $response = $this->get(route('events.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('events/index')
            ->has('events', 2)
            ->where('events.0.title', 'Next Week')
            ->where('events.1.title', 'Next Month')
            ->has('events.0.games', 1)
            ->has('events.0.seminars', 1)
    );
});

test('the calendar shows only what is still to come, soonest first', function () {
    $this->actingAs(User::factory()->admin()->create());
    Event::factory()->create(['title' => 'Last Month', 'date' => today()->subMonth()]);
    Event::factory()->create(['title' => 'Yesterday', 'date' => today()->subDay()]);
    Event::factory()->create(['title' => 'Next Year', 'date' => today()->addYear()]);
    Event::factory()->create(['title' => 'Today', 'date' => today()]);

    $response = $this->get(route('events.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('events', 2)
            ->where('events.0.title', 'Today')
            ->where('events.1.title', 'Next Year')
    );
});

test('the calendar carries the seats each game and seminar puts on sale', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    Game::factory()->for($event)->create(['capacity' => 20]);
    Game::factory()->for($event)->create(['capacity' => 16]);
    Seminar::factory()->for($event)->create(['capacity' => 40]);

    $response = $this->get(route('events.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('events.0.games.0.capacity', 20)
            ->where('events.0.games.1.capacity', 16)
            ->where('events.0.seminars.0.capacity', 40)
    );
});

test('the calendar offers only chapters that are open', function () {
    $this->actingAs(User::factory()->admin()->create());
    Chapter::factory()->create(['name' => 'Cebu Chapter']);
    Chapter::factory()->inactive()->create(['name' => 'Closed Chapter']);

    $response = $this->get(route('events.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('chapters', 1)
            ->where('chapters.0.name', 'Cebu Chapter')
    );
});

test('the calendar carries everything scheduled inside each event', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    Game::factory()->for($event)->srt()->create(['code' => 'SRT #023']);

    $response = $this->get(route('events.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('events/index')
            ->where('events.0.title', $event->title)
            ->has('events.0.games', 1)
            ->where('events.0.games.0.code', 'SRT #023')
            ->has('events.0.games.0.master_facilitator')
            ->has('facilitators')
    );
});

test('an event can hold games and seminars side by side', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    Game::factory()->for($event)->create(['code' => 'Game #246']);
    Seminar::factory()->for($event)->create(['title' => 'Passive income 101']);

    $response = $this->get(route('events.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('events.0.games', 1)
            ->where('events.0.games.0.code', 'Game #246')
            ->has('events.0.seminars', 1)
            ->where('events.0.seminars.0.title', 'Passive income 101')
    );
});

test('admins can add an event', function () {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->post(route('events.store'), [
        'chapter_id' => $chapter->id,
        'title' => 'November Game Day',
        'type' => 'GAME_DAY',
        'date' => '2026-11-07',
        'start_time' => '13:00',
        'end_time' => '18:00',
    ]);

    $event = Event::firstWhere('title', 'November Game Day');
    $response->assertRedirect(route('events.index'));
    $this->assertDatabaseHas('events', [
        'chapter_id' => $chapter->id,
        'title' => 'November Game Day',
        'type' => 'GAME_DAY',
    ]);
});

test('an event cannot be saved without its', function (string $field) {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->post(route('events.store'), collect([
        'chapter_id' => $chapter->id,
        'title' => 'November Game Day',
        'type' => 'GAME_DAY',
        'date' => '2026-11-07',
        'start_time' => '13:00',
        'end_time' => '18:00',
    ])->except($field)->all());

    $response->assertInvalid([$field]);
    $this->assertDatabaseCount('events', 0);
})->with(['chapter_id', 'title', 'type', 'date', 'start_time', 'end_time']);

test('an event cannot end before it starts', function () {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->post(route('events.store'), [
        'chapter_id' => $chapter->id,
        'title' => 'November Game Day',
        'type' => 'GAME_DAY',
        'date' => '2026-11-07',
        'start_time' => '18:00',
        'end_time' => '13:00',
    ]);

    $response->assertInvalid(['end_time']);
    $this->assertDatabaseCount('events', 0);
});

test('admins can move an event to another date', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create(['date' => '2026-11-07']);

    $response = $this->patch(route('events.update', $event), [
        'chapter_id' => $event->chapter_id,
        'title' => $event->title,
        'type' => 'GAME_DAY',
        'date' => '2026-11-14',
        'start_time' => '09:00',
        'end_time' => '17:00',
    ]);

    $response->assertRedirect(route('events.index'));
    expect($event->fresh()->date->toDateString())->toBe('2026-11-14');
});

test('deleting an event takes its games with it', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();
    $game = Game::factory()->for($event)->create();

    $response = $this->delete(route('events.destroy', $event));

    $response->assertRedirect(route('events.index'));
    $this->assertModelMissing($event);
    $this->assertModelMissing($game);
});

test('members who are not admins cannot add an event', function () {
    $this->actingAs(User::factory()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->post(route('events.store'), [
        'chapter_id' => $chapter->id,
        'title' => 'November Game Day',
        'type' => 'GAME_DAY',
        'date' => '2026-11-07',
        'start_time' => '13:00',
        'end_time' => '18:00',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('events', 0);
});

test('members who are not admins cannot delete an event', function () {
    $this->actingAs(User::factory()->create());
    $event = Event::factory()->create();

    $response = $this->delete(route('events.destroy', $event));

    $response->assertForbidden();
    $this->assertModelExists($event);
});

test('admins can file an event as a special occasion', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();

    $response = $this->patch(route('events.update', $event), [
        'chapter_id' => $event->chapter_id,
        'title' => $event->title,
        'type' => 'SPECIAL_EVENT',
        'date' => $event->date->toDateString(),
        'start_time' => '13:00',
        'end_time' => '18:00',
    ]);

    $response->assertRedirect(route('events.index'));
    expect($event->fresh()->type)->toBe(EventType::SpecialEvent);
});

test('an event cannot be filed under a type the club does not run', function () {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->post(route('events.store'), [
        'chapter_id' => $chapter->id,
        'title' => 'November Game Day',
        'type' => 'WORKSHOP',
        'date' => '2026-11-07',
        'start_time' => '13:00',
        'end_time' => '18:00',
    ]);

    $response->assertInvalid(['type']);
    $this->assertDatabaseCount('events', 0);
});

test('an event cannot be added in the past', function () {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->post(route('events.store'), [
        'chapter_id' => $chapter->id,
        'title' => 'November Game Day',
        'type' => 'GAME_DAY',
        'date' => today()->subDay()->toDateString(),
        'start_time' => '13:00',
        'end_time' => '18:00',
    ]);

    $response->assertInvalid(['date']);
    $this->assertDatabaseCount('events', 0);
});

test('an event can be added for today', function () {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->post(route('events.store'), [
        'chapter_id' => $chapter->id,
        'title' => 'November Game Day',
        'type' => 'GAME_DAY',
        'date' => today()->toDateString(),
        'start_time' => '13:00',
        'end_time' => '18:00',
    ]);

    $response->assertValid();
    $this->assertDatabaseCount('events', 1);
});

test('an event that has already run can still be edited on its own date', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create(['date' => today()->subMonth()]);

    $response = $this->patch(route('events.update', $event), [
        'chapter_id' => $event->chapter_id,
        'title' => 'Renamed after the fact',
        'type' => 'GAME_DAY',
        'date' => $event->date->toDateString(),
        'start_time' => '13:00',
        'end_time' => '18:00',
    ]);

    $response->assertValid();
    expect($event->fresh()->title)->toBe('Renamed after the fact');
});

test('an event cannot be moved into the past', function () {
    $this->actingAs(User::factory()->admin()->create());
    $event = Event::factory()->create();

    $response = $this->patch(route('events.update', $event), [
        'chapter_id' => $event->chapter_id,
        'title' => $event->title,
        'type' => 'GAME_DAY',
        'date' => today()->subDay()->toDateString(),
        'start_time' => '13:00',
        'end_time' => '18:00',
    ]);

    $response->assertInvalid(['date']);
});
