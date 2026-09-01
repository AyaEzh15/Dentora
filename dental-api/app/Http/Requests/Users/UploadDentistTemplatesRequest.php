<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class UploadDentistTemplatesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prescription_template' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'invoice_template' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ];
    }
}
