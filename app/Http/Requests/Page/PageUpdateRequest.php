<?php

namespace App\Http\Requests\Page;

use Illuminate\Foundation\Http\FormRequest;

class PageUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $imageRules = ['nullable', 'file', 'mimetypes:image/jpeg,image/png,image/webp', 'max:51200'];

        $rules = [
            'hero_title'    => ['nullable', 'string'],
            'hero_subtitle' => ['nullable', 'string'],
            'hero_image'    => $imageRules,
            'payload'       => ['nullable', 'string'],
        ];

        $slug = (string) $this->route('slug');
        if ($slug === 'o-nas') {
            $rules['about_image']      = $imageRules;
            $rules['gallery_images']   = ['nullable', 'array'];
            $rules['gallery_images.*'] = $imageRules;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [];
    }
}
