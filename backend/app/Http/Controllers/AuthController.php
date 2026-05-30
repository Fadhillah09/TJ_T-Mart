<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KaryawanProfile;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller {
    public function login(Request $request) {
        $user = User::where('email', $request->email)->first();
        // Cek email dan password Agus dari seeder
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Login Gagal'], 401);
        }

        // Ambil data profil karyawan Agus
        $profile = KaryawanProfile::where('user_id', $user->id)->first();
        
        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'name'  => $user->name,
            'nip'   => $profile->nip,
            'mart'  => $profile->mart_name, // Contoh: T-MART PUTRI
            'gaji'  => 'Rp ' . number_format($profile->gaji_total, 0, ',', '.')
        ]);
    }
}