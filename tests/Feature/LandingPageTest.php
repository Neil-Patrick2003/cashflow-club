<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests see the landing page', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('welcome')
    );
});

test('authenticated members see the landing page', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('welcome')
            ->has('auth.user')
    );
});
