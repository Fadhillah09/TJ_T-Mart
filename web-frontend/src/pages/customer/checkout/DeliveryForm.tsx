import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CheckoutForm, CheckoutErrors } from "@/types";
import { MapPin } from "lucide-react";

// Marker icon setup
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const GEDUNG_COORDINATES: Record<string, [number, number]> = {
  "Gedung 1": [-6.9710403, 107.6283141],
  "Gedung 2": [-6.9707509, 107.6283404],
  "Gedung 3": [-6.9704344, 107.6283533],
  "Gedung 4": [-6.9709904, 107.6277174],
  "Gedung 5": [-6.9706729, 107.627767],
  "Gedung 6": [-6.970935, 107.6271111],
  "Gedung 7": [-6.9706223, 107.6271815],
  "Gedung 8": [-6.9702831, 107.6272323],
  "Gedung 9": [-6.9700347, 107.6277742],
  "Gedung 10": [-6.9697409, 107.6278167],
  "Gedung 11": [-6.9700978, 107.6283584],
  "Gedung 12": [-6.9697555, 107.6283976],
  "Gedung A": [-6.9740468, 107.6285963],
  "Gedung B": [-6.9736757, 107.6286558],
  "Gedung C": [-6.9732535, 107.6287044],
  "Gedung D": [-6.9728527, 107.6286204],
  "Gedung E": [-6.9725544, 107.6286242],
  "Gedung F": [-6.9720839, 107.6286579],
};

const LIST_GEDUNG = Object.keys(GEDUNG_COORDINATES);

interface DeliveryFormProps {
  form: CheckoutForm;
  errors: CheckoutErrors;
  onChange: (field: keyof CheckoutForm, value: string | number) => void;
  selectedGedung: string;
  setSelectedGedung: (gedung: string) => void;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  form,
  errors,
  onChange,
  selectedGedung,
  setSelectedGedung,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGedung, setTempGedung] = useState(selectedGedung);
  const [tempKamar, setTempKamar] = useState(form.kamar);

  useEffect(() => {
    setTempGedung(selectedGedung);
    setTempKamar(form.kamar);
  }, [selectedGedung, form.kamar]);

  const activeCoordinate = GEDUNG_COORDINATES[selectedGedung] || [-6.9740, 107.6303];

  const handleSave = () => {
    if (!tempKamar.trim()) {
      alert("Nomor kamar wajib diisi!");
      return;
    }
    setSelectedGedung(tempGedung);
    onChange("kamar", tempKamar);
    setIsEditing(false);
  };

  return (
    <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
      {/* Tab toggle */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full">
        <button
          type="button"
          aria-label="Pengiriman ke Asrama"
          aria-pressed={form.type === "delivery"}
          onClick={() => onChange("type", "delivery")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
            form.type === "delivery"
              ? "bg-red-600 text-white shadow-md shadow-red-900/20"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          Delivery
        </button>
        <button
          type="button"
          aria-label="Ambil Sendiri di Mart"
          aria-pressed={form.type === "takeaway"}
          onClick={() => onChange("type", "takeaway")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
            form.type === "takeaway"
              ? "bg-red-600 text-white shadow-md shadow-red-900/20"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
          }`}
        >
          Takeaway
        </button>
      </div>

      {form.type === "delivery" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#5B000B]">
              <MapPin size={16} className="text-red-600" />
              <span>Lokasi Pengantaran</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              {isEditing ? "Batal" : "Ganti Lokasi"}
            </button>
          </div>

          {/* Current Saved Location Info Box */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4">
            <h4 className="font-extrabold text-[#5B000B] text-sm">
              {selectedGedung || "Gedung Belum Dipilih"}, Kamar {form.kamar || "-"}
            </h4>
            <p className="text-[10px] text-gray-500 mt-1 font-medium italic">
              *Pastikan nomor kamar sudah benar untuk memudahkan kurir
            </p>
            {errors.kamar && (
              <p className="text-xs text-red-600 mt-1 font-semibold" role="alert">
                {errors.kamar}
              </p>
            )}
          </div>

          {/* Map Preview */}
          <div className="h-60 rounded-2xl overflow-hidden border border-gray-200 relative z-0">
            <MapContainer
              key={activeCoordinate.join(",")}
              center={activeCoordinate}
              zoom={17}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={activeCoordinate}>
                <Popup>
                  <span className="font-bold text-xs">
                    {selectedGedung}, Kamar {form.kamar}
                  </span>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Form edit lokasi */}
          {isEditing && (
            <div className="p-4 border border-gray-100 rounded-2xl space-y-4 bg-gray-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="select-gedung" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    Pilih Gedung
                  </label>
                  <select
                    id="select-gedung"
                    value={tempGedung}
                    onChange={(e) => setTempGedung(e.target.value)}
                    className="w-full p-3 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  >
                    {LIST_GEDUNG.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="input-kamar" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    No. Kamar
                  </label>
                  <input
                    id="input-kamar"
                    type="text"
                    placeholder="Contoh: 205"
                    value={tempKamar}
                    onChange={(e) => setTempKamar(e.target.value)}
                    className="w-full p-3 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl transition-all shadow-md shadow-red-900/10 uppercase tracking-wider"
              >
                Simpan Perubahan Lokasi
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center">
          <p className="text-xs font-semibold text-gray-600">
            Anda memilih metode <span className="font-extrabold text-[#5B000B]">Takeaway</span>.
            Silakan ambil pesanan Anda langsung di Mart setelah status pesanan selesai diproses.
          </p>
        </div>
      )}
    </section>
  );
};
