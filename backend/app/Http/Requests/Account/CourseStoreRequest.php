<?php

namespace App\Http\Requests\Account;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CourseStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required'],
            'category_id' => [ 'nullable', 'integer'],
            'level_id' => [ 'nullable', 'integer'],
            'language_id' => [ 'nullable', 'integer'],
            'description' => ['nullable','string'],
            'price' => ['nullable', 'numeric'],
            'cross_price' => ['nullable', 'numeric'],
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];
    }

    public function messages(): array{
        return [
        'title.required' => 'The title field is required.',

        'category_id.required' => 'The category field is required.',
        'category_id.integer' => 'The category must be a valid number.',

        'level_id.required' => 'The level field is required.',
        'level_id.integer' => 'The level must be a valid number.',

        'language_id.required' => 'The language field is required.',
        'language_id.integer' => 'The language must be a valid number.',

        'image.required' => 'The image field is required.',
        'image.image' => 'The image must be an image.',
        'image.mimes' => 'The image must be a valid image type.',
        'image.max' => 'The image must be less than 2MB.',

    ];
    }
}
