import { BrowserRouter, Routes, Route } from "react-router-dom";

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
      <AppSidebar />
      <main className="w-full bg-gray-200">
        <div className="md:hidden fixed p-2 bottom-3 left-3 bg-gray-700 hover:bg-white rounded-full">
          <SidebarTrigger />
        </div>
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
            path="/events"
            element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProtectedRoute>{/* <Profile /> */}</ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
