import type { ThemeBundle } from '../types.js';

export const minimalBundle: ThemeBundle = {
  manifest: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Aesop/Muji-inspired theme — extreme whitespace, monochrome palette, typography-focused',
    sector: 'genel',
    category: 'universal',
    colorPalette: ['#171717', '#737373', '#404040', '#FAFAFA', '#171717'],
    config: {
      primary: '#171717',
      secondary: '#737373',
      accent: '#404040',
      background: '#FAFAFA',
      foreground: '#171717',
      muted: '#F5F5F5',
      border: '#E5E5E5',
      fonts: { heading: 'Inter', body: 'Inter' },
      borderRadius: 'none',
      layout: {
        headerStyle: 'centered',
        productGridColumns: 3,
        footerColumns: 1,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero', type: 'hero' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'categories', name: 'Categories', type: 'categories-grid' },
    ],
  },

  homePage: {
    version: 1,
    blocks: [
      // 1. Hero — NO background image, typography-only, gradient feel
      {
        id: 'minimal_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'Less is More',
            tr: 'Az, Coktur',
            de: 'Weniger ist Mehr',
            fr: 'Moins c\'est Plus',
            es: 'Menos es Mas',
          },
          subtitle: {
            en: 'Carefully curated essentials for mindful living',
            tr: 'Bilinçli yasam icin ozenle secilmis temel urunler',
            de: 'Sorgfaeltig kuratierte Essentials fuer achtsames Leben',
            fr: 'Des essentiels soigneusement selectionnes pour une vie consciente',
            es: 'Esenciales cuidadosamente seleccionados para una vida consciente',
          },
          buttonText: {
            en: 'Explore',
            tr: 'Kesfet',
            de: 'Entdecken',
            fr: 'Explorer',
            es: 'Explorar',
          },
          buttonLink: '/pages/shop',
          overlayOpacity: 0,
        },
        style: {
          backgroundColor: '#FAFAFA',
          textColor: '#171717',
          padding: '6rem 2rem',
        },
      },

      // 2. Spacer — intentionally large whitespace
      {
        id: 'minimal_home_spacer_1',
        type: 'spacer',
        props: { height: '4rem' },
      },

      // 3. Product showcase — 3 products, 3 columns
      {
        id: 'minimal_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'Selected',
            tr: 'Secilmis',
            de: 'Ausgewaehlt',
            fr: 'Selection',
            es: 'Seleccion',
          },
          limit: 3,
          columns: 3,
        },
        style: {
          padding: '2rem',
          maxWidth: '1200px',
        },
      },

      // 4. Columns(3) — Static product images on white, no price, just product name
      {
        id: 'minimal_home_curated_columns',
        type: 'columns',
        props: { columns: 3, gap: '3rem' },
        style: {
          padding: '4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          {
            id: 'minimal_home_curated_col1',
            type: 'container',
            props: {},
            children: [
              {
                id: 'minimal_home_curated_img1',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
                  alt: {
                    en: 'Ceramic Vase',
                    tr: 'Seramik Vazo',
                    de: 'Keramikvase',
                    fr: 'Vase en ceramique',
                    es: 'Jarron de ceramica',
                  },
                },
                style: {
                  borderRadius: '0',
                },
              },
              {
                id: 'minimal_home_curated_text1',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: 'Ceramic Vase',
                    tr: 'Seramik Vazo',
                    de: 'Keramikvase',
                    fr: 'Vase en ceramique',
                    es: 'Jarron de ceramica',
                  },
                },
                style: {
                  textAlign: 'center',
                  padding: '1rem 0 0 0',
                  textColor: '#737373',
                },
              },
            ],
          },
          {
            id: 'minimal_home_curated_col2',
            type: 'container',
            props: {},
            children: [
              {
                id: 'minimal_home_curated_img2',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
                  alt: {
                    en: 'Hand-Poured Candle',
                    tr: 'El Yapimi Mum',
                    de: 'Handgegossene Kerze',
                    fr: 'Bougie coulee a la main',
                    es: 'Vela vertida a mano',
                  },
                },
                style: {
                  borderRadius: '0',
                },
              },
              {
                id: 'minimal_home_curated_text2',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: 'Hand-Poured Candle',
                    tr: 'El Yapimi Mum',
                    de: 'Handgegossene Kerze',
                    fr: 'Bougie coulee a la main',
                    es: 'Vela vertida a mano',
                  },
                },
                style: {
                  textAlign: 'center',
                  padding: '1rem 0 0 0',
                  textColor: '#737373',
                },
              },
            ],
          },
          {
            id: 'minimal_home_curated_col3',
            type: 'container',
            props: {},
            children: [
              {
                id: 'minimal_home_curated_img3',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
                  alt: {
                    en: 'Linen Throw',
                    tr: 'Keten Battaniye',
                    de: 'Leinendecke',
                    fr: 'Plaid en lin',
                    es: 'Manta de lino',
                  },
                },
                style: {
                  borderRadius: '0',
                },
              },
              {
                id: 'minimal_home_curated_text3',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: 'Linen Throw',
                    tr: 'Keten Battaniye',
                    de: 'Leinendecke',
                    fr: 'Plaid en lin',
                    es: 'Manta de lino',
                  },
                },
                style: {
                  textAlign: 'center',
                  padding: '1rem 0 0 0',
                  textColor: '#737373',
                },
              },
            ],
          },
        ],
      },

      // 5. Divider — thin, solid, centered, 60% width
      {
        id: 'minimal_home_divider',
        type: 'divider',
        props: {},
        style: {
          backgroundColor: '#E5E5E5',
          maxWidth: '60%',
          margin: '3rem auto',
        },
      },

      // 6. Category showcase — 3 categories, 3 columns
      {
        id: 'minimal_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Browse',
            tr: 'Gozat',
            de: 'Stoebern',
            fr: 'Parcourir',
            es: 'Explorar',
          },
          limit: 3,
          columns: 3,
        },
        style: {
          padding: '2rem',
          maxWidth: '1200px',
        },
      },

      // 7. Columns(3) — Monochrome category photos with grayscale, white text overlay
      {
        id: 'minimal_home_category_visuals',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          padding: '4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          {
            id: 'minimal_home_catvis_col1',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&q=80" alt="Essentials" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Essentials</span></div></div>',
                tr: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&q=80" alt="Temel Urunler" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Temel Urunler</span></div></div>',
                de: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&q=80" alt="Essentials" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Essentials</span></div></div>',
                fr: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&q=80" alt="Essentiels" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Essentiels</span></div></div>',
                es: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&q=80" alt="Esenciales" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Esenciales</span></div></div>',
              },
            },
          },
          {
            id: 'minimal_home_catvis_col2',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80" alt="Home" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Home</span></div></div>',
                tr: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80" alt="Ev" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Ev</span></div></div>',
                de: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80" alt="Zuhause" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Zuhause</span></div></div>',
                fr: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80" alt="Maison" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Maison</span></div></div>',
                es: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80" alt="Hogar" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Hogar</span></div></div>',
              },
            },
          },
          {
            id: 'minimal_home_catvis_col3',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" alt="Personal Care" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Personal Care</span></div></div>',
                tr: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" alt="Kisisel Bakim" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Kisisel Bakim</span></div></div>',
                de: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" alt="Koerperpflege" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Koerperpflege</span></div></div>',
                fr: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" alt="Soin personnel" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Soin Personnel</span></div></div>',
                es: '<div style="position:relative;height:300px;overflow:hidden"><img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" alt="Cuidado personal" style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%)" /><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3)"><span style="color:#fff;font-size:1.5rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:300">Cuidado Personal</span></div></div>',
              },
            },
          },
        ],
      },

      // 8. Newsletter — single word title, minimal description
      {
        id: 'minimal_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'Updates',
            tr: 'Guncellemeler',
            de: 'Neuigkeiten',
            fr: 'Actualites',
            es: 'Novedades',
          },
          description: {
            en: 'Occasional notes on new arrivals.',
            tr: 'Yeni urunler hakkinda ara sira notlar.',
            de: 'Gelegentliche Hinweise zu Neuheiten.',
            fr: 'Notes occasionnelles sur les nouveautes.',
            es: 'Notas ocasionales sobre nuevas llegadas.',
          },
        },
        style: {
          padding: '4rem 2rem',
          backgroundColor: '#F5F5F5',
          textAlign: 'center',
        },
      },
    ],
  },

  header: {
    version: 1,
    blocks: [
      {
        id: 'minimal_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'STUDIO',
            tr: 'STUDIO',
            de: 'STUDIO',
            fr: 'STUDIO',
            es: 'STUDIO',
          },
          logoUrl: '',
        },
      },
      {
        id: 'minimal_header_nav',
        type: 'navigation-menu',
        props: {
          items: [
            {
              label: { en: 'Home', tr: 'Ana Sayfa', de: 'Startseite', fr: 'Accueil', es: 'Inicio' },
              link: '/',
            },
            {
              label: { en: 'Shop', tr: 'Magaza', de: 'Shop', fr: 'Boutique', es: 'Tienda' },
              link: '/pages/shop',
            },
            {
              label: { en: 'About', tr: 'Hakkimizda', de: 'Ueber uns', fr: 'A propos', es: 'Sobre nosotros' },
              link: '/pages/about',
            },
            {
              label: { en: 'Contact', tr: 'Iletisim', de: 'Kontakt', fr: 'Contact', es: 'Contacto' },
              link: '/pages/contact',
            },
          ],
        },
      },
      {
        id: 'minimal_header_search',
        type: 'search-bar',
        props: {
          placeholder: {
            en: 'Search...',
            tr: 'Ara...',
            de: 'Suchen...',
            fr: 'Rechercher...',
            es: 'Buscar...',
          },
        },
      },
      {
        id: 'minimal_header_cart',
        type: 'cart-icon',
        props: {
          showCount: true,
        },
      },
    ],
  },

  footer: {
    version: 1,
    blocks: [
      // Brand name — large, centered
      {
        id: 'minimal_footer_brand',
        type: 'text',
        props: {
          tag: 'p',
          content: {
            en: 'STUDIO',
            tr: 'STUDIO',
            de: 'STUDIO',
            fr: 'STUDIO',
            es: 'STUDIO',
          },
        },
        style: {
          textAlign: 'center',
          padding: '2rem 0 1rem 0',
          textColor: '#171717',
          customCss: 'font-size:1.5rem;letter-spacing:0.3em;font-weight:300',
        },
      },

      // Thin divider
      {
        id: 'minimal_footer_divider',
        type: 'divider',
        props: {},
        style: {
          backgroundColor: '#E5E5E5',
          maxWidth: '40%',
          margin: '0 auto 1.5rem auto',
        },
      },

      // Social links — only Instagram and Pinterest
      {
        id: 'minimal_footer_social',
        type: 'social-links',
        props: {
          links: [
            { platform: 'instagram', url: '#' },
            { platform: 'pinterest', url: '#' },
          ],
        },
      },

      // Copyright — centered
      {
        id: 'minimal_footer_copyright',
        type: 'text',
        props: {
          tag: 'p',
          content: {
            en: '\u00a9 2026 STUDIO. All rights reserved.',
            tr: '\u00a9 2026 STUDIO. Tum haklari saklidir.',
            de: '\u00a9 2026 STUDIO. Alle Rechte vorbehalten.',
            fr: '\u00a9 2026 STUDIO. Tous droits reserves.',
            es: '\u00a9 2026 STUDIO. Todos los derechos reservados.',
          },
        },
        style: {
          textAlign: 'center',
          padding: '1rem 0 2rem 0',
          textColor: '#737373',
        },
      },
    ],
  },
};
