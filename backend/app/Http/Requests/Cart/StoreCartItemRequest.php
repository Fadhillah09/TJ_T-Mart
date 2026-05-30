<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class StoreCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'produk_id' => ['required', 'integer', 'exists:produk,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
