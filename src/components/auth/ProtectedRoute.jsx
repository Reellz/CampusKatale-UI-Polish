/**
 * ProtectedRoute — redirects unauthenticated users to /auth.
 *
 * Moved from App.jsx into its own file so it can be:
 *   - Imported without importing the entire App router
 *   - Tested in isolation
 *   - Reused in nested route definitions
 */
import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return <LoadingSpinner fullPage label="Checking authentication..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
