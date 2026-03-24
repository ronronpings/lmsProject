<?php

namespace App\Http\Requests\Account;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LessonStoreRequest extends FormRequest
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
            'title' => ['required','string','max:255'],
            'chapter_id' => ['required','exists:chapters,id'],
            'sort_order' => ['nullable','integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required.',
            'title.string' => 'Title must be a string.',
            'title.max' => 'Title must be less than 255 characters.',
            'chapter_id.required' => 'Chapter is required.',
            'chapter_id.exists' => 'Chapter does not exist.',
            'sort_order.required' => 'Sort order is required.',
            'sort_order.integer' => 'Sort order must be an integer.',
        ];
    }
}
