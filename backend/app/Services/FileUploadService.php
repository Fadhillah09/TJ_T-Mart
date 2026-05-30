<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;

class FileUploadService
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

    private const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    private const MAX_SIZE_KB = 2048;

    public function uploadImage(UploadedFile $file, string $folder): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $mime = $file->getMimeType();

        if (! in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            throw new InvalidArgumentException('Ekstensi file tidak diizinkan.');
        }

        if (! in_array($mime, self::ALLOWED_MIMES, true)) {
            throw new InvalidArgumentException('Tipe MIME file tidak diizinkan.');
        }

        if ($file->getSize() > self::MAX_SIZE_KB * 1024) {
            throw new InvalidArgumentException('Ukuran file melebihi 2MB.');
        }

        $filename = Str::random(40).'.'.$extension;

        $path = $file->storeAs($folder, $filename, 'public');

        return $path;
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    public function publicUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }
}
