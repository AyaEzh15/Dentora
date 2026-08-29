<?php

namespace App\Enums;

enum ConsultationStatus: string
{
    case DRAFT = 'DRAFT';
    case COMPLETED = 'COMPLETED';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Brouillon',
            self::COMPLETED => 'Terminée',
        };
    }
}
