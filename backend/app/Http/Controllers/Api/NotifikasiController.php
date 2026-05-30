<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotifikasiResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    /**
     * @OA\Get(
     *     path="/notifikasi",
     *     tags={"Notifikasi"},
     *     summary="List user notifications",
     *     description="Includes unread_count in meta. Paginated 20/page.",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Notification list with meta.unread_count", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/notifikasi/{id}/read",
     *     tags={"Notifikasi"},
     *     summary="Mark notification as read",
     *     description="IDOR-protected: only the notification owner can mark it read.",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Marked as read", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse")),
     *     @OA\Response(response=404, description="Notification not found")
     * )
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $notification->update(['is_read' => true]);

        return $this->success(null, 'Notifikasi ditandai sudah dibaca');
    }

    /**
     * @OA\Put(
     *     path="/notifikasi/read-all",
     *     tags={"Notifikasi"},
     *     summary="Mark all notifications as read",
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="All marked as read", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->notifications()
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return $this->success(null, 'Semua notifikasi ditandai sudah dibaca');
    }
}
