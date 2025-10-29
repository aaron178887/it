<?php

namespace App\Http\Requests\Reference;

use Illuminate\Foundation\Http\FormRequest;

class ReferenceSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'tag'         => ['nullable', 'string', 'max:255'],
            'logo_alt'    => ['nullable', 'string', 'max:255'],
            'logo_file'   => ['nullable', 'file', 'mimetypes:image/png,image/jpeg,image/webp,image/svg+xml', 'max:5120'],
        ];
    }
}
