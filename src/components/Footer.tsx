'use client';

import Link from 'next/link';
import { Facebook } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 text-[--foreground] bg-[--brand-primary] relative overflow-hidden">
      {/* Animated gold shimmer line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#b89b59]/40 via-[#d6b678]/80 to-[#b89b59]/40 animate-goldflow" />

      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4 py-12 text-sm relative z-10">
        {/* Brand + Welcome */}
        <section aria-labelledby="footer-brand">
          <h4
            id="footer-brand"
            className="font-serif text-lg text-[--brand-secondary] mb-2 tracking-wide"
          >
            Scents & Suites
          </h4>
          <p className="text-[--brand-accent]/90 leading-relaxed">
            A private, elegant guesthouse in Village, Gaborone. Experience
            personalized luxury, quiet comfort, and premium service.
          </p>
        </section>

        {/* Contact Info */}
        <section aria-labelledby="footer-contact">
          <h4
            id="footer-contact"
            className="font-serif text-lg text-[--brand-secondary] mb-2 tracking-wide"
          >
            Contact Us
          </h4>
          <ul className="space-y-1 text-[--brand-accent]/90">
            <li>
              <a href="tel:+26771680243" className="hover:underline">
                +267 71 680 243 / +267 72 202 747
              </a>
            </li>
            <li>
              <a
                href="mailto:booking@scentsandsuites.com"
                className="hover:underline"
              >
                booking@scentsandsuites.com
              </a>
            </li>
            <li>
              Plot 1234, Village
              <br />
              Gaborone, Botswana
            </li>
          </ul>
        </section>

        {/* Quick Links — synced with header */}
        <nav aria-labelledby="footer-links">
          <h4
            id="footer-links"
            className="font-serif text-lg text-[--brand-secondary] mb-2 tracking-wide"
          >
            Quick Links
          </h4>
          <ul className="space-y-1 text-[--brand-accent]/90">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/room-styles" className="hover:underline">Our Suites</Link></li>
            <li><Link href="/shop" className="hover:underline">Scents I Love</Link></li>
            <li><Link href="/dining" className="hover:underline">Dining</Link></li>
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/gallery" className="hover:underline">Things To Do</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li>
              <Link
                href="/booking"
                className="hover:underline font-medium text-[--brand-secondary]"
              >
                Book a Stay
              </Link>
            </li>
          </ul>
        </nav>

        {/* Downloads + Social */}
        <section aria-labelledby="footer-downloads">
          <h4
            id="footer-downloads"
            className="font-serif text-lg text-[--brand-secondary] mb-2 tracking-wide"
          >
            Brochure
          </h4>
          <p className="mb-3 text-[--brand-accent]/90 leading-relaxed">
            Prefer offline info? Download our full PDF brochure to explore
            suites, amenities, and pricing.
          </p>
          <a
            href="/scents-suites-brochure.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 text-sm text-[--brand-secondary] hover:underline"
          >
            Download Brochure
          </a>

          {/* Social Media */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.facebook.com/people/Scents-and-Suites-Luxury-Villa/61583289884818/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Scents & Suites on Facebook"
              className="group inline-flex items-center gap-2 text-[--brand-accent] hover:text-[#d6b678] transition"
            >
              <div className="p-2 rounded-full bg-[--brand-secondary]/10 group-hover:bg-[--brand-secondary]/20 transition relative icon-pulse">
                <Facebook size={18} />
                <span className="absolute inset-0 rounded-full pulse-glow"></span>
              </div>
              <span className="text-xs tracking-wide font-medium">
                Facebook Page
              </span>
            </a>
          </div>
        </section>
      </div>

      {/* Base Strip */}
      <div className="border-t border-[--brand-accent]/30 relative z-10">
        <div className="container py-4 flex flex-col md:flex-row justify-between text-xs text-[--brand-accent]/80 gap-2">
          <div>&copy; {year} Scents & Suites. All rights reserved.</div>
          <div>Privacy-focused. Locally owned. Made with care in Botswana.</div>
        </div>
      </div>

      {/* Shared animation styles */}
      <style jsx global>{`
        /* flowing shimmer line (same as droplet animation tempo) */
        @keyframes goldflow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-goldflow {
          background-size: 200% 200%;
          animation: goldflow 6s ease-in-out infinite;
        }

        /* soft pulse glow for icons */
        @keyframes pulseSoft {
          0%, 100% {
            opacity: 0.8;
            filter: drop-shadow(0 0 6px rgba(184, 155, 89, 0.4));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 12px rgba(214, 182, 120, 0.8));
          }
        }
        .icon-pulse {
          animation: pulseSoft 4.5s ease-in-out infinite;
        }

        /* subtle radial pulse overlay */
        @keyframes pulseGlow {
          0% {
            opacity: 0.2;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.2;
            transform: scale(0.9);
          }
        }
        .pulse-glow {
          background: radial-gradient(circle, rgba(214,182,120,0.3) 0%, transparent 70%);
          animation: pulseGlow 4.5s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
    </footer>
  );
}
