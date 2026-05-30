<?php

namespace App\Http\Requests\Galon;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalonStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $transaction = \App\Models\GalonTransaction::find($this->route('id'));

        return $transaction && $this->user()?->can('updateStatus', $transaction);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:pending,paid,delivering,completed,cancelled'],
        ];
    }
}
