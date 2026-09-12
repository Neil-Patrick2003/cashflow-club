<?php

use App\Models\User;

test('registering users cannot mass assign the admin flag', function () {
    $user = User::create([
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password',
        'is_admin' => true,
    ])->fresh();

    expect($user->is_admin)->toBeFalse();
});

test('the admin state flags the user as an admin', function () {
    $user = User::factory()->admin()->create()->fresh();

    expect($user->is_admin)->toBeTrue();
});
