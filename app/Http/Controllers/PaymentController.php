<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Http\Requests\PaymentUpdateRequest;
use App\Models\Payment;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class PaymentController extends Controller
{
    /**
     * Show every seat the club has taken and what each one owes.
     *
     * A seat covered by membership carries no payment at all, so the list is
     * built from the seats rather than from the payments. Left alone, what is
     * still owed leads, because collecting it is the work this page exists
     * for; a search, a standing or an order given in the query takes over.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('payments/index', [
            /* The query builder's own methods come first: everything after
               `with` is forwarded to Eloquent, which is where the ordering
               this page falls back to is settled. */
            'seats' => QueryBuilder::for(Registration::class)
                ->allowedFilters(
                    AllowedFilter::callback('search', $this->searchSeats(...)),
                    AllowedFilter::callback('status', $this->narrowToStanding(...)),
                )
                ->allowedSorts(
                    AllowedSort::field('amount', 'price_due'),
                    /* The order the seats were claimed in, which their ids
                       already carry. */
                    AllowedSort::field('claimed', 'id'),
                    AllowedSort::callback('member', $this->sortByMember(...)),
                    'owes_money',
                )
                ->defaultSort('-owes_money')
                ->with(['user:id,name,email', 'game.event.chapter', 'payment'])
                ->withExists([
                    'payment as owes_money' => fn ($query) => $query->where('status', PaymentStatus::Pending),
                ])
                /* Applied after whatever order was asked for, so a page of
                   equal rows never shuffles between visits. */
                ->orderByDesc('id')
                ->get(),
            'filters' => $this->filtersFrom($request),
        ]);
    }

    /**
     * Record that the money for the given seat is in.
     */
    public function update(PaymentUpdateRequest $request, Payment $payment): RedirectResponse
    {
        $payment->update([
            ...$request->validated(),
            'status' => PaymentStatus::Paid,
            /* Money that is already in came in when it came in, so a correction
               to the method never moves the date. */
            'paid_at' => $payment->paid_at ?? now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Payment marked as paid.')]);

        return to_route('payments.index');
    }

    /**
     * Narrow the seats to those whose member or game answers to the term.
     *
     * @param  Builder<Registration>  $query
     */
    private function searchSeats(Builder $query, mixed $term): void
    {
        $like = '%'.(is_array($term) ? implode(' ', $term) : $term).'%';

        $query->where(function (Builder $query) use ($like): void {
            $query
                ->whereHas('user', fn (Builder $query) => $query
                    ->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like))
                ->orWhereHas('game', fn (Builder $query) => $query->where('code', 'like', $like));
        });
    }

    /**
     * Narrow the seats to those whose money stands the given way.
     *
     * @param  Builder<Registration>  $query
     */
    private function narrowToStanding(Builder $query, mixed $standing): void
    {
        match (is_string($standing) ? PaymentStatus::tryFrom($standing) : null) {
            PaymentStatus::Pending => $query->whereRelation('payment', 'status', PaymentStatus::Pending),
            /* A seat covered by membership carries no payment, and so nothing
               outstanding: it is settled along with the rest. */
            PaymentStatus::Paid => $query->where(fn (Builder $query) => $query
                ->whereRelation('payment', 'status', PaymentStatus::Paid)
                ->orWhereDoesntHave('payment')),
            /* An unknown standing narrows nothing, rather than emptying the
               page on a mistyped link. */
            default => null,
        };
    }

    /**
     * Order the seats by the name of the member holding them.
     *
     * @param  Builder<Registration>  $query
     */
    private function sortByMember(Builder $query, bool $descending): void
    {
        $query->orderBy(
            User::select('name')->whereColumn('users.id', 'registrations.user_id'),
            $descending ? 'desc' : 'asc',
        );
    }

    /**
     * What the page is currently narrowed and ordered by, sent back so the
     * controls can show it.
     *
     * @return array{search: string|null, status: string|null, sort: string|null}
     */
    private function filtersFrom(Request $request): array
    {
        $given = function (string $key) use ($request): ?string {
            $value = $request->input($key);

            return is_string($value) && $value !== '' ? $value : null;
        };

        return [
            'search' => $given('filter.search'),
            'status' => $given('filter.status'),
            'sort' => $given('sort'),
        ];
    }
}
