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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            /** The time the game starts on its event's date. */
            $table->time('schedule_at');
            $table->decimal('member_price', 10, 2)->default(0);
            $table->decimal('non_member_price', 10, 2)->default(0);
            $table->unsignedInteger('capacity');
            /** Set for SRT sessions only; regular games run without one. */
            $table->foreignId('master_facilitator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
