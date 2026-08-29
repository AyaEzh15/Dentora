<?php

namespace App\Http\Requests\Appointments;

use App\Enums\AppointmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['sometimes', 'integer'],
            'dentist_id' => ['sometimes', 'integer'],
            'start_at' => ['sometimes', 'date'],
            'end_at' => ['sometimes', 'date', 'after:start_at'],
            'status' => ['sometimes', Rule::enum(AppointmentStatus::class)],
            'reason' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
