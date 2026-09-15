<?php

namespace App\Models;

use BaconQrCode\Renderer\Color\Rgb;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\Fill;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * The card a member shows at the door.
 *
 * @property int $id
 * @property int $user_id
 * @property string $number
 * @property string $token
 * @property int|null $chapter_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['number', 'token', 'chapter_id'])]
#[Hidden(['token'])]
class MembershipCard extends Model
{
    /**
     * Issue the given member their card.
     *
     * Every member carries one, so the number is worked out here rather than
     * left to each caller: the member's own number and the year they joined.
     */
    public static function issueTo(User $user): self
    {
        return $user->membershipCard()->create([
            'number' => sprintf('CFC-P%d-%d', $user->id, ($user->created_at ?? now())->year),
            'token' => Str::random(40),
        ]);
    }

    /**
     * The card's QR as an inline SVG.
     *
     * It carries the token and nothing else, so a scan identifies the member
     * to the club without putting anything about them on the card itself.
     */
    public function qrCodeSvg(int $size = 260): string
    {
        $svg = (new Writer(
            new ImageRenderer(
                new RendererStyle($size, 0, null, null, Fill::uniformColor(
                    new Rgb(255, 255, 255),
                    new Rgb(9, 0, 20),
                )),
                new SvgImageBackEnd,
            )
        ))->writeString($this->token);

        /* Without its XML declaration, so it can be inlined in the page. */
        return trim(substr($svg, strpos($svg, "\n") + 1));
    }

    /**
     * The member the card belongs to.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The chapter the member calls home, once the club records one.
     *
     * @return BelongsTo<Chapter, $this>
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }
}
