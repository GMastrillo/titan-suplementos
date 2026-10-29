import { CustomerIntent, SuggestedResponse, ChatMessage, Store, Product } from '@/schemas/domain';

export function classifyMessageIntent(message: string): CustomerIntent {
  const lower = message.toLowerCase();

  // 1. Intenção de Transbordo Humano
  if (lower.includes('atendente') || lower.includes('humano') || lower.includes('falar com pessoa') || lower.includes('gerente')) {
    return {
      category: 'HUMAN_HANDOFF',
      categoryLabel: 'Transbordo para Atendente Humano',
      confidenceScore: 0.98,
      isCommercialOpportunity: false,
      urgency: 'ALTA',
      detectedTopic: 'Solicitação direta de atendente da unidade',
      recommendedAction: 'Transferir imediatamente o diálogo para o operador responsável da loja.',
    };
  }

  // 2. Intenção Comercial / Oportunidade de Compra
  if (
    lower.includes('preço') ||
    lower.includes('valor') ||
    lower.includes('comprar') ||
    lower.includes('desconto') ||
    lower.includes('pagamento') ||
    lower.includes('disponibilidade') ||
    lower.includes('tem no estoque') ||
    lower.includes('entrega') ||
    lower.includes('quanto custa')
  ) {
    return {
      category: 'COMMERCIAL_OPPORTUNITY',
      categoryLabel: 'Oportunidade Comercial de Venda',
      confidenceScore: 0.94,
      isCommercialOpportunity: true,
      urgency: 'ALTA',
      detectedTopic: 'Interesse de compra e consulta comercial',
      recommendedAction: 'Apresentar condições de retirada imediata ou envio local e confirmar a unidade preferida.',
    };
  }

  // 3. Intenção de Horários, Endereço e Logística
  if (
    lower.includes('horário') ||
    lower.includes('aberto') ||
    lower.includes('funciona') ||
    lower.includes('endereço') ||
    lower.includes('onde fica') ||
    lower.includes('estacionamento')
  ) {
    return {
      category: 'STORE_HOURS_LOGISTICS',
      categoryLabel: 'Informações de Unidade & Logística',
      confidenceScore: 0.95,
      isCommercialOpportunity: false,
      urgency: 'MEDIA',
      detectedTopic: 'Localização, horários e acesso à loja física',
      recommendedAction: 'Informar dados da loja e convidar o cliente para visita com degustação de suplementos.',
    };
  }

  // 4. Dúvida Técnica Nutricional
  if (
    lower.includes('como tomar') ||
    lower.includes('dosagem') ||
    lower.includes('antes ou depois') ||
    lower.includes('creatina') ||
    lower.includes('whey') ||
    lower.includes('saturação') ||
    lower.includes('efeito colateral') ||
    lower.includes('diferença')
  ) {
    return {
      category: 'TECHNICAL_QUESTION',
      categoryLabel: 'Orientação Técnica sobre Suplemento',
      confidenceScore: 0.92,
      isCommercialOpportunity: true,
      urgency: 'MEDIA',
      detectedTopic: 'Modo de uso, composição e benefícios do suplemento',
      recommendedAction: 'Explicar de forma consultiva e sugerir o produto ideal com base no objetivo informado.',
    };
  }

  // 5. Consulta Geral
  return {
    category: 'GENERAL_INQUIRY',
    categoryLabel: 'Atendimento Geral',
    confidenceScore: 0.85,
    isCommercialOpportunity: false,
    urgency: 'BAIXA',
    detectedTopic: 'Contato inicial e apresentação',
    recommendedAction: 'Saudar calorosamente e identificar o objetivo de treino do cliente.',
  };
}

