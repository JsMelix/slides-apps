import { Slide } from './types';

export const INITIAL_SLIDES: Slide[] = [
  {
    id: '1',
    title: 'x402: El Protocolo de Pagos Nativo de Internet',
    subtitle: 'Estándar Abierto • Coinbase & Partners',
    tagline: 'AUTONOMÍA ECONÓMICA DE LA WEB',
    description: 'Descubre cómo la resurrección del código de estado original de internet HTTP 402 (Payment Required) permite pagos instantáneos con stablecoins para APIs, software y agentes de Inteligencia Artificial.',
    iconName: 'rocket',
    accentColor: 'cyan',
    keyPoints: [
      'Estándar abierto y neutral',
      'Integración nativa con Web3 L2 (Base)',
      'Pagos ultra-baratos con USDC'
    ]
  },
  {
    id: '2',
    title: '¿Qué es x402 y de dónde viene?',
    subtitle: 'El Código de Estado Resucitado',
    tagline: 'HISTORIA Y ORIGEN',
    description: 'En 1996, se reservó el código HTTP 402 (Payment Required) para futuros sistemas de cobro digital. Por falta de tecnología financiera, quedó olvidado por décadas. Hoy x402 lo revive con la tecnología idónea.',
    iconName: 'terminal',
    accentColor: 'purple',
    keyPoints: [
      'Resucita el código HTTP 402',
      'Usa Stablecoins (USDC) como colateral',
      'Impulsado por redes L2 como Base'
    ]
  },
  {
    id: '3',
    title: 'Base + USDC: El Motor de las Microtransacciones',
    subtitle: 'La Autopista Rápida y la Moneda Estable',
    tagline: 'INFRAESTRUCTURA CLAVE',
    description: 'Para que x402 sea práctico, necesita superar las barreras de las comisiones altas y la volatilidad. Aquí es donde entran estos dos pilares tecnológicos:',
    iconName: 'coins',
    accentColor: 'amber',
    keyPoints: [
      'Base (L2): La red de Coinbase que procesa pagos en milisegundos por menos de un centavo.',
      'USDC: Moneda digital regulada y estable siempre equivalente a 1 Dólar, sin volatilidad.',
      'Sinergia Total: Permite micro-cobros exactos de $0.01 de forma completamente viable.'
    ]
  },
  {
    id: '4',
    title: '¿Para qué sirve? Casos de Uso Reales',
    subtitle: 'Economía "Pay-As-You-Go" sin límites',
    tagline: 'VALOR PRÁCTICO',
    description: 'Habilita una economía de pago por uso instantánea, omitiendo molestas suscripciones mensuales y pasarelas de pago lentas y centralizadas.',
    iconName: 'coins',
    accentColor: 'emerald',
    keyPoints: [
      'APIs de Pago por Uso exacto',
      'Desbloqueo de Software y Posts on-demand',
      'Seguridad total sin API Keys tradicionales'
    ]
  },
  {
    id: '5',
    title: 'Autonomía Total para Agentes de IA',
    subtitle: 'Las Máquinas como Actores Económicos',
    tagline: 'EL FUTURO DE LA IA',
    description: 'Los agentes de IA pueden negociar, comprar recursos de cómputo (GPUs), acceder a bases de datos y pagar a otros agentes de forma 100% autónoma a través del protocolo.',
    iconName: 'robot',
    accentColor: 'purple',
    keyPoints: [
      'IA realiza transacciones autónomas',
      'Pago milimétrico por segundo de GPU',
      'Negociación de agente a agente'
    ]
  },
  {
    id: '6',
    title: '¿Cómo funciona el protocolo?',
    subtitle: 'Flujo Técnico Paso a Paso',
    tagline: 'ARQUITECTURA DEL PROTOCOLO',
    description: 'Una interacción fluida entre Cliente, Servidor y Blockchain en milisegundos:',
    iconName: 'cpu',
    accentColor: 'cyan',
    keyPoints: [
      '1. Cliente solicita datos protegidos',
      '2. Servidor devuelve 402 Payment Required',
      '3. Cliente firma y paga transacción en L2',
      '4. Servidor valida y entrega los datos'
    ]
  },
  {
    id: '7',
    title: 'La Revolución de los "5 Ceros"',
    subtitle: 'Los Pilares de la Experiencia x402',
    tagline: 'FILOSOFÍA DE DISEÑO',
    description: 'x402 redefine las finanzas del software eliminando todas las fricciones tradicionales:',
    iconName: 'shield',
    accentColor: 'emerald',
    keyPoints: [
      'Cero Tarifas de pasarela centralizada',
      'Cero Esperas: asentamiento instantáneo',
      'Cero Fricción: sin formularios ni tarjetas',
      'Cero Centralización: estándar neutral',
      'Cero Restricciones de red o monedero'
    ]
  },
  {
    id: '8',
    title: 'Un Ecosistema en Pleno Crecimiento',
    subtitle: 'Respaldado por Gigantes Tecnológicos',
    tagline: 'ADOPCIÓN GLOBAL',
    description: 'Grandes empresas e infraestructuras del internet y de la blockchain están integrando y promoviendo el estándar x402 para dar autonomía económica a la Web.',
    iconName: 'globe',
    accentColor: 'purple',
    keyPoints: [
      'Coinbase & Stripe',
      'Amazon Web Services (AWS)',
      'Circle & Alchemy & Vercel',
      'Anthropic & NEAR Protocol'
    ]
  }
];
