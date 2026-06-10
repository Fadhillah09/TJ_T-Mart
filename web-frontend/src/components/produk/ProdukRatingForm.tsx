import { useProdukRating } from "@/hooks/useProdukRating";

interface Props {
  produkId: string | undefined;
}

const ProdukRatingForm = ({ produkId }: Props) => {
  const {
    selectedStar,
    setSelectedStar,
    hoveredStar,
    setHoveredStar,
    ratingSuccess,
    ratingError,
    sudahRating,
    ratingMutation,
    komentarText,
    setKomentarText,
    komentarSuccess,
    komentarError,
    komentarMutation,
  } = useProdukRating(produkId);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
      {/* Rating 1x */}
      <div className="space-y-3">
        <div>
          <h3 className="font-black text-gray-800 uppercase tracking-tight text-xs">
            Beri Rating Produk
          </h3>
          <p className="text-[10px] text-gray-400">
            Satu akun hanya bisa memberikan rating satu kali
          </p>
        </div>

        {sudahRating ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-[10px] font-bold text-amber-700 flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            Anda sudah memberikan rating untuk produk ini.
          </div>
        ) : (
          <>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onMouseEnter={() => setHoveredStar(i)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setSelectedStar(i)}
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${(hoveredStar || selectedStar) >= i ? "text-yellow-400 fill-current" : "text-gray-200"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            {selectedStar > 0 && (
              <p className="text-[10px] font-bold text-[#dc2626]">
                {
                  [
                    "",
                    "Sangat Buruk",
                    "Buruk",
                    "Cukup",
                    "Bagus",
                    "Sangat Bagus",
                  ][selectedStar]
                }
              </p>
            )}
            {ratingSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-[10px] font-bold text-green-700">
                ✓ Rating berhasil disimpan!
              </div>
            )}
            {ratingError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-[10px] font-bold text-red-700">
                ✗ {ratingError}
              </div>
            )}
            <button
              disabled={!selectedStar || ratingMutation.isPending}
              onClick={() => ratingMutation.mutate({ rating: selectedStar })}
              className="w-full py-2 font-bold text-white bg-[#dc2626] rounded-xl hover:bg-[#b91c1c] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-xs uppercase tracking-wider shadow-sm"
            >
              {ratingMutation.isPending ? "Menyimpan..." : "Simpan Rating"}
            </button>
          </>
        )}
      </div>

      <div className="border-t border-dashed border-gray-200" />

      {/* Komentar - boleh berkali-kali */}
      <div className="space-y-3">
        <div>
          <h3 className="font-black text-gray-800 uppercase tracking-tight text-xs">
            Tulis Komentar Ulasan
          </h3>
          <p className="text-[10px] text-gray-400">
            Boleh ditulis lebih dari satu kali
          </p>
        </div>
        <textarea
          value={komentarText}
          onChange={(e) => setKomentarText(e.target.value)}
          rows={3}
          placeholder="Bagikan pengalaman belanja Anda tentang produk ini..."
          className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#dc2626] resize-none bg-gray-50/50 font-medium"
        />
        {komentarSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-[10px] font-bold text-green-700">
            ✓ Komentar berhasil dikirim!
          </div>
        )}
        {komentarError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-[10px] font-bold text-red-700">
            ✗ {komentarError}
          </div>
        )}
        <button
          disabled={!komentarText.trim() || komentarMutation.isPending}
          onClick={() => komentarMutation.mutate({ komentar: komentarText })}
          className="w-full py-2.5 font-bold text-white bg-gray-700 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-xs uppercase tracking-wider shadow-sm"
        >
          {komentarMutation.isPending ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </div>
    </div>
  );
};

export default ProdukRatingForm;
