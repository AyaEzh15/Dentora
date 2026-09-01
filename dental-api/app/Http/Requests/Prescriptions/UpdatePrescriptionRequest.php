<?php

namespace App\Http\Requests\Prescriptions;

use App\Enums\PrescriptionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePrescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dentist_id' => ['sometimes', 'integer'],
            'consultation_id' => ['nullable', 'integer'],
            'prescribed_at' => ['sometimes', 'date'],
            'status' => ['sometimes', Rule::enum(PrescriptionStatus::class)],
            'notes' => ['nullable', 'string'],
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.medication' => ['required_with:items', 'string', 'max:255'],
            'items.*.dosage' => ['nullable', 'string', 'max:120'],
            'items.*.frequency' => ['nullable', 'string', 'max:120'],
            'items.*.duration' => ['nullable', 'string', 'max:80'],
            'items.*.quantity' => ['sometimes', 'integer', 'min:1'],
            'items.*.instructions' => ['nullable', 'string', 'max:255'],
        ];
    }
}
