import type { ThemeBundle } from '../types.js';

export const teknolojiBundle: ThemeBundle = {
  manifest: {
    id: 'teknoloji',
    name: 'Teknoloji',
    description: 'Modern, dark technology store theme with comparison and specs focus',
    sector: 'teknoloji',
    category: 'sector',
    colorPalette: ['#3B82F6', '#94A3B8', '#22D3EE', '#0F172A', '#F1F5F9'],
    config: {
      primary: '#3B82F6',
      secondary: '#94A3B8',
      accent: '#22D3EE',
      background: '#0F172A',
      foreground: '#F1F5F9',
      muted: '#1E293B',
      border: '#334155',
      fonts: { heading: 'Space Grotesk', body: 'Inter' },
      borderRadius: 'sm',
      layout: {
        headerStyle: 'standard',
        productGridColumns: 4,
        footerColumns: 4,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero Banner', type: 'hero' },
      { id: 'brands', name: 'Shop by Brand', type: 'custom', component: 'brand-filter' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'comparison', name: 'Compare Products', type: 'custom', component: 'feature-comparison' },
      { id: 'categories', name: 'Categories', type: 'categories-grid' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Home Page — 11 blocks
  // ---------------------------------------------------------------------------
  homePage: {
    version: 1,
    blocks: [
      // 1. Hero — Dark tech setup
      {
        id: 'teknoloji_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'Next-Gen Technology',
            tr: 'Yeni Nesil Teknoloji',
            de: 'Technologie der naechsten Generation',
            fr: 'Technologie de nouvelle generation',
            es: 'Tecnologia de nueva generacion',
          },
          subtitle: {
            en: 'Discover the latest innovations that shape the future',
            tr: 'Gelecegi sekillendiren en yeni yenilikleri kesfedin',
            de: 'Entdecken Sie die neuesten Innovationen, die die Zukunft gestalten',
            fr: 'Decouvrez les dernieres innovations qui faconnent le futur',
            es: 'Descubre las ultimas innovaciones que dan forma al futuro',
          },
          buttonText: {
            en: 'Shop Now',
            tr: 'Alisverise Basla',
            de: 'Jetzt einkaufen',
            fr: 'Acheter maintenant',
            es: 'Comprar ahora',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1920&q=80',
          overlayOpacity: 0.5,
          secondaryButtonText: {
            en: 'Compare Products',
            tr: 'Urunleri Karsilastir',
            de: 'Produkte vergleichen',
            fr: 'Comparer les produits',
            es: 'Comparar productos',
          },
          secondaryButtonLink: '/pages/categories',
        },
        style: {
          backgroundColor: '#020617',
          textColor: '#F1F5F9',
          padding: '4rem 2rem',
        },
      },

      // 2. Brand Logos Bar (html)
      {
        id: 'teknoloji_home_brands',
        type: 'html',
        props: {
          content: {
            en: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:2rem 0;background:#1E293B;border-bottom:1px solid #334155;flex-wrap:wrap">' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Apple</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Samsung</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Sony</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">LG</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Dell</span>' +
              '</div>',
            tr: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:2rem 0;background:#1E293B;border-bottom:1px solid #334155;flex-wrap:wrap">' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Apple</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Samsung</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Sony</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">LG</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Dell</span>' +
              '</div>',
            de: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:2rem 0;background:#1E293B;border-bottom:1px solid #334155;flex-wrap:wrap">' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Apple</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Samsung</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Sony</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">LG</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Dell</span>' +
              '</div>',
            fr: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:2rem 0;background:#1E293B;border-bottom:1px solid #334155;flex-wrap:wrap">' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Apple</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Samsung</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Sony</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">LG</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Dell</span>' +
              '</div>',
            es: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:2rem 0;background:#1E293B;border-bottom:1px solid #334155;flex-wrap:wrap">' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Apple</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Samsung</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Sony</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">LG</span>' +
              '<span style="opacity:0.6;font-size:1.2rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94A3B8">Dell</span>' +
              '</div>',
          },
        },
        style: {
          backgroundColor: '#1E293B',
          padding: '0',
        },
      },

      // 3. Product Showcase — 8 products, 4 columns
      {
        id: 'teknoloji_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'Top Picks',
            tr: 'En Iyi Secimler',
            de: 'Top-Auswahl',
            fr: 'Meilleurs choix',
            es: 'Mejores selecciones',
          },
          subtitle: {
            en: 'Handpicked by our tech experts',
            tr: 'Teknoloji uzmanlarimiz tarafindan secildi',
            de: 'Handverlesen von unseren Tech-Experten',
            fr: 'Selectionnes par nos experts tech',
            es: 'Seleccionados por nuestros expertos en tecnologia',
          },
          limit: 8,
          columns: 4,
        },
        style: {
          backgroundColor: '#0F172A',
          textColor: '#F1F5F9',
          padding: '3rem 2rem',
        },
      },

      // 4. Static Tech Product Cards — 4 columns
      {
        id: 'teknoloji_home_product_cards',
        type: 'columns',
        props: { columns: 4, gap: '1.5rem' },
        style: {
          backgroundColor: '#0F172A',
          padding: '2rem',
          maxWidth: '1280px',
        },
        children: [
          {
            id: 'teknoloji_home_card_phone',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              padding: '1rem',
            },
            children: [
              {
                id: 'teknoloji_home_card_phone_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
                  alt: {
                    en: 'ProMax Phone',
                    tr: 'ProMax Telefon',
                    de: 'ProMax Handy',
                    fr: 'ProMax Telephone',
                    es: 'ProMax Telefono',
                  },
                },
                style: { borderRadius: '6px' },
              },
              {
                id: 'teknoloji_home_card_phone_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'ProMax Phone',
                    tr: 'ProMax Telefon',
                    de: 'ProMax Handy',
                    fr: 'ProMax Telephone',
                    es: 'ProMax Telefono',
                  },
                },
                style: { textColor: '#F1F5F9', padding: '0.75rem 0 0.25rem 0' },
              },
              {
                id: 'teknoloji_home_card_phone_price',
                type: 'text',
                props: {
                  tag: 'span',
                  content: {
                    en: '$1,099',
                    tr: '$1,099',
                    de: '$1,099',
                    fr: '$1,099',
                    es: '$1,099',
                  },
                },
                style: { textColor: '#22D3EE' },
              },
            ],
          },
          {
            id: 'teknoloji_home_card_laptop',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              padding: '1rem',
            },
            children: [
              {
                id: 'teknoloji_home_card_laptop_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
                  alt: {
                    en: 'UltraBook Pro',
                    tr: 'UltraBook Pro',
                    de: 'UltraBook Pro',
                    fr: 'UltraBook Pro',
                    es: 'UltraBook Pro',
                  },
                },
                style: { borderRadius: '6px' },
              },
              {
                id: 'teknoloji_home_card_laptop_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'UltraBook Pro',
                    tr: 'UltraBook Pro',
                    de: 'UltraBook Pro',
                    fr: 'UltraBook Pro',
                    es: 'UltraBook Pro',
                  },
                },
                style: { textColor: '#F1F5F9', padding: '0.75rem 0 0.25rem 0' },
              },
              {
                id: 'teknoloji_home_card_laptop_price',
                type: 'text',
                props: {
                  tag: 'span',
                  content: {
                    en: '$1,499',
                    tr: '$1,499',
                    de: '$1,499',
                    fr: '$1,499',
                    es: '$1,499',
                  },
                },
                style: { textColor: '#22D3EE' },
              },
            ],
          },
          {
            id: 'teknoloji_home_card_headphones',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              padding: '1rem',
            },
            children: [
              {
                id: 'teknoloji_home_card_headphones_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                  alt: {
                    en: 'Studio Headphones',
                    tr: 'Studio Kulaklik',
                    de: 'Studio Kopfhoerer',
                    fr: 'Casque Studio',
                    es: 'Auriculares Studio',
                  },
                },
                style: { borderRadius: '6px' },
              },
              {
                id: 'teknoloji_home_card_headphones_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Studio Headphones',
                    tr: 'Studio Kulaklik',
                    de: 'Studio Kopfhoerer',
                    fr: 'Casque Studio',
                    es: 'Auriculares Studio',
                  },
                },
                style: { textColor: '#F1F5F9', padding: '0.75rem 0 0.25rem 0' },
              },
              {
                id: 'teknoloji_home_card_headphones_price',
                type: 'text',
                props: {
                  tag: 'span',
                  content: {
                    en: '$349',
                    tr: '$349',
                    de: '$349',
                    fr: '$349',
                    es: '$349',
                  },
                },
                style: { textColor: '#22D3EE' },
              },
            ],
          },
          {
            id: 'teknoloji_home_card_watch',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              padding: '1rem',
            },
            children: [
              {
                id: 'teknoloji_home_card_watch_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&q=80',
                  alt: {
                    en: 'Smart Watch X',
                    tr: 'Akilli Saat X',
                    de: 'Smart Watch X',
                    fr: 'Montre Connectee X',
                    es: 'Reloj Inteligente X',
                  },
                },
                style: { borderRadius: '6px' },
              },
              {
                id: 'teknoloji_home_card_watch_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Smart Watch X',
                    tr: 'Akilli Saat X',
                    de: 'Smart Watch X',
                    fr: 'Montre Connectee X',
                    es: 'Reloj Inteligente X',
                  },
                },
                style: { textColor: '#F1F5F9', padding: '0.75rem 0 0.25rem 0' },
              },
              {
                id: 'teknoloji_home_card_watch_price',
                type: 'text',
                props: {
                  tag: 'span',
                  content: {
                    en: '$449',
                    tr: '$449',
                    de: '$449',
                    fr: '$449',
                    es: '$449',
                  },
                },
                style: { textColor: '#22D3EE' },
              },
            ],
          },
        ],
      },

      // 5. Banner — Trade-in
      {
        id: 'teknoloji_home_banner',
        type: 'banner',
        props: {
          title: {
            en: 'Trade in your device — Get up to $500 credit',
            tr: 'Eski cihazinizi getirin — 500$\'a kadar kredi kazanin',
            de: 'Tauschen Sie Ihr altes Geraet ein — Bis zu 500$ Gutschrift',
            fr: 'Echangez votre ancien appareil — Jusqu\'a 500$ de credit',
            es: 'Cambia tu dispositivo viejo — Hasta $500 de credito',
          },
          subtitle: {
            en: 'Upgrade to the latest tech today',
            tr: 'Bugun en son teknolojiye yukselt',
            de: 'Wechseln Sie noch heute zur neuesten Technik',
            fr: 'Passez a la derniere technologie aujourd\'hui',
            es: 'Actualiza a la ultima tecnologia hoy',
          },
          buttonText: {
            en: 'Get Quote',
            tr: 'Teklif Al',
            de: 'Angebot einholen',
            fr: 'Obtenir un devis',
            es: 'Obtener cotizacion',
          },
          buttonLink: '/pages/trade-in',
          backgroundImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
          height: '300px',
        },
        style: {
          textColor: '#FFFFFF',
          padding: '3rem 2rem',
        },
      },

      // 6. Spec Comparison Cards — 3 columns of html
      {
        id: 'teknoloji_home_spec_cards',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          backgroundColor: '#0F172A',
          padding: '3rem 2rem',
          maxWidth: '1280px',
        },
        children: [
          {
            id: 'teknoloji_home_spec_gaming',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Gaming Laptop</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Processor</td><td style="padding:0.5rem 0;text-align:right">Intel i9-14900HX</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">32 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Storage</td><td style="padding:0.5rem 0;text-align:right">1 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4080 16GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Display</td><td style="padding:0.5rem 0;text-align:right">16" QHD 240Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$2,499</div>' +
                  '</div>',
                tr: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Gaming Laptop</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Islemci</td><td style="padding:0.5rem 0;text-align:right">Intel i9-14900HX</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">32 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Depolama</td><td style="padding:0.5rem 0;text-align:right">1 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4080 16GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Ekran</td><td style="padding:0.5rem 0;text-align:right">16" QHD 240Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$2,499</div>' +
                  '</div>',
                de: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Gaming Laptop</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Prozessor</td><td style="padding:0.5rem 0;text-align:right">Intel i9-14900HX</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">32 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Speicher</td><td style="padding:0.5rem 0;text-align:right">1 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4080 16GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Display</td><td style="padding:0.5rem 0;text-align:right">16" QHD 240Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$2,499</div>' +
                  '</div>',
                fr: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Gaming Laptop</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Processeur</td><td style="padding:0.5rem 0;text-align:right">Intel i9-14900HX</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">32 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Stockage</td><td style="padding:0.5rem 0;text-align:right">1 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4080 16GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Ecran</td><td style="padding:0.5rem 0;text-align:right">16" QHD 240Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$2,499</div>' +
                  '</div>',
                es: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Gaming Laptop</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Procesador</td><td style="padding:0.5rem 0;text-align:right">Intel i9-14900HX</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">32 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Almacenamiento</td><td style="padding:0.5rem 0;text-align:right">1 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4080 16GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Pantalla</td><td style="padding:0.5rem 0;text-align:right">16" QHD 240Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$2,499</div>' +
                  '</div>',
              },
            },
          },
          {
            id: 'teknoloji_home_spec_workstation',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Workstation</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Processor</td><td style="padding:0.5rem 0;text-align:right">AMD Ryzen 9 7950X</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">64 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Storage</td><td style="padding:0.5rem 0;text-align:right">2 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4090 24GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Display</td><td style="padding:0.5rem 0;text-align:right">17" 4K 120Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$3,999</div>' +
                  '</div>',
                tr: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Is Istasyonu</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Islemci</td><td style="padding:0.5rem 0;text-align:right">AMD Ryzen 9 7950X</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">64 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Depolama</td><td style="padding:0.5rem 0;text-align:right">2 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4090 24GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Ekran</td><td style="padding:0.5rem 0;text-align:right">17" 4K 120Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$3,999</div>' +
                  '</div>',
                de: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Workstation</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Prozessor</td><td style="padding:0.5rem 0;text-align:right">AMD Ryzen 9 7950X</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">64 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Speicher</td><td style="padding:0.5rem 0;text-align:right">2 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4090 24GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Display</td><td style="padding:0.5rem 0;text-align:right">17" 4K 120Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$3,999</div>' +
                  '</div>',
                fr: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Station de travail</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Processeur</td><td style="padding:0.5rem 0;text-align:right">AMD Ryzen 9 7950X</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">64 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Stockage</td><td style="padding:0.5rem 0;text-align:right">2 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4090 24GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Ecran</td><td style="padding:0.5rem 0;text-align:right">17" 4K 120Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$3,999</div>' +
                  '</div>',
                es: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Estacion de trabajo</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Procesador</td><td style="padding:0.5rem 0;text-align:right">AMD Ryzen 9 7950X</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">64 GB DDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Almacenamiento</td><td style="padding:0.5rem 0;text-align:right">2 TB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">RTX 4090 24GB</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Pantalla</td><td style="padding:0.5rem 0;text-align:right">17" 4K 120Hz</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$3,999</div>' +
                  '</div>',
              },
            },
          },
          {
            id: 'teknoloji_home_spec_ultrabook',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Ultrabook</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Processor</td><td style="padding:0.5rem 0;text-align:right">Intel i7-1370P</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">16 GB LPDDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Storage</td><td style="padding:0.5rem 0;text-align:right">512 GB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">Intel Iris Xe</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Display</td><td style="padding:0.5rem 0;text-align:right">14" FHD+ OLED</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$1,299</div>' +
                  '</div>',
                tr: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Ultrabook</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Islemci</td><td style="padding:0.5rem 0;text-align:right">Intel i7-1370P</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">16 GB LPDDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Depolama</td><td style="padding:0.5rem 0;text-align:right">512 GB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">Intel Iris Xe</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Ekran</td><td style="padding:0.5rem 0;text-align:right">14" FHD+ OLED</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$1,299</div>' +
                  '</div>',
                de: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Ultrabook</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Prozessor</td><td style="padding:0.5rem 0;text-align:right">Intel i7-1370P</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">16 GB LPDDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Speicher</td><td style="padding:0.5rem 0;text-align:right">512 GB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">Intel Iris Xe</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Display</td><td style="padding:0.5rem 0;text-align:right">14" FHD+ OLED</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$1,299</div>' +
                  '</div>',
                fr: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Ultrabook</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Processeur</td><td style="padding:0.5rem 0;text-align:right">Intel i7-1370P</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">16 GB LPDDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Stockage</td><td style="padding:0.5rem 0;text-align:right">512 GB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">Intel Iris Xe</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Ecran</td><td style="padding:0.5rem 0;text-align:right">14" FHD+ OLED</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$1,299</div>' +
                  '</div>',
                es: '<div style="background:#1E293B;border:1px solid #22D3EE;border-radius:8px;padding:1.5rem">' +
                  '<h3 style="color:#22D3EE;font-size:1.25rem;margin:0 0 1rem 0;font-weight:700">Ultrabook</h3>' +
                  '<table style="width:100%;color:#F1F5F9;font-size:0.9rem;border-collapse:collapse">' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Procesador</td><td style="padding:0.5rem 0;text-align:right">Intel i7-1370P</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">RAM</td><td style="padding:0.5rem 0;text-align:right">16 GB LPDDR5</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">Almacenamiento</td><td style="padding:0.5rem 0;text-align:right">512 GB NVMe SSD</td></tr>' +
                  '<tr style="border-bottom:1px solid #334155"><td style="padding:0.5rem 0;color:#94A3B8">GPU</td><td style="padding:0.5rem 0;text-align:right">Intel Iris Xe</td></tr>' +
                  '<tr><td style="padding:0.5rem 0;color:#94A3B8">Pantalla</td><td style="padding:0.5rem 0;text-align:right">14" FHD+ OLED</td></tr>' +
                  '</table>' +
                  '<div style="margin-top:1rem;text-align:center;color:#22D3EE;font-weight:700;font-size:1.1rem">$1,299</div>' +
                  '</div>',
              },
            },
          },
        ],
      },

      // 7. Category Showcase — 6 categories
      {
        id: 'teknoloji_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Browse Categories',
            tr: 'Kategorilere Goz At',
            de: 'Kategorien durchsuchen',
            fr: 'Parcourir les categories',
            es: 'Explorar categorias',
          },
          subtitle: {
            en: 'Find exactly what you need',
            tr: 'Tam ihtiyaciniz olani bulun',
            de: 'Finden Sie genau das, was Sie brauchen',
            fr: 'Trouvez exactement ce dont vous avez besoin',
            es: 'Encuentra exactamente lo que necesitas',
          },
          limit: 6,
          columns: 3,
        },
        style: {
          backgroundColor: '#0F172A',
          textColor: '#F1F5F9',
          padding: '3rem 2rem',
        },
      },

      // 8. Static Tech Category Cards — 3 columns
      {
        id: 'teknoloji_home_category_cards',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          backgroundColor: '#0F172A',
          padding: '2rem',
          maxWidth: '1280px',
        },
        children: [
          {
            id: 'teknoloji_home_cat_smartphones',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" alt="Smartphones" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Smartphones</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Latest models from top brands</p></div>' +
                  '</div></div>',
                tr: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" alt="Akilli Telefonlar" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Akilli Telefonlar</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">En iyi markalardan son modeller</p></div>' +
                  '</div></div>',
                de: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" alt="Smartphones" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Smartphones</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Neueste Modelle von Top-Marken</p></div>' +
                  '</div></div>',
                fr: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" alt="Smartphones" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Smartphones</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Derniers modeles des meilleures marques</p></div>' +
                  '</div></div>',
                es: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" alt="Smartphones" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Smartphones</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Ultimos modelos de las mejores marcas</p></div>' +
                  '</div></div>',
              },
            },
          },
          {
            id: 'teknoloji_home_cat_laptops',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80" alt="Laptops" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Laptops</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Power meets portability</p></div>' +
                  '</div></div>',
                tr: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80" alt="Laptoplar" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Laptoplar</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Guc ve tasinabilirlik bir arada</p></div>' +
                  '</div></div>',
                de: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80" alt="Laptops" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Laptops</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Leistung trifft Tragbarkeit</p></div>' +
                  '</div></div>',
                fr: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80" alt="Ordinateurs portables" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Ordinateurs portables</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Puissance et portabilite</p></div>' +
                  '</div></div>',
                es: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80" alt="Portatiles" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Portatiles</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Potencia y portabilidad</p></div>' +
                  '</div></div>',
              },
            },
          },
          {
            id: 'teknoloji_home_cat_audio',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80" alt="Audio" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Audio</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Premium sound experience</p></div>' +
                  '</div></div>',
                tr: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80" alt="Ses Sistemleri" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Ses Sistemleri</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Premium ses deneyimi</p></div>' +
                  '</div></div>',
                de: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80" alt="Audio" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Audio</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Premium-Klangerlebnis</p></div>' +
                  '</div></div>',
                fr: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80" alt="Audio" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Audio</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Experience sonore premium</p></div>' +
                  '</div></div>',
                es: '<div style="position:relative;border-radius:8px;overflow:hidden;height:280px">' +
                  '<img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80" alt="Audio" style="width:100%;height:100%;object-fit:cover" />' +
                  '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,23,42,0.9),rgba(15,23,42,0.3));display:flex;align-items:flex-end;padding:1.5rem">' +
                  '<div><h3 style="color:#F1F5F9;font-size:1.5rem;margin:0 0 0.25rem 0;font-weight:700">Audio</h3><p style="color:#94A3B8;margin:0;font-size:0.9rem">Experiencia de sonido premium</p></div>' +
                  '</div></div>',
              },
            },
          },
        ],
      },

      // 9. Divider — cyan, thin
      {
        id: 'teknoloji_home_divider',
        type: 'divider',
        props: {},
        style: {
          backgroundColor: '#22D3EE',
          margin: '2rem auto',
          maxWidth: '80%',
        },
      },

      // 10. FAQ Accordion — 4 items
      {
        id: 'teknoloji_home_faq',
        type: 'accordion',
        props: {
          title: {
            en: 'Frequently Asked Questions',
            tr: 'Sikca Sorulan Sorular',
            de: 'Haeufig gestellte Fragen',
            fr: 'Questions frequemment posees',
            es: 'Preguntas frecuentes',
          },
          items: [
            {
              title: {
                en: 'Warranty Policy',
                tr: 'Garanti Politikasi',
                de: 'Garantiebestimmungen',
                fr: 'Politique de garantie',
                es: 'Politica de garantia',
              },
              content: {
                en: 'All products come with a minimum 2-year manufacturer warranty. Extended warranty plans are available for up to 5 years. Coverage includes hardware defects, battery replacement, and accidental damage protection options.',
                tr: 'Tum urunler en az 2 yillik uretici garantisi ile gelir. 5 yila kadar uzatilmis garanti planlari mevcuttur. Kapsam donanim kusurlarini, pil degisimini ve kaza hasari koruma seceneklerini icerir.',
                de: 'Alle Produkte werden mit einer Mindestgarantie von 2 Jahren geliefert. Erweiterte Garantieplaene sind fuer bis zu 5 Jahre verfuegbar. Die Abdeckung umfasst Hardwaredefekte, Batterieaustausch und Optionen zum Schutz vor versehentlichen Schaeden.',
                fr: 'Tous les produits sont livres avec une garantie fabricant minimale de 2 ans. Des plans de garantie prolongee sont disponibles jusqu\'a 5 ans. La couverture comprend les defauts materiels, le remplacement de batterie et les options de protection contre les dommages accidentels.',
                es: 'Todos los productos incluyen un minimo de 2 anos de garantia del fabricante. Los planes de garantia extendida estan disponibles hasta 5 anos. La cobertura incluye defectos de hardware, reemplazo de bateria y opciones de proteccion contra danos accidentales.',
              },
            },
            {
              title: {
                en: 'Return Policy',
                tr: 'Iade Politikasi',
                de: 'Rueckgaberecht',
                fr: 'Politique de retour',
                es: 'Politica de devolucion',
              },
              content: {
                en: 'We offer a 30-day hassle-free return policy on all unopened items. Opened items can be returned within 15 days if they are in original condition with all accessories. Refunds are processed within 5-7 business days.',
                tr: 'Acilmamis tum urunlerde 30 gunluk sorunsuz iade politikasi sunuyoruz. Acilmis urunler, tum aksesuarlari ile orijinal durumda ise 15 gun icerisinde iade edilebilir. Geri odemeler 5-7 is gunu icerisinde islenir.',
                de: 'Wir bieten eine 30-taegige problemlose Rueckgabepolitik fuer alle ungeoefffneten Artikel. Geoeffnete Artikel koennen innerhalb von 15 Tagen zurueckgegeben werden, wenn sie sich im Originalzustand mit allem Zubehoer befinden. Rueckerstattungen werden innerhalb von 5-7 Werktagen bearbeitet.',
                fr: 'Nous offrons une politique de retour sans tracas de 30 jours sur tous les articles non ouverts. Les articles ouverts peuvent etre retournes dans les 15 jours s\'ils sont dans leur etat d\'origine avec tous les accessoires. Les remboursements sont traites sous 5 a 7 jours ouvrables.',
                es: 'Ofrecemos una politica de devolucion sin complicaciones de 30 dias en todos los articulos sin abrir. Los articulos abiertos pueden devolverse dentro de 15 dias si estan en condiciones originales con todos los accesorios. Los reembolsos se procesan en 5-7 dias habiles.',
              },
            },
            {
              title: {
                en: 'Shipping Information',
                tr: 'Kargo Bilgileri',
                de: 'Versandinformationen',
                fr: 'Informations de livraison',
                es: 'Informacion de envio',
              },
              content: {
                en: 'Free standard shipping on orders over $50. Express delivery available for next-day arrival. All shipments include tracking and insurance. International shipping is available to over 40 countries.',
                tr: '50$ uzerindeki siparislerde ucretsiz standart kargo. Ertesi gun teslimat icin ekspres teslimat mevcuttur. Tum gonderiler takip ve sigorta icerir. 40\'tan fazla ulkeye uluslararasi kargo yapilmaktadir.',
                de: 'Kostenloser Standardversand bei Bestellungen ueber 50$. Expresslieferung fuer naechsten Tag verfuegbar. Alle Sendungen enthalten Tracking und Versicherung. Internationaler Versand ist in ueber 40 Laender moeglich.',
                fr: 'Livraison standard gratuite pour les commandes de plus de 50$. Livraison express disponible pour une arrivee le lendemain. Tous les envois incluent le suivi et l\'assurance. La livraison internationale est disponible dans plus de 40 pays.',
                es: 'Envio estandar gratuito en pedidos superiores a $50. Entrega express disponible para el dia siguiente. Todos los envios incluyen seguimiento y seguro. El envio internacional esta disponible a mas de 40 paises.',
              },
            },
            {
              title: {
                en: 'Technical Support',
                tr: 'Teknik Destek',
                de: 'Technischer Support',
                fr: 'Support technique',
                es: 'Soporte tecnico',
              },
              content: {
                en: 'Our expert tech support team is available 24/7 via live chat, email, and phone. We offer free setup assistance for all purchases, troubleshooting guides, and remote diagnostics for quick resolution of any issues.',
                tr: 'Uzman teknik destek ekibimiz canli sohbet, e-posta ve telefon ile 7/24 hizmetinizdedir. Tum satin alimlar icin ucretsiz kurulum yardimi, sorun giderme kilavuzlari ve herhangi bir sorunun hizli cozumu icin uzaktan teshis sunuyoruz.',
                de: 'Unser erfahrenes Tech-Support-Team ist rund um die Uhr per Live-Chat, E-Mail und Telefon erreichbar. Wir bieten kostenlose Einrichtungshilfe fuer alle Kaeufe, Fehlerbehebungsanleitungen und Ferndiagnose zur schnellen Loesung aller Probleme.',
                fr: 'Notre equipe d\'assistance technique experte est disponible 24h/24 et 7j/7 par chat en direct, e-mail et telephone. Nous offrons une assistance gratuite a l\'installation pour tous les achats, des guides de depannage et des diagnostics a distance pour une resolution rapide de tout probleme.',
                es: 'Nuestro equipo de soporte tecnico experto esta disponible las 24 horas del dia, los 7 dias de la semana por chat en vivo, correo electronico y telefono. Ofrecemos asistencia de configuracion gratuita para todas las compras, guias de solucion de problemas y diagnosticos remotos para una resolucion rapida de cualquier problema.',
              },
            },
          ],
        },
        style: {
          backgroundColor: '#0F172A',
          textColor: '#F1F5F9',
          padding: '3rem 2rem',
          maxWidth: '900px',
        },
      },

      // 11. Newsletter — dark background
      {
        id: 'teknoloji_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'Tech Updates',
            tr: 'Teknoloji Haberleri',
            de: 'Tech-Updates',
            fr: 'Actualites tech',
            es: 'Novedades tecnologicas',
          },
          description: {
            en: 'Be the first to know about new releases, exclusive deals, and tech reviews',
            tr: 'Yeni urunler, ozel firsatlar ve teknoloji incelemelerinden ilk siz haberdar olun',
            de: 'Erfahren Sie als Erster von neuen Produkten, exklusiven Angeboten und Tech-Bewertungen',
            fr: 'Soyez le premier informe des nouvelles sorties, offres exclusives et avis tech',
            es: 'Sea el primero en conocer los nuevos lanzamientos, ofertas exclusivas y resenas tecnologicas',
          },
          buttonText: {
            en: 'Subscribe',
            tr: 'Abone Ol',
            de: 'Abonnieren',
            fr: 'S\'abonner',
            es: 'Suscribirse',
          },
          placeholder: {
            en: 'Enter your email',
            tr: 'E-posta adresinizi girin',
            de: 'E-Mail-Adresse eingeben',
            fr: 'Entrez votre e-mail',
            es: 'Ingrese su correo electronico',
          },
        },
        style: {
          backgroundColor: '#1E293B',
          textColor: '#F1F5F9',
          padding: '3rem 2rem',
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Header
  // ---------------------------------------------------------------------------
  header: {
    version: 1,
    blocks: [
      {
        id: 'teknoloji_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'TechStore',
            tr: 'TeknoMagaza',
            de: 'TechShop',
            fr: 'TechBoutique',
            es: 'TecnoTienda',
          },
          logoUrl: '',
        },
      },
      {
        id: 'teknoloji_header_nav',
        type: 'navigation-menu',
        props: {
          items: [
            {
              label: { en: 'Home', tr: 'Ana Sayfa', de: 'Startseite', fr: 'Accueil', es: 'Inicio' },
              link: '/',
            },
            {
              label: { en: 'Products', tr: 'Urunler', de: 'Produkte', fr: 'Produits', es: 'Productos' },
              link: '/pages/shop',
            },
            {
              label: { en: 'Brands', tr: 'Markalar', de: 'Marken', fr: 'Marques', es: 'Marcas' },
              link: '/pages/categories',
            },
            {
              label: { en: 'Deals', tr: 'Firsatlar', de: 'Angebote', fr: 'Promotions', es: 'Ofertas' },
              link: '/pages/deals',
            },
            {
              label: { en: 'Support', tr: 'Destek', de: 'Support', fr: 'Assistance', es: 'Soporte' },
              link: '/pages/contact',
            },
          ],
        },
      },
      {
        id: 'teknoloji_header_search',
        type: 'search-bar',
        props: {
          placeholder: {
            en: 'Search products...',
            tr: 'Urun ara...',
            de: 'Produkte suchen...',
            fr: 'Rechercher...',
            es: 'Buscar productos...',
          },
        },
      },
      {
        id: 'teknoloji_header_cart',
        type: 'cart-icon',
        props: {
          showCount: true,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Footer — 4 columns
  // ---------------------------------------------------------------------------
  footer: {
    version: 1,
    blocks: [
      {
        id: 'teknoloji_footer_columns',
        type: 'columns',
        props: { columns: 4, gap: '2rem' },
        style: {
          backgroundColor: '#0F172A',
          padding: '3rem 2rem',
        },
        children: [
          // Col 1: Shop
          {
            id: 'teknoloji_footer_col1',
            type: 'container',
            props: {},
            children: [
              {
                id: 'teknoloji_footer_col1_links',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Shop</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/shop" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">All Products</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">New Arrivals</a></li>' +
                      '<li><a href="/pages/best-sellers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Best Sellers</a></li>' +
                      '<li><a href="/pages/deals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Deals</a></li>' +
                      '</ul>',
                    tr: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Magaza</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/shop" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Tum Urunler</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Yeni Gelenler</a></li>' +
                      '<li><a href="/pages/best-sellers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Cok Satanlar</a></li>' +
                      '<li><a href="/pages/deals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Firsatlar</a></li>' +
                      '</ul>',
                    de: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Shop</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/shop" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Alle Produkte</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Neuheiten</a></li>' +
                      '<li><a href="/pages/best-sellers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Bestseller</a></li>' +
                      '<li><a href="/pages/deals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Angebote</a></li>' +
                      '</ul>',
                    fr: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Boutique</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/shop" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Tous les produits</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Nouveautes</a></li>' +
                      '<li><a href="/pages/best-sellers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Meilleures ventes</a></li>' +
                      '<li><a href="/pages/deals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Promotions</a></li>' +
                      '</ul>',
                    es: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Tienda</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/shop" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Todos los productos</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Novedades</a></li>' +
                      '<li><a href="/pages/best-sellers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Mas vendidos</a></li>' +
                      '<li><a href="/pages/deals" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Ofertas</a></li>' +
                      '</ul>',
                  },
                },
              },
            ],
          },
          // Col 2: Support
          {
            id: 'teknoloji_footer_col2',
            type: 'container',
            props: {},
            children: [
              {
                id: 'teknoloji_footer_col2_links',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Support</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/warranty" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Warranty</a></li>' +
                      '<li><a href="/pages/repairs" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Repairs</a></li>' +
                      '<li><a href="/pages/returns" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Returns</a></li>' +
                      '<li><a href="/pages/tech-support" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Technical Support</a></li>' +
                      '<li><a href="/pages/contact" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Contact</a></li>' +
                      '</ul>',
                    tr: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Destek</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/warranty" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Garanti</a></li>' +
                      '<li><a href="/pages/repairs" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Onarim</a></li>' +
                      '<li><a href="/pages/returns" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Iade</a></li>' +
                      '<li><a href="/pages/tech-support" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Teknik Destek</a></li>' +
                      '<li><a href="/pages/contact" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Iletisim</a></li>' +
                      '</ul>',
                    de: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Support</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/warranty" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Garantie</a></li>' +
                      '<li><a href="/pages/repairs" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Reparaturen</a></li>' +
                      '<li><a href="/pages/returns" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Ruecksendungen</a></li>' +
                      '<li><a href="/pages/tech-support" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Technischer Support</a></li>' +
                      '<li><a href="/pages/contact" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Kontakt</a></li>' +
                      '</ul>',
                    fr: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Assistance</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/warranty" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Garantie</a></li>' +
                      '<li><a href="/pages/repairs" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Reparations</a></li>' +
                      '<li><a href="/pages/returns" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Retours</a></li>' +
                      '<li><a href="/pages/tech-support" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Support technique</a></li>' +
                      '<li><a href="/pages/contact" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Contact</a></li>' +
                      '</ul>',
                    es: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Soporte</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/warranty" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Garantia</a></li>' +
                      '<li><a href="/pages/repairs" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Reparaciones</a></li>' +
                      '<li><a href="/pages/returns" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Devoluciones</a></li>' +
                      '<li><a href="/pages/tech-support" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Soporte tecnico</a></li>' +
                      '<li><a href="/pages/contact" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Contacto</a></li>' +
                      '</ul>',
                  },
                },
              },
            ],
          },
          // Col 3: Company
          {
            id: 'teknoloji_footer_col3',
            type: 'container',
            props: {},
            children: [
              {
                id: 'teknoloji_footer_col3_links',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Company</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/about" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">About</a></li>' +
                      '<li><a href="/pages/careers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Careers</a></li>' +
                      '<li><a href="/pages/press" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Press</a></li>' +
                      '<li><a href="/pages/blog" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Blog</a></li>' +
                      '</ul>',
                    tr: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Sirket</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/about" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Hakkimizda</a></li>' +
                      '<li><a href="/pages/careers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Kariyer</a></li>' +
                      '<li><a href="/pages/press" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Basin</a></li>' +
                      '<li><a href="/pages/blog" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Blog</a></li>' +
                      '</ul>',
                    de: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Unternehmen</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/about" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Uber uns</a></li>' +
                      '<li><a href="/pages/careers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Karriere</a></li>' +
                      '<li><a href="/pages/press" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Presse</a></li>' +
                      '<li><a href="/pages/blog" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Blog</a></li>' +
                      '</ul>',
                    fr: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Entreprise</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/about" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">A propos</a></li>' +
                      '<li><a href="/pages/careers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Carrieres</a></li>' +
                      '<li><a href="/pages/press" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Presse</a></li>' +
                      '<li><a href="/pages/blog" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Blog</a></li>' +
                      '</ul>',
                    es: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Empresa</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
                      '<li><a href="/pages/about" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Sobre nosotros</a></li>' +
                      '<li><a href="/pages/careers" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Empleo</a></li>' +
                      '<li><a href="/pages/press" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Prensa</a></li>' +
                      '<li><a href="/pages/blog" style="color:#94A3B8;text-decoration:none;font-size:0.9rem">Blog</a></li>' +
                      '</ul>',
                  },
                },
              },
            ],
          },
          // Col 4: Newsletter + description
          {
            id: 'teknoloji_footer_col4',
            type: 'container',
            props: {},
            children: [
              {
                id: 'teknoloji_footer_col4_newsletter_text',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Newsletter</h4>' +
                      '<p style="color:#94A3B8;font-size:0.9rem;line-height:1.5;margin:0">Subscribe to get the latest tech news, product launches, and exclusive deals delivered straight to your inbox.</p>',
                    tr: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Bulten</h4>' +
                      '<p style="color:#94A3B8;font-size:0.9rem;line-height:1.5;margin:0">En son teknoloji haberlerini, urun lansmanlarini ve ozel firsatlari dogrudan e-postaniza almak icin abone olun.</p>',
                    de: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Newsletter</h4>' +
                      '<p style="color:#94A3B8;font-size:0.9rem;line-height:1.5;margin:0">Abonnieren Sie, um die neuesten Tech-Nachrichten, Produkteinfuehrungen und exklusive Angebote direkt in Ihren Posteingang zu erhalten.</p>',
                    fr: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Newsletter</h4>' +
                      '<p style="color:#94A3B8;font-size:0.9rem;line-height:1.5;margin:0">Abonnez-vous pour recevoir les dernieres actualites tech, lancements de produits et offres exclusives directement dans votre boite mail.</p>',
                    es: '<h4 style="color:#F1F5F9;margin:0 0 1rem 0;font-size:1rem;font-weight:700">Boletin</h4>' +
                      '<p style="color:#94A3B8;font-size:0.9rem;line-height:1.5;margin:0">Suscribase para recibir las ultimas noticias tecnologicas, lanzamientos de productos y ofertas exclusivas directamente en su bandeja de entrada.</p>',
                  },
                },
              },
            ],
          },
        ],
      },

      // Social links
      {
        id: 'teknoloji_footer_social',
        type: 'social-links',
        props: {
          links: [
            { platform: 'twitter', url: '#' },
            { platform: 'youtube', url: '#' },
            { platform: 'instagram', url: '#' },
          ],
        },
        style: {
          padding: '1.5rem 0',
          backgroundColor: '#0F172A',
        },
      },

      // Copyright
      {
        id: 'teknoloji_footer_copyright',
        type: 'text',
        props: {
          tag: 'p',
          content: {
            en: '\u00a9 2026 TechStore. All rights reserved.',
            tr: '\u00a9 2026 TeknoMagaza. Tum haklari saklidir.',
            de: '\u00a9 2026 TechShop. Alle Rechte vorbehalten.',
            fr: '\u00a9 2026 TechBoutique. Tous droits reserves.',
            es: '\u00a9 2026 TecnoTienda. Todos los derechos reservados.',
          },
        },
        style: {
          textAlign: 'center',
          padding: '1rem 0',
          backgroundColor: '#0F172A',
          textColor: '#94A3B8',
        },
      },
    ],
  },
};
