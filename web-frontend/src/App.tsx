import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "@/pages/Register";
import CustomerHome from "./pages/customer/Home";
import DashboardAdmin from "./pages/admin/Dashboard";
import KurirHome from "./pages/kurir/Home";
import DeliveryMap from "./pages/kurir/DeliveryMap";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import GalonPage from "@/pages/customer/galon/GalonPage";
import TokenPage from "@/pages/customer/token/TokenPage";
import TokenResult from "@/components/token/TokenResult";
import TokenHistory from "@/components/token/TokenHistory";
import ProdukDetail from "./pages/customer/ProdukDetail";
import CheckoutPage from "./pages/customer/checkout";
import KonfirmasiPage from "./pages/customer/Konfirmasi";
import CartPage from "./pages/customer/Cart";
import WishlistPage from "./pages/customer/Wishlist";

import OrderSuccess from "./pages/customer/OrderSuccess";

function App() {
  return (
    <Router>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            fontWeight: "600",
            fontSize: "14px",
            fontFamily: "sans-serif",
            borderRadius: "12px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            padding: "12px 24px",
            border: "1px border-gray-100",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#FFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFF",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/kurir/home" element={<KurirHome />} />
        <Route path="/kurir/delivery-map" element={<DeliveryMap />} />
        <Route
          path="/galon"
          element={
            <ErrorBoundary>
              <GalonPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/token"
          element={
            <ErrorBoundary>
              <TokenPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/token/result/:id"
          element={
            <ErrorBoundary>
              <TokenResult />
            </ErrorBoundary>
          }
        />
        <Route
          path="/token/history"
          element={
            <ErrorBoundary>
              <TokenHistory />
            </ErrorBoundary>
          }
        />
        <Route path="/produk/:id" element={<ProdukDetail />} />
        <Route
          path="/checkout"
          element={
            <ErrorBoundary>
              <CheckoutPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/cart"
          element={
            <ErrorBoundary>
              <CartPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ErrorBoundary>
              <WishlistPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/customer/konfirmasi"
          element={
            <ErrorBoundary>
              <KonfirmasiPage />
            </ErrorBoundary>
          }
        />

        <Route
          path="/order/success"
          element={
            <ErrorBoundary>
              <OrderSuccess />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
