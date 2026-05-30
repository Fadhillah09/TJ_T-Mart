<?php

namespace App\Http\Requests\Produk;

use Illuminate\Foundation\Http\FormRequest;

class StoreProdukRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\Produk::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'nama_produk' => ['required', 'string', 'max:255'],
            'kategori_id' => ['required', 'integer', 'exists:kategori_produk,id'],
            'harga' => ['required', 'integer', 'min:0'],
            'stok' => ['required', 'integer', 'min:0'],
            'deskripsi' => ['nullable', 'string', 'max:5000'],
            'gambar' => ['nullable', 'file', 'max:2048'],
        ];
    }
}
