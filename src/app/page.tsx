// src/app/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, MessageCircle, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { firestore } from "@/utils/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Image from "next/image";

type Highlight = {
  id: string;
  imageUrl: string;
  title: string;
  desc: string;
  showOnHome: boolean;
  order: number;
  isHero?: boolean;
};

const WHATSAPP_NUMBER = "+267 78 768 259";
const WHATSAPP_CHANNEL =
  "https://whatsapp.com/channel/0029Vb6s2BE3LdQZJGmxQf1W";

function waLink(message: string) {
  const digits = WHATSAPP_NUMBER.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function HomePage() {
  const [gallery, setGallery] = useState<Highlight[]>([]);
  const [hero, setHero] = useState<Highlight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(firestore, "highlights"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          ...(doc.data() as Highlight),
          id: doc.id,
        }));

        const heroItem = data.find((item) => item.isHero === true) || null;
        setHero(heroItem);

        const visible = data.filter((item) => item.showOnHome && !item.isHero).slice(0, 4);
        setGallery(visible);
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="bg-[--background] text-[--foreground] overflow-hidden">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative w-full min-h-[88vh] flex items-center justify-center px-6 overflow-hidden isolate">
        {/* Background visual (from Firestore highlights) */}
        {!loading && hero?.imageUrl && (
          hero.imageUrl.endsWith(".mp4") ? (
            <video
              src={hero.imageUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-35 animate-fade-in"
            />
          ) : (
            <Image
              src={hero.imageUrl || "/placeholder.png"}
              alt={hero.title || "Hero"}
              fill
              priority
              className="absolute inset-0 object-cover opacity-35 animate-fade-in"
            />
          )
        )}

        {/* Tech overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070A12]/70 via-[#0B0F19]/85 to-[#070A12]/95" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 18% 22%, rgba(96,165,250,0.22), transparent 55%), radial-gradient(circle at 78% 30%, rgba(168,85,247,0.18), transparent 55%), radial-gradient(circle at 60% 85%, rgba(52,211,153,0.14), transparent 55%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/80">
            <Sparkles size={14} />
            Phones • Laptops • Gadgets • Plus clothing & shoes on request
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            iHub
            <span className="block text-white/75 text-xl sm:text-2xl md:text-3xl font-semibold mt-3">
              Tech & Gadgets — Prices + Fast WhatsApp Ordering
            </span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Browse our pricing list, pick what you want, and place your order instantly on WhatsApp.
            If you need clothing or shoes, send a photo/link and your size.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waLink("Hi iHub 👋 I want to place an order.")}
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-white border border-white/10 bg-white/10 hover:bg-white/15 transition"
            >
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>

            <Link
              href="/c/phones"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-[#0B0F19] bg-white hover:brightness-110 transition"
            >
              <ShoppingBag size={18} />
              Browse Prices
            </Link>

            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-white/90 border border-white/10 hover:bg-white/5 transition"
            >
              Follow Channel
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
            {[
              {
                icon: <ShieldCheck size={18} />,
                title: "Trusted sourcing",
                desc: "We confirm availability and condition before you pay.",
              },
              {
                icon: <Truck size={18} />,
                title: "Delivery options",
                desc: "Share your location and we’ll confirm delivery/collection.",
              },
              {
                icon: <MessageCircle size={18} />,
                title: "Fast WhatsApp support",
                desc: "Ask anything — specs, colors, storage, recommendations.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/85"
              >
                <div className="flex items-center gap-2 text-white">
                  <span className="text-white/80">{c.icon}</span>
                  <div className="font-semibold">{c.title}</div>
                </div>
                <div className="text-sm mt-2 text-white/65 leading-relaxed">
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────── */}
      <section className="py-20 px-6 text-center relative">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[--foreground] mb-3 animate-fade-up">
            Shop by Category
          </h2>
          <p className="text-[--muted] mb-10 max-w-2xl mx-auto animate-fade-up delay-100">
            Tap a category to view prices. Not listed? Order via WhatsApp with the exact details.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              {
                title: "Phones",
                desc: "iPhone • Samsung • Redmi/Xiaomi • more",
                href: "/c/phones",
              },
              {
                title: "Laptops",
                desc: "Work • school • gaming • Mac/Windows",
                href: "/c/laptops",
              },
              {
                title: "Gadgets",
                desc: "Earbuds • watches • chargers • accessories",
                href: "/c/gadgets",
              },
              {
                title: "Clothing & Shoes",
                desc: "Send photo/link + size + budget to order",
                href: "/c/clothing",
              },
            ].map((item, i) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/8 transition animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <span className="text-white/60 group-hover:text-white transition">→</span>
                </div>
                <p className="text-sm text-white/65 mt-2 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waLink("Hi iHub 👋 Please recommend a phone/laptop based on my budget.")}
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-white border border-white/10 bg-white/10 hover:bg-white/15 transition"
            >
              <MessageCircle size={18} />
              Ask for a recommendation
            </a>
            <Link
              href="/deals"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-[#0B0F19] bg-white hover:brightness-110 transition"
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED / GALLERY (Firestore highlights) ─────── */}
      <section className="py-20 px-6 text-center bg-white/5 relative">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 animate-fade-up">
            Featured Drops
          </h2>
          <p className="text-sm mb-10 max-w-xl mx-auto text-white/65 animate-fade-up delay-100">
            Latest highlights from iHub. We update these from the admin dashboard.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white/10 aspect-[4/3] rounded-xl animate-pulse border border-white/10"
                />
              ))
            ) : gallery.length > 0 ? (
              gallery.map((item, i) => (
                <div
                  key={item.id}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-sm animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <Image
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.title || "Featured"}
                    width={500}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                    <div className="text-sm font-semibold text-white line-clamp-1">
                      {item.title || "Featured"}
                    </div>
                    <div className="text-xs text-white/70 line-clamp-2 mt-0.5">
                      {item.desc || ""}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-white/5 animate-fade-up"
                >
                  <Image
                    src="/placeholder.png"
                    alt="Placeholder"
                    width={500}
                    height={400}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              ))
            )}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/c/phones"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-[#0B0F19] bg-white hover:brightness-110 transition"
            >
              Browse Prices
            </Link>
            <a
              href={waLink("Hi iHub 👋 I want to order something that is not listed.")}
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-white border border-white/10 bg-white/10 hover:bg-white/15 transition"
            >
              <MessageCircle size={18} />
              Order Anything on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── WHATSAPP CTA ─────────────────────────────────── */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(96,165,250,0.18), transparent 55%), radial-gradient(circle at 85% 70%, rgba(168,85,247,0.16), transparent 55%), radial-gradient(circle at 50% 95%, rgba(52,211,153,0.12), transparent 55%)",
          }}
        />
        <div className="container relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 animate-fade-up">
            Ready to Order?
          </h2>
          <p className="text-sm text-white/70 mb-8 max-w-xl mx-auto animate-fade-up delay-100">
            Send your list on WhatsApp and we’ll confirm availability, delivery and payment.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-200">
            <a
              href={waLink("Hi iHub 👋 I want to order:\n\n1) \n2) \n\nLocation: \nName: ")}
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-white border border-white/10 bg-white/10 hover:bg-white/15 transition"
            >
              <MessageCircle size={18} />
              Message iHub on WhatsApp
            </a>

            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold text-sm text-[#0B0F19] bg-white hover:brightness-110 transition"
            >
              Follow WhatsApp Channel
            </a>
          </div>
        </div>
      </section>

      {/* ─── ANIMATIONS ──────────────────────────────────── */}
      <style jsx global>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.75s cubic-bezier(0.25, 0.1, 0.25, 1) both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 1.1s ease-in-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up,
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
