import { useState } from "react";
import { getProductByPage } from "./productService";

export default function ProductByPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPage = async (targetPage = page) => {
    setLoading(true);
    setError("");

    try {
      const result = await getProductByPage({
        pageNo: targetPage,
        pageSize: size,
      });

      setProducts(result.data.payload);
      setPage(targetPage);
    } catch (err) {
      console.error("Failed to fetch page:", err);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">
        Browse Products by Page
      </h2>

      {/* Page Size + Fetch */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          min="1"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          placeholder="Page size"
          className="w-28 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
        />

        <button
          onClick={() => fetchPage(0)}
          disabled={loading}
          className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {/* Products */}
      {products && (
        <>
          <ul className="divide-y divide-slate-700 text-sm text-slate-300 mb-4">
            {products.map((p, i) => (
              <li key={p.id ?? i} className="py-2 flex justify-between">
                <span>{p.name}</span>

                <span className="text-green-400 font-mono">₹{p.price}</span>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => fetchPage(Math.max(page - 1, 0))}
              disabled={loading || page === 0}
              className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-xs text-slate-400 self-center">
              Page {page + 1}
            </span>

            <button
              onClick={() => fetchPage(page + 1)}
              disabled={loading}
              className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
