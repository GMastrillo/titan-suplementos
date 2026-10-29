import React from 'react';
import Link from 'next/link';
import { getAllStores, getAllProducts } from '@/services/catalog-service';
import { ProductCard } from '@/components/ProductCard';
import {
  Sparkles,
  MapPin,
  Clock,
  Zap,
  ArrowRight,
  MessageCircle,
  Store as StoreIcon,
} from 'lucide-react';

export default async function HomePage() {
  const stores = await getAllStores();
  const products = await getAllProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-[#24323F] bg-gradient-to-b from-[#131A20] via-[#0B0F12] to-[#0B0F12] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3.5 py-1.5 text-xs font-semibold text-[#10B981]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Digitalização Comercial da Rede • 5 Unidades Físicas</span>
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight text-[#F8FAFC] sm:text-5xl sm:leading-tight">
              A força de <span className="text-[#10B981]">5 lojas físicas</span> com a agilidade do atendimento inteligente
            </h1>

            <p className="mt-5 text-sm leading-relaxed text-[#94A3B8] sm:text-base">
              Conheça suplementos de alta pureza, consulte a disponibilidade em tempo real na sua unidade mais próxima e receba atendimento consultivo potencializado por Inteligência Artificial no WhatsApp.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/produtos"
                className="flex items-center gap-2 rounded-xl bg-[#10B981] px-6 py-3 text-xs font-bold text-[#0B0F12] transition-colors hover:bg-[#059669] shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)]"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/atendimento"
                className="flex items-center gap-2 rounded-xl border border-[#8B5CF6]/40 bg-[#8B5CF6]/15 px-6 py-3 text-xs font-bold text-[#F8FAFC] transition-colors hover:bg-[#8B5CF6]/25"
              >
                <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
                <span>Testar Copiloto IA</span>
              </Link>
            </div>
          </div>

          {/* Destaques em Números Tabulares */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-[#24323F] pt-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="font-mono text-2xl font-black text-[#F8FAFC] sm:text-3xl">5 Lojas</div>
              <div className="mt-1 text-xs text-[#94A3B8]">São Paulo, Rio, BH e Curitiba</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-black text-[#10B981] sm:text-3xl">100%</div>
              <div className="mt-1 text-xs text-[#94A3B8]">Pureza e Laudos Verificados</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-black text-[#F59E0B] sm:text-3xl">&lt; 30s</div>
              <div className="mt-1 text-xs text-[#94A3B8]">Tempo Médio com Copiloto IA</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-black text-[#8B5CF6] sm:text-3xl">Crawl 1.0</div>
              <div className="mt-1 text-xs text-[#94A3B8]">Humano no Loop Garantido</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. As 5 Unidades Físicas (Modelo C - Vitrines Digitais) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981]">
              <StoreIcon className="h-4 w-4" />
              <span>Presença Regional da Rede</span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-[#F8FAFC]">Escolha a Unidade Mais Próxima</h2>
          </div>
          <Link
            href="/lojas"
            className="text-xs font-semibold text-[#10B981] hover:underline"
          >
            Ver todas as 5 unidades →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="flex flex-col justify-between rounded-xl border border-[#24323F] bg-[#131A20] p-5 transition-all hover:border-[#10B981] hover:bg-[#1B242D]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                      {store.city} • {store.state}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-[#F8FAFC]">{store.name}</h3>
                  </div>
                  {store.isFlagship && (
                    <span className="rounded bg-[#10B981]/15 px-2 py-0.5 text-[10px] font-bold text-[#10B981]">
                      Flagship
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-xs text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                    <span className="line-clamp-1">{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                    <span>{store.openingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-[#24323F] pt-4">
                <Link
                  href={`/lojas/${store.slug}`}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#24323F] bg-[#0B0F12] py-2 text-xs font-medium text-[#F8FAFC] hover:bg-[#24323F]"
                >
                  <span>Ver Vitrine</span>
                </Link>
                <a
                  href={`https://wa.me/${store.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-bold text-[#0B0F12] hover:bg-[#059669]"
                  title="Chamar no WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Vitrine de Suplementos em Destaque */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981]">
              <Zap className="h-4 w-4" />
              <span>Catálogo Demonstrativo</span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-[#F8FAFC]">Suplementos Mais Procurados</h2>
          </div>
          <Link
            href="/produtos"
            className="text-xs font-semibold text-[#10B981] hover:underline"
          >
            Ver catálogo completo ({products.length} itens) →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Banner Chamada Atendimento com IA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-[#8B5CF6]/30 bg-gradient-to-r from-[#131A20] via-[#1B242D] to-[#131A20] p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#8B5CF6]/20 px-3 py-1 text-xs font-semibold text-[#8B5CF6]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Módulo 1 — Atendimento Inteligente com IA</span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-[#F8FAFC] sm:text-3xl">
              Experimente o Copiloto de IA para Atendentes no WhatsApp
            </h3>

            <p className="mt-3 text-xs leading-relaxed text-[#94A3B8] sm:text-sm">
              Veja como nossa IA categoriza dúvidas, identifica oportunidades de fechamento de venda em tempo real e sugere respostas prontas em 1 clique para o atendente da unidade.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/atendimento"
                className="flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#7C3AED]"
              >
                <span>Abrir Simulador de WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
