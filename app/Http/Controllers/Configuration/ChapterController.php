<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\ChapterStoreRequest;
use App\Http\Requests\Configuration\ChapterUpdateRequest;
use App\Models\Chapter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ChapterController extends Controller
{
    /**
     * Show the chapters tab of the configuration page.
     */
    public function index(): Response
    {
        return Inertia::render('configuration/chapters', [
            'chapters' => Chapter::query()->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created chapter.
     */
    public function store(ChapterStoreRequest $request): RedirectResponse
    {
        Chapter::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Chapter added.')]);

        return to_route('chapters.index');
    }

    /**
     * Update the given chapter.
     */
    public function update(ChapterUpdateRequest $request, Chapter $chapter): RedirectResponse
    {
        $chapter->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Chapter updated.')]);

        return to_route('chapters.index');
    }

    /**
     * Delete the given chapter.
     */
    public function destroy(Chapter $chapter): RedirectResponse
    {
        $chapter->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Chapter deleted.')]);

        return to_route('chapters.index');
    }
}
