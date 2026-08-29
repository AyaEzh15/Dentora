<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Clinic>
 */
class ClinicFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('###'),
            'email' => fake()->companyEmail(),
            'phone' => fake()->e164PhoneNumber(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'is_active' => true,
        ];
    }
}
