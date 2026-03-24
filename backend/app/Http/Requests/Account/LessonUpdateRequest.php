<?php

namespace App\Http\Requests\Account;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LessonUpdateRequest extends FormRequest
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
            //
            'title' => ['required','string','max:255'],
            'chapter_id' => ['required','exists:chapters,id'],
            'is_free_preview' => ['required','boolean'],
            'description'=> ['required'],
            'duration'=> ['required', 'numeric'],
            'status' => ['required'],
        ];
    }
}
