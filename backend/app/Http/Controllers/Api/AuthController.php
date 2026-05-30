<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuditService;
use App\Services\LoginSecurityService;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;

class AuthController extends Controller
{
    public function __construct(
        private readonly LoginSecurityService $loginSecurity
    ) {}

    /**
     * @OA\Post(
     *     path="/auth/register",
     *     tags={"Auth"},
     *     summary="Register a new customer account",
     *
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/RegisterRequest")),
     *
     *     @OA\Response(response=201, description="Registration successful", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse")),
     *     @OA\Response(response=422, description="Validation error", @OA\JsonContent(ref="#/components/schemas/ApiErrorResponse"))
     * )
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'role_id' => 4,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'] ?? null,
            'nomor_kamar' => $validated['nomor_kamar'] ?? null,
            'penghuni_asrama' => $validated['penghuni_asrama'] ?? false,
            'status' => 'aktif',
        ]);

        $user->sendEmailVerificationNotification();

        AuditService::log('register', User::class, $user->id, $request);

        return $this->success([
            'user' => UserResource::make($user->load('role')),
        ], 'Registrasi berhasil. Silakan verifikasi email Anda.', 201);
    }

    /**
     * @OA\Post(
     *     path="/auth/login",
     *     tags={"Auth"},
     *     summary="Login and obtain Bearer token",
     *
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/LoginRequest")),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Login berhasil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="access_token", type="string", example="1|abc123token"),
     *                 @OA\Property(property="token_type", type="string", example="Bearer")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Invalid credentials"),
     *     @OA\Response(response=429, description="Account locked after failed attempts")
     * )
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $email = $request->input('email');
        $ip = $request->ip();

        if ($this->loginSecurity->isLocked($email, $ip)) {
            return $this->error('Akun terkunci sementara, coba lagi dalam 15 menit', null, 429);
        }

        $user = User::with(['role', 'activeMart'])->where('email', $email)->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            $this->loginSecurity->recordFailedAttempt($email, $ip);

            return $this->error('Email atau password salah.', null, 401);
        }

        if ($user->status === 'suspended') {
            return $this->error('Akun kamu disuspend', null, 403);
        }

        if ($user->status !== 'aktif') {
            return $this->error('Akun tidak aktif.', null, 403);
        }

        $this->loginSecurity->clearAttempts($email, $ip);

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        AuditService::log('login', User::class, $user->id, $request);

        return $this->success([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => UserResource::make($user),
        ], 'Login berhasil');
    }

    /**
     * @OA\Post(
     *     path="/auth/logout",
     *     tags={"Auth"},
     *     summary="Revoke current access token",
     *     security={{"sanctum":{}}},
     *
     *     @OA\Response(response=200, description="Logout successful", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        AuditService::log('logout', User::class, $request->user()->id, $request);

        return $this->success(null, 'Logout berhasil');
    }

    /**
     * @OA\Post(
     *     path="/auth/logout-all",
     *     tags={"Auth"},
     *     summary="Revoke all access tokens for the user",
     *     security={{"sanctum":{}}},
     *
     *     @OA\Response(response=200, description="All sessions terminated", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse"))
     * )
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        AuditService::log('logout_all', User::class, $request->user()->id, $request);

        return $this->success(null, 'Semua sesi berhasil diakhiri');
    }

    /**
     * @OA\Get(
     *     path="/auth/me",
     *     tags={"Auth"},
     *     summary="Get authenticated user profile",
     *     security={{"sanctum":{}}},
     *
     *     @OA\Response(response=200, description="Profile retrieved", @OA\JsonContent(ref="#/components/schemas/ApiSuccessResponse")),
     *     @OA\Response(response=403, description="Email not verified")
     * )
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['role', 'activeMart', 'lokasi']);

        return $this->success(['user' => UserResource::make($user)], 'Profil berhasil diambil');
    }

    public function resendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->error('Email sudah diverifikasi.', null, 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->success(null, 'Link verifikasi telah dikirim ke email Anda.');
    }

    public function verifyEmail(Request $request, string $id, string $hash): JsonResponse
    {
        $user = User::find($id);

        if (! $user || ! hash_equals($hash, sha1($user->getEmailForVerification()))) {
            return $this->error('Link verifikasi tidak valid.', null, 403);
        }

        if (! URL::hasValidSignature($request)) {
            return $this->error('Link verifikasi kedaluwarsa.', null, 403);
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
            AuditService::log('email_verified', User::class, $user->id, $request);
        }

        return $this->success(
            UserResource::make($user->load('role')),
            'Email berhasil diverifikasi'
        );
    }
}
