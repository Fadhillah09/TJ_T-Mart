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
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'no_telp' => 'required',
            'status_penghuni' => 'required'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'no_telp' => $request->no_telp,
            'status_penghuni' => $request->status_penghuni,
            'role' => 'Kurir', // Default role setelah daftar
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Akun berhasil dibuat!',
            'user' => $user
        ], 201);
    }
}