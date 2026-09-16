import { useState } from "react";
import { getProductInRangeByPage } from "./productService";

export default function ProductRange() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await getProductInRangeByPage({
        start: Number(minPrice),
        end: Number(maxPrice),
        pageNo: page,
        pageSize: size,
      });

      setProducts(result.data.payload);
    } catch (err) {
      console.error("Failed to fetch range:", err);
      setError("Failed to fetch products in range.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">
        Browse Products by Price Range
      </h2>

      <form onSubmit={handleFetch} className="grid grid-cols-2 gap-3 mb-4">
        <input
          type="number"
          min="0"
          step="0.01"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Start price"
          required
          className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
        />

        <input
          type="number"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="End price"
          required
          className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
        />

        <input
          type="number"
          min="0"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          placeholder="Page"
          className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
        />

        <input
          type="number"
          min="1"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          placeholder="Page size"
          className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 py-2.5 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {products && (
        <>
          {products.length > 0 ? (
            <ul className="divide-y divide-slate-700 text-sm text-slate-300">
              {products.map((p, i) => (
                <li key={p.id ?? i} className="py-2 flex justify-between">
                  <span>{p.name}</span>

                  <span className="text-green-400 font-mono">₹{p.price}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-sm">
              No products found in this price range.
            </p>
          )}
        </>
      )}
    </div>
  );
}
