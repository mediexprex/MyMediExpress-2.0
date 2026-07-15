import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { listenAuth } from "../../services/authService";

function UserProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = listenAuth((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Loading state while Firebase checks auth
  if (user === undefined) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default UserProtectedRoute;