<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'dashboard.view',

            'patients.view',
            'patients.create',
            'patients.update',
            'patients.delete',

            'appointments.view',
            'appointments.create',
            'appointments.update',
            'appointments.cancel',

            'consultations.view',
            'consultations.create',
            'consultations.update',

            'odontogram.view',
            'odontogram.update',

            'treatments.view',
            'treatments.create',
            'treatments.update',

            'prescriptions.view',
            'prescriptions.create',

            'billing.view',
            'billing.create',

            'payments.view',
            'payments.create',

            'expenses.view',
            'expenses.create',

            'stock.view',
            'stock.manage',

            'documents.view',
            'documents.manage',

            'reports.view',

            'users.view',
            'users.manage',

            'settings.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $admin = Role::firstOrCreate(['name' => UserRole::ADMIN->value, 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        $dentist = Role::firstOrCreate(['name' => UserRole::DENTIST->value, 'guard_name' => 'web']);
        $dentist->syncPermissions([
            'dashboard.view',
            'patients.view',
            'patients.create',
            'patients.update',
            'appointments.view',
            'appointments.create',
            'appointments.update',
            'appointments.cancel',
            'consultations.view',
            'consultations.create',
            'consultations.update',
            'odontogram.view',
            'odontogram.update',
            'treatments.view',
            'treatments.create',
            'treatments.update',
            'prescriptions.view',
            'prescriptions.create',
            'billing.view',
            'documents.view',
            'reports.view',
        ]);

        $assistant = Role::firstOrCreate(['name' => UserRole::ASSISTANT->value, 'guard_name' => 'web']);
        $assistant->syncPermissions([
            'dashboard.view',
            'patients.view',
            'patients.create',
            'appointments.view',
            'appointments.create',
            'consultations.view',
            'odontogram.view',
            'treatments.view',
            'prescriptions.view',
            'documents.view',
        ]);

        $secretary = Role::firstOrCreate(['name' => UserRole::SECRETARY->value, 'guard_name' => 'web']);
        $secretary->syncPermissions([
            'dashboard.view',
            'patients.view',
            'patients.create',
            'patients.update',
            'appointments.view',
            'appointments.create',
            'appointments.update',
            'appointments.cancel',
            'billing.view',
            'billing.create',
            'payments.view',
            'payments.create',
            'documents.view',
        ]);
    }
}
