"use client";

import { useCart } from "@/context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, totalItems, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        id="cart-drawer"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/[0.06] bg-[#0a0e1a]/95 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/25">
              <svg className="h-4.5 w-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Your Cart</h2>
              <p className="text-xs text-slate-500">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
                <svg className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-300">Your cart is empty</h3>
              <p className="max-w-[240px] text-sm text-slate-500">Explore products and add them to your cart to see them here.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, quantity }) => {
                const name = product.product_name || "Unknown Product";
                const img = product.image_url || product.image_front_url || "";
                const grade = (product.nutrition_grades || product.nutrition_grade_fr || "").toLowerCase();

                return (
                  <li key={product.code} className="group flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60">
                      {img ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={img} alt={name} className="h-full w-full object-contain p-1" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {grade && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 text-[9px] font-bold uppercase text-white">{grade}</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between overflow-hidden">
                      <p className="truncate text-sm font-medium text-slate-200">{name}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQuantity(product.code, quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-slate-300 ring-1 ring-white/[0.08] transition-colors hover:bg-rose-500/15 hover:text-rose-300 hover:ring-rose-500/25">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14" /></svg>
                          </button>
                          <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-white/[0.04] px-2 text-xs font-semibold text-slate-200 ring-1 ring-white/[0.08]">{quantity}</span>
                          <button onClick={() => updateQuantity(product.code, quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-slate-300 ring-1 ring-white/[0.08] transition-colors hover:bg-indigo-500/15 hover:text-indigo-300 hover:ring-indigo-500/25">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M12 5v14m-7-7h14" /></svg>
                          </button>
                        </div>
                        <button onClick={() => removeItem(product.code)} className="flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/[0.06] px-6 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-400">Total items</span>
              <span className="font-semibold text-slate-100">{totalItems}</span>
            </div>
            <button onClick={clearCart} className="w-full rounded-xl border border-rose-500/20 bg-rose-500/10 py-3 text-sm font-medium text-rose-300 transition-all hover:bg-rose-500/20 hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]">
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
