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
        $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|string|email|unique:users',
            'password'        => 'required|string|min:8|confirmed',
            'no_telp'         => 'required',
            'status_penghuni' => 'required|boolean',
            'lokasi_id'       => 'nullable|exists:lokasi_delivery,id',
            'nomor_kamar'     => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone'           => $request->no_telp, 
            'penghuni_asrama'  => $request->status_penghuni,  
            'lokasi_id'        => $request->lokasi_id,        
            'nomor_kamar'      => $request->nomor_kamar,      
            'role_id'          => 3, 
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Akun berhasil dibuat!',
            'user' => $user
        ], 201);
    }
}