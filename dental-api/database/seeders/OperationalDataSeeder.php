<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Enums\ConsultationStatus;
use App\Enums\Gender;
use App\Enums\ToothCondition;
use App\Enums\TreatmentPhaseStatus;
use App\Enums\TreatmentPlanStatus;
use App\Models\Appointment;
use App\Models\CareType;
use App\Models\Clinic;
use App\Models\Consultation;
use App\Models\MedicalRecord;
use App\Models\OdontogramTooth;
use App\Models\Patient;
use App\Models\TreatmentPlan;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class OperationalDataSeeder extends Seeder
{
    public function run(): void
    {
        $clinic = Clinic::query()->where('slug', 'dental-smile')->first();
        $dentist = User::query()->where('email', 'aya@dentiste.com')->first();
        $admin = User::query()->where('email', 'admin@admin.com')->first();

        if (! $clinic || ! $dentist) {
            return;
        }

        $patients = [
            [
                'file_number' => 'PT-0001',
                'first_name' => 'Sara',
                'last_name' => 'Amrani',
                'email' => 'sara.amrani@email.ma',
                'phone' => '0612345678',
                'date_of_birth' => '1992-03-14',
                'gender' => Gender::FEMALE,
                'city' => 'Rabat',
                'medical_alert' => 'Allergie : Pénicilline',
                'is_active' => true,
            ],
            [
                'file_number' => 'PT-0002',
                'first_name' => 'Youssef',
                'last_name' => 'Benali',
                'email' => 'youssef.benali@email.ma',
                'phone' => '0698765432',
                'date_of_birth' => '1985-11-02',
                'gender' => Gender::MALE,
                'city' => 'Salé',
                'is_active' => true,
            ],
            [
                'file_number' => 'PT-0003',
                'first_name' => 'Fatima Zahra',
                'last_name' => 'Idrissi',
                'email' => 'fz.idrissi@email.ma',
                'phone' => '0661122334',
                'date_of_birth' => '1998-07-21',
                'gender' => Gender::FEMALE,
                'city' => 'Rabat',
                'is_active' => true,
            ],
            [
                'file_number' => 'PT-0004',
                'first_name' => 'Karim',
                'last_name' => 'Tazi',
                'email' => 'karim.tazi@email.ma',
                'phone' => '0677001122',
                'date_of_birth' => '1978-01-09',
                'gender' => Gender::MALE,
                'city' => 'Témara',
                'is_active' => false,
            ],
            [
                'file_number' => 'PT-0005',
                'first_name' => 'Nadia',
                'last_name' => 'El Fassi',
                'email' => 'nadia.elfassi@email.ma',
                'phone' => '0655443322',
                'date_of_birth' => '1990-05-30',
                'gender' => Gender::FEMALE,
                'city' => 'Rabat',
                'is_active' => true,
            ],
        ];

        $created = [];

        foreach ($patients as $data) {
            $created[] = Patient::query()->updateOrCreate(
                [
                    'clinic_id' => $clinic->id,
                    'file_number' => $data['file_number'],
                ],
                $data + ['created_by' => $admin?->id]
            );
        }

        $careType = fn (string $name) => CareType::query()->where('slug', Str::slug($name))->first();

        $slots = [
            [$created[0], today()->setTime(9, 0), today()->setTime(9, 45), AppointmentStatus::COMPLETED, 'Détartrage'],
            [$created[1], today()->setTime(10, 30), today()->setTime(11, 15), AppointmentStatus::IN_PROGRESS, 'Consultation dentaire'],
            [$created[2], today()->setTime(14, 0), today()->setTime(14, 45), AppointmentStatus::CONFIRMED, 'Consultation dentaire'],
            [$created[4], today()->setTime(16, 0), today()->setTime(16, 45), AppointmentStatus::PENDING, 'Blanchiment dentaire'],
            [$created[0], now()->addDay()->setTime(11, 0), now()->addDay()->setTime(11, 45), AppointmentStatus::CONFIRMED, 'Consultation dentaire'],
        ];

        $completedAppointment = null;

        foreach ($slots as [$patient, $start, $end, $status, $careName]) {
            $type = $careType($careName);

            $appointment = Appointment::query()->updateOrCreate(
                [
                    'clinic_id' => $clinic->id,
                    'patient_id' => $patient->id,
                    'start_at' => $start,
                ],
                [
                    'dentist_id' => $dentist->id,
                    'care_type_id' => $type?->id,
                    'end_at' => $end,
                    'status' => $status,
                    'reason' => $type?->name ?? $careName,
                    'created_by' => $admin?->id,
                ]
            );

            if ($status === AppointmentStatus::COMPLETED) {
                $completedAppointment = $appointment;
            }
        }

        $sara = $created[0];
        $detartrage = $careType('Détartrage');
        $implant = $careType('Implant dentaire');
        $greffe = $careType('Greffe osseuse');
        $couronne = $careType('Couronne dentaire');
        $extraction = $careType('Extraction dentaire');

        MedicalRecord::query()->updateOrCreate(
            ['patient_id' => $sara->id],
            [
                'clinic_id' => $clinic->id,
                'blood_type' => 'A+',
                'allergies' => 'Pénicilline',
                'chronic_diseases' => 'Aucune',
                'current_medications' => 'Aucun traitement en cours',
                'dental_history' => 'Détartrages réguliers. Caries traitées en 2024.',
                'notes' => 'Patiente coopérative, hygiène correcte.',
            ]
        );

        foreach ([
            ['16', ToothCondition::CROWN],
            ['26', ToothCondition::CARIES],
            ['36', ToothCondition::FILLED],
            ['46', ToothCondition::TO_EXTRACT],
        ] as [$number, $condition]) {
            OdontogramTooth::query()->updateOrCreate(
                ['patient_id' => $sara->id, 'tooth_number' => $number],
                [
                    'clinic_id' => $clinic->id,
                    'condition' => $condition,
                ]
            );
        }

        $consultation = Consultation::query()->updateOrCreate(
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $sara->id,
                'consulted_at' => today()->setTime(9, 10),
            ],
            [
                'dentist_id' => $dentist->id,
                'appointment_id' => $completedAppointment?->id,
                'care_type_id' => $detartrage?->id,
                'status' => ConsultationStatus::COMPLETED,
                'chief_complaint' => 'Dépôt et saignement gingival.',
                'clinical_exam' => 'Tartre généralisé, gencives inflammées au secteur 4.',
                'diagnosis' => 'Gingivite associée à un tartre important.',
                'treatment_notes' => 'Détartrage complet réalisé. Contrôle d’hygiène.',
                'recommendations' => 'Brossage 2x/jour, fil dentaire, contrôle dans 6 mois.',
                'created_by' => $dentist->id,
            ]
        );

        if ($detartrage) {
            $consultation->procedures()->delete();
            $consultation->procedures()->create([
                'care_type_id' => $detartrage->id,
                'quantity' => 1,
                'notes' => 'Arcade supérieure et inférieure',
            ]);
        }

        $plan = TreatmentPlan::query()->updateOrCreate(
            [
                'clinic_id' => $clinic->id,
                'patient_id' => $sara->id,
                'title' => 'Réhabilitation secteur postérieur',
            ],
            [
                'dentist_id' => $dentist->id,
                'description' => 'Extraction, implant et couronne sur 46.',
                'status' => TreatmentPlanStatus::IN_PROGRESS,
                'created_by' => $dentist->id,
            ]
        );

        $plan->phases()->delete();
        $phase1 = $plan->phases()->create([
            'title' => 'Phase 1 : Préparation',
            'description' => 'Extraction de la dent 46 et assainissement.',
            'sort_order' => 1,
            'status' => TreatmentPhaseStatus::COMPLETED,
        ]);
        $phase2 = $plan->phases()->create([
            'title' => 'Phase 2 : Chirurgie',
            'description' => 'Pose d’implant et greffe osseuse si besoin.',
            'sort_order' => 2,
            'status' => TreatmentPhaseStatus::IN_PROGRESS,
        ]);
        $phase3 = $plan->phases()->create([
            'title' => 'Phase 3 : Prothèse',
            'description' => 'Couronne définitive sur implant.',
            'sort_order' => 3,
            'status' => TreatmentPhaseStatus::PENDING,
        ]);

        if ($extraction) {
            $phase1->items()->create(['care_type_id' => $extraction->id, 'tooth_number' => '46', 'status' => 'DONE']);
        }
        if ($implant) {
            $phase2->items()->create(['care_type_id' => $implant->id, 'tooth_number' => '46', 'status' => 'PLANNED']);
        }
        if ($greffe) {
            $phase2->items()->create(['care_type_id' => $greffe->id, 'tooth_number' => '46', 'status' => 'PLANNED']);
        }
        if ($couronne) {
            $phase3->items()->create(['care_type_id' => $couronne->id, 'tooth_number' => '46', 'status' => 'PLANNED']);
        }
    }
}
