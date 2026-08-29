<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('dentist_id')->constrained('users')->restrictOnDelete();
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->string('status', 30)->default('PENDING');
            $table->string('reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancel_reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['clinic_id', 'start_at']);
            $table->index(['dentist_id', 'start_at']);
            $table->index(['patient_id', 'start_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
