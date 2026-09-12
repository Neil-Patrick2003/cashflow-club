<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\LevelRequirementStoreRequest;
use App\Http\Requests\Configuration\LevelRequirementUpdateRequest;
use App\Models\LevelRequirement;
use App\Models\MembershipLevel;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class LevelRequirementController extends Controller
{
    /**
     * Add a requirement to the given membership level.
     */
    public function store(LevelRequirementStoreRequest $request, MembershipLevel $membershipLevel): RedirectResponse
    {
        $membershipLevel->requirements()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Requirement added.')]);

        return to_route('membership-levels.index');
    }

    /**
     * Update the given requirement.
     */
    public function update(LevelRequirementUpdateRequest $request, LevelRequirement $levelRequirement): RedirectResponse
    {
        $levelRequirement->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Requirement updated.')]);

        return to_route('membership-levels.index');
    }

    /**
     * Delete the given requirement.
     */
    public function destroy(LevelRequirement $levelRequirement): RedirectResponse
    {
        $levelRequirement->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Requirement deleted.')]);

        return to_route('membership-levels.index');
    }
}
