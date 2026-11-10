'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Shield, UserCircle2, LogIn } from 'lucide-react';
import { getSession } from '@/lib/memberSession';
import LanguageSelector from './LanguageSelector';
import type { Language } from '@/lib/translations';
import { translations } from '@/lib/translations';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function Navbar({ language, setLanguage }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const tr = translations[language];

  useEffect(() => { setSignedIn(Boolean(getSession())); }, []);

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
    { href: '/province', label: 'Provinces' },
    { href: '/growth', label: 'Growth IA' },
    { href: '/invite', label: 'Inviter' },
    { href: '/security', label: 'Sentinel' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-xs">
      <div className="flag-stripe" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                 style={{ backgroundImage: 'linear-gradient(145deg, #1f8bff, #0055CC)', boxShadow: '0 6px 14px -4px rgba(0,85,204,0.5)' }}>
              <Shield className="w-5 h-5 text-drc-yellow" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-extrabold text-drc-blue-dark text-lg leading-none block tracking-tight">Le Congo D’Abord</span>
              <span className="text-[11px] text-ink-500 font-medium leading-none tracking-wide" style={{ color: 'var(--ink-500)' }}>La compétence avant les promesses</span>
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
            {signedIn ? (
              <Link href="/mon-espace" className="hidden sm:inline-flex items-center gap-1.5 nav-link">
                <UserCircle2 className="w-4 h-4" /> Mon espace
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex items-center gap-1.5 nav-link">
                <LogIn className="w-4 h-4" /> Se connecter
              </Link>
            )}
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
            <Link
              href={signedIn ? '/mon-espace' : '/login'}
              className="flex items-center gap-2 nav-link text-sm font-semibold text-drc-blue"
              onClick={() => setOpen(false)}
            >
              {signedIn ? <><UserCircle2 className="w-4 h-4" /> Mon espace</> : <><LogIn className="w-4 h-4" /> Se connecter</>}
            </Link>
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
