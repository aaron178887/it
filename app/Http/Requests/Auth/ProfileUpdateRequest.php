<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = (int) optional($this->user())->id;

        return [
            'name'  => ['required', 'string', 'max:190'],
            'email' => ['required', 'email', 'max:190', Rule::unique('users', 'email')->ignore($userId)],
            'new_password'              => ['nullable', Password::min(8)->mixedCase()->numbers()->symbols(), 'max:200'],
            'new_password_confirmation' => ['nullable', 'same:new_password'],
        ];
    }
}
