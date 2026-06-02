<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LokasiDeliverySeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $lokasi = [
            ['Gedung A', -6.97404680, 107.62859630, 3],
            ['Gedung B', -6.97367570, 107.62865580, 3],
            ['Gedung C', -6.97325350, 107.62870440, 3],
            ['Gedung D', -6.97285270, 107.62862040, 3],
            ['Gedung E', -6.97255440, 107.62862420, 1],
            ['Gedung F', -6.97208390, 107.62865790, 1],
            ['Gedung 1', -6.97104030, 107.62831410, 1],
            ['Gedung 2', -6.97075090, 107.62834040, 1],
            ['Gedung 3', -6.97043440, 107.62835330, 1],
            ['Gedung 4', -6.97099040, 107.62771740, 1],
            ['Gedung 5', -6.97067290, 107.62776700, 2],
            ['Gedung 6', -6.97093500, 107.62711110, 2],
            ['Gedung 7', -6.97062230, 107.62718150, 2],
            ['Gedung 8', -6.97028310, 107.62723230, 2],
            ['Gedung 9', -6.97003470, 107.62777420, 2],
            ['Gedung 10', -6.96974090, 107.62781670, 2],
            ['Gedung 11', -6.97009780, 107.62835840, 1],
            ['Gedung 12', -6.96975550, 107.62839760, 2],
        ];

        $rows = [];
        foreach ($lokasi as [$nama, $lat, $lng, $martId]) {
            $rows[] = [
                'mart_id' => $martId,
                'nama_lokasi' => $nama,
                'nama_gedung' => $nama,
                'latitude' => $lat,
                'longitude' => $lng,
                'foto' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('lokasi_delivery')->insert($rows);
    }
}
