import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import ProductByCategory from "./ProductByCategory";
import ProductById from "./ProductById";
import ProductByPage from "./ProductByPage";
import ProductRange from "./ProductRange";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";
import StockControls from "./StockControls";

const TABS = [
  { key: "category", label: "By Category" },
  { key: "byId", label: "By ID" },
  { key: "byPage", label: "By Page" },
  { key: "range", label: "Price Range" },
  { key: "add", label: "Add Product" },
  { key: "update", label: "Update Product" },
  { key: "delete", label: "Delete Product" },
  // { key: "stock", label: "Adjust Stock" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("category");

  const logout = async () => {
    try {
      const result = await axiosInstance.post("/api/v3/auth/logout");

      toast.success(result.data.payload);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Remove JWT token
      localStorage.removeItem("jwt_token");

      // Redirect to home and replace the dashboard history entry
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "byId":
        return <ProductById />;

      case "byPage":
        return <ProductByPage />;

      case "range":
        return <ProductRange />;

      case "add":
        return <AddProduct />;

      case "update":
        return <UpdateProduct />;

      case "delete":
        return <DeleteProduct />;

      case "stock":
        return <StockControls />;

      case "category":
      default:
        return <ProductByCategory category="FMCG" sorting="ASC" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        <button
          onClick={logout}
          className="text-2xl bg-purple-600 px-3 py-2 rounded-2xl cursor-pointer hover:bg-purple-700 transition-colors duration-150"
        >
          Logout
        </button>
      </div>

      {/* Tab navigation */}
      <nav className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {renderActiveTab()}
    </div>
  );
};

export default Dashboard;
