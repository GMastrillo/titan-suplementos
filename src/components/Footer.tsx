import React from 'react';
import Link from 'next/link';
import { storesMock } from '@/services/catalog-service';
import { ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-[#24323F] bg-[#0B0F12] text-[#94A3B8]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-[#F8FAFC]">TITAN SUPLEMENTOS</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">
              Digitalização comercial de rede com 5 lojas físicas de nutrição esportiva e longevidade.
              Atendimento consultivo potencializado por Inteligência Artificial.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#10B981]">
              <ShieldCheck className="h-4 w-4" />
              <span>Produtos 100% Autênticos com Laudo</span>
            </div>
          </div>

          {/* As 5 Unidades */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              As 5 Unidades Físicas
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {storesMock.map((store) => (
                <li key={store.id}>
                  <Link
                    href={`/lojas/${store.slug}`}
                    className="transition-colors hover:text-[#10B981]"
                  >
                    {store.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias Principais */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Suplementos Principais
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/produtos?categoria=PROTEINAS" className="transition-colors hover:text-[#10B981]">
                  Proteínas Isoladas e Hidrolisadas
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=CREATINAS" className="transition-colors hover:text-[#10B981]">
                  Creatina Monohidratada Creapure
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=PRE_TREINO" className="transition-colors hover:text-[#10B981]">
                  Pré-Treino & Foco Mental
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=VITAMINAS" className="transition-colors hover:text-[#10B981]">
                  Ômega 3 TG e Vitaminas
                </Link>
              </li>
            </ul>
          </div>

          {/* Demonstração de IA & WhatsApp */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Inovação Comercial
            </h4>
            <p className="mt-3 text-xs leading-relaxed">
              Demonstração do Módulo de Atendimento Inteligente com IA integrado às lojas.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/atendimento"
                className="flex items-center gap-2 rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-2 text-xs font-semibold text-[#F8FAFC] transition-colors hover:bg-[#8B5CF6]/20"
              >
                <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
                <span>Simulador de Copiloto IA</span>
              </Link>
              <Link
                href="/lojas"
                className="flex items-center gap-2 rounded-lg border border-[#24323F] bg-[#131A20] px-3 py-2 text-xs font-medium text-[#F8FAFC] transition-colors hover:bg-[#1B242D]"
              >
                <MessageCircle className="h-4 w-4 text-[#10B981]" />
                <span>Contatos no WhatsApp</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#24323F] pt-6 text-center text-xs text-[#64748B]">
          <p>© {currentYear} Rede Titan Suplementos — MVP de Digitalização Comercial. Demonstração de Solução.</p>
          <p className="mt-1">
            Suplementos alimentares dispensados de registro conforme RDC Anvisa 240/2018. Não substituem prescrição médica.
          </p>
        </div>
      </div>
    </footer>
  );
}
