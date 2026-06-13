<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$marts = DB::table('mart')->get();
echo "MARTS:\n";
print_r($marts->toArray());

$produkMarts = DB::table('produk_mart')->get();
echo "PRODUK MARTS:\n";
print_r($produkMarts->toArray());

$produk = DB::table('produk')->get();
echo "PRODUK:\n";
print_r($produk->toArray());
