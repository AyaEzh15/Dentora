<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Enums\Gender;
use App\Models\Appointment;
use App\Models\Clinic;
use App\Models\Patient;
use App\Models\User;
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

        $slots = [
            [$created[0], today()->setTime(9, 0), today()->setTime(9, 45), AppointmentStatus::COMPLETED, 'Détartrage'],
            [$created[1], today()->setTime(10, 30), today()->setTime(11, 15), AppointmentStatus::IN_PROGRESS, 'Contrôle'],
            [$created[2], today()->setTime(14, 0), today()->setTime(14, 45), AppointmentStatus::CONFIRMED, 'Consultation'],
            [$created[4], today()->setTime(16, 0), today()->setTime(16, 45), AppointmentStatus::PENDING, 'Blanchiment'],
            [$created[0], now()->addDay()->setTime(11, 0), now()->addDay()->setTime(11, 45), AppointmentStatus::CONFIRMED, 'Suivi'],
        ];

        foreach ($slots as [$patient, $start, $end, $status, $reason]) {
            Appointment::query()->updateOrCreate(
                [
                    'clinic_id' => $clinic->id,
                    'patient_id' => $patient->id,
                    'start_at' => $start,
                ],
                [
                    'dentist_id' => $dentist->id,
                    'end_at' => $end,
                    'status' => $status,
                    'reason' => $reason,
                    'created_by' => $admin?->id,
                ]
            );
        }
    }
}
