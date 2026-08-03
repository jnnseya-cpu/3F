'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import type { Language } from '@/lib/translations';
import { translations } from '@/lib/translations';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function Navbar({ language, setLanguage }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const tr = translations[language];

  const navLinks = [
    { href: '/', label: tr['nav.home'] || 'Accueil' },
    { href: '/register', label: tr['nav.register'] || "S'inscrire" },
    { href: '/dashboard', label: tr['nav.dashboard'] || 'Tableau de bord' },
    { href: '/candidates', label: tr['nav.candidates'] || 'Candidats IA' },
    { href: '/contributions', label: tr['nav.contributions'] || 'Cotisations' },
    { href: '/training', label: tr['nav.training'] || 'Académie' },
    { href: '/policy', label: tr['nav.policy'] || 'Politiques' },
    { href: '/infrastructure', label: tr['nav.infrastructure'] || 'Infrastructure' },
    { href: '/ethics', label: tr['nav.ethics'] || 'Éthique' },
    { href: '/projects', label: 'SNTO Projets' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="flag-stripe" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-drc-blue rounded-lg flex items-center justify-center shadow">
              <Shield className="w-5 h-5 text-drc-yellow" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-drc-blue text-lg leading-none block">Le Congo D’Abord</span>
              <span className="text-xs text-gray-500 font-medium leading-none">Le Congo D'Abord</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 6).map(link => (
              <Link key={link.href} href={link.href} className="nav-link text-xs">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <Link
              href="/register"
              className="hidden sm:inline-flex btn-primary text-sm py-2 px-4"
            >
              {tr['nav.register'] || "S'inscrire"}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block nav-link text-sm"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
