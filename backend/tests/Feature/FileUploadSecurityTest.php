<?php

namespace Tests\Feature;

use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use Tests\TestCase;

class FileUploadSecurityTest extends TestCase
{
    public function test_rejects_invalid_file_extension(): void
    {
        Storage::fake('public');

        $service = new FileUploadService;
        $file = UploadedFile::fake()->create('malware.exe', 100, 'application/octet-stream');

        $this->expectException(InvalidArgumentException::class);
        $service->uploadImage($file, 'produk');
    }

    public function test_accepts_valid_png_upload(): void
    {
        Storage::fake('public');

        $service = new FileUploadService;
        $file = UploadedFile::fake()->image('product.png', 100, 100);

        $path = $service->uploadImage($file, 'produk');

        $this->assertNotEmpty($path);
        Storage::disk('public')->assertExists($path);
    }
}
