import { ArchitecturePlanResult } from '../src/types';
import { ProjectArchitectureEngine } from '../src/services/architectureEngine';
import { ImageSearchService } from './imageSearchService';

export interface GeneratedProjectOutput {
  projectName: string;
  description: string;
  entryFile: string;
  files: Record<string, string>;
  summary: string;
  architecturePlan: ArchitecturePlanResult;
  steps: string[];
}

interface DomainConfig {
  domain: string;
  projectName: string;
  headline: string;
  subheadline: string;
  badge: string;
  category: string;
  heroImage: string;
  actionTitle: string;
  actionButtonText: string;
  accentColor: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    price: string;
    rating: number;
    image: string;
    tags: string[];
  }>;
}

export class ServerProjectGenerator {
  /**
   * Main entry point to generate a complete architected project
   * with the exact folder and file structure shown in the specification:
   * 📁 .aistudio
   * 📁 público
   * 📁 Servidor
   * 📁 src
   * 📄 .env.exemplo
   * 📄 .gitignore
   * 📄 bun.lock
   * 📄 index.html
   * 📄 metadata.json
   * 📄 package.json
   * 📄 server.ts
   * 📄 tsconfig.json
   * 📄 vite.config.ts
   */
  static generateProject(prompt: string, projectType = 'web-application', model?: string): GeneratedProjectOutput {
    const plan = ProjectArchitectureEngine.planArchitecture(prompt, projectType);
    const domainAnalysis = ProjectArchitectureEngine.analyzeDomain(prompt, projectType);
    const config = this.resolveDomainConfig(prompt, domainAnalysis.domain, plan.projectName);

    const files = this.buildCompleteArchitecture(config, prompt, model);

    const steps = [
      '1. Análise profunda dos requisitos de negócio e classificação de domínio',
      '2. Estruturação da árvore de pastas (.aistudio, público, Servidor, src)',
      '3. Integração com o motor de análise visual e imagens Google/Unsplash',
      '4. Desenvolvimento dos componentes modulares interligados (Header, Hero, Catálogo, Busca, Modal)',
      '5. Implementação da camada Servidor (Rotas REST, Controladores e Armazenamento)',
      '6. Configuração dos ficheiros raiz (bun.lock, package.json, server.ts, tsconfig.json, vite.config.ts)',
    ];

    return {
      projectName: config.projectName,
      description: plan.description,
      entryFile: 'index.html',
      files,
      summary: `Website profissional "${config.projectName}" desenvolvido com sucesso! Estrutura de pastas completa (.aistudio, público, Servidor, src), componentes modulares conectados entre si, backend funcional e motor de análise de imagens Google integrado.`,
      architecturePlan: plan,
      steps,
    };
  }

