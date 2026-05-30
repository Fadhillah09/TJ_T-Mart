<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Presensi;
use App\Models\Transaksi; 
use Illuminate\Support\Facades\Auth;

class CourierController extends Controller
{
    public function getProfile()
    {
        $user = Auth::user()->load('adminProfile');

        return response()->json([
            'status' => 'success',
            'data' => [
                'nama' => $user->name,
                'jabatan' => $user->adminProfile->jabatan ?? 'Kurir',
                'bank' => $user->adminProfile->nama_bank ?? '-',
                'nomor_rekening' => $user->adminProfile->nomor_rekening ?? '-',
                'unit' => $user->activeMart->nama_mart ?? 'TJ-T Mart'
            ]
        ]);
    }

 
    public function updateDeliveryStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Dikemas,Diantar,Telah Sampai'
        ]);

        $transaksi = Transaksi::find($id);

        if (!$transaksi) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        $transaksi->status_transaksi = $request->status;
        $transaksi->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status pesanan diperbarui menjadi ' . $request->status,
            'updated_at' => $transaksi->updated_at
        ]);
    }

    public function checkIn(Request $request)
    {
        $user = auth()->user();
        $today = Carbon::today()->toDateString();

        $cek = Presensi::where('user_id', $user->id)->where('tanggal', $today)->first();
        if ($cek) {
            return response()->json(['message' => 'Anda sudah check-in hari ini.'], 400);
        }

        $presensi = Presensi::create([
            'user_id' => $user->id,
            'mart_id' => $user->karyawanProfile->mart_id, 
            'tanggal' => $today,
            'jam_masuk' => Carbon::now()->toTimeString(),
            'status' => 'hadir'
        ]);

        return response()->json(['message' => 'Check-in berhasil!', 'data' => $presensi]);
    }

    // (Scan Presensi Pulang)
    public function checkOut(Request $request)
    {
        $user = auth()->user();
        $today = Carbon::today()->toDateString();

        $presensi = Presensi::where('user_id', $user->id)->where('tanggal', $today)->first();

        if (!$presensi) {
            return response()->json(['message' => 'Anda belum check-in hari ini.'], 400);
        }

        if ($presensi->jam_keluar) {
            return response()->json(['message' => 'Anda sudah check-out.'], 400);
        }

        $presensi->update([
            'jam_keluar' => Carbon::now()->toTimeString()
        ]);

        return response()->json(['message' => 'Check-out berhasil! Hati-hati di jalan.', 'data' => $presensi]);
    }
}