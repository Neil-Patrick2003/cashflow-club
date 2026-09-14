<?php

use App\Enums\PaymentStatus;
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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            /** One seat is billed once, so a registration carries one payment. */
            $table->foreignId('registration_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            /** Recorded by hand in admin once the money is taken. */
            $table->string('method')->nullable();
            $table->string('status')->default(PaymentStatus::Pending->value);
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
