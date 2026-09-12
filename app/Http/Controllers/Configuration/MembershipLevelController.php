<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\MembershipLevelStoreRequest;
use App\Http\Requests\Configuration\MembershipLevelUpdateRequest;
use App\Models\MembershipLevel;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MembershipLevelController extends Controller
{
    /**
     * Show the membership levels tab of the configuration page.
     */
    public function index(): Response
    {
        return Inertia::render('configuration/membership-levels', [
            'levels' => MembershipLevel::query()
                ->with('requirements')
                ->orderBy('rank_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created membership level.
     */
    public function store(MembershipLevelStoreRequest $request): RedirectResponse
    {
        $level = MembershipLevel::create($request->safe()->only(['name', 'rank_order']));

        $level->requirements()->createMany($request->validated('requirements', []));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Level added.')]);

        return to_route('membership-levels.index');
    }

    /**
     * Update the given membership level.
     */
    public function update(MembershipLevelUpdateRequest $request, MembershipLevel $membershipLevel): RedirectResponse
    {
        $membershipLevel->update($request->safe()->only(['name', 'rank_order']));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Level updated.')]);

        return to_route('membership-levels.index');
    }

    /**
     * Delete the given membership level and its requirements.
     */
    public function destroy(MembershipLevel $membershipLevel): RedirectResponse
    {
        $membershipLevel->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Level deleted.')]);

        return to_route('membership-levels.index');
    }
}
