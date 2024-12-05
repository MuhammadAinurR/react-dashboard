import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Profile from "./pages/Profile";
import NotFound from "../pages/NotFound";
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Navbar from "../components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import BindStatus from "@/pages/BindStatus";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppLayout() {
  return (
    <>
      <AppSidebar />
      <main className="w-full bg-gray-200">
        <Navbar />
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/profile"
            element={<ProtectedRoute>{/* <Profile /> */}</ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
