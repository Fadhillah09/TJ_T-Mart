import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass } from "lucide-react";

// Coordinate constants
const COURIER_START_COORDS: [number, number] = [-6.9755, 107.6315];

// Inline Leaflet Icons (using DivIcon with inline SVG to prevent asset loading issues)
const storeMarkerIcon = L.divIcon({
  html: `<div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-xl text-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  </div>`,
  className: "custom-leaflet-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const customerMarkerIcon = L.divIcon({
  html: `<div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-xl text-white animate-pulse">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
  </div>`,
  className: "custom-leaflet-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const courierMarkerIcon = L.divIcon({
  html: `<div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-xl text-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
  </div>`,
  className: "custom-leaflet-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

interface OrderTrackingMapProps {
  status: string;
  elapsedSeconds: number;
  courier: any;
  martName: string;
  T_MART_COORDS: [number, number];
  CUSTOMER_COORDS: [number, number];
}

// Sub-component to programmatically set map bounds
const MapBoundsFitter: React.FC<{ bounds: [[number, number], [number, number]] }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds[0] && bounds[1]) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
    }
  }, [map, bounds]);
  return null;
};

export const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({
  status,
  elapsedSeconds,
  courier,
  martName,
  T_MART_COORDS,
  CUSTOMER_COORDS,
}) => {
  const interpolatePoints = (start: [number, number], end: [number, number], ratio: number): [number, number] => {
    return [
      start[0] + (end[0] - start[0]) * ratio,
      start[1] + (end[1] - start[1]) * ratio
    ];
  };

  const getCourierCoords = (): [number, number] => {
    if (!courier) return COURIER_START_COORDS;
    const elapsed = elapsedSeconds;
    if (status === "COURIER_ACCEPTED" || status === "COURIER_TO_STORE") {
      const ratio = Math.min(1, Math.max(0, (elapsed - 15) / 15));
      return interpolatePoints(COURIER_START_COORDS, T_MART_COORDS, ratio);
    }
    if (status === "SHOPPING") {
      return T_MART_COORDS;
    }
    if (status === "DELIVERING") {
      const ratio = Math.min(1, Math.max(0, (elapsed - 45) / 30));
      return interpolatePoints(T_MART_COORDS, CUSTOMER_COORDS, ratio);
    }
    if (status === "COMPLETED") {
      return CUSTOMER_COORDS;
    }
    return [courier.lat, courier.lng];
  };

  const courierPos = getCourierCoords();
  const mapCenter: [number, number] = [
    (T_MART_COORDS[0] + CUSTOMER_COORDS[0]) / 2,
    (T_MART_COORDS[1] + CUSTOMER_COORDS[1]) / 2,
  ];

  if (status === "WAITING_COURIER_ACCEPTANCE") {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-fadeIn">
        <div className="p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[350px]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#dc2626]/20 border-t-[#dc2626] animate-spin flex items-center justify-center" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#dc2626] animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-black text-[#5B000B] tracking-tight uppercase">
              Menghubungkan dengan Kurir
            </h3>
            <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
              Sistem sedang menyiarkan pesanan Anda ke kurir-kurir TJ Mart terdekat di area asrama.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-fadeIn">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping shrink-0" />
            Pelacakan Lokasi Kurir
          </h3>
          {courier && (
            <div className="text-right text-[10px] text-gray-500 font-extrabold flex gap-3">
              <span>Jarak: <span className="text-green-600">~420m</span></span>
              <span>Estimasi: <span className="text-green-600">~3 menit</span></span>
            </div>
          )}
        </div>

        {/* Leaflet container */}
        <div className="h-[350px] w-full rounded-2xl overflow-hidden shadow-inner border border-gray-100 relative z-10">
          <MapContainer
            center={mapCenter}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapBoundsFitter bounds={[T_MART_COORDS, CUSTOMER_COORDS]} />

            <Marker position={T_MART_COORDS} icon={storeMarkerIcon}>
              <Popup>
                <p className="text-xs font-bold text-red-600">{martName} (Toko)</p>
              </Popup>
            </Marker>

            <Marker position={CUSTOMER_COORDS} icon={customerMarkerIcon}>
              <Popup>
                <p className="text-xs font-bold text-blue-600">Kamar Anda (Tujuan)</p>
              </Popup>
            </Marker>

            {courier && (
              <Marker position={courierPos} icon={courierMarkerIcon}>
                <Popup>
                  <p className="text-xs font-bold text-green-600">Kurir: {courier.name}</p>
                </Popup>
              </Marker>
            )}

            {/* Draw route lines */}
            {(status === "COURIER_TO_STORE" || status === "COURIER_ACCEPTED") && (
              <Polyline positions={[COURIER_START_COORDS, T_MART_COORDS]} color="#3b82f6" weight={4} dashArray="8, 8" />
            )}
            {status === "SHOPPING" && (
              <Polyline positions={[COURIER_START_COORDS, T_MART_COORDS]} color="#3b82f6" weight={4} opacity={0.4} />
            )}
            {(status === "DELIVERING" || status === "COMPLETED") && (
              <Polyline positions={[T_MART_COORDS, CUSTOMER_COORDS]} color="#22c55e" weight={4} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
