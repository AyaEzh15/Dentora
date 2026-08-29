<?php

namespace App\Enums;

enum TreatmentPhaseStatus: string
{
    case PENDING = 'PENDING';
    case IN_PROGRESS = 'IN_PROGRESS';
    case COMPLETED = 'COMPLETED';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'À venir',
            self::IN_PROGRESS => 'En cours',
            self::COMPLETED => 'Terminé',
        };
    }
}
