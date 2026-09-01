<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CASH = 'CASH';
    case CARD = 'CARD';
    case CHECK = 'CHECK';
    case TRANSFER = 'TRANSFER';

    public function label(): string
    {
        return match ($this) {
            self::CASH => 'Espèces',
            self::CARD => 'Carte',
            self::CHECK => 'Chèque',
            self::TRANSFER => 'Virement',
        };
    }
}
