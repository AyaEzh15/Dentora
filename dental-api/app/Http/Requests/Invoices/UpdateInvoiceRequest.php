<?php

namespace App\Http\Requests\Invoices;

use App\Enums\InvoiceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dentist_id' => ['nullable', 'integer'],
            'issued_at' => ['sometimes', 'date'],
            'status' => ['sometimes', Rule::enum(InvoiceStatus::class)],
            'notes' => ['nullable', 'string'],
            'items' => ['sometimes', 'array'],
            'items.*.care_type_id' => ['nullable', 'integer', 'exists:care_types,id'],
            'items.*.description' => ['required_with:items', 'string', 'max:255'],
            'items.*.tooth_number' => ['nullable', 'string', 'max:4'],
            'items.*.quantity' => ['sometimes', 'integer', 'min:1'],
            'items.*.unit_price' => ['required_with:items', 'numeric', 'min:0'],
        ];
    }
}
