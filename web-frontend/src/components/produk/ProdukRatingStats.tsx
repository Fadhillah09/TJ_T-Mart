import StarIcon from "@/utils/StarIcon";

interface Props {
  avgRating: number;
  ulasanList: any[];
}

const ProdukRatingStats = ({ avgRating, ulasanList }: Props) => {
  const ratingDist = [5, 4, 3, 2, 1].map((star) => {
    const count = ulasanList.filter(
      (r: any) => Number(r.rating) === star,
    ).length;
    const pct =
      ulasanList.length > 0 ? Math.round((count / ulasanList.length) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
        <div className="text-center min-w-[72px]">
          <p className="text-4xl font-black text-gray-900 leading-none">
            {avgRating.toFixed(1)}
          </p>
          <div className="flex justify-center mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} filled={avgRating >= i} size="w-4 h-4" />
            ))}
          </div>
          <p className="text-[9px] text-gray-400 font-bold mt-1">
            {ulasanList.length} ulasan
          </p>
        </div>
        <div className="flex-1 space-y-1.5">
          {ratingDist.map(({ star, pct }) => (
            <div
              key={star}
              className="flex items-center gap-2 text-[10px] font-bold text-gray-500"
            >
              <span className="w-3 text-right">{star}</span>
              <StarIcon filled size="w-2.5 h-2.5" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-7 text-right text-gray-400">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Ulasan Pelanggan:
        </h5>
        {ulasanList.length === 0 ? (
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-center text-gray-400 italic font-medium">
            Belum ada komentar ulasan pada produk ini.
          </div>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {ulasanList.map((r: any, i: number) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-black text-gray-700">
                  {r.user?.name ?? r.user?.nama ?? r.nama ?? "Anonim"}
                </span>
                {r.komentar && (
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                    {r.komentar}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdukRatingStats;
