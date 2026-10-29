'use client';

import React, { useState } from 'react';
import { storesMock, productsMock } from '@/services/catalog-service';
import { WhatsAppChatSimulator } from '@/components/WhatsAppChatSimulator';
import { Sparkles, Store as StoreIcon, Package, Info } from 'lucide-react';

export default function AtendimentoPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-1');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-1');

  const currentStore = storesMock.find((s) => s.id === selectedStoreId) || storesMock[0];
  const currentProduct = productsMock.find((p) => p.id === selectedProductId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header do Módulo */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3.5 py-1.5 text-xs font-semibold text-[#8B5CF6]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Módulo 1 — Demonstração Operacional de IA</span>
        </div>
        <h1 className="mt-3 text-2xl font-black text-[#F8FAFC] sm:text-3xl">
          Atendimento Inteligente com IA no WhatsApp
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-[#94A3B8] sm:text-sm">
          Simule a jornada completa: um cliente enviando dúvidas sobre disponibilidade, modo de uso ou preços, e veja o assistente de IA orientando o atendente da unidade em tempo real com sugestões profissionais e classificação de intenções.
        </p>
      </div>

      {/* Barra de Controles de Demonstração (Selecionar Unidade e Produto Contextualizado) */}
      <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-[#24323F] bg-[#131A20] p-4 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC]">
            <StoreIcon className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Unidade Física de Atendimento:</span>
          </label>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#24323F] bg-[#0B0F12] px-3 py-2 text-xs text-[#F8FAFC] focus:border-[#10B981] focus:outline-none"
          >
            {storesMock.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name} — {store.city} ({store.state})
              </option>
            ))}
          </select>
          <span className="mt-1 block text-[11px] text-[#94A3B8]">
            Responsável: {currentStore.managerName}
          </span>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#F8FAFC]">
            <Package className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Suplemento em Discussão (Contexto Inicial):</span>
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#24323F] bg-[#0B0F12] px-3 py-2 text-xs text-[#F8FAFC] focus:border-[#10B981] focus:outline-none"
          >
            {productsMock.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name} — R$ {prod.price.toFixed(2).replace('.', ',')}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-[11px] text-[#94A3B8]">
            Categoria: {currentProduct?.categoryLabel}
          </span>
        </div>
      </div>

      {/* O Simulador Interativo */}
      <WhatsAppChatSimulator
        key={`${selectedStoreId}-${selectedProductId}`}
        currentStore={currentStore}
        initialProduct={currentProduct}
      />

      {/* Nota Explicativa de Arquitetura e Futuras Integrações */}
      <div className="mt-8 rounded-xl border border-[#24323F] bg-[#131A20] p-4 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-2 font-semibold text-[#F8FAFC]">
          <Info className="h-4 w-4 text-[#10B981]" />
          <span>Como funciona a transição para produção:</span>
        </div>
        <p className="mt-2 leading-relaxed">
          Neste MVP, o fluxo demonstra a lógica de classificação, IA copiloto e geração de respostas assistidas em tempo real. Na fase de produção, a camada de webhook conectará diretamente à API oficial do WhatsApp Business Cloud ou provedores autorizados (Meta Cloud API / Z-API), sem alterar os sistemas de estoque existentes.
        </p>
      </div>
    </div>
  );
}
