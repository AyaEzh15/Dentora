<?php

namespace App\Http\Requests\Appointments;

use App\Enums\AppointmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'integer'],
            'dentist_id' => ['required', 'integer'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'status' => ['sometimes', Rule::enum(AppointmentStatus::class)],
            'reason' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
