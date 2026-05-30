<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Absensi\StoreAbsensiRequest;
use App\Http\Resources\AbsensiResource;
use App\Models\Absensi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    public function store(StoreAbsensiRequest $request): JsonResponse
    {
        $this->authorize('create', Absensi::class);

        $validated = $request->validated();
        $user = $request->user();

        return DB::transaction(function () use ($user, $validated) {
            $today = Carbon::today();

            $existing = Absensi::where('user_id', $user->id)
                ->whereDate('created_at', $today)
                ->lockForUpdate()
                ->latest()
                ->first();

            if ($existing && $existing->jam_pulang !== null) {
                return $this->error('Absensi hari ini sudah lengkap.', null, 409);
            }

            if (! $existing) {
                $now = Carbon::now();
                $batas = Carbon::today()->setTime(8, 0);

                $absensi = Absensi::create([
                    'user_id' => $user->id,
                    'jam_masuk' => $now->format('H:i:s'),
                    'jam_pulang' => null,
                    'status' => $now->greaterThan($batas) ? 'terlambat' : 'tepat_waktu',
                    'koordinat_absen' => $validated['koordinat_absen'],
                ]);

                return $this->success(AbsensiResource::make($absensi), 'Absen masuk berhasil', 201);
            }

            $existing->update([
                'jam_pulang' => Carbon::now()->format('H:i:s'),
            ]);

            return $this->success(AbsensiResource::make($existing->fresh()), 'Absen pulang berhasil');
        });
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Absensi::class);

        $validated = $request->validate([
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'tanggal' => ['sometimes', 'date_format:Y-m-d'],
            'status' => ['sometimes', 'in:tepat_waktu,terlambat,mangkir'],
        ]);

        $absensi = Absensi::query()
            ->with('user:id,name,email,role_id')
            ->when($validated['user_id'] ?? null, fn ($q, $userId) => $q->where('user_id', $userId))
            ->when($validated['tanggal'] ?? null, fn ($q, $tanggal) => $q->whereDate('created_at', $tanggal))
            ->when($validated['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20);

        return $this->success(
            AbsensiResource::collection($absensi)->response()->getData(true),
            'Daftar absensi berhasil diambil'
        );
    }
}
