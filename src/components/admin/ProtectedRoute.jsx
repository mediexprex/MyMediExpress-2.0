import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { listenAuth } from "../../services/authService";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = listenAuth((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Checking authentication
  if (user === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        Checking Authentication...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in
  return children;
}

export default ProtectedRoute;