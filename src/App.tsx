import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DashboardHome from "./pages/DashboardHome";
import Pricing from "./pages/Pricing";
// import CommandsPage from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import Support from "./pages/Support";
import Commands from "./pages/Commands";
import About from "./pages/About";
import { useEffect } from "react";
import "@/lib/env"; // Import environment validation

const queryClient = new QueryClient();

// Component to handle document title updates and scroll to top
const DocumentTitle = () => {
  const location = useLocation();

    useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'BuildForMe - Premium Discord Bot Dashboard',
      '/auth': 'Sign In - BuildForMe',
      '/dashboard': 'Dashboard - BuildForMe',
      '/pricing': 'Pricing - BuildForMe',
        // Keep legacy path pointing to same title, but we route to /commands below
        '/documentation': 'Commands - BuildForMe',
      '/support': 'Support - BuildForMe',
      '/commands': 'Commands - BuildForMe',
    };

    const title = titles[location.pathname] || 'BuildForMe';
    document.title = title;
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

// Main layout component
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-pure-black text-foreground flex flex-col">
      <Navbar />
      {/* Account for fixed header height */}
      <main className="flex-1 pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Layout without Navbar or Footer
const NoNavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-pure-black text-foreground flex flex-col">
      <main className="flex-1 flex flex-col justify-center items-center">
        {children}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2c2f33',
            border: '1px solid rgba(153, 170, 181, 0.2)',
            color: '#f4f4f4',
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <DocumentTitle />
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <MainLayout>
                <Index />
              </MainLayout>
            } />
            <Route path="/pricing" element={
              <MainLayout>
                <Pricing />
              </MainLayout>
            } />
            <Route path="/about" element={
              <MainLayout>
                <About />
              </MainLayout>
            } />

            <Route path="/auth" element={
              <PublicRoute>
                <NoNavLayout>
                  <Auth />
                </NoNavLayout>
              </PublicRoute>
            } />
            
            {/* Policy pages */}
            <Route path="/terms" element={
              <MainLayout>
                <TermsOfService />
              </MainLayout>
            } />
            <Route path="/privacy" element={
              <MainLayout>
                <PrivacyPolicy />
              </MainLayout>
            } />
            <Route path="/returns" element={
              <MainLayout>
                <ReturnPolicy />
              </MainLayout>
            } />
            <Route path="/support" element={
              <MainLayout>
                <Support />
              </MainLayout>
            } />
            <Route path="/commands" element={
              <MainLayout>
                <Commands />
              </MainLayout>
            } />
            <Route path="/documentation" element={<Navigate to="/commands" replace />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ErrorBoundary>
                    <DashboardHome />
                    </ErrorBoundary>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={
              <MainLayout>
                <NotFound />
              </MainLayout>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
