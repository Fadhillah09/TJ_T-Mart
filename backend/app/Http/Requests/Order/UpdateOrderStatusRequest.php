<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()?->role?->name, ['admin', 'superadmin'], true);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:pending,processing,delivering,completed,cancelled'],
            'kurir_id' => ['required_if:status,delivering', 'nullable', 'integer', 'exists:users,id'],
        ];
    }
}
