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
}
