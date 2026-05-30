<?php

namespace App\Http\Requests\Galon;

use Illuminate\Foundation\Http\FormRequest;

class StoreGalonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'nama_galon' => ['required', 'in:Galon Baru + Isi,Galon 19L (Isi Ulang)'],
            'jumlah' => ['required', 'integer', 'min:1', 'max:50'],
            'metode_pembayaran' => ['required', 'in:COD,MIDTRANS'],
            'metode_pengiriman' => ['required', 'in:ambil,antar'],
            'catatan' => ['nullable', 'string', 'max:255'],
        ];
    }
}
