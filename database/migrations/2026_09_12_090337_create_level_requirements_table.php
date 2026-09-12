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
        Schema::create('level_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_id')->constrained('membership_levels')->cascadeOnDelete();
            $table->string('type');
            /** Null for pass/fail requirements such as the facilitator assessment. */
            $table->unsignedInteger('int_value')->nullable();
            $table->timestamps();

            $table->unique(['level_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('level_requirements');
    }
};
