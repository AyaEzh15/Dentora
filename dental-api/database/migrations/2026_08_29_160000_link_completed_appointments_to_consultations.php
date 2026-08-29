<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $completed = DB::table('appointments')->where('status', 'COMPLETED')->get();

        foreach ($completed as $appointment) {
            $alreadyLinked = DB::table('consultations')
                ->where('appointment_id', $appointment->id)
                ->exists();

            if ($alreadyLinked) {
                continue;
            }

            $query = DB::table('consultations')
                ->where('patient_id', $appointment->patient_id)
                ->where('dentist_id', $appointment->dentist_id)
                ->whereNull('appointment_id')
                ->whereDate('consulted_at', Carbon::parse($appointment->start_at)->toDateString());

            if ($appointment->care_type_id) {
                $query->where('care_type_id', $appointment->care_type_id);
            }

            $match = $query->orderBy('id')->first();

            if ($match) {
                DB::table('consultations')
                    ->where('id', $match->id)
                    ->update(['appointment_id' => $appointment->id]);

                continue;
            }

            $now = now();

            $consultationId = DB::table('consultations')->insertGetId([
                'clinic_id' => $appointment->clinic_id,
                'patient_id' => $appointment->patient_id,
                'dentist_id' => $appointment->dentist_id,
                'appointment_id' => $appointment->id,
                'care_type_id' => $appointment->care_type_id,
                'consulted_at' => $appointment->start_at,
                'status' => 'DRAFT',
                'chief_complaint' => $appointment->reason,
                'created_by' => $appointment->created_by,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            if ($appointment->care_type_id) {
                DB::table('consultation_procedures')->insert([
                    'consultation_id' => $consultationId,
                    'care_type_id' => $appointment->care_type_id,
                    'quantity' => 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        Schema::table('consultations', function (Blueprint $table) {
            $table->unique('appointment_id');
        });
    }

    public function down(): void
    {
        Schema::table('consultations', function (Blueprint $table) {
            $table->dropUnique(['appointment_id']);
        });
    }
};
