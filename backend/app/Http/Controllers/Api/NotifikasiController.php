<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $notifications = Notification::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->paginate(20);

        $unreadCount = Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        return $this->success([
            'unread_count' => $unreadCount,
            'notifications' => $notifications,
        ], 'Notifikasi berhasil diambil');
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)->find($id);

        if (! $notification) {
            return $this->error('Notifikasi tidak ditemukan.', null, 404);
        }

        $notification->update(['is_read' => true]);

        return $this->success($notification, 'Notifikasi ditandai sudah dibaca');
    }

    public function markAllRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return $this->success(null, 'Semua notifikasi ditandai sudah dibaca');
    }
}