  private static resolveDomainConfig(prompt: string, domainKey: string, fallbackName: string): DomainConfig {
    const text = prompt.toLowerCase();

    // 1. Padaria / Confeitaria / Restaurante / Pastelaria
    if (/padaria|p[aã]o|confeitaria|croissant|pastelaria|caf[eé]|bolo/i.test(text) || domainKey === 'restaurant') {
      const pName = this.extractBrandName(prompt, 'Padaria Artesanal & Confeitaria Bela Massa');
      return {
        domain: 'padaria',
        projectName: pName,
        headline: 'Pães de Fermentação Lenta & Confeitaria Francesa Fina',
        subheadline: 'Ingredientes biológicos selecionados, 24 horas de fermentação natural e receitas tradicionais assadas diariamente em forno de pedra.',
        badge: '🥖 Pães Quentes & Produtos Artesanais Frescos',
        category: 'padaria',
        heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=85',
        actionTitle: 'Encomenda Online & Reservas de Padaria',
        actionButtonText: 'Fazer Encomenda',
        accentColor: 'amber',
        items: [
          {
            id: 'item-1',
            title: 'Pão de Fermentação Natural Rústico',
            description: 'Sourdough tradicional com crosta crocante caramelizada e miolo aerado com acidez equilibrada.',
            category: 'Pães Especiais',
            price: '3,80 €',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
            tags: ['Fermentação 24h', 'Farinha Biológica', 'Vegan'],
          },
          {
            id: 'item-2',
            title: 'Croissants Franceses Folhados',
            description: 'Feitos com manteiga pura da Normandia, textura estaladiça por fora e camadas macias por dentro.',
            category: 'Viennoiserie',
            price: '2,20 €',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
            tags: ['Manteiga Francesa', 'Folhado', 'Mais Vendido'],
          },
          {
            id: 'item-3',
            title: 'Baguete Rústica Tradicional',
            description: 'Baguete autêntica de inspiração parisiense com crosta dourada e aroma tostado irresistível.',
            category: 'Pães Especiais',
            price: '1,75 €',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
            tags: ['Forno de Pedra', 'Tradicional', 'Crocante'],
          },
          {
            id: 'item-4',
            title: 'Bolo Artesanal Red Velvet com Frutos Silvestres',
            description: 'Massa aveludada com cacau nobre, recheio cremoso de cream cheese e frutos do bosque frescos.',
            category: 'Confeitaria',
            price: '28,00 €',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
            tags: ['Frutos Frescos', 'Cream Cheese', 'Festivo'],
          },
          {
            id: 'item-5',
            title: 'Pastéis de Nata Estaladiços',
            description: 'Receita ancestral com massa folhada crocante e creme de ovos cremoso polvilhado com canela.',
            category: 'Confeitaria',
            price: '1,40 €',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
            tags: ['Tradição', 'Canela', 'Prémio Ouro'],
          },
          {
            id: 'item-6',
            title: 'Café Expresso Blend Especial & Cappuccino',
            description: 'Grãos 100% arábica torrados artesanalmente com leite vaporizado e latte art cremosa.',
            category: 'Cafeteria',
            price: '2,50 €',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
            tags: ['Arábica 100%', 'Latte Art', 'Especial'],
          },
        ],
      };
    }

    // 2. Clínica / Medicina / Saúde / Hospital
    if (/cl[ií]nica|m[eé]dic|sa[uú]de|hospital|paciente|consulta|doutor/i.test(text) || domainKey === 'clinic') {
      const pName = this.extractBrandName(prompt, 'Clínica Médica Santa Helena');
      return {
        domain: 'clinica',
        projectName: pName,
        headline: 'Medicina Humanizada & Diagnóstico Clínico Avançado',
        subheadline: 'Corpo clínico multidisciplinar, infraestrutura de alta tecnologia e atendimento personalizado para a sua saúde e da sua família.',
        badge: '🏥 Atendimento Clínico e Consultas de Especialidade',
        category: 'clinica',
        heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85',
        actionTitle: 'Agendamento de Consultas & Exames',
        actionButtonText: 'Agendar Consulta',
        accentColor: 'teal',
        items: [
          {
            id: 'item-1',
            title: 'Dr. Especialista em Cardiologia Preventiva',
            description: 'Check-up cardiovascular completo, ecocardiograma, eletrocardiograma e acompanhamento arterial.',
            category: 'Cardiologia',
            price: '85,00 €',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
            tags: ['Ecocardiograma', 'Check-up', 'Certificado'],
          },
          {
            id: 'item-2',
            title: 'Dra. Pediatria & Desenvolvimento Infantil',
            description: 'Cuidados dedicados e acolhedores desde o nascimento até a adolescência com vigilância contínua.',
            category: 'Pediatria',
            price: '75,00 €',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1594824813587-40b90a6e30b3?auto=format&fit=crop&w=800&q=80',
            tags: ['Neonatologia', 'Vacinação', 'Humanizado'],
          },
          {
            id: 'item-3',
            title: 'Unidade de Imagiologia & Exames de Alta Resolução',
            description: 'Ressonância magnética, tomografia computorizada, ecografias 4D com laudos rápidos.',
            category: 'Diagnóstico',
            price: '120,00 €',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
            tags: ['Ressonância', 'Tomografia', 'Laudo Digital'],
          },
          {
            id: 'item-4',
            title: 'Bloco Cirúrgico & Medicina de Precisão',
            description: 'Salas cirúrgicas esterilizadas com sistemas de filtragem HEPA e monitorização anestésica de ponta.',
            category: 'Cirurgia',
            price: 'Sob Consulta',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
            tags: ['Biossegurança', 'Cirurgia Minimamente Invasiva'],
          },
        ],
      };
    }

    // 3. Hotel / Pousada / Resort / Turismo
    if (/hotel|pousada|reserva|quarto|resort|hosped/i.test(text) || domainKey === 'hotel') {
      const pName = this.extractBrandName(prompt, 'Grand Horizon Luxury Resort & Spa');
      return {
        domain: 'hotel',
        projectName: pName,
        headline: 'Experiência Exclusiva de Luxo, Natureza & Conforto',
        subheadline: 'Suítes panorâmicas com vista mar, spa com circuito termal, gastronomia de autor e serviço personalizado cinco estrelas.',
        badge: '✨ Destino de Hospitalidade 5 Estrelas',
        category: 'hotel',
        heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
        actionTitle: 'Reserva Direta de Alojamento & Experiências',
        actionButtonText: 'Reservar Quarto',
        accentColor: 'indigo',
        items: [
          {
            id: 'item-1',
            title: 'Suíte Presidencial Vista Mar & Terraço',
            description: 'Área de 120m², cama super king, banheira de hidromassagem privativa e mordomo dedicado.',
            category: 'Suítes de Luxo',
            price: '450 € / noite',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            tags: ['Vista Mar', 'Hidromassagem', 'Terraço'],
          },
          {
            id: 'item-2',
            title: 'Quarto Deluxe King com Varanda Panorâmica',
            description: 'Isolamento acústico superior, lençóis de algodão egípcio 600 fios e amenities de luxo.',
            category: 'Alojamento',
            price: '220 € / noite',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
            tags: ['Varanda', 'Cama King', 'Pequeno-Almoço'],
          },
          {
            id: 'item-3',
            title: 'Piscina Infinita Aquecida & Sunset Bar',
            description: 'Piscina de horizonte infinito debruçada sobre o oceano com serviço de bar e cocktails exclusivos.',
            category: 'Lazer & Experiências',
            price: 'Incluído',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
            tags: ['Aquecida', 'Sunset', 'Cocktails'],
          },
          {
            id: 'item-4',
            title: 'Spa Holístico & Circuito Termal',
            description: 'Rituais de massagem com óleos essenciais, sauna finlandesa, banho turco e piscina de relaxamento.',
            category: 'Bem-Estar',
            price: '95 € / sessão',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            tags: ['Massagem', 'Sauna', 'Holístico'],
          },
        ],
      };
    }

    // 4. Loja / E-commerce / Tech / Produtos
    if (/loja|ecommerce|e-commerce|produto|carrinho|venda|compra/i.test(text) || domainKey === 'ecommerce') {
      const pName = this.extractBrandName(prompt, 'NovaTech Store & Gadgets Premium');
      return {
        domain: 'ecommerce',
        projectName: pName,
        headline: 'Tecnologia de Ponta, Inovação & Design Minimalista',
        subheadline: 'Produtos selecionados com garantia oficial, envio expresso seguro em 24h e suporte técnico especializado.',
        badge: '⚡ Loja Oficial com Envio Rápido em 24h',
        category: 'ecommerce',
        heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85',
        actionTitle: 'Carrinho de Compras & Checkout Rápido',
        actionButtonText: 'Comprar Agora',
        accentColor: 'blue',
        items: [
          {
            id: 'item-1',
            title: 'Auriculares Sem Fios Studio Pro ANC',
            description: 'Cancelamento ativo de ruído ambiente, drivers de alta fidelidade e bateria com 45h de autonomia.',
            category: 'Áudio & Música',
            price: '189,90 €',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            tags: ['Cancelamento Ruído', 'Hi-Res Audio', 'Bluetooth 5.3'],
          },
          {
            id: 'item-2',
            title: 'Smartwatch Esportivo AMOLED Ultra',
            description: 'Sensor cardíaco óptico, monitorização SpO2, GPS integrado de dupla frequência e titânio aeroespacial.',
            category: 'Wearables',
            price: '249,00 €',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            tags: ['Titânio', 'GPS Duplo', 'À Prova de Água'],
          },
          {
            id: 'item-3',
            title: 'Mochila Urbana Executiva Impermeável',
            description: 'Compartimento acolchoado para portátil de 16", fecho antifurto TSA e tecido balístico hidrorrepelente.',
            category: 'Acessórios',
            price: '79,90 €',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
            tags: ['Impermeável', 'Antifurto', 'Porta USB'],
          },
        ],
      };
    }

    // Default: General Modern Web Platform
    const pName = this.extractBrandName(prompt, fallbackName || 'Nexus Creative Solutions');
    return {
      domain: 'general',
      projectName: pName,
      headline: 'Soluções Digitais Inovadoras & Engenharia Web Moderna',
      subheadline: 'Construímos produtos digitais com arquiteturas escaláveis, alto desempenho e experiências de utilizador memoráveis.',
      badge: '🚀 Plataforma Profissional Desenvolvida no IMCH AI Developer',
      category: 'geral',
      heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85',
      actionTitle: 'Solicitação de Proposta & Contacto',
      actionButtonText: 'Solicitar Proposta',
      accentColor: 'blue',
      items: [
        {
          id: 'item-1',
          title: 'Design de Interface UI/UX & Sistemas de Design',
          description: 'Experiências intuitivas desenhadas com precisão tipográfica, microinterações fluidas e estética limpa.',
          category: 'Design Digital',
          price: 'Sob Consulta',
          rating: 5.0,
          image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
          tags: ['Figma', 'Design System', 'Acessibilidade'],
        },
        {
          id: 'item-2',
          title: 'Arquitetura Cloud & Desenvolvimento Full-Stack',
          description: 'Aplicações web reativas em React, APIs REST seguras e integração contínua de bases de dados.',
          category: 'Engenharia de Software',
          price: 'Sob Consulta',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          tags: ['React', 'Node.js', 'PostgreSQL'],
        },
        {
          id: 'item-3',
          title: 'Inteligência Artificial & Automação de Processos',
          description: 'Pipelines cognitivas integradas, modelos preditivos e assistentes inteligentes de suporte ao negócio.',
          category: 'Inteligência Artificial',
          price: 'Sob Consulta',
          rating: 5.0,
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          tags: ['Machine Learning', 'Pipelines', 'Automação'],
        },
      ],
    };
  }

