<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case PENDING = 'PENDING';
    case CONFIRMED = 'CONFIRMED';
    case IN_PROGRESS = 'IN_PROGRESS';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';
    case NO_SHOW = 'NO_SHOW';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'À venir',
            self::CONFIRMED => 'Confirmé',
            self::IN_PROGRESS => 'En salle d\'attente',
            self::COMPLETED => 'Terminé',
            self::CANCELLED => 'Annulé',
            self::NO_SHOW => 'Absent',
        };
    }
}
