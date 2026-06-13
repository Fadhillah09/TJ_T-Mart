<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function snapProduct(Request $request)
    {
        // Set Midtrans Configuration
        Config::$serverKey = config('services.midtrans.serverKey');
        Config::$isProduction = (bool) config('services.midtrans.isProduction');
        Config::$isSanitized = (bool) config('services.midtrans.isSanitized', true);
        Config::$is3ds = (bool) config('services.midtrans.is3ds', true);

        // Validasi input
        $request->validate([
            'total_amount' => 'required|numeric|min:1',
            'product_id' => 'nullable|integer',
            'qty' => 'nullable|integer',
        ]);

        $orderId = 'PRD-' . strtoupper(uniqid());

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $request->total_amount,
            ],
            'customer_details' => [
                'first_name' => Auth::user()->name,
                'email' => Auth::user()->email,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            return response()->json([
                'snap_token' => $snapToken,
                'order_id' => $orderId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat sesi pembayaran Midtrans: ' . $e->getMessage()
            ], 500);
        }
    }
}
