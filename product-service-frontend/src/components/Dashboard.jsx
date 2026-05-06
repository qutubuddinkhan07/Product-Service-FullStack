import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const token = JSON.parse(localStorage.getItem("jwt_token"));
  // console.log(token);

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetch_product_details = async () => {
    try {
      const url = "http://localhost:8080";
      const result = await axios.get(
        `${url}/api/v1.0/product/category?category=FMCG&sorting=ASC`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      setTimeout(() => {
        setProducts(result.data.payload);
        setLoading(false);
      }, 3000);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
    }
  };

  const logout = async () => {
    const url = "http://localhost:8080";
    const result = await axios.post(
      `${url}/api/v3/auth/logout`,
      null, // no request body needed
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      },
    );
    const { data } = result;
    console.log(data.payload);

    toast.success(data.payload);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  useEffect(() => {
    fetch_product_details();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>

        <div>
          <button
            onClick={() => logout()}
            className="text-2xl bg-purple-600 px-3 py-2 rounded-2xl cursor-pointer hover:bg-purple-700 transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">
            Product Details
          </h2>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="text-slate-400 text-sm animate-pulse">
              Loading products...
            </span>
          </div>
        )}

        {error && (
          <div className="m-6 bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && products && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700/50 text-slate-400 uppercase text-xs tracking-wider">
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Price</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Category</th>
                  <th className="px-6 py-3 text-left font-medium">Brand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {products.map((product, index) => (
                  <tr
                    key={product.id ?? index}
                    className="hover:bg-slate-700/40 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-green-400 font-mono">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                      {product.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {product.brand}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && products?.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
