<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreRiwayatPembelianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'tipe_layanan' => ['required', 'in:pickup,delivery'],
            'metode_pembayaran' => ['required', 'in:COD,MIDTRANS'],
            'alamat_pengantaran' => ['required_if:tipe_layanan,delivery', 'nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.produk_id' => ['required', 'integer', 'exists:produk,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
