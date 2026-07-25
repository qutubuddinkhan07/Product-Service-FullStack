import React from "react";
import { NavLink } from "react-router-dom";

const manifestRows = [
  {
    sku: "SKU-2291",
    item: "Steel Hex Bolts M8",
    qty: "1,204",
    status: "In Stock",
  },
  { sku: "SKU-1187", item: "Packing Tape 48mm", qty: "86", status: "Low" },
  { sku: "SKU-3350", item: "Nitrile Gloves (L)", qty: "0", status: "Out" },
  {
    sku: "SKU-4402",
    item: "Shipping Labels 4x6",
    qty: "3,860",
    status: "In Stock",
  },
];

const statusStyles = {
  "In Stock": "bg-emerald-400/10 text-emerald-400 ring-emerald-400/30",
  Low: "bg-amber-400/10 text-amber-400 ring-amber-400/30",
  Out: "bg-slate-400/10 text-slate-400 ring-slate-400/30",
};

const statusDot = {
  "In Stock": "bg-emerald-400",
  Low: "bg-amber-400",
  Out: "bg-slate-500",
};

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#12151B] text-[#E7E9EC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Barlow Condensed', sans-serif; }
        .font-mono-ledger { font-family: 'IBM Plex Mono', monospace; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes scan {
          0% { transform: translateY(-10%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110%); opacity: 0; }
        }
        .scan-line { animation: scan 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .scan-line { animation: none; }
        }
      `}</style>

      {/* ambient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-3xl" />

      {/* header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2.5">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            className="text-amber-400"
          >
            <path
              d="M3 7L12 3L21 7V17L12 21L3 17V7Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M3 7L12 11L21 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M12 11V21" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="font-display text-lg font-bold tracking-wide text-[#E7E9EC]">
            STOCKLINE
          </span>
        </div>
        <NavLink
          to="/login"
          className="font-body rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-[#C7CCD3] transition hover:border-amber-400/40 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
        >
          Sign in
        </NavLink>
      </header>

      {/* hero */}
      <main className="relative z-10 mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-8 md:grid-cols-2 md:items-center md:px-12 md:pt-16">
        <div>
          <p className="font-mono-ledger mb-5 text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
            Inventory, accounted for
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            Know what’s on
            <br />
            the shelf.<span className="text-amber-400">*</span>
          </h1>
          <p className="font-mono-ledger mt-2 text-xs text-[#6B7280]">
            *before your customer finds out you don’t
          </p>
          <p className="font-body mt-6 max-w-md text-base leading-relaxed text-[#A6ACB5]">
            One workspace for every SKU, every warehouse, every movement — from
            the receiving dock to the last unit out the door.
          </p>

          <div className="mt-9 flex items-center gap-4">
            <NavLink
              to="/login"
              className="font-body group inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-[#12151B] transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12151B]"
            >
              Sign in to your workspace
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </NavLink>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[
              ["Real-time counts", "Every scan updates stock instantly."],
              ["Low-stock alerts", "Get notified before shelves empty."],
              ["Multi-location", "One view across every warehouse."],
            ].map(([title, desc]) => (
              <div key={title}>
                <p className="font-body text-sm font-semibold text-[#E7E9EC]">
                  {title}
                </p>
                <p className="font-body mt-1 text-xs leading-relaxed text-[#7B8290]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* manifest card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#171B22] shadow-2xl shadow-black/40">
            <div className="scan-line pointer-events-none absolute left-0 right-0 h-16 bg-gradient-to-b from-amber-400/0 via-amber-400/10 to-amber-400/0" />

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono-ledger text-xs uppercase tracking-widest text-[#8B94A0]">
                  Manifest — Warehouse 04
                </span>
              </div>
              <span className="font-mono-ledger text-[10px] text-[#5B6270]">
                Synced 2m ago
              </span>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="font-mono-ledger text-[10px] uppercase tracking-wider text-[#5B6270]">
                  <th className="px-5 py-3 font-medium">SKU</th>
                  <th className="px-2 py-3 font-medium">Item</th>
                  <th className="px-2 py-3 font-medium">Qty</th>
                  <th className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {manifestRows.map((row) => (
                  <tr key={row.sku} className="border-t border-white/5">
                    <td className="font-mono-ledger px-5 py-3 text-xs text-[#8B94A0]">
                      {row.sku}
                    </td>
                    <td className="font-body px-2 py-3 text-sm text-[#D5D8DD]">
                      {row.item}
                    </td>
                    <td className="font-mono-ledger px-2 py-3 text-sm text-[#D5D8DD]">
                      {row.qty}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`font-body inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${statusStyles[row.status]}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusDot[row.status]}`}
                        />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* barcode footer */}
            <div className="flex items-end gap-[3px] border-t border-white/10 px-5 py-4">
              {[
                3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 3, 2, 1, 1, 4, 2, 1, 3,
                1, 2, 1,
              ].map((w, i) => (
                <span
                  key={i}
                  className="bg-[#3A4048]"
                  style={{ width: `${w}px`, height: "18px" }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
