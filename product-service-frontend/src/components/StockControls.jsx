import { useState } from "react";
import { incStock, decStock } from "./productService";

export default function StockControls() {
  const [id, setId] = useState("");
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const adjust = async (direction) => {
    if (!id) return;

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const action = direction === "inc" ? incStock : decStock;
      const result = await action(id, amount);
      setMessage(
        `Stock ${direction === "inc" ? "increased" : "decreased"}. New stock: ${
          result.data.payload?.stock ?? "—"
        }`,
      );
    } catch (err) {
      console.error("Stock update failed: ", err);
      setError("Failed to update stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Adjust stock</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Product ID"
          className="flex-1 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-20 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => adjust("dec")}
          disabled={loading}
          className="flex-1 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-white disabled:opacity-50"
        >
          − Decrease
        </button>
        <button
          onClick={() => adjust("inc")}
          disabled={loading}
          className="flex-1 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50"
        >
          + Increase
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      {message && <p className="text-green-400 text-sm mt-3">{message}</p>}
    </div>
  );
}
