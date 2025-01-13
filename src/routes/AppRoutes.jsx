import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Profile from "./pages/Profile";
import NotFound from "../pages/NotFound";
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import BindStatus from "@/pages/BindPage";
import EventPage from "@/pages/EventPage";
import SendCashbackPage from "@/pages/SendCashbackPage";
import ReferralCodesPage from "@/pages/ReferralCodesPage";
import PlatformPage from "@/pages/PlatformPage";
import UserPlatformWalletPage from "@/pages/UserPlatformWalletPage";
import WithdrawHistoryPage from "@/pages/WithdrawHistoryPage";
import { Navbar } from "@/components/Navbar";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <SidebarProvider>
                <AppLayout />
              </SidebarProvider>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="flex w-screen pt-16">
        <AppSidebar />
        <main className="w-full bg-gray-200">
          <div className="md:hidden fixed p-2 bottom-3 left-3 bg-gray-700 hover:bg-white rounded-full">
            <SidebarTrigger />
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/platforms" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bind-status"
              element={
                <ProtectedRoute>
                  <BindStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/send-cashback"
              element={
                <ProtectedRoute>
                  <SendCashbackPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/referral-codes"
              element={
                <ProtectedRoute>
                  <ReferralCodesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platforms"
              element={
                <ProtectedRoute>
                  <PlatformPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/platform-wallet"
              element={
                <ProtectedRoute>
                  <UserPlatformWalletPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/withdraw-history"
              element={
                <ProtectedRoute>
                  <WithdrawHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
}
