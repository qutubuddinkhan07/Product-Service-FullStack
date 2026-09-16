import { useState } from "react";
import { addNewProduct } from "./productService";

const initialForm = {
  name: "",
  price: "",
  description: "",
  category: "",
  brand: "",
  stock: "",
};

export default function AddProduct() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await addNewProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      });
      setMessage(`Added "${result.data.payload?.name ?? form.name}" successfully.`);
      setForm(initialForm);
    } catch (err) {
      console.error("Add product failed: ", err);
      setError("Failed to add product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Add a new product</h2>

      {message && <p className="text-green-400 text-sm mb-3">{message}</p>}
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="col-span-2 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <input
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand"
          required
          className="px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="col-span-2 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500"
        />

        <button
          type="submit"
          disabled={saving}
          className="col-span-2 py-2.5 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add product"}
        </button>
      </form>
    </div>
  );
}
