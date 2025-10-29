<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name'    => trim((string) $this->input('name', '')),
            'email'   => trim((string) $this->input('email', '')),
            'message' => trim((string) $this->input('message', '')),
        ]);
    }

    public function rules(): array
    {
        return [
            'name'        => ['bail','required','string','max:120'],
            'email'       => ['bail','required','email:rfc,dns','max:190'],
            'message'     => ['bail','required','string','max:5000'],
            'captcha'     => ['bail','required','string','max:20'],
            'captcha_qid' => ['bail','required','string', Rule::in(['q1','q2','q3','q4','q5'])],
            'captcha_sig' => ['bail','required','string','size:64'],
        ];
    }

    public function messages(): array
    {
        return [
            'captcha.required' => 'Vyplňte kontrolní otázku.',
        ];
    }
}
