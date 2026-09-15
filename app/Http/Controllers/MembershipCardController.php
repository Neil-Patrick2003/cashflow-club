<?php

namespace App\Http\Controllers;

use App\Models\MembershipCard;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MembershipCardController extends Controller
{
    /**
     * Show the member their own card.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();

        /* A card is issued the moment someone registers. Anyone who joined
           before the club had them gets theirs on first look, so no member is
           ever sent away without one. */
        $card = $user->membershipCard ?? MembershipCard::issueTo($user);

        return Inertia::render('card/index', [
            'card' => $card->load('chapter'),
            'qr' => $card->qrCodeSvg(),
            'membershipLevel' => $user->membershipLevel?->name,
            'memberSince' => $user->created_at,
        ]);
    }
}
