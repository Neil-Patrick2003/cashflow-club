<?php

use App\Models\User;

test('the root document always applies the night theme', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get(route('dashboard'));

    $response->assertSee('<html lang="en" class="dark">', escape: false);
});

test('the root document serves the club seal as the favicon', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get(route('dashboard'));

    $response->assertSee('<link rel="icon" href="/favicon.ico" sizes="32x32 96x96">', escape: false);
});
