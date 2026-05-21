import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import AppLayout from "@/components/app/AppLayout";
import ProtectedRoute from "@/components/app/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AdminBookingsPage from "@/pages/AdminBookingsPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminGuestsPage from "@/pages/AdminGuestsPage";
import AdminProfilePage from "@/pages/AdminProfilePage";
import AdminVillaEditorPage from "@/pages/AdminVillaEditorPage";
import AdminVillasPage from "@/pages/AdminVillasPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";
import UserBookingsPage from "@/pages/UserBookingsPage";
import UserDashboardPage from "@/pages/UserDashboardPage";
import UserProfilePage from "@/pages/UserProfilePage";
import VillaDetailPage from "@/pages/VillaDetailPage";
import VillasPage from "@/pages/VillasPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/villas" element={<VillasPage />} />
              <Route path="/villas/:id" element={<VillaDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                <Route path="/dashboard" element={<UserDashboardPage />} />
                <Route path="/bookings" element={<UserBookingsPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/villas" element={<AdminVillasPage />} />
                <Route path="/admin/villas/new" element={<AdminVillaEditorPage />} />
                <Route path="/admin/villas/:id/edit" element={<AdminVillaEditorPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />
                <Route path="/admin/guests" element={<AdminGuestsPage />} />
                <Route path="/admin/profile" element={<AdminProfilePage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
