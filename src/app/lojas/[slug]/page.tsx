import React from 'react';
import { notFound } from 'next/navigation';
import { getStoreBySlug, getAllStores, getAllProducts } from '@/services/catalog-service';
import { ProductCard } from '@/components/ProductCard';
import { Clock, Phone, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  const stores = await getAllStores();
  return stores.map((s) => ({ slug: s.slug }));
}

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Banner da Unidade */}
      <div className="relative overflow-hidden rounded-2xl border border-[#24323F] bg-gradient-to-r from-[#131A20] to-[#1B242D] p-6 sm:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#10B981]">
                {store.city} • {store.state}
              </span>
              {store.isFlagship && (
                <span className="rounded bg-[#10B981]/20 px-2.5 py-0.5 text-xs font-bold text-[#10B981]">
                  Unidade Principal Flagship
                </span>
              )}
            </div>

            <h1 className="mt-2 text-2xl font-black text-[#F8FAFC] sm:text-4xl">
              {store.name}
            </h1>
            <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">{store.address}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#10B981]" />
                <span>{store.openingHours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#10B981]" />
                <span>{store.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-xs font-bold text-[#0B0F12] hover:bg-[#059669] shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chamar no WhatsApp da Loja</span>
            </a>
            <Link
              href={`/atendimento?loja=${store.slug}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-4 py-2.5 text-xs font-semibold text-[#F8FAFC] hover:bg-[#8B5CF6]/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span>Simular Atendimento com IA desta Loja</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Catálogo Disponível na Unidade */}
      <div className="mt-12">
        <div className="flex items-center justify-between border-b border-[#24323F] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">
              Vitrine e Catálogo da Unidade
            </h2>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Todos os pedidos e consultas desta página são direcionados diretamente para a equipe da {store.name}.
            </p>
          </div>
          <div className="hidden items-center gap-1.5 text-xs text-[#10B981] sm:flex">
            <ShieldCheck className="h-4 w-4" />
            <span>Retirada Imediata no Balcão</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} currentStore={store} />
          ))}
        </div>
      </div>
    </div>
  );
}
