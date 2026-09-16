import { useState } from "react";
import { deleteProductById } from "./productService";

export default function DeleteProduct() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!id) return;
    if (!window.confirm(`Delete product ${id}? This can't be undone.`)) return;

    setLoading(true);
    setError("");
    setMessage("");
    try {
      await deleteProductById(id);
      setMessage(`Product ${id} deleted.`);
      setId("");
    } catch (err) {
      console.error("Delete failed: ", err);
      setError("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Delete a product</h2>

      <form onSubmit={handleDelete} className="flex gap-2">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Product ID"
          className="flex-1 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-red-900/50 text-red-300 border border-red-700 hover:bg-red-900 rounded-lg disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      {message && <p className="text-green-400 text-sm mt-3">{message}</p>}
    </div>
  );
}
