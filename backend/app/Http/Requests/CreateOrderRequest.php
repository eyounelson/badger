<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Order amount is required.',
            'amount.numeric' => 'Order amount must be a number.',
            'amount.min' => 'Order amount must be at least 0.',
        ];
    }
}
