<?php

namespace App\Enums;

enum PrescriptionStatus: string
{
    case DRAFT = 'DRAFT';
    case ISSUED = 'ISSUED';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Brouillon',
            self::ISSUED => 'Émise',
        };
    }
}
