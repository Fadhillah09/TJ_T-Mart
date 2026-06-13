import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import api from "@/api/axiosConfig";
import { produkApi } from "@/api/produk";
import { cartApi } from "@/api/cart";
import { orderApi } from "@/api/order";
import { useMartStore } from "@/store/martStore";
import { useToast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeliveryForm } from "./DeliveryForm";
import { CartItemGroup } from "./CartItemGroup";
import { OrderSummary } from "./OrderSummary";
import { groupCartByMart, calcOrderTotal, sanitizeForm } from "@/utils/helpers";
import { CheckoutForm, CheckoutErrors, CartItem } from "@/types";
import { ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import SubHeader from "@/components/layout/SubHeader";
import Footer from "@/components/layout/Footer";

// Zod Validation Schema
const checkoutSchema = z.object({
  type: z.enum(["delivery", "takeaway"]),
  mart_id: z.number({ required_error: "Pilih mart terlebih dahulu" }),
  kamar: z.string().optional(),
  payment_method: z.enum(["cod", "transfer"]),
  note: z.string().max(255).optional(),
}).superRefine((data, ctx) => {
  if (data.type === "delivery" && !data.kamar?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["kamar"],
      message: "Nomor kamar wajib diisi untuk pengiriman",
    });
  }
});

export default function CheckoutPage() {
  const location = useLocation();
  const buyNowState = location.state as { produk_id?: number; qty?: number } | null;

  const navigate = useNavigate();
  const toast = useToast();
  const { activeMart } = useMartStore();

  const [form, setForm] = useState<CheckoutForm>({
    type: "delivery",
    mart_id: activeMart?.id || 1,
    kamar: "",
    payment_method: "cod",
    note: "",
  });

  const [selectedGedung, setSelectedGedung] = useState("");
  const [errors, setErrors] = useState<CheckoutErrors>({});

  // Query: Get Cart Items
  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    enabled: !buyNowState?.produk_id,
  });

  // Query: Get single product detail if in Buy Now mode
  const { data: buyNowProductData, isLoading: isBuyNowLoading } = useQuery({
    queryKey: ["produk", buyNowState?.produk_id],
    queryFn: () => produkApi.getProdukDetail(buyNowState!.produk_id!),
    enabled: !!buyNowState?.produk_id,
  });

  // Query: Get Profile info
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await api.get("/user/profile");
      return res.data?.data;
    },
  });

  // Sync profile data to form once loaded
  useEffect(() => {
    if (profileData) {
      setForm((prev) => ({
        ...prev,
        kamar: profileData.kamar || "",
      }));
      setSelectedGedung(profileData.gedung || "Gedung 6");
    }
  }, [profileData]);

  // Sync mart_id from Buy Now product once loaded
  useEffect(() => {
    if (buyNowState?.produk_id && buyNowProductData?.data) {
      const p = buyNowProductData.data;
      const itemMartId = activeMart?.id || p.produk_marts?.[0]?.mart_id || 1;
      setForm((prev) => ({
        ...prev,
        mart_id: itemMartId,
      }));
    }
  }, [buyNowState, buyNowProductData, activeMart]);

  // Form onChange handler
  const handleChange = (field: keyof CheckoutForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const rawCartItems = cartData?.data?.items || [];

  // Transform BackendCartItem to CheckoutCartItem
  const mappedCartItems: CartItem[] = useMemo(() => {
    if (buyNowState?.produk_id) {
      const p = buyNowProductData?.data;
      if (!p) return [];
      const martId = activeMart?.id || p.produk_marts?.[0]?.mart_id || 1;
      const martName = activeMart?.nama_mart || p.produk_marts?.[0]?.mart?.nama_mart || "Mart";
      return [{
        id: 0,
        product_id: p.id,
        product_name: p.nama_produk || "",
        mart_id: martId,
        mart_name: martName,
        qty: buyNowState.qty || 1,
        price: p.harga || 0,
        image_url: p.gambar_url || "",
      }];
    }

    return rawCartItems.map((item: any) => ({
      id: item.id,
      product_id: item.produk_id,
      product_name: item.produk?.nama_produk || "",
      mart_id: activeMart?.id || item.produk?.produk_marts?.[0]?.mart_id || 1,
      mart_name: activeMart?.nama_mart || item.produk?.produk_marts?.[0]?.mart?.nama_mart || "Mart",
      qty: item.quantity,
      price: item.produk?.harga || 0,
      image_url: item.produk?.gambar_url || "",
    }));
  }, [rawCartItems, buyNowState, buyNowProductData, activeMart]);

  const groupedItems = useMemo(() => groupCartByMart(mappedCartItems), [mappedCartItems]);
  const totals = useMemo(() => calcOrderTotal(mappedCartItems, form.type), [mappedCartItems, form.type]);

  const createOrderMutation = useMutation({
    mutationFn: (payload: any) => orderApi.createOrder(payload),
    onSuccess: (res: any) => {
      toast.success("Pesanan berhasil dibuat!");
      navigate("/customer/konfirmasi", { state: { order_id: res.data?.order_id || res.data?.id } });
    },
    onError: (err: any) => {
      if (err.response?.status === 422) {
        const backendErrors = err.response.data?.errors || {};
        const mappedErrors: CheckoutErrors = {};
        if (backendErrors.alamat_pengantaran) mappedErrors.kamar = backendErrors.alamat_pengantaran[0];
        if (backendErrors.tipe_layanan) mappedErrors.type = backendErrors.tipe_layanan[0];
        if (backendErrors.metode_pembayaran) mappedErrors.payment_method = backendErrors.metode_pembayaran[0];
        setErrors(mappedErrors);
        toast.error("Validasi gagal. Silakan periksa kembali input Anda.");
      } else {
        toast.error(err.response?.data?.message || "Terjadi kesalahan saat membuat pesanan.");
      }
    },
  });

  const handleSubmit = () => {
    const sanitized = sanitizeForm(form);
    const parsed = checkoutSchema.safeParse(sanitized);

    if (!parsed.success) {
      const fieldErrors: CheckoutErrors = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof CheckoutForm;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const payload = {
      tipe_layanan: form.type === "takeaway" ? "pickup" : "delivery",
      metode_pembayaran: form.payment_method === "cod" ? "COD" : "MIDTRANS",
      alamat_pengantaran: form.type === "delivery" ? `${selectedGedung}, Kamar ${form.kamar}` : null,
      items: mappedCartItems.map((item) => ({
        produk_id: item.product_id,
        quantity: item.qty,
      })),
      note: form.note,
    };

    createOrderMutation.mutate(payload);
  };

  const isLoading = (buyNowState?.produk_id ? isBuyNowLoading : isCartLoading) || isProfileLoading;

  if (isLoading) {
    return (
      <>
        <Header />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-60 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-80 rounded-3xl" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (mappedCartItems.length === 0) {
    return (
      <>
        <Header />
        <SubHeader />
        <main className="max-w-7xl mx-auto px-4 pt-32 pb-24 flex items-center justify-center min-h-[50vh]">
          <EmptyState
            icon={<ShoppingBag size={48} />}
            title="Keranjang kamu kosong"
            description="Silakan cari produk pilihan Anda di TJ Mart terlebih dahulu."
            action={
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all active:scale-95 text-xs shadow-md shadow-red-900/10"
              >
                Kembali Belanja
              </button>
            }
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <SubHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
          <span className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => navigate("/")}>Beranda</span>
          <span className="text-gray-300">/</span>
          {buyNowState?.produk_id ? (
            <>
              <span className="hover:text-red-600 cursor-pointer transition-colors max-w-[200px] truncate" onClick={() => navigate(`/produk/${buyNowState.produk_id}`)}>
                {buyNowProductData?.data?.nama_produk || "Produk"}
              </span>
              <span className="text-gray-300">/</span>
            </>
          ) : (
            <>
              <span className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => navigate("/cart")}>
                Keranjang
              </span>
              <span className="text-gray-300">/</span>
            </>
          )}
          <span className="text-[#5B000B]">Checkout</span>
        </nav>

        <h1 className="text-2xl font-extrabold text-[#5B000B] mb-6">
          Checkout Pesanan
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Kiri */}
          <div className="lg:col-span-2 space-y-6">
            <DeliveryForm
              form={form}
              errors={errors}
              onChange={handleChange}
              selectedGedung={selectedGedung}
              setSelectedGedung={setSelectedGedung}
            />
            <CartItemGroup grouped={groupedItems} />
          </div>

          {/* Kanan */}
          <div className="lg:col-span-1">
            <OrderSummary
              totals={totals}
              isSubmitting={createOrderMutation.isPending}
              isDisabled={form.type === "delivery" && !form.kamar.trim()}
              onSubmit={handleSubmit}
              form={form}
              onChange={handleChange}
              errors={errors}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
