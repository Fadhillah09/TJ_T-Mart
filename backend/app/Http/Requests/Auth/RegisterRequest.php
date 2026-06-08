<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers(),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'nomor_kamar' => ['nullable', 'string', 'max:10'],
            'lokasi_id' => ['nullable', 'integer', 'exists:lokasi_delivery,id'],
            'penghuni_asrama' => ['nullable', 'boolean'],
            'foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ];
    }
}
