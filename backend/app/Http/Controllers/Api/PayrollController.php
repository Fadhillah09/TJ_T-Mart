<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin; // Model Admin yang tadi kita buat
use App\Models\User;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    /**
     * Menampilkan daftar kurir beserta info rekening untuk Super Admin
     */
    public function getKurirForPayroll()
    {
        // Ambil user yang jabatannya 'Kurir' di tabel admins
        $kurirList = Admin::with('user')
            ->where('jabatan', 'LIKE', '%Kurir%')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $kurirList->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->user->name ?? $item->nama_custom,
                    'jabatan' => $item->jabatan,
                    'bank' => $item->nama_bank,
                    'rekening' => $item->nomor_rekening,
                    'gaji_terakhir' => $item->gaji
                ];
            })
        ]);
    }

    /**
     * Simpan/Update Gaji Kurir
     */
    public function storeGaji(Request $request)
    {
        $request->validate([
            'admin_id' => 'required|exists:admins,id',
            'jumlah_gaji' => 'required|numeric'
        ]);

        $admin = Admin::find($request->admin_id);
        $admin->gaji = $request->jumlah_gaji;
        $admin->tanggal_gaji = now();
        $admin->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Gaji berhasil diperbarui untuk ' . $admin->nama_custom
        ]);
    }
}