import React from 'react';
import Link from 'next/link';
import { getAllStores } from '@/services/catalog-service';
import { Store as StoreIcon, MapPin, Clock, Phone, MessageCircle, ArrowRight } from 'lucide-react';

export default async function LojasPage() {
  const stores = await getAllStores();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1 text-xs font-semibold text-[#10B981]">
          <StoreIcon className="h-3.5 w-3.5" />
          <span>Rede Integrada • 5 Lojas</span>
        </div>
        <h1 className="mt-4 text-3xl font-black text-[#F8FAFC] sm:text-4xl">
          Nossas 5 Unidades Físicas
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#94A3B8] sm:text-sm">
          Cada loja possui atendimento especializado, estacionamento conveniente e canal de WhatsApp direto com nutricionistas e consultores de vendas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store.id}
            className="flex flex-col justify-between rounded-xl border border-[#24323F] bg-[#131A20] p-6 transition-all hover:border-[#10B981] hover:bg-[#1B242D]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                  {store.city} • {store.state}
                </span>
                {store.isFlagship && (
                  <span className="rounded bg-[#10B981]/15 px-2 py-0.5 text-[10px] font-bold text-[#10B981]">
                    Flagship Store
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-lg font-bold text-[#F8FAFC]">{store.name}</h2>
              <p className="mt-1 text-xs text-[#94A3B8]">{store.neighborhood}</p>

              <div className="mt-6 space-y-3 text-xs text-[#94A3B8]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{store.openingHours}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-[#10B981] shrink-0" />
                  <span>{store.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#24323F] pt-4">
              <div className="text-[11px] text-[#94A3B8] mb-3">
                Gestão da Unidade: <strong className="text-[#F8FAFC]">{store.managerName}</strong>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/lojas/${store.slug}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#24323F] bg-[#0B0F12] py-2.5 text-xs font-semibold text-[#F8FAFC] hover:bg-[#24323F]"
                >
                  <span>Ver Vitrine Local</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${store.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#10B981] px-4 py-2.5 text-xs font-bold text-[#0B0F12] hover:bg-[#059669]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
