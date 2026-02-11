"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { firestore } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import {
  Search,
  Smartphone,
  Laptop,
  Watch,
  Shirt,
  Footprints,
  Tag,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

/* ───────────────── TYPES ───────────────── */

type Highlight = {
  id: string;
  imageUrl: string;
  title: string;
  desc: string;
  showOnHome: boolean;
  order: number;
  isHero?: boolean;
};

type Product = {
  id: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  dealPrice?: number | null;
  isDeal: boolean;
  inStock: boolean;
  imageUrl: string;
  description?: string | null;
};

/* ───────────────── CONSTANTS ───────────────── */

const WHATSAPP_NUMBER = "+26778768259";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const categoryNav = [
  { label: "Phones", href: "/c/phones", icon: <Smartphone size={18} /> },
  { label: "Laptops", href: "/c/laptops", icon: <Laptop size={18} /> },
  { label: "Gadgets", href: "/c/gadgets", icon: <Watch size={18} /> },
  { label: "Clothing", href: "/c/clothing", icon: <Shirt size={18} /> },
  { label: "Shoes", href: "/c/shoes", icon: <Footprints size={18} /> },
  { label: "Deals", href: "/deals", icon: <Tag size={18} /> },
];

/* ───────────────── HELPERS ───────────────── */

function formatPula(n: number) {
  // simple formatting; adjust if you want commas always, etc.
  return `P${Number.isFinite(n) ? n.toLocaleString() : n}`;
}

function getDisplayPrice(p: Product) {
  const effective =
    p.isDeal && typeof p.dealPrice === "number" && p.dealPrice > 0
      ? p.dealPrice
      : p.price;

  // If you later support variants/ranges, swap this function
  return formatPula(effective);
}

/* ───────────────── PAGE ───────────────── */

export default function HomePage() {
  const router = useRouter();

  const [hero, setHero] = useState<Highlight | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<"all" | "new">("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const hsnap = await getDocs(collection(firestore, "highlights"));
        const hdata = hsnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Highlight[];

        setHero(hdata.find((h) => h.isHero) || null);

        const psnap = await getDocs(collection(firestore, "products"));
        const pdata = psnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Product[];

        // "New Arrivals" fallback: just first slice for now
        // (If you have createdAt later, sort by it)
        setProducts(pdata);
      } catch (e) {
        console.error("Home load failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const base = tab === "new" ? products.slice(0, 24) : products;
    return base.slice(0, 60);
  }, [products, tab]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <main className="min-h-screen bg-[--background] text-[--foreground]">
      {/* ───────────────── TOP BAR (szwego-like) ───────────────── */}
      <div className="sticky top-0 z-40 bg-[--background] border-b border-[--border]">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Brand */}
          <Link href="/" className="font-extrabold tracking-tight text-lg">
            iHub
          </Link>

          {/* Search */}
          <form onSubmit={onSearch} className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[--muted]"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search iPhones, Samsung, laptops…"
                className="w-full rounded-full border border-[--border] bg-[--surface] text-[--foreground] pl-10 pr-3 py-2.5 text-sm outline-none"
              />
            </div>
          </form>

          {/* WhatsApp CTA */}
          <a
            href={waLink("Hi iHub 👋 I want to check prices / place an order.")}
            className="shrink-0 rounded-full border border-[--border] bg-[--surface] px-3 py-2 text-sm font-semibold"
            aria-label="Order on WhatsApp"
          >
            WhatsApp
          </a>
        </div>

        {/* Category icons row */}
        <div className="px-2 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 px-2">
            {categoryNav.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="min-w-[84px] flex flex-col items-center gap-1 rounded-2xl border border-[--border] bg-[--surface] px-3 py-2"
              >
                <span className="text-[--brand-primary]">{c.icon}</span>
                <span className="text-xs font-semibold text-[--foreground]">
                  {c.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tabs row (All / New Arrivals like screenshot) */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-5 text-sm font-semibold">
            <button
              onClick={() => setTab("all")}
              className={`pb-2 ${
                tab === "all"
                  ? "text-[--foreground] border-b-2 border-[--brand-primary]"
                  : "text-[--muted]"
              }`}
            >
              all
            </button>
            <button
              onClick={() => setTab("new")}
              className={`pb-2 ${
                tab === "new"
                  ? "text-[--foreground] border-b-2 border-[--brand-primary]"
                  : "text-[--muted]"
              }`}
            >
              New Arrivals
            </button>

            <div className="ml-auto text-xs text-[--muted] flex items-center gap-2">
              <Sparkles size={14} />
              Order via WhatsApp
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── HERO BANNER (optional, keeps your highlight) ───────────────── */}
      {hero?.imageUrl && (
        <section className="px-4 pt-4">
          <div className="relative overflow-hidden rounded-2xl border border-[--border] bg-[--surface] aspect-[16/7]">
            <Image
              src={hero.imageUrl}
              alt={hero.title || "iHub banner"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute left-4 bottom-4 right-4">
              <div className="text-white font-extrabold text-lg leading-tight">
                {hero.title || "iHub"}
              </div>
              <div className="text-white/85 text-sm line-clamp-2">
                {hero.desc || "Browse prices and order fast on WhatsApp."}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── PRODUCT GRID (tight mobile store grid) ───────────────── */}
      <section className="px-4 py-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[--border] bg-[--surface] overflow-hidden"
              >
                <div className="aspect-square bg-white/10 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-[--border] bg-[--surface] p-8 text-center text-[--muted]">
            No products yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={`/c/${p.category}`}
                className="rounded-2xl border border-[--border] bg-[--surface] overflow-hidden active:scale-[0.99] transition"
              >
                <div className="relative aspect-square bg-black/10">
                  <Image
                    src={p.imageUrl || "/placeholder.png"}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />

                  {/* badges */}
                  {!p.inStock && (
                    <div className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full bg-black/70 text-white">
                      Out of stock
                    </div>
                  )}
                  {p.isDeal && (
                    <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full bg-[--brand-primary] text-white">
                      Deal
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-2 leading-snug">
                    {p.name}
                  </div>
                  <div className="mt-1 text-[11px] text-[--muted] line-clamp-1">
                    {p.brand || p.category}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-[15px] font-extrabold text-red-500">
                      {getDisplayPrice(p)}
                    </div>

                    {/* cart icon (visual only like screenshot) */}
                    <span className="grid place-items-center h-9 w-9 rounded-full border border-[--border] bg-[--background]">
                      <ShoppingCart size={16} className="text-[--muted]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ───────────────── BOTTOM CTA STRIP ───────────────── */}
      <div className="sticky bottom-0 z-30 border-t border-[--border] bg-[--background]">
        <div className="px-4 py-3 flex items-center gap-3">
          <a
            href={waLink("Hi iHub 👋 I want to place an order.")}
            className="flex-1 rounded-full bg-[--brand-primary] text-white px-4 py-3 font-extrabold text-sm text-center"
          >
            Order on WhatsApp
          </a>
          <Link
            href="/c/phones"
            className="rounded-full border border-[--border] bg-[--surface] px-4 py-3 font-semibold text-sm"
          >
            Browse
          </Link>
        </div>
      </div>
    </main>
  );
}
