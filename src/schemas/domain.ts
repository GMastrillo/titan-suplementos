import { z } from 'zod';

export const StoreSchema = z.object({
  id: z.string().min(2).max(50),
  name: z.string().min(3).max(100),
  slug: z.string().min(2).max(50),
  city: z.string().min(2).max(60),
  state: z.string().length(2),
  address: z.string().min(5).max(200),
  neighborhood: z.string().min(2).max(80),
  phone: z.string().min(8).max(25),
  whatsappNumber: z.string().min(10).max(20),
  openingHours: z.string().min(5).max(100),
  managerName: z.string().min(2).max(80),
  isFlagship: z.boolean().default(false),
});

export type Store = z.infer<typeof StoreSchema>;

export const ProductCategoryEnum = z.enum([
  'PROTEINAS',
  'AMINOACIDOS',
  'CREATINAS',
  'PRE_TREINO',
  'VITAMINAS',
  'SNACKS_BARRAS',
]);

export type ProductCategory = z.infer<typeof ProductCategoryEnum>;

export const ProductSchema = z.object({
  id: z.string().min(2).max(50),
  name: z.string().min(3).max(120),
  slug: z.string().min(2).max(100),
  category: ProductCategoryEnum,
  categoryLabel: z.string().min(2).max(50),
  brand: z.string().min(2).max(60),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  shortDescription: z.string().min(10).max(250),
  detailedDescription: z.string().min(20).max(1200),
  nutritionalHighlights: z.array(z.string().max(80)).min(1).max(6),
  servingSize: z.string().min(2).max(60),
  inStock: z.boolean().default(true),
  stockBadge: z.string().max(40).default('Disponível na Rede'),
  imageUrl: z.string().max(300),
});

export type Product = z.infer<typeof ProductSchema>;

export const IntentCategoryEnum = z.enum([
  'COMMERCIAL_OPPORTUNITY',
  'TECHNICAL_QUESTION',
  'STORE_HOURS_LOGISTICS',
  'HUMAN_HANDOFF',
  'GENERAL_INQUIRY',
]);

export type IntentCategory = z.infer<typeof IntentCategoryEnum>;

export const CustomerIntentSchema = z.object({
  category: IntentCategoryEnum,
  categoryLabel: z.string().min(2).max(80),
  confidenceScore: z.number().min(0).max(1),
  isCommercialOpportunity: z.boolean(),
  urgency: z.enum(['ALTA', 'MEDIA', 'BAIXA']),
  detectedTopic: z.string().min(2).max(120),
  recommendedAction: z.string().min(5).max(250),
});

export type CustomerIntent = z.infer<typeof CustomerIntentSchema>;

export const SuggestedResponseSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(80),
  content: z.string().min(10).max(600),
  tone: z.enum(['PROFISSIONAL', 'CONSULTIVO', 'DIRETO', 'URGENTE']),
  isHumanHandoffRecommended: z.boolean(),
});

export type SuggestedResponse = z.infer<typeof SuggestedResponseSchema>;

export const ChatMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(['CUSTOMER', 'AI_ASSISTANT', 'ATTENDANT', 'SYSTEM']),
  senderName: z.string().max(60),
  content: z.string().min(1).max(1000),
  timestamp: z.string(),
  isAiGenerated: z.boolean().default(false),
  aiReasoning: z.string().max(300).optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
