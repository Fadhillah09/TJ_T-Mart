import { useAuthStore } from '@/store/authStore';

const InfoPenghuni = () => {
  const { user } = useAuthStore();

  const items = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      ),
      label: 'Nama Lengkap',
      value: user?.name ?? '-',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
             m-5 0v-2a2 2 0 012-2h10a2 2 0 012 2v2M7 5h10" />
      ),
      label: 'Gedung Asrama',
      value: user?.lokasi?.nama_lokasi ?? '-',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h.01M12 7h.01M16 7h.01M21 12v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3
             m18-4a2 2 0 00-2-2H5a2 2 0 00-2 2m18 0h.01M19 19H5" />
      ),
      label: 'Nomor Kamar',
      value: user?.nomor_kamar ?? '-',
    },
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] mb-10 border-2 border-[#dc2626]/10
                    shadow-xl shadow-[#dc2626]/10 transition-all duration-300
                    hover:shadow-2xl hover:shadow-[#dc2626]/15">

      {/* Header */}
      <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
        <div className="p-3 rounded-full mr-4 bg-[#dc2626] text-white shadow-lg shadow-[#dc2626]/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5.121 17.804A13.935 13.935 0 0112 16c2.585 0 5.013.84 6.942 2.227
                 M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-wider text-gray-900">
          Informasi Penghuni Asrama
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.label}
            className="p-4 rounded-xl border-l-4 border-[#dc2626]/80 bg-red-50/50
                       shadow-md shadow-gray-200/50 transition-all duration-200
                       hover:bg-red-50 hover:shadow-lg">
            <div className="flex items-center mb-1">
              <svg className="w-4 h-4 mr-2 text-[#dc2626]" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              <p className="text-xs font-bold uppercase tracking-widest text-[#dc2626]">
                {item.label}
              </p>
            </div>
            <p className="font-extrabold text-gray-900 text-lg ml-6">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoPenghuni;