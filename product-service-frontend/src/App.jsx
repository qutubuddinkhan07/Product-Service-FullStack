import React from "react";
import Login from "./components/Login";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/Register";
import PageNotFound from "./components/PageNotFound";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={route} />

      <ToastContainer />
    </div>
  );
};

export default App;
