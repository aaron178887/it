<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Service;

class ServiceUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'remove_hero_image' => filter_var($this->input('remove_hero_image', false), FILTER_VALIDATE_BOOLEAN),
            'is_published'      => filter_var($this->input('is_published', $this->input('is_published', false)), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    public function rules(): array
    {
        /** @var Service $service */
        $service = $this->route('service');

        $slugRule = ['required', 'string', 'max:160'];
        if ($service) {
            $slugRule[] = Rule::unique('pages', 'slug')->ignore($service->page->id);
        } else {
            $slugRule[] = Rule::unique('pages', 'slug');
        }

        return [
            'title'             => ['required', 'string', 'max:160'],
            'slug'              => $slugRule,
            'category'          => ['nullable', 'string', 'max:120'],
            'menu_icon_svg'     => ['nullable', 'string', 'max:20000'],
            'hero_title'        => ['required', 'string', 'max:160'],
            'hero_lead'         => ['required', 'string', 'max:2000'],
            'hero_image'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'remove_hero_image' => ['nullable', 'boolean'],
            'data'              => ['required', 'string', 'json'],
            'section_images.*'  => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'is_published'      => ['nullable', 'boolean'],
        ];
    }
}
