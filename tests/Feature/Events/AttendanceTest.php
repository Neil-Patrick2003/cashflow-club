<?php

use App\Enums\CheckInMethod;
use App\Models\Attendance;
use App\Models\Game;
use App\Models\Payment;
use App\Models\Registration;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $seat = Registration::factory()->create();

    $response = $this->post(route('registrations.attendance.store', $seat));

    $response->assertRedirect(route('login'));
});

test('members who are not admins cannot check anyone in', function () {
    $this->actingAs(User::factory()->create());
    $seat = Registration::factory()->create();

    $response = $this->post(route('registrations.attendance.store', $seat));

    $response->assertForbidden();
    expect(Attendance::count())->toBe(0);
});

test('members who are not admins cannot undo a check-in', function () {
    $this->actingAs(User::factory()->create());
    $seat = Registration::factory()->create();
    Attendance::factory()->for($seat)->create();

    $response = $this->delete(route('registrations.attendance.destroy', $seat));

    $response->assertForbidden();
    expect(Attendance::count())->toBe(1);
});

test('an admin records a seat as arrived, marked as taken by hand', function () {
    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);
    $seat = Registration::factory()->create();

    $response = $this->post(route('registrations.attendance.store', $seat));

    $response->assertRedirect();
    $attendance = $seat->attendance()->sole();
    expect($attendance->method)->toBe(CheckInMethod::Manual)
        ->and($attendance->recorded_by)->toBe($admin->id)
        ->and($attendance->checked_in_at)->not->toBeNull();
});

test('checking the same seat in twice leaves the first arrival time alone', function () {
    $this->actingAs(User::factory()->admin()->create());
    $seat = Registration::factory()->create();
    $arrival = Attendance::factory()->for($seat)->create([
        'checked_in_at' => now()->subHour(),
    ]);

    $this->post(route('registrations.attendance.store', $seat));

    expect($seat->attendance()->count())->toBe(1)
        ->and($seat->attendance()->sole()->checked_in_at->timestamp)
        ->toBe($arrival->checked_in_at->timestamp);
});

test('undoing a check-in leaves the seat and the money it owes untouched', function () {
    $this->actingAs(User::factory()->admin()->create());
    $seat = Registration::factory()->paid()->create();
    $payment = Payment::factory()->for($seat)->create();
    Attendance::factory()->for($seat)->create();

    $response = $this->delete(route('registrations.attendance.destroy', $seat));

    $response->assertRedirect();
    expect($seat->attendance()->exists())->toBeFalse();
    $this->assertModelExists($seat);
    $this->assertModelExists($payment);
});

test('a seat nobody took up is left with no attendance at all', function () {
    $this->actingAs(User::factory()->admin()->create());
    $game = Game::factory()->create();
    $arrived = Registration::factory()->for($game)->create();
    $noShow = Registration::factory()->for($game)->create();

    $this->post(route('registrations.attendance.store', $arrived));

    expect($arrived->attendance()->exists())->toBeTrue()
        ->and($noShow->attendance()->exists())->toBeFalse();
});
