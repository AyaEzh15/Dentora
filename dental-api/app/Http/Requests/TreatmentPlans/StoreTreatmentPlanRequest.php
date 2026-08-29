<?php

namespace App\Http\Requests\TreatmentPlans;

use App\Enums\TreatmentPhaseStatus;
use App\Enums\TreatmentPlanStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTreatmentPlanRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::enum(TreatmentPlanStatus::class)],
            'phases' => ['sometimes', 'array'],
            'phases.*.title' => ['required_with:phases', 'string', 'max:180'],
            'phases.*.description' => ['nullable', 'string'],
            'phases.*.sort_order' => ['sometimes', 'integer', 'min:1'],
            'phases.*.status' => ['sometimes', Rule::enum(TreatmentPhaseStatus::class)],
            'phases.*.items' => ['sometimes', 'array'],
            'phases.*.items.*.care_type_id' => ['required', 'integer', 'exists:care_types,id'],
            'phases.*.items.*.tooth_number' => ['nullable', 'string', 'max:4'],
            'phases.*.items.*.notes' => ['nullable', 'string', 'max:255'],
            'phases.*.items.*.status' => ['sometimes', 'string', 'max:30'],
            'phases.*.items.*.estimated_price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
