<?php

namespace App\Http\Requests\Token;

use Illuminate\Foundation\Http\FormRequest;

class StoreTokenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'nominal' => ['required', 'in:20000,50000,100000,200000,500000'],
            'metode_pembayaran' => ['required', 'in:COD,MIDTRANS'],
        ];
    }
}
