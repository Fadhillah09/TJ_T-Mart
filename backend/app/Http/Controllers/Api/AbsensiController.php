<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AbsensiController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'koordinat_absen' => ['required', 'string'],
        ]);

        $user = $request->user();
        $today = Carbon::today();

        $absensi = Absensi::where('user_id', $user->id)
            ->whereDate('created_at', $today)
            ->latest()
            ->first();

        if (! $absensi || $absensi->jam_pulang !== null) {
            $now = Carbon::now();
            $batas = Carbon::today()->setTime(8, 0);

            $absensi = Absensi::create([
                'user_id' => $user->id,
                'jam_masuk' => $now->format('H:i:s'),
                'jam_pulang' => null,
                'status' => $now->greaterThan($batas) ? 'terlambat' : 'tepat_waktu',
                'koordinat_absen' => $validated['koordinat_absen'],
            ]);

            return $this->success($absensi, 'Absen masuk berhasil', 201);
        }

        if ($absensi->jam_masuk && ! $absensi->jam_pulang) {
            $absensi->update([
                'jam_pulang' => Carbon::now()->format('H:i:s'),
            ]);

            return $this->success($absensi->fresh(), 'Absen pulang berhasil');
        }

        return $this->error('Absensi hari ini sudah lengkap.', null, 422);
    }

    public function index(Request $request): JsonResponse
    {
        $absensi = Absensi::query()
            ->with('user:id,name,email,role_id')
            ->when($request->user_id, fn ($q, $userId) => $q->where('user_id', $userId))
            ->when($request->tanggal, fn ($q, $tanggal) => $q->whereDate('created_at', $tanggal))
            ->latest()
            ->paginate(20);

        return $this->success($absensi, 'Daftar absensi berhasil diambil');
    }
}
