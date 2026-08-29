<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'ADMIN';
    case DENTIST = 'DENTIST';
    case ASSISTANT = 'ASSISTANT';
    case SECRETARY = 'SECRETARY';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrateur',
            self::DENTIST => 'Dentiste',
            self::ASSISTANT => 'Assistant',
            self::SECRETARY => 'Secrétaire',
        };
    }
}
