import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import Policies from './pages/Policies';
import PolicyDetail from './pages/PolicyDetail';
import Claims from './pages/Claims';
import Rewards from './pages/Rewards';
import FAQ from './pages/FAQ';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-account-otp" element={<CreateAccount />} />
        <Route path="/create-account-password" element={<CreateAccount />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product/:productCode" element={<ProductList />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/policies/:policyNo" element={<PolicyDetail />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/claims/new" element={<div className="min-h-screen flex items-center justify-center font-[Noto_Sans]"><p className="text-[20px] text-[#6e6e6e]">Submit Claim — coming soon</p></div>} />
        <Route path="/claims/:claimId" element={<div className="min-h-screen flex items-center justify-center font-[Noto_Sans]"><p className="text-[20px] text-[#6e6e6e]">Claim Detail — coming soon</p></div>} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/settings" element={<div className="min-h-screen flex items-center justify-center font-[Noto_Sans]"><p className="text-[20px] text-[#6e6e6e]">Settings — coming soon</p></div>} />
        <Route path="/singpass" element={<div className="min-h-screen flex items-center justify-center font-[Noto_Sans]"><p className="text-[20px] text-[#6e6e6e]">Singpass — coming soon</p></div>} />
        <Route path="/singpass-consent" element={<div className="min-h-screen flex items-center justify-center font-[Noto_Sans]"><p className="text-[20px] text-[#6e6e6e]">Singpass Consent — coming soon</p></div>} />
        <Route path="/error" element={<div className="min-h-screen flex items-center justify-center font-[Noto_Sans]"><p className="text-[20px] text-[#dc3545]">An error occurred.</p></div>} />
      </Routes>
    </BrowserRouter>
  );
}
