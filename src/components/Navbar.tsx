'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Store, MessageCircle, ShoppingBag, MapPin, Sparkles, Menu, X } from 'lucide-react';
import { storesMock } from '@/services/catalog-service';

export function Navbar() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedStore = storesMock.find((s) => s.id === selectedStoreId) || storesMock[0];

  return (
    <header className="sticky top-0 z-40 border-b border-[#24323F] bg-[#0B0F12]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#00E599] font-black text-[#0B0F12] shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)]">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-[#F8FAFC]">TITAN</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#10B981]">Suplementos</span>
            </div>
            <span className="text-[10px] font-medium text-[#94A3B8]">Rede 5 Lojas • Atendimento com IA</span>
          </div>
        </Link>

        {/* Store Quick Selector (Desktop) */}
        <div className="hidden items-center gap-2 rounded-lg border border-[#24323F] bg-[#131A20] px-3 py-1.5 md:flex">
          <MapPin className="h-4 w-4 text-[#10B981]" />
          <span className="text-xs text-[#94A3B8]">Sua Loja:</span>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#F8FAFC] focus:outline-none"
            aria-label="Selecionar unidade da rede"
          >
            {storesMock.map((store) => (
              <option key={store.id} value={store.id} className="bg-[#131A20] text-[#F8FAFC]">
                {store.name} ({store.state})
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-xs font-medium text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
          >
            Início
          </Link>
          <Link
            href="/lojas"
            className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
          >
            <Store className="h-3.5 w-3.5 text-[#10B981]" />
            <span>As 5 Lojas</span>
          </Link>
          <Link
            href="/produtos"
            className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Catálogo</span>
          </Link>
          <Link
            href="/atendimento"
            className="flex items-center gap-1.5 rounded-lg border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-3 py-1.5 text-xs font-semibold text-[#F8FAFC] transition-colors hover:bg-[#8B5CF6]/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>Copiloto de IA</span>
            <span className="rounded bg-[#8B5CF6] px-1 text-[9px] font-bold text-white">NOVO</span>
          </Link>
          <a
            href={`https://wa.me/${selectedStore.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-[#10B981] px-3.5 py-1.5 text-xs font-semibold text-[#0B0F12] transition-colors hover:bg-[#059669]"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp da Loja</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#24323F] bg-[#131A20] text-[#F8FAFC] md:hidden"
          aria-label="Abrir menu móvel"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#24323F] bg-[#131A20] px-4 py-4 md:hidden">
          <div className="mb-4">
            <label className="mb-1 block text-xs text-[#94A3B8]">Escolha a unidade física:</label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full rounded-lg border border-[#24323F] bg-[#0B0F12] px-3 py-2 text-xs text-[#F8FAFC]"
            >
              {storesMock.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} ({store.state})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-sm font-medium text-[#F8FAFC]"
            >
              Início
            </Link>
            <Link
              href="/lojas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-sm font-medium text-[#94A3B8]"
            >
              As 5 Lojas da Rede
            </Link>
            <Link
              href="/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-sm font-medium text-[#94A3B8]"
            >
              Catálogo de Suplementos
            </Link>
            <Link
              href="/atendimento"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1 text-sm font-medium text-[#8B5CF6]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Simulador Copiloto IA</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
