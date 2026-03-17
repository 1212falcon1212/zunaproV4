import type { ThemeBundle } from '../types.js';

export const giyimBundle: ThemeBundle = {
  manifest: {
    id: 'giyim',
    name: 'Giyim',
    description: 'Editorial, high-contrast fashion theme inspired by ZARA and H&M with serif typography',
    sector: 'giyim',
    category: 'sector',
    colorPalette: ['#1A1A1A', '#6B7280', '#BE185D', '#FFFFFF', '#111111'],
    config: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
      accent: '#BE185D',
      background: '#FFFFFF',
      foreground: '#111111',
      muted: '#F9FAFB',
      border: '#E5E7EB',
      fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
      borderRadius: 'none',
      layout: {
        headerStyle: 'centered',
        productGridColumns: 3,
        footerColumns: 2,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero Banner', type: 'hero' },
      { id: 'lookbook', name: 'Lookbook Grid', type: 'custom', component: 'lookbook-grid' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'editorial-banner', name: 'Editorial Banner', type: 'banner' },
      { id: 'categories', name: 'Categories', type: 'categories-grid' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Home Page
  // ---------------------------------------------------------------------------
  homePage: {
    version: 1,
    blocks: [
      // 1. Hero — Fashion editorial, minimal text, big overlay
      {
        id: 'giyim_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'New Season',
            tr: 'Yeni Sezon',
            de: 'Neue Saison',
            fr: 'Nouvelle Saison',
            es: 'Nueva Temporada',
          },
          subtitle: {
            en: 'Curated essentials for the modern wardrobe',
            tr: 'Modern gardiroba ozel secilmis parcalar',
            de: 'Kuratierte Essentials fuer die moderne Garderobe',
            fr: 'Des essentiels selectionnes pour la garde-robe moderne',
            es: 'Esenciales seleccionados para el guardarropa moderno',
          },
          buttonText: {
            en: 'Shop Now',
            tr: 'Alisverise Basla',
            de: 'Jetzt einkaufen',
            fr: 'Acheter maintenant',
            es: 'Comprar ahora',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
          overlayOpacity: 0.3,
        },
        style: {
          backgroundColor: '#1A1A1A',
          textColor: '#FFFFFF',
          padding: '6rem 2rem',
        },
      },

      // 2. Lookbook Grid — 2 large editorial photos side by side
      {
        id: 'giyim_home_lookbook',
        type: 'columns',
        props: { columns: 2, gap: '0.5rem' },
        style: {
          padding: '0 1rem',
        },
        children: [
          {
            id: 'giyim_home_lookbook_men',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Men\'s Collection</h2><a href="/categories/men" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Shop Collection</a></div></div>',
                tr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Erkek Koleksiyonu</h2><a href="/categories/men" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Koleksiyonu Incele</a></div></div>',
                de: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Herrenkollektion</h2><a href="/categories/men" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Kollektion ansehen</a></div></div>',
                fr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Collection Homme</h2><a href="/categories/men" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Voir la collection</a></div></div>',
                es: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Coleccion Hombre</h2><a href="/categories/men" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Ver coleccion</a></div></div>',
              },
            },
          },
          {
            id: 'giyim_home_lookbook_women',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Women\'s Collection</h2><a href="/categories/women" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Shop Collection</a></div></div>',
                tr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Kadin Koleksiyonu</h2><a href="/categories/women" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Koleksiyonu Incele</a></div></div>',
                de: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Damenkollektion</h2><a href="/categories/women" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Kollektion ansehen</a></div></div>',
                fr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Collection Femme</h2><a href="/categories/women" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Voir la collection</a></div></div>',
                es: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80);background-size:cover;background-position:center;height:400px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)"></div><div style="position:relative;text-align:center;color:#fff"><h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;margin:0 0 0.5rem">Coleccion Mujer</h2><a href="/categories/women" style="color:#fff;text-decoration:underline;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase">Ver coleccion</a></div></div>',
              },
            },
          },
        ],
      },

      // 3. Spacer
      {
        id: 'giyim_home_spacer1',
        type: 'spacer',
        props: { height: '1.5rem' },
      },

      // 4. Product Showcase — 6 products, 3 columns
      {
        id: 'giyim_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'Just In',
            tr: 'Yeni Gelenler',
            de: 'Neu eingetroffen',
            fr: 'Nouveautes',
            es: 'Recien llegados',
          },
          limit: 6,
          columns: 3,
        },
        style: {
          padding: '2rem 0',
        },
      },

      // 5. Static Fashion Products — Silk Dress, Wool Coat, Leather Boots
      {
        id: 'giyim_home_editorial_products',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          padding: '2rem 1rem',
        },
        children: [
          {
            id: 'giyim_home_ep_dress',
            type: 'container',
            props: {},
            children: [
              {
                id: 'giyim_home_ep_dress_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
                  alt: {
                    en: 'Silk Dress',
                    tr: 'Ipek Elbise',
                    de: 'Seidenkleid',
                    fr: 'Robe en soie',
                    es: 'Vestido de seda',
                  },
                },
              },
              {
                id: 'giyim_home_ep_dress_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Silk Dress',
                    tr: 'Ipek Elbise',
                    de: 'Seidenkleid',
                    fr: 'Robe en soie',
                    es: 'Vestido de seda',
                  },
                },
                style: {
                  padding: '0.75rem 0 0.25rem',
                },
              },
              {
                id: 'giyim_home_ep_dress_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$189',
                    tr: '$189',
                    de: '$189',
                    fr: '$189',
                    es: '$189',
                  },
                },
                style: {
                  textColor: '#BE185D',
                },
              },
            ],
          },
          {
            id: 'giyim_home_ep_coat',
            type: 'container',
            props: {},
            children: [
              {
                id: 'giyim_home_ep_coat_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80',
                  alt: {
                    en: 'Wool Coat',
                    tr: 'Yun Palto',
                    de: 'Wollmantel',
                    fr: 'Manteau en laine',
                    es: 'Abrigo de lana',
                  },
                },
              },
              {
                id: 'giyim_home_ep_coat_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Wool Coat',
                    tr: 'Yun Palto',
                    de: 'Wollmantel',
                    fr: 'Manteau en laine',
                    es: 'Abrigo de lana',
                  },
                },
                style: {
                  padding: '0.75rem 0 0.25rem',
                },
              },
              {
                id: 'giyim_home_ep_coat_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$349',
                    tr: '$349',
                    de: '$349',
                    fr: '$349',
                    es: '$349',
                  },
                },
                style: {
                  textColor: '#BE185D',
                },
              },
            ],
          },
          {
            id: 'giyim_home_ep_boots',
            type: 'container',
            props: {},
            children: [
              {
                id: 'giyim_home_ep_boots_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
                  alt: {
                    en: 'Leather Boots',
                    tr: 'Deri Bot',
                    de: 'Lederstiefel',
                    fr: 'Bottes en cuir',
                    es: 'Botas de cuero',
                  },
                },
              },
              {
                id: 'giyim_home_ep_boots_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Leather Boots',
                    tr: 'Deri Bot',
                    de: 'Lederstiefel',
                    fr: 'Bottes en cuir',
                    es: 'Botas de cuero',
                  },
                },
                style: {
                  padding: '0.75rem 0 0.25rem',
                },
              },
              {
                id: 'giyim_home_ep_boots_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$279',
                    tr: '$279',
                    de: '$279',
                    fr: '$279',
                    es: '$279',
                  },
                },
                style: {
                  textColor: '#BE185D',
                },
              },
            ],
          },
        ],
      },

      // 6. Full-Width Editorial Banner — SS26 Collection
      {
        id: 'giyim_home_editorial_banner',
        type: 'banner',
        props: {
          title: {
            en: 'SS26 Collection',
            tr: 'SS26 Koleksiyonu',
            de: 'SS26 Kollektion',
            fr: 'Collection SS26',
            es: 'Coleccion SS26',
          },
          subtitle: {
            en: 'Explore the new season',
            tr: 'Yeni sezonu kesfet',
            de: 'Entdecken Sie die neue Saison',
            fr: 'Explorez la nouvelle saison',
            es: 'Explora la nueva temporada',
          },
          buttonText: {
            en: 'Discover',
            tr: 'Kesfet',
            de: 'Entdecken',
            fr: 'Decouvrir',
            es: 'Descubrir',
          },
          buttonLink: '/pages/collections',
          backgroundImage: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80',
          height: '400px',
        },
        style: {
          padding: '0',
          textColor: '#ffffff',
          customCss: 'min-height:400px;background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center',
        },
      },

      // 7. Category Showcase — 4 categories, 2 columns
      {
        id: 'giyim_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Shop by Category',
            tr: 'Kategoriye Gore Alisveris',
            de: 'Nach Kategorie einkaufen',
            fr: 'Acheter par categorie',
            es: 'Comprar por categoria',
          },
          limit: 4,
          columns: 2,
        },
        style: {
          padding: '3rem 0',
        },
      },

      // 8. Static Category Cards — Dresses & Outerwear
      {
        id: 'giyim_home_category_cards',
        type: 'columns',
        props: { columns: 2, gap: '0.5rem' },
        style: {
          padding: '0 1rem',
        },
        children: [
          {
            id: 'giyim_home_cat_dresses',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Dresses</h2><a href="/categories/dresses" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Explore</a></div></div>',
                tr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Elbiseler</h2><a href="/categories/dresses" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Kesfet</a></div></div>',
                de: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Kleider</h2><a href="/categories/dresses" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Entdecken</a></div></div>',
                fr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Robes</h2><a href="/categories/dresses" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Explorer</a></div></div>',
                es: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Vestidos</h2><a href="/categories/dresses" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Explorar</a></div></div>',
              },
            },
          },
          {
            id: 'giyim_home_cat_outerwear',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Outerwear</h2><a href="/categories/outerwear" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Explore</a></div></div>',
                tr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Dis Giyim</h2><a href="/categories/outerwear" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Kesfet</a></div></div>',
                de: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Oberbekleidung</h2><a href="/categories/outerwear" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Entdecken</a></div></div>',
                fr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Manteaux</h2><a href="/categories/outerwear" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Explorer</a></div></div>',
                es: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80);background-size:cover;background-position:center;height:350px;display:flex;align-items:flex-end;justify-content:center;padding:2rem"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55),transparent)"></div><div style="position:relative;text-align:center;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:1rem"><h2 style="font-family:Cormorant Garamond,serif;font-size:1.75rem;margin:0 0 0.5rem">Abrigos</h2><a href="/categories/outerwear" style="color:#fff;text-decoration:none;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase">Explorar</a></div></div>',
              },
            },
          },
        ],
      },

      // 9. Divider — Rose gold thin line, centered, 50% width
      {
        id: 'giyim_home_divider',
        type: 'divider',
        props: {},
        style: {
          backgroundColor: '#BE185D',
          maxWidth: '50%',
          margin: '2rem auto',
        },
      },

      // 10. Newsletter — "Join the Club", minimalist white bg
      {
        id: 'giyim_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'Join the Club',
            tr: 'Kulube Katil',
            de: 'Werden Sie Mitglied',
            fr: 'Rejoignez le club',
            es: 'Unete al club',
          },
          description: {
            en: 'Be the first to know about new arrivals and exclusive offers',
            tr: 'Yeni gelenler ve ozel firsatlardan ilk siz haberdar olun',
            de: 'Erfahren Sie als Erster von Neuheiten und exklusiven Angeboten',
            fr: 'Soyez le premier informe des nouveautes et offres exclusives',
            es: 'Se el primero en conocer las novedades y ofertas exclusivas',
          },
        },
        style: {
          backgroundColor: '#FFFFFF',
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
        id: 'giyim_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'MAISON',
            tr: 'MAISON',
            de: 'MAISON',
            fr: 'MAISON',
            es: 'MAISON',
          },
          logoUrl: '',
        },
      },
      {
        id: 'giyim_header_nav',
        type: 'navigation-menu',
        props: {
          items: [
            {
              label: { en: 'Home', tr: 'Ana Sayfa', de: 'Startseite', fr: 'Accueil', es: 'Inicio' },
              link: '/',
            },
            {
              label: { en: 'Women', tr: 'Kadin', de: 'Damen', fr: 'Femme', es: 'Mujer' },
              link: '/categories/women',
            },
            {
              label: { en: 'Men', tr: 'Erkek', de: 'Herren', fr: 'Homme', es: 'Hombre' },
              link: '/categories/men',
            },
            {
              label: { en: 'New In', tr: 'Yeni Gelenler', de: 'Neuheiten', fr: 'Nouveautes', es: 'Novedades' },
              link: '/pages/new-in',
            },
            {
              label: { en: 'Sale', tr: 'Indirim', de: 'Sale', fr: 'Soldes', es: 'Rebajas' },
              link: '/pages/sale',
            },
          ],
        },
      },
      {
        id: 'giyim_header_search',
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
        id: 'giyim_header_cart',
        type: 'cart-icon',
        props: {
          showCount: true,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Footer — Minimalist 2-column fashion style
  // ---------------------------------------------------------------------------
  footer: {
    version: 1,
    blocks: [
      {
        id: 'giyim_footer_main',
        type: 'container',
        props: {},
        style: {
          backgroundColor: '#1A1A1A',
          textColor: '#FFFFFF',
          padding: '3rem 2rem',
        },
        children: [
          {
            id: 'giyim_footer_columns',
            type: 'columns',
            props: { columns: 2, gap: '3rem' },
            children: [
              // Column 1: Brand name + horizontal links with pipe separators
              {
                id: 'giyim_footer_col1',
                type: 'container',
                props: {},
                children: [
                  {
                    id: 'giyim_footer_brand',
                    type: 'text',
                    props: {
                      tag: 'div',
                      content: {
                        en: '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;letter-spacing:0.2em;margin:0 0 1.25rem">MAISON</h3><p style="font-size:0.8rem;letter-spacing:0.05em;line-height:2"><a href="/pages/shop" style="color:#fff;text-decoration:none">Shop</a> &nbsp;|&nbsp; <a href="/pages/about" style="color:#fff;text-decoration:none">About</a> &nbsp;|&nbsp; <a href="/pages/careers" style="color:#fff;text-decoration:none">Careers</a> &nbsp;|&nbsp; <a href="/pages/press" style="color:#fff;text-decoration:none">Press</a> &nbsp;|&nbsp; <a href="/pages/contact" style="color:#fff;text-decoration:none">Contact</a></p>',
                        tr: '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;letter-spacing:0.2em;margin:0 0 1.25rem">MAISON</h3><p style="font-size:0.8rem;letter-spacing:0.05em;line-height:2"><a href="/pages/shop" style="color:#fff;text-decoration:none">Magaza</a> &nbsp;|&nbsp; <a href="/pages/about" style="color:#fff;text-decoration:none">Hakkimizda</a> &nbsp;|&nbsp; <a href="/pages/careers" style="color:#fff;text-decoration:none">Kariyer</a> &nbsp;|&nbsp; <a href="/pages/press" style="color:#fff;text-decoration:none">Basin</a> &nbsp;|&nbsp; <a href="/pages/contact" style="color:#fff;text-decoration:none">Iletisim</a></p>',
                        de: '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;letter-spacing:0.2em;margin:0 0 1.25rem">MAISON</h3><p style="font-size:0.8rem;letter-spacing:0.05em;line-height:2"><a href="/pages/shop" style="color:#fff;text-decoration:none">Shop</a> &nbsp;|&nbsp; <a href="/pages/about" style="color:#fff;text-decoration:none">Uber uns</a> &nbsp;|&nbsp; <a href="/pages/careers" style="color:#fff;text-decoration:none">Karriere</a> &nbsp;|&nbsp; <a href="/pages/press" style="color:#fff;text-decoration:none">Presse</a> &nbsp;|&nbsp; <a href="/pages/contact" style="color:#fff;text-decoration:none">Kontakt</a></p>',
                        fr: '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;letter-spacing:0.2em;margin:0 0 1.25rem">MAISON</h3><p style="font-size:0.8rem;letter-spacing:0.05em;line-height:2"><a href="/pages/shop" style="color:#fff;text-decoration:none">Boutique</a> &nbsp;|&nbsp; <a href="/pages/about" style="color:#fff;text-decoration:none">A propos</a> &nbsp;|&nbsp; <a href="/pages/careers" style="color:#fff;text-decoration:none">Carrieres</a> &nbsp;|&nbsp; <a href="/pages/press" style="color:#fff;text-decoration:none">Presse</a> &nbsp;|&nbsp; <a href="/pages/contact" style="color:#fff;text-decoration:none">Contact</a></p>',
                        es: '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;letter-spacing:0.2em;margin:0 0 1.25rem">MAISON</h3><p style="font-size:0.8rem;letter-spacing:0.05em;line-height:2"><a href="/pages/shop" style="color:#fff;text-decoration:none">Tienda</a> &nbsp;|&nbsp; <a href="/pages/about" style="color:#fff;text-decoration:none">Sobre nosotros</a> &nbsp;|&nbsp; <a href="/pages/careers" style="color:#fff;text-decoration:none">Empleo</a> &nbsp;|&nbsp; <a href="/pages/press" style="color:#fff;text-decoration:none">Prensa</a> &nbsp;|&nbsp; <a href="/pages/contact" style="color:#fff;text-decoration:none">Contacto</a></p>',
                      },
                    },
                  },
                ],
              },
              // Column 2: Newsletter description + Social links text
              {
                id: 'giyim_footer_col2',
                type: 'container',
                props: {},
                children: [
                  {
                    id: 'giyim_footer_social_text',
                    type: 'text',
                    props: {
                      tag: 'div',
                      content: {
                        en: '<p style="font-size:0.85rem;margin:0 0 1rem;line-height:1.6">Sign up for exclusive access to new collections, lookbooks, and private sales.</p><p style="font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase"><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">Instagram</a><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">TikTok</a><a href="#" style="color:#fff;text-decoration:none">Pinterest</a></p>',
                        tr: '<p style="font-size:0.85rem;margin:0 0 1rem;line-height:1.6">Yeni koleksiyonlara, lookbooklara ve ozel indirimlere ilk erisim icin kayit olun.</p><p style="font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase"><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">Instagram</a><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">TikTok</a><a href="#" style="color:#fff;text-decoration:none">Pinterest</a></p>',
                        de: '<p style="font-size:0.85rem;margin:0 0 1rem;line-height:1.6">Melden Sie sich an fuer exklusiven Zugang zu neuen Kollektionen, Lookbooks und privaten Sales.</p><p style="font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase"><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">Instagram</a><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">TikTok</a><a href="#" style="color:#fff;text-decoration:none">Pinterest</a></p>',
                        fr: '<p style="font-size:0.85rem;margin:0 0 1rem;line-height:1.6">Inscrivez-vous pour un acces exclusif aux nouvelles collections, lookbooks et ventes privees.</p><p style="font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase"><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">Instagram</a><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">TikTok</a><a href="#" style="color:#fff;text-decoration:none">Pinterest</a></p>',
                        es: '<p style="font-size:0.85rem;margin:0 0 1rem;line-height:1.6">Registrate para acceso exclusivo a nuevas colecciones, lookbooks y ventas privadas.</p><p style="font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase"><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">Instagram</a><a href="#" style="color:#fff;text-decoration:none;margin-right:1.5rem">TikTok</a><a href="#" style="color:#fff;text-decoration:none">Pinterest</a></p>',
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      // Copyright — centered, minimal
      {
        id: 'giyim_footer_copyright',
        type: 'text',
        props: {
          tag: 'p',
          content: {
            en: '\u00a9 2026 MAISON. All rights reserved.',
            tr: '\u00a9 2026 MAISON. Tum haklari saklidir.',
            de: '\u00a9 2026 MAISON. Alle Rechte vorbehalten.',
            fr: '\u00a9 2026 MAISON. Tous droits reserves.',
            es: '\u00a9 2026 MAISON. Todos los derechos reservados.',
          },
        },
        style: {
          textAlign: 'center',
          padding: '1.5rem 0',
          backgroundColor: '#111111',
          textColor: '#6B7280',
        },
      },
    ],
  },
};
