'use client';

import Link from 'next/link';
import Button from './Button';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold text-black tracking-tight">
            LEXY
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#como-funciona"
            className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors"
          >
            Cómo funciona
          </Link>
          <Link
            href="#precios"
            className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors"
          >
            Precios
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors"
          >
            FAQ
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button size="sm" href="#precios">
            Probar gratis
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-black p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-black/5">
          <div className="px-6 py-4 space-y-4">
            <Link
              href="#como-funciona"
              className="block text-gray-900 hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="#precios"
              className="block text-gray-900 hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Precios
            </Link>
            <Link
              href="#faq"
              className="block text-gray-900 hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Button size="sm" href="#precios" className="w-full">
              Probar gratis
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
