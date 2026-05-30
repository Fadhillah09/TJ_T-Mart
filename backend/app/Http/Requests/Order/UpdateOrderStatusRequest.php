<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('updateStatus', $this->route('id')
            ? \App\Models\RiwayatPembelian::find($this->route('id'))
            : null);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:pending,processing,delivering,completed,cancelled'],
            'kurir_id' => ['required_if:status,delivering', 'nullable', 'integer', 'exists:users,id'],
        ];
    }
}
