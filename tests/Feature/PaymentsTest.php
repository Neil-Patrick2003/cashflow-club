<?php

use App\Enums\AccessMethod;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Game;
use App\Models\Payment;
use App\Models\Registration;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('payments.index'));

    $response->assertRedirect(route('login'));
});

test('members who are not admins cannot open the payments page', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->get(route('payments.index'));

    $response->assertForbidden();
});

test('admins see who holds each seat and what it owes', function () {
    $this->actingAs(User::factory()->admin()->create());
    $seat = Registration::factory()
        ->for(User::factory()->create(['name' => 'Ben Uy']))
        ->paid()
        ->create();
    Payment::factory()->for($seat)->create(['amount' => 2000]);

    $response = $this->get(route('payments.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->component('payments/index')
            ->has('seats', 1)
            ->where('seats.0.user.name', 'Ben Uy')
            ->where('seats.0.payment.amount', '2000.00')
            ->where('seats.0.payment.status', PaymentStatus::Pending->value)
            ->has('seats.0.game')
    );
});

test('a seat covered by membership is listed with no payment to collect', function () {
    $this->actingAs(User::factory()->admin()->create());
    Registration::factory()->create();

    $response = $this->get(route('payments.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('seats', 1)
            ->where('seats.0.access_method', AccessMethod::Membership->value)
            ->where('seats.0.payment', null)
    );
});

test('the seats that still owe money lead the list', function () {
    $this->actingAs(User::factory()->admin()->create());
    $owing = Registration::factory()->paid()->create();
    Payment::factory()->for($owing)->create();
    /* Taken after the seat that owes money, so only the ordering can put the
       money still to come in first. */
    $covered = Registration::factory()->create();

    $response = $this->get(route('payments.index'));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('seats.0.id', $owing->id)
            ->where('seats.1.id', $covered->id)
    );
});

test('admins can mark a seat paid and record how the money came in', function () {
    $this->actingAs(User::factory()->admin()->create());
    $payment = Payment::factory()->create();

    $response = $this->patch(route('payments.update', $payment), [
        'method' => PaymentMethod::GCash->value,
    ]);

    $response->assertRedirect(route('payments.index'));
    $this->assertDatabaseHas('payments', [
        'id' => $payment->id,
        'method' => PaymentMethod::GCash->value,
        'status' => PaymentStatus::Paid->value,
    ]);
    expect($payment->refresh()->paid_at)->not->toBeNull();
});

test('correcting how a settled seat was paid leaves the day the money came in', function () {
    $this->actingAs(User::factory()->admin()->create());
    $payment = Payment::factory()->paid()->create(['paid_at' => now()->subWeek()]);

    $this->patch(route('payments.update', $payment), [
        'method' => PaymentMethod::Cash->value,
    ]);

    expect($payment->refresh()->paid_at->toDateString())
        ->toBe(now()->subWeek()->toDateString());
});

test('a seat cannot be marked paid without a way the club takes money', function (?string $method) {
    $this->actingAs(User::factory()->admin()->create());
    $payment = Payment::factory()->create();

    $response = $this->patch(route('payments.update', $payment), ['method' => $method]);

    $response->assertInvalid(['method']);
    $this->assertDatabaseHas('payments', [
        'id' => $payment->id,
        'status' => PaymentStatus::Pending->value,
    ]);
})->with(['missing' => null, 'unknown' => 'BITCOIN']);

test('members who are not admins cannot mark a seat paid', function () {
    $this->actingAs(User::factory()->create());
    $payment = Payment::factory()->create();

    $response = $this->patch(route('payments.update', $payment), [
        'method' => PaymentMethod::Cash->value,
    ]);

    $response->assertForbidden();
    $this->assertDatabaseHas('payments', [
        'id' => $payment->id,
        'status' => PaymentStatus::Pending->value,
    ]);
});

test('a search narrows the seats to the member or the game it names', function (string $term) {
    $this->actingAs(User::factory()->admin()->create());
    $wanted = Registration::factory()
        ->for(User::factory()->create(['name' => 'Ben Uy', 'email' => 'ben@example.com']))
        ->for(Game::factory()->create(['code' => 'SRT #023']))
        ->create();
    Registration::factory()
        ->for(User::factory()->create(['name' => 'Ana Lim', 'email' => 'ana@example.com']))
        ->for(Game::factory()->create(['code' => 'Game #246']))
        ->create();

    $response = $this->get(route('payments.index', ['filter' => ['search' => $term]]));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('seats', 1)
            ->where('seats.0.id', $wanted->id)
    );
})->with(['Ben', 'ben@example', 'SRT #023']);

test('the pending filter shows only the seats still owing money', function () {
    $this->actingAs(User::factory()->admin()->create());
    Registration::factory()->create();
    $owing = Registration::factory()->paid()->create();
    Payment::factory()->for($owing)->create();
    Payment::factory()->paid()->for(Registration::factory()->paid()->create())->create();

    $response = $this->get(route('payments.index', [
        'filter' => ['status' => PaymentStatus::Pending->value],
    ]));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('seats', 1)
            ->where('seats.0.id', $owing->id)
    );
});

test('the paid filter shows the settled seats and those with nothing to collect', function () {
    $this->actingAs(User::factory()->admin()->create());
    $owing = Registration::factory()->paid()->create();
    Payment::factory()->for($owing)->create();
    $settled = Registration::factory()->paid()->create();
    Payment::factory()->paid()->for($settled)->create();
    /* Covered by membership, so it never owed anything to settle. */
    $covered = Registration::factory()->create();

    $response = $this->get(route('payments.index', [
        'filter' => ['status' => PaymentStatus::Paid->value],
    ]));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->has('seats', 2)
            ->where('seats.0.id', $covered->id)
            ->where('seats.1.id', $settled->id)
    );
});

test('an order asked for takes over from leading with what is owed', function () {
    $this->actingAs(User::factory()->admin()->create());
    /* The cheaper seat is the one still owing, so it leads until an order is
       asked for. */
    $cheaper = Registration::factory()->paid(800)->create();
    Payment::factory()->for($cheaper)->create();
    $dearer = Registration::factory()->paid(2500)->create();
    Payment::factory()->for($dearer)->paid()->create();

    $response = $this->get(route('payments.index', ['sort' => '-amount']));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('seats.0.id', $dearer->id)
            ->where('seats.1.id', $cheaper->id)
    );
});

test('the seats can be ordered by the member holding them', function () {
    $this->actingAs(User::factory()->admin()->create());
    $last = Registration::factory()
        ->for(User::factory()->create(['name' => 'Zara Cruz']))
        ->create();
    $first = Registration::factory()
        ->for(User::factory()->create(['name' => 'Ana Lim']))
        ->create();

    $response = $this->get(route('payments.index', ['sort' => 'member']));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('seats.0.id', $first->id)
            ->where('seats.1.id', $last->id)
    );
});

test('the page says what it is narrowed and ordered by', function () {
    $this->actingAs(User::factory()->admin()->create());

    $response = $this->get(route('payments.index', [
        'filter' => ['search' => 'Ben', 'status' => PaymentStatus::Pending->value],
        'sort' => '-amount',
    ]));

    $response->assertInertia(
        fn (AssertableInertia $page) => $page->where('filters.search', 'Ben')
            ->where('filters.status', PaymentStatus::Pending->value)
            ->where('filters.sort', '-amount')
    );
});
