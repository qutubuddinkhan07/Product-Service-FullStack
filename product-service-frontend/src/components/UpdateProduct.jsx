import { useState } from "react";
import { getProductById, updateProductById } from "./productService";

export default function UpdateProduct() {
  const [id, setId] = useState("");
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLoad = async (e) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await getProductById(id);
      setForm(result.data.payload);
    } catch (err) {
      console.error("Failed to load product: ", err);
      setError("Product not found.");
      setForm(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateProductById(id, { ...form, price: Number(form.price) });
      setMessage("Product updated.");
    } catch (err) {
      console.error("Update failed: ", err);
      setError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Update a product</h2>

      <form onSubmit={handleLoad} className="flex gap-2 mb-4">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Product ID"
          className="flex-1 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-white disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load"}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      {message && <p className="text-green-400 text-sm mb-3">{message}</p>}

      {form && (
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-3">
          <input
            name="name"
            value={form.name ?? ""}
            onChange={handleChange}
            placeholder="Name"
            required
            className="col-span-2 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
          />
          <input
            name="price"
            type="number"
            value={form.price ?? ""}
            onChange={handleChange}
            placeholder="Price"
            required
            className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
          />
          <input
            name="category"
            value={form.category ?? ""}
            onChange={handleChange}
            placeholder="Category"
            required
            className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
          />
          <input
            name="brand"
            value={form.brand ?? ""}
            onChange={handleChange}
            placeholder="Brand"
            required
            className="col-span-2 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
          />
          <textarea
            name="description"
            value={form.description ?? ""}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="col-span-2 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 outline-none focus:border-slate-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="col-span-2 py-2.5 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
