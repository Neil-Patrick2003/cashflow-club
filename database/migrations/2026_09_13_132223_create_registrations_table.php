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
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            /** How the person got in: by membership, by paying, or by voucher. */
            $table->string('access_method');
            /** What this seat leaves them owing; zero unless they are paying. */
            $table->decimal('price_due', 10, 2)->default(0);
            /** Presented at the door and scanned on the way in. */
            /**
             * One voucher is redeemable once, ever. No foreign key yet: the
             * vouchers table does not exist, so add one when it lands.
             */
            $table->unsignedBigInteger('voucher_id')->nullable()->unique();
            $table->timestamps();

            /** A seat is claimed once per person. */
            $table->unique(['user_id', 'game_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
