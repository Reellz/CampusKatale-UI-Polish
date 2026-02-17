import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import AddListing from "./pages/AddListing";
import Wishlist from "./pages/Wishlist";
import Notifications from "./pages/Notifications";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen font-[Lexend] text-[#177529]">
        Checking authentication...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/add-listing" element={<AddListing />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Optional catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/*<Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/chat/:userId" element={<ChatPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} /> */} 
    </Routes>
  );
}

export default App;
