import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  ArrowLeft,
  CheckCircle,
  Navigation,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const DeliveryMap = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Diantar");

  // Koordinat Asrama Telkom University (Gedung Asrama A)
  // Tipe data [number, number]
  const centerPosition: [number, number] = [-6.9740468, 107.6285963];

  const handleUpdateStatus = (newStatus: string) => {
    setStatus(newStatus);
    alert(`Status pesanan diperbarui menjadi: ${newStatus}`);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="p-4 flex items-center gap-4 bg-white border-b shadow-sm z-[1000]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <div>
          <h2 className="font-bold text-gray-900 leading-none">
            Detail Pengantaran
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            #ORD-202401 - Gedung Asrama A
          </p>
        </div>
      </div>

      {/* AREA PETA */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={centerPosition}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            {...({ attribution: "&copy; OpenStreetMap contributors" } as any)}
          />
          <Marker position={centerPosition}>
            <Popup>
              <div className="text-center font-sans">
                <span className="font-bold text-[#d50d27]">
                  Tujuan Pengantaran
                </span>
                <br />
                Kamar 302, Gedung A
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        <button className="absolute bottom-6 right-6 bg-[#d50d27] text-white p-4 rounded-full shadow-2xl z-[1000] active:scale-90 transition-transform">
          <MessageCircle size={28} />
        </button>
      </div>

      {/* Panel kontrol kurir */}
      <div className="p-6 bg-white rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-[1000]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600">
              <Navigation size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Estimasi Tiba
              </p>
              <p className="text-sm font-bold text-gray-900">± 5 Menit Lagi</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase border border-green-200">
            {status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleUpdateStatus("Telah Sampai")}
            className="col-span-2 flex items-center justify-center gap-2 bg-[#d50d27] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#d50d27]/30 active:scale-[0.98] transition-all"
          >
            <CheckCircle size={20} />
            Konfirmasi Pesanan Sampai
          </button>

          <button className="bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold text-xs uppercase tracking-tight">
            Hubungi Penjual
          </button>

          <button className="bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold text-xs uppercase tracking-tight">
            Peta Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
