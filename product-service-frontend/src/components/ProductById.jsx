import { useState } from "react";
import { getProductById } from "./productService";

export default function ProductById() {
  const [id, setId] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError("");
    setProduct(null);
    try {
      const result = await getProductById(id);
      setProduct(result.data.payload);
    } catch (err) {
      console.error("Failed to fetch product: ", err);
      setError("Product not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">
        Look up product by ID
      </h2>

      <form onSubmit={handleFetch} className="flex gap-2 mb-4">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Product ID"
          className="flex-1 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {product && (
        <div className="text-sm text-slate-300 space-y-1">
          <p>
            <span className="text-slate-500">Name:</span> {product.name}
          </p>
          <p>
            <span className="text-slate-500">Price:</span> ₹{product.price}
          </p>
          <p>
            <span className="text-slate-500">Description:</span>{" "}
            {product.description}
          </p>
          <p>
            <span className="text-slate-500">Category:</span> {product.category}
          </p>
          <p>
            <span className="text-slate-500">Brand:</span> {product.brand}
          </p>
        </div>
      )}
    </div>
  );
}
