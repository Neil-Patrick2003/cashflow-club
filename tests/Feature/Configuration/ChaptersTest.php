<?php

use App\Models\Chapter;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('the configuration page opens on the chapters tab', function () {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->get(route('configuration.index'));

    $response->assertRedirect(route('chapters.index'));
});

test('guests are redirected to the login page', function () {
    $response = $this->get(route('chapters.index'));

    $response->assertRedirect(route('login'));
});

test('members who are not admins cannot open the configuration page', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get(route('chapters.index'));

    $response->assertForbidden();
});

test('admins see the chapters on the configuration page', function () {
    $this->actingAs(User::factory()->admin()->create());
    Chapter::factory()->create(['name' => 'Cebu Chapter', 'city' => 'Cebu City']);

    $response = $this->get(route('chapters.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('configuration/chapters')
            ->has('chapters', 1)
            ->where('chapters.0.name', 'Cebu Chapter')
            ->where('chapters.0.city', 'Cebu City')
            ->where('chapters.0.is_active', true)
    );
});

test('admins can add a chapter', function () {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->post(route('chapters.store'), [
        'name' => 'Davao Chapter',
        'city' => 'Davao City',
        'is_active' => '1',
    ]);

    $response->assertRedirect(route('chapters.index'));
    $this->assertDatabaseHas('chapters', [
        'name' => 'Davao Chapter',
        'city' => 'Davao City',
        'is_active' => true,
    ]);
});

test('a chapter cannot be saved without its', function (string $field) {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->post(route('chapters.store'), collect([
        'name' => 'Davao Chapter',
        'city' => 'Davao City',
        'is_active' => '1',
    ])->except($field)->all());

    $response->assertInvalid([$field]);
    $this->assertDatabaseCount('chapters', 0);
})->with(['name', 'city', 'is_active']);

test('a chapter name is used only once', function () {
    $this->actingAs(User::factory()->admin()->create());
    Chapter::factory()->create(['name' => 'Cebu Chapter']);

    $response = $this->post(route('chapters.store'), [
        'name' => 'Cebu Chapter',
        'city' => 'Mandaue City',
        'is_active' => '1',
    ]);

    $response->assertInvalid(['name' => 'The name has already been taken.']);
    $this->assertDatabaseCount('chapters', 1);
});

test('admins can rename a chapter and close it', function () {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->patch(route('chapters.update', $chapter), [
        'name' => 'Iloilo Chapter',
        'city' => 'Iloilo City',
        'is_active' => '0',
    ]);

    $response->assertRedirect(route('chapters.index'));
    expect($chapter->fresh())
        ->name->toBe('Iloilo Chapter')
        ->city->toBe('Iloilo City')
        ->is_active->toBeFalse();
});

test('a chapter keeps its own name while being edited', function () {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create(['name' => 'Cebu Chapter', 'city' => 'Cebu City']);

    $response = $this->patch(route('chapters.update', $chapter), [
        'name' => 'Cebu Chapter',
        'city' => 'Mandaue City',
        'is_active' => '1',
    ]);

    $response->assertValid();
    expect($chapter->fresh()->city)->toBe('Mandaue City');
});

test('admins can delete a chapter', function () {
    $this->actingAs(User::factory()->admin()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->delete(route('chapters.destroy', $chapter));

    $response->assertRedirect(route('chapters.index'));
    $this->assertModelMissing($chapter);
});

test('members who are not admins cannot add a chapter', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->post(route('chapters.store'), [
        'name' => 'Davao Chapter',
        'city' => 'Davao City',
        'is_active' => '1',
    ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('chapters', 0);
});

test('members who are not admins cannot delete a chapter', function () {
    $this->actingAs(User::factory()->create());
    $chapter = Chapter::factory()->create();

    $response = $this->delete(route('chapters.destroy', $chapter));

    $response->assertForbidden();
    $this->assertModelExists($chapter);
});
