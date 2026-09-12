<?php

use App\Models\LevelRequirement;
use App\Models\MembershipLevel;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('members who are not admins cannot open the membership levels tab', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get(route('membership-levels.index'));

    $response->assertForbidden();
});

test('admins see the levels with their requirements, lowest rank first', function () {
    $this->actingAs(User::factory()->admin()->create());
    $apprentice = MembershipLevel::factory()->create(['name' => 'Apprentice', 'rank_order' => 2]);
    MembershipLevel::factory()->create(['name' => 'Starter', 'rank_order' => 1]);
    LevelRequirement::factory()->for($apprentice, 'level')->create(['int_value' => 10]);

    $response = $this->get(route('membership-levels.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('configuration/membership-levels')
            ->has('levels', 2)
            ->where('levels.0.name', 'Starter')
            ->where('levels.1.name', 'Apprentice')
            ->where('levels.1.requirements.0.type', 'ELIGIBLE_GAMES')
            ->where('levels.1.requirements.0.int_value', 10)
    );
});

test('admins can add a level', function () {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->post(route('membership-levels.store'), [
        'name' => 'Apprentice',
        'rank_order' => '2',
    ]);

    $response->assertRedirect(route('membership-levels.index'));
    $this->assertDatabaseHas('membership_levels', [
        'name' => 'Apprentice',
        'rank_order' => 2,
    ]);
});

test('admins can add a level with its requirements in one go', function () {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->post(route('membership-levels.store'), [
        'name' => 'Apprentice',
        'rank_order' => '2',
        'requirements' => [
            ['type' => 'ELIGIBLE_GAMES', 'int_value' => '10'],
            ['type' => 'ASSESSMENT'],
        ],
    ]);

    $response->assertRedirect(route('membership-levels.index'));
    $level = MembershipLevel::firstWhere('name', 'Apprentice');
    $this->assertDatabaseHas('level_requirements', [
        'level_id' => $level->id,
        'type' => 'ELIGIBLE_GAMES',
        'int_value' => 10,
    ]);
    $this->assertDatabaseHas('level_requirements', [
        'level_id' => $level->id,
        'type' => 'ASSESSMENT',
        'int_value' => null,
    ]);
});

test('a counted requirement sent with a new level needs its threshold', function () {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->post(route('membership-levels.store'), [
        'name' => 'Apprentice',
        'rank_order' => '2',
        'requirements' => [
            ['type' => 'ELIGIBLE_GAMES'],
        ],
    ]);

    $response->assertInvalid(['requirements.0.int_value']);
    $this->assertDatabaseCount('membership_levels', 0);
});

test('a new level cannot carry the same requirement twice', function () {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->post(route('membership-levels.store'), [
        'name' => 'Apprentice',
        'rank_order' => '2',
        'requirements' => [
            ['type' => 'ELIGIBLE_GAMES', 'int_value' => '10'],
            ['type' => 'ELIGIBLE_GAMES', 'int_value' => '12'],
        ],
    ]);

    $response->assertInvalid(['requirements.1.type']);
    $this->assertDatabaseCount('membership_levels', 0);
});

test('a level cannot be saved without its', function (string $field) {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->post(route('membership-levels.store'), collect([
        'name' => 'Apprentice',
        'rank_order' => '2',
    ])->except($field)->all());

    $response->assertInvalid([$field]);
    $this->assertDatabaseCount('membership_levels', 0);
})->with(['name', 'rank_order']);

test('a level name is used only once', function () {
    $this->actingAs(User::factory()->admin()->create());
    MembershipLevel::factory()->create(['name' => 'Apprentice']);

    $response = $this->post(route('membership-levels.store'), [
        'name' => 'Apprentice',
        'rank_order' => '3',
    ]);

    $response->assertInvalid(['name' => 'The name has already been taken.']);
    $this->assertDatabaseCount('membership_levels', 1);
});

test('admins can rename a level and move it up the ladder', function () {
    $this->actingAs(User::factory()->admin()->create());
    $level = MembershipLevel::factory()->create(['name' => 'Apprentice', 'rank_order' => 3]);

    $response = $this->patch(route('membership-levels.update', $level), [
        'name' => 'Journeyman',
        'rank_order' => '1',
    ]);

    $response->assertRedirect(route('membership-levels.index'));
    expect($level->fresh())
        ->name->toBe('Journeyman')
        ->rank_order->toBe(1);
});

test('deleting a level takes its requirements with it', function () {
    $this->actingAs(User::factory()->admin()->create());
    $level = MembershipLevel::factory()->create();
    $requirement = LevelRequirement::factory()->for($level, 'level')->create();

    $response = $this->delete(route('membership-levels.destroy', $level));

    $response->assertRedirect(route('membership-levels.index'));
    $this->assertModelMissing($level);
    $this->assertModelMissing($requirement);
});

test('members who are not admins cannot add a level', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->post(route('membership-levels.store'), [
        'name' => 'Apprentice',
        'rank_order' => '2',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('membership_levels', 0);
});

test('members who are not admins cannot delete a level', function () {
    $this->actingAs(User::factory()->create());
    $level = MembershipLevel::factory()->create();

    $response = $this->delete(route('membership-levels.destroy', $level));

    $response->assertForbidden();
    $this->assertModelExists($level);
});
