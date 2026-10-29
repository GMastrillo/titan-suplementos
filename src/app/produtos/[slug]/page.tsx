import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts, getAllStores } from '@/services/catalog-service';
import { buildWhatsAppLink } from '@/services/ai-copilot-service';
import { CheckCircle2, ShieldCheck, MessageCircle, Sparkles, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProdutoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ loja?: string }>;
}) {
  const { slug } = await params;
  const { loja } = await searchParams;

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const stores = await getAllStores();
  const selectedStore = (loja ? stores.find((s) => s.slug === loja) : stores[0]) || stores[0];
  const whatsappUrl = buildWhatsAppLink(selectedStore, product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        href="/produtos"
        className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#10B981] mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Voltar ao catálogo</span>
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#24323F] bg-[#131A20] p-6">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover rounded-xl"
            />
            <div className="absolute top-4 left-4 rounded-md bg-[#0B0F12]/80 px-3 py-1 text-xs font-semibold text-[#10B981] backdrop-blur-md">
              {product.categoryLabel}
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-[#24323F] bg-[#0B0F12]/90 p-3 backdrop-blur-md flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Dose Padrão:</span>
              <span className="font-semibold text-[#F8FAFC]">{product.servingSize}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between lg:col-span-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>{product.brand}</span>
            </div>

            <h1 className="mt-2 text-2xl font-black text-[#F8FAFC] sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-[#94A3B8] sm:text-sm">
              {product.detailedDescription}
            </p>

            <div className="mt-6 rounded-xl border border-[#24323F] bg-[#131A20] p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#94A3B8]">Preço na Rede:</span>
                  <div className="font-mono text-3xl font-black tabular-nums text-[#10B981]">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                {product.originalPrice && (
                  <div className="text-right">
                    <span className="text-xs text-[#64748B]">De</span>
                    <div className="font-mono text-sm text-[#64748B] line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                <span>{product.stockBadge}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Destaques da Fórmula
              </h3>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.nutritionalHighlights.map((hl, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-[#24323F] bg-[#131A20] px-3 py-2 text-xs text-[#F8FAFC]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-[#24323F] pt-6">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC] mb-2">
              <MapPin className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Consultar ou Retirar na Loja:</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mb-4">
              {stores.map((st) => (
                <Link
                  key={st.id}
                  href={`/produtos/${product.slug}?loja=${st.slug}`}
                  className={`rounded-lg border p-2 text-center text-xs transition-colors ${
                    selectedStore.id === st.id
                      ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981] font-bold'
                      : 'border-[#24323F] bg-[#131A20] text-[#94A3B8] hover:border-[#10B981]'
                  }`}
                >
                  <div className="line-clamp-1">{st.name.replace('Titan ', '')}</div>
                  <div className="text-[10px] text-[#64748B]">{st.city}</div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#10B981] py-3.5 text-xs font-bold text-[#0B0F12] hover:bg-[#059669] shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pedir pelo WhatsApp ({selectedStore.name.replace('Titan ', '')})</span>
              </a>

              <Link
                href={`/atendimento?produto=${product.slug}&loja=${selectedStore.slug}`}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-4 py-3.5 text-xs font-bold text-[#F8FAFC] hover:bg-[#8B5CF6]/20"
              >
                <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
                <span>Simular com IA</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
