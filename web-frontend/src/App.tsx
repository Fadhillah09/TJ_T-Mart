import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/admin/Dashboard';
import KurirHome from './pages/kurir/Home';
import DeliveryMap from './pages/kurir/DeliveryMap';
import Register from '@/pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login & Default */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard khusus Super Admin / Admin */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        
        {/* Dashboard & Fitur Kurir Mobile */}
        <Route path="/kurir/home" element={<KurirHome />} />
        <Route path="/kurir/delivery-map" element={<DeliveryMap />} />
      </Routes>
    </Router>
  );
}

export default App;