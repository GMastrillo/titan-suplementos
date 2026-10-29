import React, { Suspense } from 'react';
import { getAllProducts, getAllStores } from '@/services/catalog-service';
import { ProductCard } from '@/components/ProductCard';
import { ShoppingBag, Filter } from 'lucide-react';
import Link from 'next/link';

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const allProducts = await getAllProducts();
  const stores = await getAllStores();

  const filteredProducts = categoria && categoria !== 'TODOS'
    ? allProducts.filter((p) => p.category === categoria)
    : allProducts;

  const categories = [
    { key: 'TODOS', label: 'Todos os Suplementos' },
    { key: 'PROTEINAS', label: 'Proteínas' },
    { key: 'CREATINAS', label: 'Creatinas' },
    { key: 'PRE_TREINO', label: 'Pré-Treino' },
    { key: 'AMINOACIDOS', label: 'Aminoácidos' },
    { key: 'VITAMINAS', label: 'Saúde & Vitaminas' },
    { key: 'SNACKS_BARRAS', label: 'Snacks & Barras' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1 text-xs font-semibold text-[#10B981]">
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Catálogo Unificado da Rede</span>
        </div>
        <h1 className="mt-4 text-3xl font-black text-[#F8FAFC] sm:text-4xl">
          Suplementação de Alta Performance
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-xs text-[#94A3B8] sm:text-sm">
          Todos os produtos contam com laudos de pureza e disponibilidade para consulta nas 5 lojas físicas.
        </p>
      </div>

      {/* Filtros de Categoria */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 border-b border-[#24323F] pb-6">
        <div className="mr-2 flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <Filter className="h-3.5 w-3.5 text-[#10B981]" />
          <span>Categorias:</span>
        </div>
        {categories.map((cat) => {
          const isActive = (!categoria && cat.key === 'TODOS') || categoria === cat.key;
          return (
            <Link
              key={cat.key}
              href={cat.key === 'TODOS' ? '/produtos' : `/produtos?categoria=${cat.key}`}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#10B981] text-[#0B0F12] font-semibold'
                  : 'border border-[#24323F] bg-[#131A20] text-[#94A3B8] hover:border-[#10B981] hover:text-[#F8FAFC]'
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Grid de Produtos com Suspense */}
      <Suspense fallback={<div className="text-center text-xs text-[#94A3B8]">Carregando catálogo...</div>}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} currentStore={stores[0]} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
