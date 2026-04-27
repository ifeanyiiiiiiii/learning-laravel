<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->nullOnDelete();
            $table->decimal('amount', 15, 2);
            $table->enum('currency', ['NGN', 'USD'])->default('NGN');
            $table->enum('type', ['income', 'expense']);
            $table->string('description')->nullable();
            $table->date('transacted_at');  // when it happened (user-controlled)
            $table->timestamps();           // created_at = when it was logged
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
