# Design System — Titan Performance Athletic

## 1. Conceito e Arquetipo
O conceito estético baseia-se em **Athletic Prestige & High-Performance Vitality**:
- Transmite autoridade técnica, pureza de ingredientes e energia atlética.
- Evita templates genéricos de e-commerce e foca em contrastes marcantes e leitura rápida.

## 2. Paleta Oficial (`tokens.json`)
| Papel | Hex | Descrição |
|---|---|---|
| Background Dark | `#0B0F12` | Fundo principal da aplicação |
| Surface Elevated | `#131A20` | Cartões de produto e superfícies de destaque |
| Surface Highlight | `#1B242D` | Estados ativos e hover de cartões |
| Border Wireframe | `#24323F` | Bordas sutis de separação |
| Brand Primary | `#10B981` | Verde Titan Volt (CTA, badges de estoque, sucesso) |
| Brand Accent | `#00E599` | Destaque e luz em gradientes de alta performance |
| Oportunidade Comercial | `#F59E0B` | Âmbar de alerta e fechamento de vendas |
| Badge de IA | `#8B5CF6` | Roxo cognitivo para transparência de IA no Copiloto |
| Text Primary | `#F8FAFC` | Texto de alto contraste e legibilidade |
| Text Secondary | `#94A3B8` | Metadados, descrições secundárias e dosagens |

## 3. Tipografia e Proporções
- Títulos: Fonte sans com peso 600 ou 700.
- Valores Numéricos e Preços: `font-mono tabular-nums` para alinhamento fiscal e legibilidade perfeita.
- Raios de Borda: `rounded-xl` (16px) em cartões e `rounded-lg` (10px) em botões e inputs.

## 4. Acessibilidade (WCAG AA)
- Todos os contrastes de texto sobre superfície atendem ao ratio mínimo de 4.5:1.
- Elementos interativos possuem estados de `:focus-visible` destacados.
- Imagens de produtos contêm textos alternativos (`alt`) descritivos e semânticos.
