<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('membership_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            /** What the member quotes: `CFC-P12-2026`. */
            $table->string('number')->unique();
            /** What the QR carries, so nothing personal is on the card. */
            $table->string('token', 64)->unique();
            /** The chapter the member calls home; not asked for at sign-up. */
            $table->foreignId('chapter_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_cards');
    }
};
