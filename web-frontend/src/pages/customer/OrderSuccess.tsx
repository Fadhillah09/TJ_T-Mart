import { useMemo, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import Header from "@/components/layout/Header";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";
import { currency } from "@/utils/produkUtils";
import { AlertCircle } from "lucide-react";
import { useOrderTrackingStore } from "@/store/orderTrackingStore";
import { parseGedungFromAddress } from "@/utils/asramaCoords";
import { getStatusConfig } from "@/utils/orderStatusConfig";

// Component imports
import { OrderHero } from "@/components/order/OrderHero";
import { OrderTrackingMap } from "@/components/order/OrderTrackingMap";
import { OrderCourierCard } from "@/components/order/OrderCourierCard";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { OrderItemsList } from "@/components/order/OrderItemsList";
import { OrderReceipt } from "@/components/order/OrderReceipt";
import { OrderSimDashboard } from "@/components/order/OrderSimDashboard";

const MART_COORDS_MAP: Record<number, [number, number]> = {
  1: [-6.9710403, 107.6283141],  // Belakang Gedung 1, Asrama Putra
  2: [-6.9702831, 107.6272323],  // Depan Gedung 8, Asrama Putra
  3: [-6.9740468, 107.6285963],  // Belakang Gedung A, Asrama Putri
};
const DEFAULT_T_MART_COORDS: [number, number] = [-6.9710403, 107.6283141];

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse query params
  const type = searchParams.get("type") || "delivery";
  const amount = parseInt(searchParams.get("amount") || "0", 10);
  const orderIdParam = searchParams.get("order_id") || "";
  const paymentMethod = searchParams.get("payment_method") || "Tunai";
  const addressParam = decodeURIComponent(searchParams.get("address") || "");
  const martIdParam = parseInt(searchParams.get("mart_id") || "0", 10);
  const martNameParam = decodeURIComponent(searchParams.get("mart_name") || "");

  // Query: Fetch user purchases list to search for this order
  const { data: ordersData, refetch } = useQuery({
    queryKey: ["purchaseHistory"],
    queryFn: async () => {
      const res = await api.get("/riwayat-pembelian");
      return res.data?.data?.data || res.data?.data || [];
    },
  });

  // Find the matching order from backend history
  const orderDetail = useMemo(() => {
    if (!ordersData || !orderIdParam) return null;
    return ordersData.find(
      (o: any) =>
        o.order_id === orderIdParam ||
        o.id === parseInt(orderIdParam, 10) ||
        String(o.id) === orderIdParam
    );
  }, [ordersData, orderIdParam]);

  const totalAmount = orderDetail?.total ?? amount;

  // Resolve target coordinates
  const address = addressParam || orderDetail?.alamat_pengantaran || "";
  const CUSTOMER_COORDS = useMemo(() => parseGedungFromAddress(address), [address]);

  // Derive T-Mart coordinates from the mart_id in the order
  const martId: number = martIdParam
    || (orderDetail?.details?.[0]?.produk?.produk_marts?.[0]?.mart_id
    ?? orderDetail?.mart_id
    ?? 1);
  const martName: string = martNameParam
    || (orderDetail?.details?.[0]?.produk?.produk_marts?.[0]?.mart?.nama_mart
    ?? "TJ Mart Putra");
  const T_MART_COORDS: [number, number] = MART_COORDS_MAP[martId] ?? DEFAULT_T_MART_COORDS;

  // Initialize and start order tracking session
  const {
    sessions,
    startTracking,
    tickSession,
    simulateCourierAccepted,
    simulateTimeout
  } = useOrderTrackingStore();

  const session = sessions[orderIdParam] || {
    orderId: orderIdParam,
    status: "WAITING_COURIER_ACCEPTANCE",
    elapsedSeconds: 0,
    countdownTime: 600,
    courier: null,
    refundInfo: null,
  };

  // Synchronize state with backend order status updates if status changes
  useEffect(() => {
    if (orderIdParam) {
      startTracking(orderIdParam, totalAmount);
    }
  }, [orderIdParam, totalAmount, startTracking]);

  // Real-time ticking subscription
  useEffect(() => {
    if (orderIdParam && session.status !== "COMPLETED" && session.status !== "CANCELLED") {
      const interval = setInterval(() => {
        tickSession(orderIdParam);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [orderIdParam, session.status, tickSession]);

  // If backend shows complete/cancel, update frontend store accordingly
  useEffect(() => {
    if (orderDetail?.status) {
      if (orderDetail.status === "completed" && session.status !== "COMPLETED") {
        // Mark as completed without courier photo & vehicle details
        useOrderTrackingStore.setState((state) => ({
          sessions: {
            ...state.sessions,
            [orderIdParam]: {
              ...session,
              status: "COMPLETED",
              elapsedSeconds: 75,
              courier: session.courier || {
                name: "Budi Santoso",
                phone: "0812-3456-7890",
                rating: 4.8,
                lat: CUSTOMER_COORDS[0],
                lng: CUSTOMER_COORDS[1]
              }
            }
          }
        }));
      } else if (orderDetail.status === "cancelled" && session.status !== "CANCELLED") {
        simulateTimeout(orderIdParam);
      }
    }
  }, [orderDetail, orderIdParam, CUSTOMER_COORDS]);

  // Sync state changes with backend to keep db up to date
  const updateBackendStatus = async (newStatus: string, courierId?: number) => {
    if (!orderDetail?.id) return;
    try {
      await api.put(`/admin/riwayat-pembelian/${orderDetail.id}/status`, {
        status: newStatus,
        kurir_id: courierId ?? null
      });
      refetch();
    } catch (err) {
      console.error("Gagal sinkron status ke backend:", err);
    }
  };

  // Sync session state changes to DB on specific milestones
  useEffect(() => {
    if (orderDetail?.id) {
      if (session.status === "CANCELLED" && orderDetail.status !== "cancelled") {
        updateBackendStatus("cancelled");
      } else if (session.status === "DELIVERING" && orderDetail.status !== "delivering") {
        updateBackendStatus("delivering", 4); // Default Courier ID 4
      } else if (session.status === "COMPLETED" && orderDetail.status !== "completed") {
        updateBackendStatus("completed");
      }
    }
  }, [session.status, orderDetail]);

  // Interactive buttons handler with simulated states
  const [callLoading, setCallLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const handleCallDriver = () => {
    setCallLoading(true);
    setTimeout(() => {
      setCallLoading(false);
      window.open(`tel:${session.courier?.phone || "081234567890"}`, "_self");
    }, 800);
  };

  const handleChatDriver = () => {
    setChatLoading(true);
    setTimeout(() => {
      setChatLoading(false);
      const text = encodeURIComponent(`Halo, saya dengan pesanan Invoice #${orderIdParam}.`);
      window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
    }, 800);
  };

  // Rincian Pembelian
  const itemsList = useMemo(() => {
    if (orderDetail?.details) {
      return orderDetail.details.map((d: any) => ({
        name: d.nama_produk || d.produk?.nama_produk || "Produk",
        qty: d.jumlah || d.quantity || 1,
        price: d.harga_satuan || 0,
        subtotal: d.subtotal || 0,
        image_url: d.produk?.gambar_url || "",
        gambar: d.produk?.gambar || "",
        stock: d.produk?.stok ?? 10
      }));
    }
    return [
      {
        name: "Item Belanja",
        qty: 1,
        price: amount > 6000 ? amount - 6000 : amount,
        subtotal: amount > 6000 ? amount - 6000 : amount,
        image_url: "",
        gambar: "",
        stock: 10
      },
    ];
  }, [orderDetail, amount]);

  const serviceFee = orderDetail?.biaya_layanan ?? 1000;
  const shippingFee = orderDetail?.ongkir ?? (type === "delivery" ? 5000 : 0);

  const statusConfig = useMemo(() => getStatusConfig(session.status, address, paymentMethod), [session.status, address, paymentMethod]);

  const handlePrint = () => {
    window.print();
  };

  const handleSpeedUp = () => {
    const steps: Record<string, number> = {
      WAITING_COURIER_ACCEPTANCE: 12,
      COURIER_ACCEPTED: 15,
      COURIER_TO_STORE: 29,
      SHOPPING: 44,
      DELIVERING: 74
    };
    const target = steps[session.status];
    if (target !== undefined) {
      useOrderTrackingStore.setState((state) => ({
        sessions: {
          ...state.sessions,
          [orderIdParam]: {
            ...session,
            elapsedSeconds: target
          }
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none antialiased">
      <Header />
      <SubHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-8 print:pt-4 print:pb-4">
        
        {/* 1. Hero Section */}
        <OrderHero
          status={session.status}
          countdownTime={session.countdownTime}
          orderIdParam={orderIdParam}
          martName={martName}
          paymentMethod={paymentMethod}
          statusConfig={statusConfig}
          simulateCourierAccepted={simulateCourierAccepted}
          simulateTimeout={simulateTimeout}
        />

        {/* Outer Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Sisi Kiri (Map, Courier Card, Timeline, Products) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 2. Interactive Map (Leaflet) / Cancelled State */}
            {session.status === "CANCELLED" ? (
              (() => {
                const isCOD = paymentMethod.toLowerCase().includes("cod") || paymentMethod.toLowerCase().includes("tunai");
                return (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6 animate-fadeIn">
                    <div className="flex items-start gap-4 p-4 bg-red-50 text-red-800 rounded-2xl border border-red-100">
                      <AlertCircle className="w-8 h-8 shrink-0 text-red-600 mt-1" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-black uppercase tracking-wider">
                          {isCOD ? "Pesanan Dibatalkan" : "Dana Sedang Dikembalikan"}
                        </h3>
                        <p className="text-xs text-red-600 font-semibold leading-relaxed">
                          {isCOD
                            ? "Pesanan Anda telah dibatalkan karena tidak menemukan kurir. Tidak ada pengembalian dana yang diperlukan untuk metode pembayaran COD (Bayar di Tempat)."
                            : `Refund sebesar ${currency(totalAmount)} sedang ditransfer kembali ke metode pembayaran Anda.`}
                        </p>
                      </div>
                    </div>

                    {/* Refund Status Steps */}
                    {!isCOD && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                          Pelacakan Refund Dana
                        </h4>
                        <div className="space-y-6 border-l-2 border-red-200 ml-4 pl-6 relative">
                          {session.refundInfo?.trackingSteps.map((step, idx) => (
                            <div key={idx} className="relative">
                              <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                                step.status === "completed" ? "bg-red-600 border-white text-white" :
                                step.status === "current" ? "bg-white border-red-600 text-red-600" :
                                "bg-white border-gray-200 text-gray-300"
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  step.status === "completed" ? "bg-white" :
                                  step.status === "current" ? "bg-red-600 animate-ping" :
                                  "bg-gray-200"
                                }`} />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <p className={`text-xs font-bold ${step.status !== "pending" ? "text-gray-900" : "text-gray-400"}`}>
                                    {step.title}
                                  </p>
                                  {step.time && <span className="text-[10px] text-gray-400 font-semibold">{step.time}</span>}
                                </div>
                                <p className="text-[11px] text-gray-500 leading-snug font-medium">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <OrderTrackingMap
                status={session.status}
                elapsedSeconds={session.elapsedSeconds}
                courier={session.courier}
                martName={martName}
                T_MART_COORDS={T_MART_COORDS}
                CUSTOMER_COORDS={CUSTOMER_COORDS}
              />
            )}

            {/* 3. Courier Information Card */}
            {session.courier && session.status !== "CANCELLED" && (
              <OrderCourierCard
                courier={session.courier}
                callLoading={callLoading}
                chatLoading={chatLoading}
                handleCallDriver={handleCallDriver}
                handleChatDriver={handleChatDriver}
              />
            )}

            {/* 4. Tracking Timeline */}
            <OrderTimeline
              sessionStatus={session.status}
              heroGradient={statusConfig.heroGradient}
            />

            {/* 5. Product List Section */}
            <OrderItemsList itemsList={itemsList} />

          </div>

          {/* Sisi Kanan (Digital Print Receipt) */}
          <div className="lg:col-span-1 space-y-6">
            <OrderReceipt
              status={session.status}
              orderDetail={orderDetail}
              paymentMethod={paymentMethod}
              addressParam={addressParam}
              itemsList={itemsList}
              serviceFee={serviceFee}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
              statusConfig={statusConfig}
              handlePrint={handlePrint}
              navigateHome={() => navigate("/")}
            />
          </div>

        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
      
      {/* Simulation overlay dashboard for evaluators */}
      <OrderSimDashboard
        status={session.status}
        elapsedSeconds={session.elapsedSeconds}
        orderIdParam={orderIdParam}
        simulateCourierAccepted={simulateCourierAccepted}
        simulateTimeout={simulateTimeout}
        onSpeedUp={handleSpeedUp}
      />

    </div>
  );
}
