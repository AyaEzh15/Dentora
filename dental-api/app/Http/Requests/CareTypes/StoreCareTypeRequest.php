<?php

namespace App\Http\Requests\CareTypes;

use Illuminate\Foundation\Http\FormRequest;

class StoreCareTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150', 'unique:care_types,name'],
            'sort_order' => ['sometimes', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
