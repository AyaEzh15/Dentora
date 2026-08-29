<?php

namespace App\Enums;

enum ToothCondition: string
{
    case HEALTHY = 'HEALTHY';
    case CARIES = 'CARIES';
    case FILLED = 'FILLED';
    case CROWN = 'CROWN';
    case ROOT_CANAL = 'ROOT_CANAL';
    case MISSING = 'MISSING';
    case IMPLANT = 'IMPLANT';
    case TO_EXTRACT = 'TO_EXTRACT';

    public function label(): string
    {
        return match ($this) {
            self::HEALTHY => 'Saine',
            self::CARIES => 'Carie',
            self::FILLED => 'Obturée',
            self::CROWN => 'Couronne',
            self::ROOT_CANAL => 'Dévitalisée',
            self::MISSING => 'Absente',
            self::IMPLANT => 'Implant',
            self::TO_EXTRACT => 'À extraire',
        };
    }
}
