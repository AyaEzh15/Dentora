<?php

namespace App\Enums;

enum TreatmentPlanStatus: string
{
    case DRAFT = 'DRAFT';
    case ACCEPTED = 'ACCEPTED';
    case IN_PROGRESS = 'IN_PROGRESS';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Brouillon',
            self::ACCEPTED => 'Accepté',
            self::IN_PROGRESS => 'En cours',
            self::COMPLETED => 'Terminé',
            self::CANCELLED => 'Annulé',
        };
    }
}
