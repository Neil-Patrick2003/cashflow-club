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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            /**
             * Turning up is recorded against the seat, and a seat is claimed
             * once per person, so it is attended once. A row here means they
             * came; a no-show simply never gets one, and keeps its seat and
             * whatever it paid.
             */
            $table->foreignId('registration_id')->unique()->constrained()->cascadeOnDelete();
            $table->timestamp('checked_in_at');
            /** Scanned at the door, or ticked off the roster by hand. */
            $table->string('method');
            /** The admin who worked the door, kept for the club's own record. */
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
