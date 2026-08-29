<?php

namespace Database\Seeders;

use App\Models\CareType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CareTypeSeeder extends Seeder
{
    public const NAMES = [
        'Consultation dentaire',
        'Consultation d’urgence',
        'Détartrage',
        'Polissage dentaire',
        'Traitement de carie',
        'Plombage / obturation',
        'Composite dentaire',
        'Dévitalisation',
        'Traitement de canal',
        'Retraitement endodontique',
        'Extraction dentaire',
        'Extraction de dent de sagesse',
        'Drainage d’abcès',
        'Traitement de gingivite',
        'Traitement de parodontite',
        'Surfaçage radiculaire',
        'Blanchiment dentaire',
        'Facette dentaire',
        'Couronne dentaire',
        'Bridge dentaire',
        'Inlay / Onlay',
        'Prothèse dentaire complète',
        'Prothèse dentaire partielle',
        'Réparation de prothèse',
        'Implant dentaire',
        'Couronne sur implant',
        'Greffe osseuse',
        'Appareil orthodontique',
        'Gouttières / aligneurs',
        'Contention orthodontique',
        'Scellement des sillons',
        'Application de fluor',
        'Pulpotomie',
        'Soins des dents de lait',
        'Reconstruction dentaire',
        'Reconstitution corono-radiculaire',
        'Traitement d’une dent cassée',
        'Traitement d’un traumatisme dentaire',
        'Radiographie dentaire',
        'Radiographie panoramique',
        'CBCT / scanner dentaire',
        'Empreinte dentaire',
        'Gouttière de bruxisme',
        'Gouttière de blanchiment',
        'Curetage dentaire',
        'Chirurgie apicale',
        'Freinectomie',
        'Gingivectomie',
        'Allongement coronaire',
        'Pose de bijou dentaire',
    ];

    public function run(): void
    {
        foreach (self::NAMES as $index => $name) {
            CareType::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}
