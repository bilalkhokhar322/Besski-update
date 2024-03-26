import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAllowed = localStorage.getItem("token");
  if (!isAllowed) {
    return <Navigate to={"/"} />;
  }
  return children;
}

