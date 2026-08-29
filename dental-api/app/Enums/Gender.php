<?php

namespace App\Enums;

enum Gender: string
{
    case MALE = 'MALE';
    case FEMALE = 'FEMALE';
    case OTHER = 'OTHER';

    public function label(): string
    {
        return match ($this) {
            self::MALE => 'Homme',
            self::FEMALE => 'Femme',
            self::OTHER => 'Autre',
        };
    }
}
