
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BookService from "./pages/BookService";
import BookingConfirmation from "./pages/BookingConfirmation";
import ChooseVehicleType from "./pages/ChooseVehicleType";
import EarnWithUnboxd from "./pages/EarnWithUnboxd";
import CorporateHome from "./pages/CorporateHome";
import CorporateDashboard from "./pages/CorporateDashboard";
import BulkBooking from "./pages/BulkBooking";
import CorporatePartnerships from "./pages/CorporatePartnerships";
import FacilityManagerDashboard from "./pages/FacilityManagerDashboard";
// Added routes for missing pages referenced across the app to prevent broken navigations
import NotFound from "./pages/NotFound";
import ProviderLogin from "./pages/ProviderLogin";
import ProviderDashboard from "./pages/ProviderDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import FindMover from "./pages/FindMover";
import ChooseEarningMethod from "./pages/ChooseEarningMethod";
import BecomeDriver from "./pages/BecomeDriver";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            {/* Auth-related routes used by various buttons/links */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* Provider & driver flows */}
            <Route path="/provider-login" element={<ProviderLogin />} />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            {/* Core booking flows */}
            <Route path="/book-service" element={<BookService />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/choose-vehicle-type" element={<ChooseVehicleType />} />
            <Route path="/choose-earning-method" element={<ChooseEarningMethod />} />
            <Route path="/earn-with-unboxd" element={<EarnWithUnboxd />} />
            <Route path="/find-mover" element={<FindMover />} />
            <Route path="/corporate" element={<CorporateHome />} />
            <Route path="/corporate/dashboard" element={<CorporateDashboard />} />
            <Route path="/corporate/bulk-booking" element={<BulkBooking />} />
            <Route path="/corporate/partnerships" element={<CorporatePartnerships />} />
            <Route path="/facility-dashboard" element={<FacilityManagerDashboard />} />
            {/* Misc */}
            <Route path="/home" element={<HomePage />} />
            {/* Catch-all 404 to avoid blank screens on unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
