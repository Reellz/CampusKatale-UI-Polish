/**
 * RoleGuard — extends ProtectedRoute with Clerk publicMetadata role checking.
 *
 * Moved from App.jsx (inline definition) into its own file, replacing the
 * unused src/components/RoleGuard.jsx that was previously exported but never
 * imported anywhere.
 *
 * Props:
 *   allowedRoles - string[] of roles that may access the route
 *   fallback     - redirect path if role doesn't match (default: "/")
 *   children     - route content
 */
import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";

function RoleGuard({ allowedRoles, fallback = "/", children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <LoadingSpinner fullPage label="Checking authentication..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const role = user?.publicMetadata?.role;

  if (!allowedRoles.includes(role)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}

export default RoleGuard;
