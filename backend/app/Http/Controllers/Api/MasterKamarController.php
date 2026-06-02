<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MasterKamar;
use Illuminate\Http\JsonResponse;

class MasterKamarController extends Controller
{
    public function index(): JsonResponse
    {
        $kamars = MasterKamar::orderBy('lantai')->orderBy('nomor_kamar')->get();
        return $this->success($kamars, 'Daftar kamar berhasil diambil');
    }
}