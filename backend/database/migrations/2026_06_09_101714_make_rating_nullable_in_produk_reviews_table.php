<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::table('produk_reviews', function (Blueprint $table) {
        $table->tinyInteger('rating')->nullable()->change();
    });
}

public function down(): void
{
    Schema::table('produk_reviews', function (Blueprint $table) {
        $table->tinyInteger('rating')->nullable(false)->change();
    });
}
};