export function generateSuggestedResponses(
  intent: CustomerIntent,
  customerMessage: string,
  selectedStore?: Store,
  productContext?: Product
): SuggestedResponse[] {
  const storeName = selectedStore?.name ?? 'nossa unidade mais próxima';
  const hours = selectedStore?.openingHours ?? 'de segunda a sábado';
  const productName = productContext?.name ?? 'nosso suplemento';
  const productPrice = productContext ? `R$ ${productContext.price.toFixed(2).replace('.', ',')}` : '';

  if (intent.category === 'COMMERCIAL_OPPORTUNITY') {
    return [
      {
        id: 'sug-comm-1',
        title: 'Sugestão 1: Fechamento Ágil com Retirada',
        content: `Olá! Temos ${productName} disponível para pronta entrega na unidade ${storeName}${productPrice ? ` por ${productPrice}` : ''}. Você prefere retirar no balcão hoje mesmo ou que a gente separe para envio expresso até seu endereço?`,
        tone: 'DIRETO',
        isHumanHandoffRecommended: false,
      },
      {
        id: 'sug-comm-2',
        title: 'Sugestão 2: Consultiva com Combinação (Upsell)',
        content: `Temos sim em estoque na ${storeName}! Clientes que levam ${productName} frequentemente combinam com uma Creatina Creapure para maximizar o ganho de força. Gostaria que eu verificasse uma condição especial para o kit completo?`,
        tone: 'CONSULTIVO',
        isHumanHandoffRecommended: false,
      },
      {
        id: 'sug-comm-3',
        title: 'Sugestão 3: Transbordo para Vendedor da Loja',
        content: `Perfeito! Vou direcionar você para o nosso atendente na unidade ${storeName} para confirmar seu pedido e aplicar a melhor condição de pagamento de hoje. Só um instante!`,
        tone: 'PROFISSIONAL',
        isHumanHandoffRecommended: true,
      },
    ];
  }

  if (intent.category === 'TECHNICAL_QUESTION') {
    return [
      {
        id: 'sug-tech-1',
        title: 'Sugestão 1: Guia Prático de Consumo',
        content: `Ótima pergunta! A orientação padrão de uso para ${productName} é tomar 1 dose diária diluída em água gelada, preferencialmente pós-treino ou conforme a orientação do seu nutricionista. Importante lembrar que suplementos alimentares complementam uma dieta equilibrada. Quer ajuda para escolher o melhor sabor?`,
        tone: 'CONSULTIVO',
        isHumanHandoffRecommended: false,
      },
      {
        id: 'sug-tech-2',
        title: 'Sugestão 2: Foco em Absorção e Rendimento',
        content: `O diferencial do ${productName} é a pureza biológica e rápida assimilação. Se o seu foco for recuperação muscular, ele atua diretamente diminuindo o catabolismo. Temos na ${storeName} para você conhecer a tabela nutricional completa.`,
        tone: 'PROFISSIONAL',
        isHumanHandoffRecommended: false,
      },
    ];
  }

  if (intent.category === 'STORE_HOURS_LOGISTICS') {
    return [
      {
        id: 'sug-store-1',
        title: 'Sugestão 1: Horários e Localização',
        content: `A unidade ${storeName} fica em ${selectedStore?.address ?? 'nossa loja central'}. Nosso horário de funcionamento é: ${hours}. Venha tomar um café conosco e experimentar um shake proteico!`,
        tone: 'PROFISSIONAL',
        isHumanHandoffRecommended: false,
      },
    ];
  }

  if (intent.category === 'HUMAN_HANDOFF') {
    return [
      {
        id: 'sug-handoff-1',
        title: 'Sugestão 1: Conexão com Atendente Humano',
        content: `Com certeza! Já estou chamando o atendente da unidade ${storeName} para continuar seu atendimento com total atenção. O histórico da nossa conversa já foi resumido para ele.`,
        tone: 'URGENTE',
        isHumanHandoffRecommended: true,
      },
    ];
  }

  return [
    {
      id: 'sug-gen-1',
      title: 'Sugestão Padrão: Boas-vindas da Rede',
      content: `Olá! Bem-vindo à Rede Titan Suplementos. Como posso auxiliar você hoje a alcançar seu melhor objetivo esportivo na unidade ${storeName}?`,
      tone: 'PROFISSIONAL',
      isHumanHandoffRecommended: false,
    },
  ];
}

export function generateConversationSummary(
  messages: ChatMessage[],
  store?: Store,
  product?: Product
): string {
  const storeLabel = store?.name ?? 'Rede Titan (Geral)';
  const productLabel = product?.name ?? 'Não especificado';
  const userMessages = messages.filter((m) => m.sender === 'CUSTOMER');
  const count = userMessages.length;

  return `Resumo do Atendimento:\n- Unidade de Interesse: ${storeLabel}\n- Produto Contextualizado: ${productLabel}\n- Total de mensagens do cliente: ${count}\n- Assunto predominante: ${userMessages[userMessages.length - 1]?.content.slice(0, 80) ?? 'Início do contato'}\n- Status: Contexto pronto para continuidade pelo atendente da loja.`;
}

export function buildWhatsAppLink(store: Store, product?: Product, customGreeting?: string): string {
  const greeting = customGreeting || (product
    ? `Olá equipe da ${store.name}! Vi o suplemento ${product.name} (R$ ${product.price.toFixed(2)}) no site e gostaria de consultar a disponibilidade para retirada ou entrega hoje.`
    : `Olá equipe da ${store.name}! Gostaria de tirar uma dúvida sobre produtos e atendimento na loja.`);

  const encoded = encodeURIComponent(greeting);
  return `https://wa.me/${store.whatsappNumber}?text=${encoded}`;
}
