<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // Menyerasikan dengan name attribute yang dikirim dari FormData frontend
        $request->validate([
            'name'             => 'required|string|max:255',
            'email'            => 'required|string|email|unique:users',
            'password'         => 'required|string|min:8|confirmed',
            'phone'            => 'required', // Diubah dari no_telp ke phone
            'penghuni_asrama'  => 'required|boolean', // Diubah dari status_penghuni ke penghuni_asrama
            'lokasi_id'        => 'nullable|exists:lokasi_delivery,id',
            'nomor_kamar'      => 'nullable|string',
            'foto'             => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Daftarkan validasi foto profil
        ]);

        // Handle upload foto jika user memasukkan file foto profil
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('avatars', 'public');
        }

        $user = User::create([
            'name'            => $request->name,
            'email'           => $request->email,
            'password'        => Hash::make($request->password),
            'phone'           => $request->phone, 
            'penghuni_asrama' => $request->penghuni_asrama,  
            'lokasi_id'       => $request->lokasi_id,        
            'nomor_kamar'     => $request->nomor_kamar,
            'foto'            => $fotoPath, // Pastikan field 'foto' ini sudah terdaftar di $fillable Model User kamu
            'role_id'         => 3, 
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Akun berhasil dibuat!',
            'user'    => $user
        ], 201);
    }
}