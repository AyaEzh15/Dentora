<?php

namespace App\Http\Requests\Clinical;

use App\Enums\ToothCondition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SyncOdontogramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'teeth' => ['required', 'array', 'min:1'],
            'teeth.*.tooth_number' => ['required', 'string', 'max:4'],
            'teeth.*.condition' => ['required', Rule::enum(ToothCondition::class)],
            'teeth.*.notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
