import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Map from "./pages/Map";
import Today from "./pages/Today";
import Favorites from "./pages/Favorites";
import RegisterVenue from "./pages/RegisterVenue";
import Login from "./pages/Login";
import { AuthProvider } from '@/providers/AuthProvider';
import { Auth } from './components/Auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<Map />} />
              <Route path="/today" element={<Today />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Auth />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedAdminRoute>
                    <Admin />
                  </ProtectedAdminRoute>
                } 
              />
              <Route path="/register-venue" element={
                <ProtectedRoute>
                  <RegisterVenue />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