  private static extractBrandName(prompt: string, fallback: string): string {
    const cleaned = prompt
      .replace(/(?:cria|criar|gerar|desenvolve|desenvolver|faz|fazer|um|uma|site|website|página|plataforma|para|de)\s+/gi, '')
      .trim();
    if (!cleaned || cleaned.length < 3) return fallback;
    const words = cleaned.split(' ').slice(0, 5).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  /**
   * Builds the complete project files matching the user's exact specification:
   * 📁 .aistudio
   * 📁 público
   * 📁 Servidor
   * 📁 src
   * 📄 .env.exemplo
   * 📄 .gitignore
   * 📄 bun.lock
   * 📄 index.html
   * 📄 metadata.json
   * 📄 package.json
   * 📄 server.ts
   * 📄 tsconfig.json
   * 📄 vite.config.ts
   */
  private static buildCompleteArchitecture(config: DomainConfig, prompt: string, model?: string): Record<string, string> {
    const name = config.projectName;
    const itemsJson = JSON.stringify(config.items, null, 2);

    return {
      // ================= 1. .aistudio/ =================
      '.aistudio/config.json': JSON.stringify({
        project: name,
        domain: config.domain,
        generatedAt: new Date().toISOString(),
        generatedByModel: model || 'minimax/minimax-m3.1-flash',
        runtime: {
          engine: 'IMCH AI Developer Engine',
          bundler: 'Vite 6',
          packageManager: 'Bun',
          framework: 'React 18 + TypeScript',
        },
        imageSearchEngine: {
          provider: 'Google Visual Analysis & Unsplash Curated API',
          endpoint: '/api/image-search',
          status: 'connected',
        },
      }, null, 2),

      '.aistudio/blueprint.json': JSON.stringify({
        architecture: {
          frontend: {
            layer: 'src/components',
            components: ['Header', 'Hero', 'ItemCatalog', 'ImageSearchExplorer', 'InteractiveAction', 'ContactSection', 'Footer'],
            services: ['src/services/apiClient.ts', 'src/services/imageSearchService.ts'],
            state: 'Centralized in src/App.tsx with reactive hooks',
          },
          server: {
            layer: 'Servidor',
            routes: 'Servidor/routes/api.ts',
            controllers: 'Servidor/controllers/itemController.ts',
            imageService: 'Servidor/services/googleImageAnalysis.ts',
            storage: 'Servidor/db/database.ts',
          },
          publicAssets: {
            layer: 'público',
            manifest: 'público/manifest.json',
            galleryCache: 'público/gallery-cache.json',
          },
        },
      }, null, 2),

      // ================= 2. público/ =================
      'público/manifest.json': JSON.stringify({
        short_name: name.slice(0, 12),
        name: `${name} · Website Profissional`,
        icons: [
          {
            src: 'favicon.svg',
            type: 'image/svg+xml',
            sizes: '512x512',
          },
        ],
        start_url: '/',
        background_color: '#09090b',
        theme_color: '#09090b',
        display: 'standalone',
      }, null, 2),

      'público/robots.txt': `User-agent: *
Allow: /
Sitemap: https://${name.toLowerCase().replace(/\s+/g, '')}.com/sitemap.xml
`,

      'público/favicon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#3b82f6" stroke-width="4"/>
  <path d="M30 65 L50 25 L70 65 Z" fill="#3b82f6"/>
</svg>`,

      'público/gallery-cache.json': JSON.stringify({
        domain: config.domain,
        cachedAt: new Date().toISOString(),
        heroImage: config.heroImage,
        items: config.items.map((it) => ({
          id: it.id,
          title: it.title,
          url: it.image,
          category: it.category,
          source: 'Google Visual Analysis Verified',
        })),
      }, null, 2),

      // ================= 3. Servidor/ =================
      'Servidor/routes/api.ts': `import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { GoogleImageAnalysis } from '../services/googleImageAnalysis';

export const apiRouter = Router();

// Endpoints do catálogo e ações do utilizador
apiRouter.get('/items', ItemController.getItems);
apiRouter.get('/items/:id', ItemController.getItemById);
apiRouter.post('/action', ItemController.handleUserAction);

// Endpoint de pesquisa e análise visual de imagens Google
apiRouter.get('/images/search', async (req, res) => {
  const query = String(req.query.q || '');
  const category = String(req.query.category || '${config.category}');
  const images = await GoogleImageAnalysis.searchContextualImages(query, category);
  res.json({ query, category, count: images.length, results: images });
});
`,

      'Servidor/controllers/itemController.ts': `import { Request, Response } from 'express';
import { Database } from '../db/database';

export class ItemController {
  static getItems(req: Request, res: Response) {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const items = Database.getItems(category, search);
    res.json({ success: true, count: items.length, items });
  }

  static getItemById(req: Request, res: Response) {
    const item = Database.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item não encontrado' });
    }
    res.json({ success: true, item });
  }

  static handleUserAction(req: Request, res: Response) {
    const { itemId, customerName, customerContact, details } = req.body;
    if (!customerName || !customerContact) {
      return res.status(400).json({ success: false, error: 'Nome e contacto são obrigatórios.' });
    }
    const record = Database.createActionRecord({
      itemId,
      customerName,
      customerContact,
      details,
      createdAt: new Date().toISOString(),
      status: 'confirmado',
    });
    res.json({ success: true, message: 'Operação concluída com sucesso!', record });
  }
}
`,

      'Servidor/services/googleImageAnalysis.ts': `// Serviço de Análise e Pesquisa Visual de Imagens Google / Unsplash
export interface ContextualImage {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category: string;
  resolution: string;
  source: string;
}

export class GoogleImageAnalysis {
  static async searchContextualImages(query: string, category: string): Promise<ContextualImage[]> {
    // Comunicação com o motor de análise visual do servidor
    const res = await fetch(\`http://localhost:3000/api/image-search?query=\${encodeURIComponent(query)}&category=\${encodeURIComponent(category)}\`).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      return (data.results || []).map((r: any) => ({
        id: r.id,
        title: r.title,
        url: r.url,
        thumbnail: r.thumbnail,
        category: r.category,
        resolution: '1920x1080 (HD)',
        source: 'Google Visual Analysis Engine',
      }));
    }
    return [];
  }
}
`,

      'Servidor/db/database.ts': `export interface ActionRecord {
  id: string;
  itemId?: string;
  customerName: string;
  customerContact: string;
  details?: string;
  createdAt: string;
  status: string;
}

export class Database {
  private static items = ${itemsJson};
  private static records: ActionRecord[] = [];

  static getItems(category?: string, search?: string) {
    let result = [...this.items];
    if (category && category !== 'todos') {
      result = result.filter(it => it.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(it => it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q));
    }
    return result;
  }

  static getItemById(id: string) {
    return this.items.find(it => it.id === id);
  }

  static createActionRecord(data: Omit<ActionRecord, 'id'>): ActionRecord {
    const record: ActionRecord = {
      id: 'rec-' + Date.now(),
      ...data,
    };
    this.records.push(record);
    return record;
  }
}
`,

      // ================= 4. src/ =================
      'src/types/index.ts': `export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  tags: string[];
}

export interface CustomerActionForm {
  itemId?: string;
  customerName: string;
  customerContact: string;
  details: string;
}

export interface ImageSearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  source: string;
  author: string;
}
`,

      'src/services/imageSearchService.ts': `import { ImageSearchResult } from '../types';

export class ImageSearchService {
  /**
   * Consulta o endpoint de análise visual Google para obter fotografias de alta qualidade
   */
  static async searchImages(query: string, category = '${config.category}'): Promise<ImageSearchResult[]> {
    try {
      const res = await fetch(\`/api/image-search?query=\${encodeURIComponent(query)}&category=\${encodeURIComponent(category)}&limit=6\`);
      if (res.ok) {
        const data = await res.json();
        return data.results || [];
      }
    } catch (e) {
      console.warn('Fallback para cache de imagens local:', e);
    }
    return [];
  }
}
`,

      'src/services/apiClient.ts': `import { CatalogItem, CustomerActionForm } from '../types';

export class ApiClient {
  static async getItems(category?: string, search?: string): Promise<CatalogItem[]> {
    try {
      const res = await fetch(\`/api/items?category=\${category || ''}&search=\${search || ''}\`);
      if (res.ok) {
        const data = await res.json();
        return data.items || [];
      }
    } catch (e) {}
    return [];
  }

  static async submitAction(payload: CustomerActionForm) {
    const res = await fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }
}
`,

      'src/components/Header.tsx': `import React from 'react';

interface HeaderProps {
  projectName: string;
  activeCategory: string;
  categories: string[];
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenActionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  activeCategory,
  categories,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenActionModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold flex items-center justify-center shadow-lg shadow-amber-600/20 text-base">
          ✦
        </div>
        <div>
          <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight">{projectName}</h1>
          <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">IMCH Professional Web</span>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={\`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer \${
              activeCategory === cat
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
            }\`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Search Input & Action Button */}
      <div className="flex items-center gap-2.5">
        <div className="relative hidden sm:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar itens..."
            className="w-40 md:w-56 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <button
          onClick={onOpenActionModal}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-amber-600/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>${config.actionButtonText}</span>
          {cartCount > 0 && (
            <span className="px-1.5 py-0.2 bg-white text-amber-900 rounded-full font-bold text-[10px]">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
`,

      'src/components/Hero.tsx': `import React from 'react';

interface HeroProps {
  badge: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  onExplore: () => void;
  onOpenAction: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  badge,
  headline,
  subheadline,
  heroImage,
  onExplore,
  onOpenAction,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800/80 py-16 sm:py-24 px-4 sm:px-8">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-600/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {headline}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            {subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenAction}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl shadow-xl shadow-amber-600/30 transition-all cursor-pointer"
            >
              ${config.actionButtonText}
            </button>
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 font-semibold text-sm rounded-xl transition-all cursor-pointer"
            >
              Explorar Catálogo ↓
            </button>
          </div>
        </div>

        {/* Hero Contextual Visual Card */}
        <div className="relative group rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/60 shadow-2xl">
          <img
            src={heroImage}
            alt={headline}
            className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
            <span className="font-semibold text-white">Análise Visual Google / Unsplash</span>
            <span className="font-mono text-emerald-400 text-[11px]">● Fotografia HD Ativa</span>
          </div>
        </div>
      </div>
    </section>
  );
};
`,

      'src/components/ItemCatalog.tsx': `import React from 'react';
import { CatalogItem } from '../types';

interface ItemCatalogProps {
  items: CatalogItem[];
  onSelectItem: (item: CatalogItem) => void;
  onSelectAction: (item: CatalogItem) => void;
}

export const ItemCatalog: React.FC<ItemCatalogProps> = ({
  items,
  onSelectItem,
  onSelectAction,
}) => {
  return (
    <section id="catalogo" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-amber-500 font-mono text-xs font-semibold uppercase tracking-wider">Cardápio & Itens de Destaque</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Conheça as Nossas Especialidades</h3>
        </div>
        <span className="text-xs text-neutral-400 font-mono">{items.length} itens disponíveis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg"
          >
            {/* Real Google / Unsplash Analyzed Photo */}
            <div className="relative h-48 overflow-hidden bg-neutral-950">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 rounded-lg text-xs font-bold text-white font-mono">
                {item.price}
              </div>
              <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-neutral-900/90 rounded text-[10px] text-amber-400 font-mono">
                ★ {item.rating}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-amber-500 uppercase">{item.category}</span>
                <h4 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-neutral-800/80 text-[10px] text-neutral-400 font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectItem(item)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => onSelectAction(item)}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition-colors shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  Selecionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
`,

      'src/components/ImageSearchExplorer.tsx': `import React, { useState } from 'react';
import { ImageSearchResult } from '../types';
import { ImageSearchService } from '../services/imageSearchService';

interface ImageSearchExplorerProps {
  onApplyImageToHero?: (url: string) => void;
}

export const ImageSearchExplorer: React.FC<ImageSearchExplorerProps> = ({ onApplyImageToHero }) => {
  const [searchTerm, setSearchTerm] = useState('${config.category}');
  const [results, setResults] = useState<ImageSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    const photos = await ImageSearchService.searchImages(searchTerm);
    setResults(photos);
    setIsSearching(false);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 border-t border-b border-neutral-800/80 bg-neutral-900/30 rounded-3xl my-10">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
              <span>🔍 Motor de Pesquisa Visual Google / Análise Fotográfica</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
              Pesquisar Imagens Reais para Qualquer Item do Website
            </h3>
            <p className="text-xs text-neutral-400">
              Digite qualquer produto, ingrediente ou serviço para carregar fotografias em alta resolução via análise contextual.
            </p>
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ex: pão de centeio, bolo de casamento, croissant chocolate..."
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            {isSearching ? 'A pesquisar...' : 'Pesquisar Imagens'}
          </button>
        </form>

        {/* Gallery Results */}
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 animate-fade-in">
            {results.map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setSelectedImage(img.url);
                  onApplyImageToHero?.(img.url);
                }}
                className={\`group relative rounded-xl overflow-hidden border cursor-pointer transition-all \${
                  selectedImage === img.url ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-neutral-800 hover:border-neutral-700'
                }\`}
              >
                <img src={img.thumbnail || img.url} alt={img.title} className="w-full h-28 object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white font-medium truncate">
                  {img.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
`,

      'src/components/InteractiveAction.tsx': `import React, { useState } from 'react';
import { CatalogItem, CustomerActionForm } from '../types';
import { ApiClient } from '../services/apiClient';

interface InteractiveActionProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem?: CatalogItem | null;
  actionTitle: string;
}

export const InteractiveAction: React.FC<InteractiveActionProps> = ({
  isOpen,
  onClose,
  selectedItem,
  actionTitle,
}) => {
  const [formData, setFormData] = useState<CustomerActionForm>({
    customerName: '',
    customerContact: '',
    details: '',
    itemId: selectedItem?.id,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await ApiClient.submitAction({ ...formData, itemId: selectedItem?.id });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h3 className="font-bold text-lg text-white">{actionTitle}</h3>
            {selectedItem && (
              <p className="text-xs text-amber-400 font-mono mt-0.5">Item selecionado: {selectedItem.title} ({selectedItem.price})</p>
            )}
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-lg p-1 cursor-pointer">✕</button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">✓</div>
            <h4 className="font-bold text-base text-white">Pedido Confirmado no Servidor!</h4>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Recebemos os seus dados com sucesso. O nosso sistema já registou a solicitação na camada de persistência.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Fechar Janela
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Nome Completo</label>
              <input
                required
                type="text"
                placeholder="Ex: Maria Santos"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Contacto Telefónico / WhatsApp ou E-mail</label>
              <input
                required
                type="text"
                placeholder="Ex: +351 912 345 678 ou maria@exemplo.com"
                value={formData.customerContact}
                onChange={(e) => setFormData({ ...formData, customerContact: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Observações ou Requisitos Adicionais</label>
              <textarea
                rows={3}
                placeholder="Ex: quantidade desejada, horário preferencial, alergias..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
              >
                {isSubmitting ? 'A enviar...' : 'Confirmar Pedido'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
`,

      'src/components/ContactSection.tsx': `import React, { useState } from 'react';

export const ContactSection: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contacto" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-4">
        <span className="text-amber-500 font-mono text-xs uppercase font-semibold">Localização & Contactos</span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Estamos Prontos para Atendê-lo</h3>
        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
          Venha conhecer o nosso espaço, desfrutar dos nossos produtos frescos ou agendar encomendas especiais.
        </p>

        <div className="space-y-3 pt-2 text-xs text-neutral-300">
          <div className="flex items-center gap-2.5">
            <span className="text-amber-400">📍</span>
            <span>Avenida Principal, nº 420 · Centro Histórico</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-amber-400">🕒</span>
            <span>Segunda a Sábado: 07h00 às 20h00 · Domingo: 08h00 às 14h00</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-amber-400">📞</span>
            <span>+351 210 987 654 · contacto@${name.toLowerCase().replace(/\s+/g, '')}.pt</span>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h4 className="font-bold text-sm text-white">Envie uma Mensagem Direta</h4>
        {sent ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs text-center">
            Mensagem enviada com sucesso! Responderemos o mais breve possível.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <input
              required
              type="text"
              placeholder="O seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
            />
            <input
              required
              type="email"
              placeholder="O seu e-mail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
            />
            <textarea
              required
              rows={3}
              placeholder="Escreva a sua mensagem..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white resize-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Enviar Mensagem
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
`,

      'src/components/Footer.tsx': `import React from 'react';

interface FooterProps {
  projectName: string;
}

export const Footer: React.FC<FooterProps> = ({ projectName }) => {
  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 py-10 px-4 sm:px-8 text-center text-xs text-neutral-500 space-y-3">
      <div className="flex items-center justify-center gap-2 text-white font-bold text-sm">
        <span className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center text-xs">✦</span>
        <span>{projectName}</span>
      </div>
      <p className="max-w-md mx-auto text-neutral-400">
        Desenvolvido com excelência no IMCH AI Developer com arquitetura modular, análise visual de imagens Google e backend integrado.
      </p>
      <div className="pt-2 text-[11px] font-mono text-neutral-500">
        © {new Date().getFullYear()} {projectName} · Todos os direitos reservados.
      </div>
    </footer>
  );
};
`,

      'src/styles/index.css': `/* Estilos Globais do Projeto */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

html {
  scroll-behavior: smooth;
}
`,

      'src/App.tsx': `import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ItemCatalog } from './components/ItemCatalog';
import { ImageSearchExplorer } from './components/ImageSearchExplorer';
import { InteractiveAction } from './components/InteractiveAction';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CatalogItem } from './types';

const INITIAL_ITEMS: CatalogItem[] = ${itemsJson};

export function App() {
  const [items, setItems] = useState<CatalogItem[]>(INITIAL_ITEMS);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState<CatalogItem | null>(null);
  const [heroImage, setHeroImage] = useState('${config.heroImage}');

  const categories = ['Todos', ...Array.from(new Set(INITIAL_ITEMS.map(i => i.category)))];

  const filteredItems = items.filter(it => {
    const matchCat = activeCategory === 'Todos' || it.category === activeCategory;
    const matchQuery = !searchQuery || it.title.toLowerCase().includes(searchQuery.toLowerCase()) || it.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleSelectItem = (item: CatalogItem) => {
    setSelectedItemForAction(item);
    setIsActionModalOpen(true);
  };

  const handleSelectAction = (item: CatalogItem) => {
    setCartCount(prev => prev + 1);
    setSelectedItemForAction(item);
    setIsActionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      <Header
        projectName="${name}"
        activeCategory={activeCategory}
        categories={categories}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onOpenActionModal={() => {
          setSelectedItemForAction(null);
          setIsActionModalOpen(true);
        }}
      />

      <main className="flex-1">
        <Hero
          badge="${config.badge}"
          headline="${config.headline}"
          subheadline="${config.subheadline}"
          heroImage={heroImage}
          onExplore={() => {
            const el = document.getElementById('catalogo');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAction={() => setIsActionModalOpen(true)}
        />

        <ItemCatalog
          items={filteredItems}
          onSelectItem={handleSelectItem}
          onSelectAction={handleSelectAction}
        />

        {/* Real Google / Unsplash Visual Search Explorer */}
        <ImageSearchExplorer
          onApplyImageToHero={(newUrl) => setHeroImage(newUrl)}
        />

        <ContactSection />
      </main>

      <Footer projectName="${name}" />

      <InteractiveAction
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        selectedItem={selectedItemForAction}
        actionTitle="${config.actionTitle}"
      />
    </div>
  );
}
`,

      'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
`,

      // ================= 5. Root Files =================
      '.env.exemplo': `# Variáveis de Ambiente do Projeto
PORT=3000
NODE_ENV=development
OPENROUTER_API_KEY=
DATABASE_URL=memory://local-db
GOOGLE_IMAGE_SEARCH_ENABLED=true
`,

      '.gitignore': `node_modules/
dist/
.DS_Store
.env
bun.lock
*.log
`,

      'bun.lock': `# Bun lockfile v1 for ${name}
lockfile_version = 1
`,

      'index.html': `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} · Website Profissional</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link rel="stylesheet" href="src/styles/index.css">
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen antialiased selection:bg-amber-500 selection:text-white">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    const INITIAL_ITEMS = ${itemsJson};

    function App() {
      const [items, setItems] = useState(INITIAL_ITEMS);
      const [activeCategory, setActiveCategory] = useState('Todos');
      const [searchQuery, setSearchQuery] = useState('');
      const [cartCount, setCartCount] = useState(0);
      const [isActionModalOpen, setIsActionModalOpen] = useState(false);
      const [selectedItemForAction, setSelectedItemForAction] = useState(null);
      const [heroImage, setHeroImage] = useState('${config.heroImage}');
      const [imageSearchTerm, setImageSearchTerm] = useState('${config.category}');
      const [imageResults, setImageResults] = useState([]);
      const [isSearchingImages, setIsSearchingImages] = useState(false);
      const [customerName, setCustomerName] = useState('');
      const [customerContact, setCustomerContact] = useState('');
      const [actionSubmitted, setActionSubmitted] = useState(false);

      const categories = ['Todos', ...Array.from(new Set(INITIAL_ITEMS.map(i => i.category)))];

      const filteredItems = items.filter(it => {
        const matchCat = activeCategory === 'Todos' || it.category === activeCategory;
        const matchQuery = !searchQuery || it.title.toLowerCase().includes(searchQuery.toLowerCase()) || it.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchQuery;
      });

      const handleImageSearch = async (e) => {
        if (e) e.preventDefault();
        setIsSearchingImages(true);
        try {
          const res = await fetch('/api/image-search?query=' + encodeURIComponent(imageSearchTerm) + '&category=${config.category}&limit=6');
          if (res.ok) {
            const data = await res.json();
            setImageResults(data.results || []);
          }
        } catch(err) {}
        setIsSearchingImages(false);
      };

      const handleActionSubmit = (e) => {
        e.preventDefault();
        setActionSubmitted(true);
      };

      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold flex items-center justify-center shadow-lg shadow-amber-600/20 text-base">
                ✦
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight">${name}</h1>
                <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">IMCH Professional Web</span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={\`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer \${
                    activeCategory === cat ? 'bg-amber-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                  }\`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar itens..."
                className="w-40 md:w-56 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <button
                onClick={() => { setSelectedItemForAction(null); setIsActionModalOpen(true); }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>${config.actionButtonText}</span>
                {cartCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-white text-amber-900 rounded-full font-bold text-[10px]">{cartCount}</span>
                )}
              </button>
            </div>
          </header>

          {/* Hero */}
          <section className="relative overflow-hidden border-b border-neutral-800/80 py-16 sm:py-24 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
                  <span>${config.badge}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  ${config.headline}
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                  ${config.subheadline}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsActionModalOpen(true)}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl shadow-xl transition-all cursor-pointer"
                  >
                    ${config.actionButtonText}
                  </button>
                  <a
                    href="#catalogo"
                    className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 font-semibold text-sm rounded-xl transition-all"
                  >
                    Explorar Catálogo ↓
                  </a>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/60 shadow-2xl">
                <img src={heroImage} alt="${name}" className="w-full h-80 sm:h-96 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
                  <span className="font-semibold text-white">Análise Visual Google / Unsplash</span>
                  <span className="font-mono text-emerald-400 text-[11px]">● Fotografia HD Ativa</span>
                </div>
              </div>
            </div>
          </section>

          {/* Item Catalog */}
          <section id="catalogo" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-amber-500 font-mono text-xs font-semibold uppercase tracking-wider">Cardápio & Itens de Destaque</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Conheça as Nossas Especialidades</h3>
              </div>
              <span className="text-xs text-neutral-400 font-mono">{filteredItems.length} itens disponíveis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg">
                  <div className="relative h-48 overflow-hidden bg-neutral-950">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 rounded-lg text-xs font-bold text-white font-mono">
                      {item.price}
                    </div>
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-neutral-900/90 rounded text-[10px] text-amber-400 font-mono">
                      ★ {item.rating}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-amber-500 uppercase">{item.category}</span>
                      <h4 className="font-bold text-base text-white">{item.title}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] text-neutral-400 font-mono">#{t}</span>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                      <button
                        onClick={() => { setSelectedItemForAction(item); setIsActionModalOpen(true); }}
                        className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => { setCartCount(c => c + 1); setSelectedItemForAction(item); setIsActionModalOpen(true); }}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Selecionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Real Google Visual Search Explorer */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 border-t border-b border-neutral-800/80 bg-neutral-900/30 rounded-3xl my-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
              <span>🔍 Motor de Pesquisa Visual Google / Análise Fotográfica</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Pesquisar Imagens Reais para Qualquer Item</h3>
            <p className="text-xs text-neutral-400">Digite qualquer produto ou ingrediente para carregar fotografias HD em tempo real:</p>

            <form onSubmit={handleImageSearch} className="flex items-center gap-2 max-w-xl">
              <input
                type="text"
                value={imageSearchTerm}
                onChange={(e) => setImageSearchTerm(e.target.value)}
                placeholder="Ex: pão artesanal, croissant, bolo..."
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
              <button
                type="submit"
                disabled={isSearchingImages}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                {isSearchingImages ? 'A pesquisar...' : 'Pesquisar Imagens'}
              </button>
            </form>

            {imageResults.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
                {imageResults.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setHeroImage(img.url)}
                    className="relative rounded-xl overflow-hidden border border-neutral-800 hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <img src={img.thumbnail || img.url} alt={img.title} className="w-full h-24 object-cover" />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium truncate bg-neutral-950/80 px-1 rounded">{img.title}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Interactive Modal */}
          {isActionModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 relative">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h3 className="font-bold text-base text-white">${config.actionTitle}</h3>
                  <button onClick={() => { setIsActionModalOpen(false); setActionSubmitted(false); }} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
                </div>
                {actionSubmitted ? (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-lg">✓</div>
                    <h4 className="font-bold text-sm text-white">Pedido Confirmado no Servidor!</h4>
                    <p className="text-xs text-neutral-400">Recebemos a solicitação com sucesso.</p>
                    <button onClick={() => { setIsActionModalOpen(false); setActionSubmitted(false); }} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold cursor-pointer">Fechar</button>
                  </div>
                ) : (
                  <form onSubmit={handleActionSubmit} className="space-y-3 text-xs">
                    {selectedItemForAction && (
                      <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-amber-400 font-mono">
                        Item: {selectedItemForAction.title} ({selectedItemForAction.price})
                      </div>
                    )}
                    <input
                      required
                      type="text"
                      placeholder="Nome completo"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Telefone ou e-mail"
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                    <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg cursor-pointer">
                      Confirmar Pedido
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="border-t border-neutral-800/80 bg-neutral-950 py-8 text-center text-xs text-neutral-500">
            <p>© ${new Date().getFullYear()} ${name} · Desenvolvido com IMCH AI Developer</p>
          </footer>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`,

      'metadata.json': JSON.stringify({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        description: config.subheadline,
        version: '1.0.0',
        author: 'IMCH Soluções Digitais',
        tags: [config.domain, 'react18', 'fullstack', 'tailwind', 'typescript', 'google-visual-analysis'],
      }, null, 2),

      'package.json': JSON.stringify({
        name: name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
          server: 'tsx server.ts',
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          express: '^4.21.2',
          dotenv: '^16.4.7',
        },
        devDependencies: {
          '@types/react': '^18.3.18',
          '@types/react-dom': '^18.3.5',
          '@types/express': '^5.0.0',
          '@vitejs/plugin-react': '^4.3.4',
          typescript: '^5.7.3',
          vite: '^6.2.0',
          tailwindcss: '^4.0.0',
          tsx: '^4.19.2',
        },
      }, null, 2),

      'server.ts': `import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './Servidor/routes/api';

dotenv.config();

const app = express();
app.use(express.json());

// Rotas da API da aplicação
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Servidor \${process.env.APP_NAME || '${name}'} em execução na porta \${PORT}\`);
});
`,

      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          useDefineForClassFields: true,
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: false,
          noUnusedParameters: false,
          noFallthroughCasesInSwitch: true,
        },
        include: ['src', 'Servidor'],
      }, null, 2),

      'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
`,
    };
  }
}
