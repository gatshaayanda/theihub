'use client';

import { useRouter } from 'next/navigation';
import {
  BedDouble,
  Image,
  UtensilsCrossed,
  BookOpenText,
  LogOut,
} from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    router.replace('/login');
  };

  const sections = [
    {
      title: 'Manage Highlights',
      desc: 'Update images shown on Home & Things To Do.',
      icon: <Image size={22} />,
      href: '/admin/dashboard/highlights',
      color: 'bg-blue-600',
    },
    {
      title: 'Manage Dining',
      desc: 'Edit dining experiences, photos & pricing.',
      icon: <UtensilsCrossed size={22} />,
      href: '/admin/dashboard/dining',
      color: 'bg-green-600',
    },
    {
      title: 'Manage Suites',
      desc: 'Update suite images, descriptions & rates.',
      icon: <BedDouble size={22} />,
      href: '/admin/dashboard/suites',
      color: 'bg-purple-600',
    },
    {
      title: 'About Images',
      desc: 'Change hero & story images for the About page.',
      icon: <BookOpenText size={22} />,
      href: '/admin/dashboard/about',
      color: 'bg-gray-800',
    },
    {
      title: 'Manage Shop',
      desc: 'Edit products, images & prices in Scents I Love.',
      icon: <BookOpenText size={22} />,
      href: '/admin/dashboard/shop',
      color: 'bg-orange-600',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 text-black px-6 py-12 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-black">
          🕯️ Scents & Suites Admin
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Admin Sections */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((s) => (
          <button
            key={s.title}
            onClick={() => router.push(s.href)}
            className={`p-6 rounded-xl text-left shadow-md hover:shadow-lg transition flex flex-col justify-between ${s.color} text-white`}
          >
            <div className="flex items-center gap-3 mb-3">
              {s.icon}
              <h2 className="text-lg font-semibold">{s.title}</h2>
            </div>
            <p className="text-sm opacity-90">{s.desc}</p>
          </button>
        ))}
      </section>

      {/* Metrics */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ['Suites', 3],
          ['Highlights', 6],
          ['Dining Experiences', 4],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="bg-white border border-gray-200 p-5 rounded-xl text-center shadow"
          >
            <div className="text-xs uppercase text-gray-500 tracking-wide">
              {label}
            </div>
            <div className="text-3xl font-bold text-black">{value}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
