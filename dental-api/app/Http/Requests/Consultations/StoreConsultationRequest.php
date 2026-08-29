<?php

namespace App\Http\Requests\Consultations;

use App\Enums\ConsultationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConsultationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'integer'],
            'dentist_id' => ['sometimes', 'integer'],
            'appointment_id' => ['nullable', 'integer', 'exists:appointments,id', 'unique:consultations,appointment_id'],
            'care_type_id' => ['nullable', 'integer', 'exists:care_types,id'],
            'consulted_at' => ['sometimes', 'date'],
            'status' => ['sometimes', Rule::enum(ConsultationStatus::class)],
            'chief_complaint' => ['nullable', 'string'],
            'clinical_exam' => ['nullable', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'treatment_notes' => ['nullable', 'string'],
            'recommendations' => ['nullable', 'string'],
            'procedures' => ['sometimes', 'array'],
            'procedures.*.care_type_id' => ['required_with:procedures', 'integer', 'exists:care_types,id'],
            'procedures.*.tooth_number' => ['nullable', 'string', 'max:4'],
            'procedures.*.quantity' => ['sometimes', 'integer', 'min:1'],
            'procedures.*.notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
