'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, CalendarClock, Mail } from 'lucide-react';
import { firestore } from '@/utils/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';

type Highlight = {
  id: string;
  imageUrl: string;
  title: string;
  desc: string;
  showOnHome: boolean;
  order: number;
  isHero?: boolean;
};

export default function HomePage() {
  const [gallery, setGallery] = useState<Highlight[]>([]);
  const [hero, setHero] = useState<Highlight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(firestore, 'highlights'), orderBy('order', 'asc'));
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
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="bg-[--background] text-[--foreground] overflow-hidden">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden isolate">
        {/* Background visual */}
        {!loading && hero?.imageUrl && (
          hero.imageUrl.endsWith('.mp4') ? (
            <video
              src={hero.imageUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40 animate-fade-in"
            />
          ) : (
            <Image
              src={hero.imageUrl || '/placeholder.png'}
              alt={hero.title || 'Hero Image'}
              fill
              priority
              className="absolute inset-0 object-cover opacity-40 animate-fade-in"
            />
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e1a1a]/70 via-[#4C1F26]/80 to-[#1e1a1a]/90" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#D6B678] mb-5 tracking-wider leading-tight">
            Scents & Suites Luxury Villa
          </h1>
          <p className="text-lg md:text-xl text-[#f3e8d2] max-w-xl mx-auto leading-relaxed">
            Nestled in the heart of Village, Gaborone — where privacy, elegance, and tranquility meet.
          </p>
          <p className="text-sm text-[#fdf7ec]/80 mt-3 italic">
            “Feels like home. Somewhere not in Botswana.”
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-block rounded-full bg-[#fff4db] text-[#1e1a1a] font-semibold px-8 py-3 transition-all duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B89B59]"
          >
            Book Your Stay
          </Link>
        </div>
      </section>

      {/* ─── SUITES ───────────────────────────────────────── */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fdfaf6]/30 to-transparent pointer-events-none" />
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#B89B59] mb-6 animate-fade-up">
          Our Suites
        </h2>
        <p className="text-[--brand-accent] mb-12 max-w-2xl mx-auto animate-fade-up delay-100">
          Each suite embodies peace, privacy, and timeless comfort — crafted for guests who seek quiet refinement.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              name: 'Premium Suite',
              size: '32 sqm',
              desc: 'Spacious luxury with premium bedding, lounge area, and a private ambiance that soothes every sense.',
            },
            {
              name: 'Deluxe Suite',
              size: '27 sqm',
              desc: 'Elegant and intimate — perfect for couples or solo guests seeking serene comfort.',
            },
            {
              name: 'Classic Suite',
              size: '15 sqm',
              desc: 'Compact and charming, ideal for brief stays or restful weekends away.',
            },
          ].map(({ name, size, desc }, i) => (
            <div
              key={name}
              className="group bg-white/60 backdrop-blur-md rounded-2xl shadow-sm p-6 text-left border border-[#b89b5940] transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-[#4C1F26]">{name}</h3>
                <span className="text-sm text-gray-500">{size}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{desc}</p>
              <Link
                href="/room-styles"
                className="mt-4 inline-block text-[#B89B59] font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── GALLERY ──────────────────────────────────────── */}
      <section className="py-24 px-6 text-center bg-[#f9f6f1] text-[#2c1e1e] relative">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#4C1F26] mb-5 animate-fade-up">
          Picture Your Stay
        </h2>
        <p className="text-sm mb-10 max-w-xl mx-auto text-[#4C1F26]/80 animate-fade-up delay-100">
          A glimpse into the calm and elegance that define Scents & Suites.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-300 aspect-[4/3] rounded-lg animate-pulse" />
            ))
          ) : gallery.length > 0 ? (
            gallery.map((item, i) => (
              <div
                key={item.id}
                className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Image
                  src={item.imageUrl || '/placeholder.png'}
                  alt={item.title || 'Gallery Image'}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))
          ) : (
            [1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 animate-fade-up"
              >
                <Image
                  src="/placeholder.png"
                  alt="Placeholder"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            ))
          )}
        </div>

        <Link
          href="/gallery"
          className="mt-10 inline-block text-[#4C1F26] font-medium underline underline-offset-4 hover:text-[#B89B59] transition-colors"
        >
          View Full Gallery
        </Link>
      </section>

      {/* ─── LOCATION / BOOKING ───────────────────────────── */}
      <section className="py-24 px-6 text-center bg-[#fffaf4] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf4] to-[#f8f4ef]" />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#B89B59] mb-6 animate-fade-up">
            Your Private Escape
          </h2>
          <p className="text-[#4C1F26]/80 max-w-xl mx-auto mb-8 animate-fade-up delay-100">
            Located in Village, Gaborone — discreetly positioned for ultimate privacy and peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up delay-200">
            <Link
              href="/location"
              className="inline-flex items-center gap-2 bg-[#fdf0d2] text-[#1e1a1a] px-6 py-3 rounded-full font-medium hover:brightness-110 transition-all duration-300"
            >
              <MapPin size={18} /> Find Us
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#4C1F26] text-[#fffaf4] px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300"
            >
              <CalendarClock size={18} /> Reserve a Room
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CONTACT TEASER ──────────────────────────────── */}
      <section className="py-20 bg-[#1e1a1a] text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e1a1a]" />
        <h2 className="text-xl md:text-2xl font-serif font-semibold text-[#B89B59] mb-4 animate-fade-up">
          Have Questions?
        </h2>
        <p className="text-[#fdf7ec]/80 text-sm mb-8 animate-fade-up delay-100">
          Reach out and we’ll get back to you within 24 hours.
        </p>
        <Link
          href="mailto:booking@scentsandsuites.com"
          className="inline-flex items-center gap-2 bg-[#fff4da] text-[#1e1a1a] px-6 py-3 rounded-full font-medium hover:brightness-110 transition-all duration-300 animate-fade-up delay-200"
        >
          <Mail size={18} /> Contact Our Concierge
        </Link>
      </section>

      {/* ─── ANIMATIONS ──────────────────────────────────── */}
      <style jsx global>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) both;
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
          animation: fadeIn 1.2s ease-in-out both;
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
