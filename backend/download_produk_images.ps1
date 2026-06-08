# Script untuk download gambar produk placeholder ke storage Laravel
# Jalankan dari direktori backend

$storageDir = "storage\app\public\produk"
New-Item -ItemType Directory -Force -Path $storageDir | Out-Null

# Map nama file ke URL gambar yang relevan (Picsum = gambar acak tapi konsisten via seed)
$images = @{
    # MAKANAN
    "makanan_indomie.jpg"   = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80&auto=format"
    "makanan_beras.jpg"     = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80&auto=format"
    "makanan_sarden.jpg"    = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80&auto=format"
    "makanan_telur.jpg"     = "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80&auto=format"
    "makanan_kecap.jpg"     = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format"
    "makanan_kornet.jpg"    = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format"
    "makanan_nugget.jpg"    = "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80&auto=format"
    "makanan_minyak.jpg"    = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80&auto=format"
    "makanan_garam.jpg"     = "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80&auto=format"
    "makanan_tepung.jpg"    = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&auto=format"
    # MINUMAN
    "minuman_pocari.jpg"    = "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80&auto=format"
    "minuman_tehbotol.jpg"  = "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80&auto=format"
    "minuman_susu.jpg"      = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&auto=format"
    "minuman_kopi.jpg"      = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format"
    "minuman_yakult.jpg"    = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80&auto=format"
    "minuman_coke.jpg"      = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80&auto=format"
    "minuman_buavita.jpg"   = "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80&auto=format"
    "minuman_milo.jpg"      = "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80&auto=format"
    "minuman_bearbrand.jpg" = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80&auto=format"
    "minuman_aqua.jpg"      = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80&auto=format"
    # ALAT TULIS
    "atk_kertas.jpg"        = "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80&auto=format"
    "atk_pulpen.jpg"        = "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80&auto=format"
    "atk_binder.jpg"        = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80&auto=format"
    "atk_stabilo.jpg"       = "https://images.unsplash.com/photo-1562887009-5e8c9b5c2c8d?w=400&q=80&auto=format"
    "atk_pensil.jpg"        = "https://images.unsplash.com/photo-1615639165765-845e4040892e?w=400&q=80&auto=format"
    "atk_penghapus.jpg"     = "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&q=80&auto=format"
    "atk_penggaris.jpg"     = "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&q=80&auto=format"
    "atk_map.jpg"           = "https://images.unsplash.com/photo-1568667256549-094345857ea7?w=400&q=80&auto=format"
    "atk_tipex.jpg"         = "https://images.unsplash.com/photo-1531346680769-a1d79b57de5e?w=400&q=80&auto=format"
    "atk_postit.jpg"        = "https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=400&q=80&auto=format"
    # SNACK
    "snack_potabee.jpg"     = "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&q=80&auto=format"
    "snack_chitato.jpg"     = "https://images.unsplash.com/photo-1613161966731-ca8ed43a1a48?w=400&q=80&auto=format"
    "snack_pringles.jpg"    = "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&q=80&auto=format"
    "snack_oreo.jpg"        = "https://images.unsplash.com/photo-1585565804112-f201f68c48b4?w=400&q=80&auto=format"
    "snack_chocolate.jpg"   = "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80&auto=format"
    "snack_bengbeng.jpg"    = "https://images.unsplash.com/photo-1548907040-4baf3f9d3f99?w=400&q=80&auto=format"
    "snack_qtela.jpg"       = "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400&q=80&auto=format"
    "snack_kacang.jpg"      = "https://images.unsplash.com/photo-1567349392-d56289cf0da4?w=400&q=80&auto=format"
    "snack_roma.jpg"        = "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80&auto=format"
    "snack_popmie.jpg"      = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80&auto=format"
    # KEBERSIHAN
    "clean_soap.jpg"        = "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80&auto=format"
    "clean_odol.jpg"        = "https://images.unsplash.com/photo-1559591937-abc0c3ba06cd?w=400&q=80&auto=format"
    "clean_shampoo.jpg"     = "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=400&q=80&auto=format"
    "clean_mamalemon.jpg"   = "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80&auto=format"
    "clean_detergen.jpg"    = "https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=400&q=80&auto=format"
    "clean_molto.jpg"       = "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80&auto=format"
    "clean_wipol.jpg"       = "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80&auto=format"
    "clean_stella.jpg"      = "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&q=80&auto=format"
    "clean_harpic.jpg"      = "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&q=80&auto=format"
    "clean_gillete.jpg"     = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80&auto=format"
    # ELEKTRONIK
    "electro_kabel.jpg"     = "https://images.unsplash.com/photo-1588599376829-a68c53bfc1f7?w=400&q=80&auto=format"
    "electro_mouse.jpg"     = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80&auto=format"
    "electro_earphone.jpg"  = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&auto=format"
    "electro_flashdisk.jpg" = "https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?w=400&q=80&auto=format"
    "electro_baterai.jpg"   = "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80&auto=format"
    "electro_colokan.jpg"   = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format"
    # MISC
    "misc_tissue.jpg"       = "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80&auto=format"
    "misc_payung.jpg"       = "https://images.unsplash.com/photo-1532498551838-b7a1cfac622e?w=400&q=80&auto=format"
    "misc_kayuputih.jpg"    = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80&auto=format"
    "misc_sandal.jpg"       = "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&q=80&auto=format"
    "misc_kapas.jpg"        = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80&auto=format"
    "misc_korek.jpg"        = "https://images.unsplash.com/photo-1558618047-f4e75aa89c8e?w=400&q=80&auto=format"
    "misc_gunting.jpg"      = "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=400&q=80&auto=format"
    "misc_plester.jpg"      = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80&auto=format"
    "misc_hanger.jpg"       = "https://images.unsplash.com/photo-1558869602-75e5c4cd2dda?w=400&q=80&auto=format"
}

$client = New-Object System.Net.WebClient
$client.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

$success = 0
$failed = 0

foreach ($file in $images.Keys) {
    $destPath = Join-Path $storageDir $file
    $url = $images[$file]
    
    if (Test-Path $destPath) {
        Write-Host "SKIP (exists): $file" -ForegroundColor Gray
        $success++
        continue
    }
    
    try {
        $client.DownloadFile($url, $destPath)
        Write-Host "OK: $file" -ForegroundColor Green
        $success++
    }
    catch {
        # Fallback: generate colored placeholder using placehold.co
        $encodedName = [uri]::EscapeDataString($file.Replace('.jpg', '').Replace('_', ' '))
        $fallbackUrl = "https://placehold.co/400x300/f9fafb/6b7280?text=$encodedName"
        try {
            $client.DownloadFile($fallbackUrl, $destPath)
            Write-Host "PLACEHOLDER: $file" -ForegroundColor Yellow
            $success++
        }
        catch {
            Write-Host "FAILED: $file - $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    }
    Start-Sleep -Milliseconds 200
}

$client.Dispose()
Write-Host ""
Write-Host "Done! Success: $success, Failed: $failed" -ForegroundColor Cyan
