<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::with(['role', 'karyawanProfile.mart'])->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->role_name ?? 'User',
            'gambar' => $user->gambar,
        ];

        // Jika yang login ternyata Kurir, berikan info tambahan (untuk dashboard web)
        if ($user->isKurir() && $user->karyawanProfile) {
            $userData['karyawan_info'] = [
                'nip' => $user->karyawanProfile->nip,
                'gaji' => $user->karyawanProfile->gaji_pokok,
                'status' => $user->karyawanProfile->status_kerja,
                'penugasan_mart' => $user->karyawanProfile->mart->nama_mart ?? 'Belum ditentukan',
            ];
        }

        return response()->json([
            'message' => 'Login Berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $userData
        ]);
    }

    // LOGIN KHUSUS APK (Hanya Role Kurir) Menolak pembeli biasa meskipun password benar. 
    public function loginKurir(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::with(['role', 'karyawanProfile.mart'])->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        if (!$user->isKurir()) {
            return response()->json([
                'message' => 'Akses Ditolak! Akun ini bukan akun Kurir resmi TJ-T Mart.'
            ], 403); 
        }

        // khusus untuk APK Mobile
        return response()->json([
            'message' => 'Selamat datang di Aplikasi Karyawan',
            'token' => $user->createToken('kurir_token')->plainTextToken,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role->role_name,
                'identitas_kurir' => [
                    'nip' => $user->karyawanProfile->nip ?? '-',
                    'mart_tugas' => $user->karyawanProfile->mart->nama_mart ?? 'Belum Ditugaskan',
                    'gaji' => $user->karyawanProfile->gaji_pokok ?? 0,
                    'status' => $user->karyawanProfile->status_kerja ?? 'aktif',
                ]
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout']);
    }

    public function getProfile(Request $request)
{
    $user = $request->user()->load('role', 'karyawanProfile.mart');

    return response()->json([
        'name' => $user->name,
        'role' => [
            'name' => $user->role->role_name
        ],
        'karyawan_profile' => [
            'nip' => $user->karyawanProfile->nip ?? '-',
            'mart' => [
                'nama' => $user->karyawanProfile->mart->nama_mart ?? '-'
            ],
        ],
        'gaji' => 'Rp ' . number_format($user->karyawanProfile->gaji_pokok ?? 0)
    ]);
}

}