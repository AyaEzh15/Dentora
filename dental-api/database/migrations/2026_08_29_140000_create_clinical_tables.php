<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('blood_type', 10)->nullable();
            $table->text('allergies')->nullable();
            $table->text('chronic_diseases')->nullable();
            $table->text('current_medications')->nullable();
            $table->text('surgical_history')->nullable();
            $table->text('dental_history')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('odontogram_teeth', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('tooth_number', 4);
            $table->string('condition', 30)->default('HEALTHY');
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->unique(['patient_id', 'tooth_number']);
        });

        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('dentist_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('care_type_id')->nullable()->constrained()->nullOnDelete();
            $table->dateTime('consulted_at');
            $table->string('status', 30)->default('DRAFT');
            $table->text('chief_complaint')->nullable();
            $table->text('clinical_exam')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('treatment_notes')->nullable();
            $table->text('recommendations')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['clinic_id', 'consulted_at']);
            $table->index(['patient_id', 'consulted_at']);
        });

        Schema::create('consultation_procedures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consultation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('care_type_id')->constrained()->restrictOnDelete();
            $table->string('tooth_number', 4)->nullable();
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('treatment_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('dentist_id')->constrained('users')->restrictOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status', 30)->default('DRAFT');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('treatment_plan_phases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('treatment_plan_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->string('status', 30)->default('PENDING');
            $table->timestamps();
        });

        Schema::create('treatment_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('treatment_plan_phase_id')->constrained()->cascadeOnDelete();
            $table->foreignId('care_type_id')->constrained()->restrictOnDelete();
            $table->string('tooth_number', 4)->nullable();
            $table->string('notes')->nullable();
            $table->string('status', 30)->default('PLANNED');
            $table->decimal('estimated_price', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatment_plan_items');
        Schema::dropIfExists('treatment_plan_phases');
        Schema::dropIfExists('treatment_plans');
        Schema::dropIfExists('consultation_procedures');
        Schema::dropIfExists('consultations');
        Schema::dropIfExists('odontogram_teeth');
        Schema::dropIfExists('medical_records');
    }
};
