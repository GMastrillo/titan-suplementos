import React from 'react';
import Link from 'next/link';
import { Product, Store } from '@/schemas/domain';
import { MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { buildWhatsAppLink } from '@/services/ai-copilot-service';

interface ProductCardProps {
  product: Product;
  currentStore?: Store;
}

export function ProductCard({ product, currentStore }: ProductCardProps) {
  const formattedPrice = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
  const whatsappUrl = currentStore
    ? buildWhatsAppLink(currentStore, product)
    : `/atendimento?produto=${product.slug}`;

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-[#24323F] bg-[#131A20] p-5 transition-all duration-200 hover:border-[#10B981] hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.45)]">
      <div>
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-[#1B242D]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 rounded-md bg-[#0B0F12]/80 px-2.5 py-1 text-xs font-medium text-[#10B981] backdrop-blur-md">
            {product.categoryLabel}
          </div>
        </div>

        <div className="mb-2 flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
          <span>{product.stockBadge}</span>
        </div>

        <h3 className="line-clamp-2 text-base font-semibold text-[#F8FAFC]">
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-[#94A3B8]">
          {product.shortDescription}
        </p>
      </div>

      <div className="mt-5 border-t border-[#24323F] pt-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[#94A3B8]">A partir de</span>
            <div className="font-mono text-xl font-bold tabular-nums text-[#F8FAFC]">
              {formattedPrice}
            </div>
          </div>
          {product.originalPrice && (
            <span className="font-mono text-xs text-[#64748B] line-through">
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/produtos/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#24323F] bg-[#1B242D] py-2 text-xs font-medium text-[#F8FAFC] transition-colors hover:bg-[#24323F]"
          >
            <span>Ver detalhes</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <a
            href={whatsappUrl}
            target={currentStore ? '_blank' : '_self'}
            rel={currentStore ? 'noopener noreferrer' : undefined}
            className="flex items-center justify-center rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-[#0B0F12] transition-colors hover:bg-[#059669]"
            title="Consultar disponibilidade no WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
