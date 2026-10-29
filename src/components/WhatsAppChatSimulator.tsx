'use client';

import React, { useState } from 'react';
import { Store, Product, ChatMessage } from '@/schemas/domain';
import { Send, Bot, Clock, Sparkles } from 'lucide-react';
import { classifyMessageIntent, generateSuggestedResponses, generateConversationSummary } from '@/services/ai-copilot-service';

interface WhatsAppChatSimulatorProps {
  currentStore: Store;
  initialProduct?: Product;
}

export function WhatsAppChatSimulator({ currentStore, initialProduct }: WhatsAppChatSimulatorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'CUSTOMER',
      senderName: 'Cliente Interessado',
      content: initialProduct
        ? `Olá! Vi o ${initialProduct.name} no site da loja ${currentStore.name}. Vocês têm disponível para retirada hoje?`
        : `Olá! Gostaria de saber o horário de funcionamento da loja ${currentStore.name} e tirar uma dúvida.`,
      timestamp: '14:32',
      isAiGenerated: false,
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  // IA analisa a última mensagem do cliente
  const lastCustomerMessage = [...messages].reverse().find((m) => m.sender === 'CUSTOMER')?.content || '';
  const detectedIntent = classifyMessageIntent(lastCustomerMessage);
  const suggestions = generateSuggestedResponses(detectedIntent, lastCustomerMessage, currentStore, initialProduct);
  const summary = generateConversationSummary(messages, currentStore, initialProduct);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `m-cust-${prev.length + 1}`,
        sender: 'CUSTOMER',
        senderName: 'Cliente',
        content: text,
        timestamp: '14:35',
        isAiGenerated: false,
      },
    ]);
    setInputVal('');
  };

  const handleApplyAiResponse = (responseContent: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-ai-${prev.length + 1}`,
        sender: 'ATTENDANT',
        senderName: `Atendente (${currentStore.name})`,
        content: responseContent,
        timestamp: '14:36',
        isAiGenerated: true,
        aiReasoning: `Sugestão gerada pela IA e aprovada pelo atendente com base na intenção ${detectedIntent.categoryLabel}.`,
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Coluna 1: Simulador do WhatsApp (Chat do Cliente) */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#24323F] bg-[#131A20] shadow-2xl lg:col-span-7">
        {/* Top bar do WhatsApp */}
        <div className="flex items-center justify-between border-b border-[#24323F] bg-[#1B242D] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] font-bold text-[#0B0F12]">
              TS
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#1B242D] bg-[#00E599]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#F8FAFC]">{currentStore.name}</div>
              <div className="text-xs text-[#10B981] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                Online agora no WhatsApp
              </div>
            </div>
          </div>
          <div className="rounded-md border border-[#24323F] bg-[#0B0F12] px-2.5 py-1 text-xs text-[#94A3B8]">
            {currentStore.phone}
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex h-[420px] flex-col gap-3 overflow-y-auto p-4 bg-[#0B0F12]/60">
          <div className="mx-auto rounded-md bg-[#1B242D] px-3 py-1 text-center text-[11px] text-[#94A3B8]">
            As mensagens são processadas pelo assistente de IA em apoio ao atendente da loja.
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'CUSTOMER' ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                  msg.sender === 'CUSTOMER'
                    ? 'rounded-tl-none border border-[#24323F] bg-[#1B242D] text-[#F8FAFC]'
                    : 'rounded-tr-none bg-[#10B981] text-[#0B0F12] font-medium'
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-3 text-[10px] opacity-75">
                  <span className="font-semibold">{msg.senderName}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="leading-relaxed">{msg.content}</p>

                {msg.isAiGenerated && (
                  <div className="mt-1.5 flex items-center gap-1 border-t border-[#0B0F12]/15 pt-1 text-[10px] font-semibold text-[#0B0F12]/80">
                    <Sparkles className="h-3 w-3" />
                    <span>Resposta assistida por IA (Crawl Mode)</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pré-definidos para teste rápido */}
        <div className="border-t border-[#24323F] bg-[#131A20] px-4 py-2">
          <span className="text-[11px] font-medium text-[#94A3B8]">Testar perguntas frequentes do cliente:</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSendMessage('Vocês têm Creatina Creapure e qual o valor?')}
              className="rounded-md border border-[#24323F] bg-[#1B242D] px-2 py-1 text-[11px] text-[#F8FAFC] transition-colors hover:border-[#10B981]"
            >
              Consultar preço Creatina
            </button>
            <button
              onClick={() => handleSendMessage('Como devo tomar o IsoHydro Whey pós-treino?')}
              className="rounded-md border border-[#24323F] bg-[#1B242D] px-2 py-1 text-[11px] text-[#F8FAFC] transition-colors hover:border-[#10B981]"
            >
              Dúvida técnica de uso
            </button>
            <button
              onClick={() => handleSendMessage('Qual o horário da loja hoje e tem estacionamento?')}
              className="rounded-md border border-[#24323F] bg-[#1B242D] px-2 py-1 text-[11px] text-[#F8FAFC] transition-colors hover:border-[#10B981]"
            >
              Horário e endereço
            </button>
            <button
              onClick={() => handleSendMessage('Quero falar com um atendente da loja')}
              className="rounded-md border border-[#24323F] bg-[#1B242D] px-2 py-1 text-[11px] text-[#F8FAFC] transition-colors hover:border-[#F59E0B]"
            >
              Solicitar atendente
            </button>
          </div>
        </div>

        {/* Input de mensagem */}
        <div className="flex items-center gap-2 border-t border-[#24323F] bg-[#1B242D] p-3">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite como se fosse um cliente pelo WhatsApp..."
            className="flex-1 rounded-lg border border-[#24323F] bg-[#0B0F12] px-3.5 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#10B981] focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981] text-[#0B0F12] transition-colors hover:bg-[#059669]"
            aria-label="Enviar mensagem"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Coluna 2: Painel do Atendente com Copiloto IA */}
      <div className="flex flex-col gap-4 lg:col-span-5">
        {/* Card: Diagnóstico de Intenção pela IA */}
        <div className="rounded-2xl border border-[#24323F] bg-[#131A20] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-bold text-[#F8FAFC]">Diagnóstico da IA em Tempo Real</h3>
            </div>
            <span className="rounded-full bg-[#8B5CF6]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#8B5CF6]">
              {(detectedIntent.confidenceScore * 100).toFixed(0)}% Confiança
            </span>
          </div>

          <div className="mt-3 rounded-lg border border-[#24323F] bg-[#0B0F12] p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8]">Intenção Detectada:</span>
              <span className="font-semibold text-[#10B981]">{detectedIntent.categoryLabel}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[#94A3B8]">Oportunidade Comercial:</span>
              <span className={detectedIntent.isCommercialOpportunity ? 'font-bold text-[#F59E0B]' : 'text-[#94A3B8]'}>
                {detectedIntent.isCommercialOpportunity ? 'Sim (Lead Quente)' : 'Informativo'}
              </span>
            </div>
            <div className="mt-2 border-t border-[#24323F] pt-2 text-[#94A3B8]">
              <strong className="text-[#F8FAFC]">Ação Recomendada: </strong>
              {detectedIntent.recommendedAction}
            </div>
          </div>
        </div>

        {/* Card: Sugestões de Respostas para o Atendente */}
        <div className="rounded-2xl border border-[#24323F] bg-[#131A20] p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#10B981]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Respostas Sugeridas (1 Clique)
              </h4>
            </div>
            <span className="text-[10px] text-[#94A3B8]">Atendente aprova antes</span>
          </div>

          <div className="space-y-2.5">
            {suggestions.map((sug) => (
              <div
                key={sug.id}
                className="rounded-xl border border-[#24323F] bg-[#1B242D] p-3 transition-colors hover:border-[#10B981]"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#F8FAFC]">{sug.title}</span>
                  <span className="rounded bg-[#0B0F12] px-2 py-0.5 text-[9px] font-medium text-[#94A3B8]">
                    Tom: {sug.tone}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">{sug.content}</p>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleApplyAiResponse(sug.content)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-[#0B0F12] transition-colors hover:bg-[#059669]"
                  >
                    <span>Aprovar e Enviar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Atendimento */}
          <div className="mt-4 rounded-xl border border-[#24323F] bg-[#0B0F12] p-3">
            <h5 className="text-[11px] font-bold text-[#F8FAFC] flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Síntese Automática do Histórico</span>
            </h5>
            <pre className="mt-1.5 text-[11px] font-mono text-[#94A3B8] whitespace-pre-wrap leading-relaxed">
              {summary}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
