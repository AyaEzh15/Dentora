<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Clinic;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Database\Seeder;

class ClinicUserSeeder extends Seeder
{
    public function run(): void
    {
        $clinic = Clinic::query()->firstOrCreate(
            ['slug' => 'dental-smile'],
            [
                'name' => 'Cabinet Dental Smile',
                'email' => 'contact@dentalsmile.ma',
                'phone' => '+212 5 37 00 00 00',
                'address' => '12 Avenue Mohammed V',
                'city' => 'Rabat',
                'is_active' => true,
            ]
        );

        $users = [
            [
                'email' => 'admin@admin.com',
                'name' => 'Admin Dentora',
                'first_name' => 'Admin',
                'last_name' => 'Dentora',
                'phone' => '+212 6 00 00 00 01',
                'role' => UserRole::ADMIN,
            ],
            [
                'email' => 'aya@dentiste.com',
                'name' => 'Dr. Aya',
                'first_name' => 'Aya',
                'last_name' => 'Dentiste',
                'phone' => '+212 6 00 00 00 02',
                'role' => UserRole::DENTIST,
            ],
            [
                'email' => 'ahmed.alaoui@dentora.ma',
                'name' => 'Dr. Ahmed Alaoui',
                'first_name' => 'Ahmed',
                'last_name' => 'Alaoui',
                'phone' => '+212 6 00 00 00 03',
                'role' => UserRole::DENTIST,
            ],
        ];

        foreach ($users as $data) {
            $user = User::query()->firstOrCreate(
                ['email' => $data['email']],
                [
                    'clinic_id' => $clinic->id,
                    'name' => $data['name'],
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'phone' => $data['phone'],
                    'password' => 'password',
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([$data['role']->value]);

            if ($data['role'] === UserRole::DENTIST) {
                app(UserService::class)->attachDefaultTemplates($user);
            }
        }
    }
}
