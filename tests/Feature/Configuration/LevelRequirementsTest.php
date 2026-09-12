<?php

use App\Enums\RequirementType;
use App\Models\LevelRequirement;
use App\Models\MembershipLevel;
use App\Models\User;

test('admins can require a number of eligible games', function () {
    $this->actingAs(User::factory()->admin()->create());
    $level = MembershipLevel::factory()->create();

    $response = $this->post(route('level-requirements.store', $level), [
        'type' => 'ELIGIBLE_GAMES',
        'int_value' => '10',
    ]);

    $response->assertRedirect(route('membership-levels.index'));
    $this->assertDatabaseHas('level_requirements', [
        'level_id' => $level->id,
        'type' => 'ELIGIBLE_GAMES',
        'int_value' => 10,
    ]);
});

test('admins can require the facilitator assessment, which carries no number', function () {
    $this->actingAs(User::factory()->admin()->create());
    $level = MembershipLevel::factory()->create();

    $response = $this->post(route('level-requirements.store', $level), [
        'type' => 'ASSESSMENT',
    ]);

    $response->assertRedirect(route('membership-levels.index'));
    $this->assertDatabaseHas('level_requirements', [
        'level_id' => $level->id,
        'type' => 'ASSESSMENT',
        'int_value' => null,
    ]);
});

test('an eligible games requirement needs a threshold', function () {
    $this->actingAs(User::factory()->admin()->create());
    $level = MembershipLevel::factory()->create();

    $response = $this->post(route('level-requirements.store', $level), [
        'type' => 'ELIGIBLE_GAMES',
    ]);

    $response->assertInvalid(['int_value']);
    $this->assertDatabaseCount('level_requirements', 0);
});

test('the assessment requirement rejects a threshold', function () {
    $this->actingAs(User::factory()->admin()->create());
    $level = MembershipLevel::factory()->create();

    $response = $this->post(route('level-requirements.store', $level), [
        'type' => 'ASSESSMENT',
        'int_value' => '10',
    ]);

    $response->assertInvalid(['int_value']);
    $this->assertDatabaseCount('level_requirements', 0);
});

test('the requirement type must be one the system knows', function () {
    $this->actingAs(User::factory()->admin()->create());
    $level = MembershipLevel::factory()->create();

    $response = $this->post(route('level-requirements.store', $level), [
        'type' => 'MENTOR_HOURS',
        'int_value' => '5',
    ]);

    $response->assertInvalid(['type']);
    $this->assertDatabaseCount('level_requirements', 0);
});

test('a level carries each requirement type only once', function () {
    $this->actingAs(User::factory()->admin()->create());
    $level = MembershipLevel::factory()->create();
    LevelRequirement::factory()->for($level, 'level')->create(['int_value' => 10]);

    $response = $this->post(route('level-requirements.store', $level), [
        'type' => 'ELIGIBLE_GAMES',
        'int_value' => '12',
    ]);

    $response->assertInvalid(['type']);
    $this->assertDatabaseCount('level_requirements', 1);
});

test('the same requirement type can sit on two levels', function () {
    $this->actingAs(User::factory()->admin()->create());
    LevelRequirement::factory()->create(['int_value' => 10]);
    $level = MembershipLevel::factory()->create();

    $response = $this->post(route('level-requirements.store', $level), [
        'type' => 'ELIGIBLE_GAMES',
        'int_value' => '20',
    ]);

    $response->assertValid();
    $this->assertDatabaseCount('level_requirements', 2);
});

test('admins can raise the threshold on a requirement', function () {
    $this->actingAs(User::factory()->admin()->create());
    $requirement = LevelRequirement::factory()->create(['int_value' => 10]);

    $response = $this->patch(route('level-requirements.update', $requirement), [
        'type' => 'ELIGIBLE_GAMES',
        'int_value' => '15',
    ]);

    $response->assertRedirect(route('membership-levels.index'));
    expect($requirement->fresh())
        ->int_value->toBe(15)
        ->type->toBe(RequirementType::EligibleGames);
});

test('switching a requirement to the assessment drops its threshold', function () {
    $this->actingAs(User::factory()->admin()->create());
    $requirement = LevelRequirement::factory()->create(['int_value' => 10]);

    $response = $this->patch(route('level-requirements.update', $requirement), [
        'type' => 'ASSESSMENT',
    ]);

    $response->assertRedirect(route('membership-levels.index'));
    expect($requirement->fresh())
        ->type->toBe(RequirementType::Assessment)
        ->int_value->toBeNull();
});

test('admins can remove a requirement', function () {
    $this->actingAs(User::factory()->admin()->create());
    $requirement = LevelRequirement::factory()->create();

    $response = $this->delete(route('level-requirements.destroy', $requirement));

    $response->assertRedirect(route('membership-levels.index'));
    $this->assertModelMissing($requirement);
});

test('members who are not admins cannot add a requirement', function () {
    $this->actingAs(User::factory()->create());
    $level = MembershipLevel::factory()->create();

    $response = $this->post(route('level-requirements.store', $level), [
        'type' => 'ASSESSMENT',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('level_requirements', 0);
});

test('members who are not admins cannot remove a requirement', function () {
    $this->actingAs(User::factory()->create());
    $requirement = LevelRequirement::factory()->create();

    $response = $this->delete(route('level-requirements.destroy', $requirement));

    $response->assertForbidden();
    $this->assertModelExists($requirement);
});
