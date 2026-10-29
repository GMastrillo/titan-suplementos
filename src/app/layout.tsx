import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rede Titan Suplementos — 5 Lojas & Atendimento Inteligente',
  description: 'Digitalização comercial de rede com 5 lojas físicas de suplementação esportiva. Conheça nossos produtos e converse diretamente no WhatsApp da unidade com suporte de IA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-[#0B0F12] text-[#F8FAFC]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
