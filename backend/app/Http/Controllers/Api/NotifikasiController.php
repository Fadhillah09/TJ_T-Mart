<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotifikasiResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->orderByDesc('created_at')
            ->paginate(20);

        $payload = NotifikasiResource::collection($notifications)->response()->getData(true);

        $unreadCount = $user->notifications()
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => $payload['data'],
            'links' => $payload['links'] ?? null,
            'meta' => array_merge($payload['meta'] ?? [], [
                'unread_count' => $unreadCount,
            ]),
            'message' => 'Notifikasi berhasil diambil',
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $notification->update(['is_read' => true]);

        return $this->success(null, 'Notifikasi ditandai sudah dibaca');
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->notifications()
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return $this->success(null, 'Semua notifikasi ditandai sudah dibaca');
    }
}
