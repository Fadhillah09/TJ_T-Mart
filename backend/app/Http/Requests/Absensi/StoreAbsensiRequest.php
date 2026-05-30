<?php

namespace App\Http\Requests\Absensi;

use Illuminate\Foundation\Http\FormRequest;

class StoreAbsensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'koordinat_absen' => ['required', 'string', 'regex:/^-?\d+\.\d+,-?\d+\.\d+$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'koordinat_absen.regex' => 'Format koordinat tidak valid. Gunakan format: latitude,longitude (contoh: -6.200000,106.816666).',
        ];
    }
}
