<?php

namespace App\Http\Requests\Produk;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProdukRequest extends FormRequest
{
    public function authorize(): bool
    {
        $produk = $this->route('id')
            ? \App\Models\Produk::find($this->route('id'))
            : null;

        return $produk && $this->user()?->can('update', $produk);
    }

    public function rules(): array
    {
        return [
            'nama_produk' => ['sometimes', 'required', 'string', 'max:255'],
            'kategori_id' => ['sometimes', 'required', 'integer', 'exists:kategori_produk,id'],
            'harga' => ['sometimes', 'required', 'integer', 'min:0'],
            'stok' => ['sometimes', 'required', 'integer', 'min:0'],
            'deskripsi' => ['nullable', 'string', 'max:5000'],
            'gambar' => ['nullable', 'file', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
