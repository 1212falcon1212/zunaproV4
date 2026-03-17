import type { ThemeBundle } from '../types.js';

export const genelBundle: ThemeBundle = {
  manifest: {
    id: 'genel',
    name: 'General',
    description: 'A versatile all-purpose theme suitable for any type of online store',
    sector: 'genel',
    category: 'sector',
    colorPalette: ['#6366f1', '#64748b', '#f59e0b', '#ffffff', '#0f172a'],
    config: {
      primary: '#6366f1',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      border: '#e2e8f0',
      fonts: { heading: 'Inter', body: 'Inter' },
      borderRadius: 'md',
      layout: {
        headerStyle: 'standard',
        productGridColumns: 4,
        footerColumns: 4,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero Banner', type: 'hero' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'categories', name: 'Categories', type: 'categories-grid' },
      { id: 'banner', name: 'Banner', type: 'banner' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Home Page — 9 blocks
  // ---------------------------------------------------------------------------
  homePage: {
    version: 1,
    blocks: [
      // 1. Hero
      {
        id: 'genel_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'Discover Our Collection',
            tr: 'Koleksiyonumuzu Kesfedin',
            de: 'Entdecken Sie unsere Kollektion',
            fr: 'Decouvrez notre collection',
            es: 'Descubre nuestra coleccion',
          },
          subtitle: {
            en: 'Handpicked products for every taste and every occasion',
            tr: 'Her zevke ve her duruma uygun secilmis urunler',
            de: 'Handverlesene Produkte fuer jeden Geschmack und jeden Anlass',
            fr: 'Des produits selectionnes pour tous les gouts et toutes les occasions',
            es: 'Productos seleccionados para todos los gustos y todas las ocasiones',
          },
          buttonText: {
            en: 'Shop Now',
            tr: 'Alisverise Basla',
            de: 'Jetzt einkaufen',
            fr: 'Acheter maintenant',
            es: 'Comprar ahora',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80',
          overlayOpacity: 0.5,
          secondaryButtonText: {
            en: 'Learn More',
            tr: 'Daha Fazla',
            de: 'Mehr erfahren',
            fr: 'En savoir plus',
            es: 'Saber mas',
          },
          secondaryButtonLink: '/pages/about',
        },
        style: {
          backgroundColor: '#1a1a2e',
          textColor: '#ffffff',
          padding: '4rem 2rem',
        },
      },

      // 2. Product Showcase — 8 products, 4 columns
      {
        id: 'genel_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'Featured Products',
            tr: 'One Cikan Urunler',
            de: 'Empfohlene Produkte',
            fr: 'Produits en vedette',
            es: 'Productos destacados',
          },
          subtitle: {
            en: 'Our most popular items, hand-selected for you',
            tr: 'Sizin icin ozenle secilmis en populer urunlerimiz',
            de: 'Unsere beliebtesten Artikel, handverlesen fuer Sie',
            fr: 'Nos articles les plus populaires, selectionnes pour vous',
            es: 'Nuestros articulos mas populares, seleccionados para ti',
          },
          limit: 8,
          columns: 4,
        },
        style: {
          padding: '3rem 2rem',
        },
      },

      // 3. Static Product Cards — columns(4) with container > image + text + text
      {
        id: 'genel_home_static_products',
        type: 'columns',
        props: { columns: 4, gap: '1.5rem' },
        style: {
          padding: '2rem 2rem',
          maxWidth: '1280px',
        },
        children: [
          // Card 1 — Watch
          {
            id: 'genel_home_static_card_1',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              customCss: 'box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden;',
            },
            children: [
              {
                id: 'genel_home_static_card_1_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
                  alt: {
                    en: 'Classic Timepiece',
                    tr: 'Klasik Saat',
                    de: 'Klassische Uhr',
                    fr: 'Montre classique',
                    es: 'Reloj clasico',
                  },
                },
                style: {
                  borderRadius: '12px 12px 0 0',
                },
              },
              {
                id: 'genel_home_static_card_1_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Classic Timepiece',
                    tr: 'Klasik Saat',
                    de: 'Klassische Uhr',
                    fr: 'Montre classique',
                    es: 'Reloj clasico',
                  },
                },
                style: {
                  padding: '0.75rem 1rem 0 1rem',
                  textColor: '#0f172a',
                },
              },
              {
                id: 'genel_home_static_card_1_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$249.99',
                    tr: '$249.99',
                    de: '$249.99',
                    fr: '$249.99',
                    es: '$249.99',
                  },
                },
                style: {
                  padding: '0.25rem 1rem 1rem 1rem',
                  textColor: '#6366f1',
                },
              },
            ],
          },
          // Card 2 — Headphones
          {
            id: 'genel_home_static_card_2',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              customCss: 'box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden;',
            },
            children: [
              {
                id: 'genel_home_static_card_2_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
                  alt: {
                    en: 'Premium Headphones',
                    tr: 'Premium Kulaklik',
                    de: 'Premium Kopfhoerer',
                    fr: 'Casque premium',
                    es: 'Auriculares premium',
                  },
                },
                style: {
                  borderRadius: '12px 12px 0 0',
                },
              },
              {
                id: 'genel_home_static_card_2_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Premium Headphones',
                    tr: 'Premium Kulaklik',
                    de: 'Premium Kopfhoerer',
                    fr: 'Casque premium',
                    es: 'Auriculares premium',
                  },
                },
                style: {
                  padding: '0.75rem 1rem 0 1rem',
                  textColor: '#0f172a',
                },
              },
              {
                id: 'genel_home_static_card_2_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$179.99',
                    tr: '$179.99',
                    de: '$179.99',
                    fr: '$179.99',
                    es: '$179.99',
                  },
                },
                style: {
                  padding: '0.25rem 1rem 1rem 1rem',
                  textColor: '#6366f1',
                },
              },
            ],
          },
          // Card 3 — Sunglasses
          {
            id: 'genel_home_static_card_3',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              customCss: 'box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden;',
            },
            children: [
              {
                id: 'genel_home_static_card_3_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
                  alt: {
                    en: 'Designer Sunglasses',
                    tr: 'Tasarim Gunes Gozlugu',
                    de: 'Designer Sonnenbrille',
                    fr: 'Lunettes de soleil design',
                    es: 'Gafas de sol de diseno',
                  },
                },
                style: {
                  borderRadius: '12px 12px 0 0',
                },
              },
              {
                id: 'genel_home_static_card_3_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Designer Sunglasses',
                    tr: 'Tasarim Gunes Gozlugu',
                    de: 'Designer Sonnenbrille',
                    fr: 'Lunettes de soleil design',
                    es: 'Gafas de sol de diseno',
                  },
                },
                style: {
                  padding: '0.75rem 1rem 0 1rem',
                  textColor: '#0f172a',
                },
              },
              {
                id: 'genel_home_static_card_3_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$129.99',
                    tr: '$129.99',
                    de: '$129.99',
                    fr: '$129.99',
                    es: '$129.99',
                  },
                },
                style: {
                  padding: '0.25rem 1rem 1rem 1rem',
                  textColor: '#6366f1',
                },
              },
            ],
          },
          // Card 4 — Camera
          {
            id: 'genel_home_static_card_4',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              customCss: 'box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden;',
            },
            children: [
              {
                id: 'genel_home_static_card_4_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
                  alt: {
                    en: 'Digital Camera',
                    tr: 'Dijital Kamera',
                    de: 'Digitalkamera',
                    fr: 'Appareil photo numerique',
                    es: 'Camara digital',
                  },
                },
                style: {
                  borderRadius: '12px 12px 0 0',
                },
              },
              {
                id: 'genel_home_static_card_4_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Digital Camera',
                    tr: 'Dijital Kamera',
                    de: 'Digitalkamera',
                    fr: 'Appareil photo numerique',
                    es: 'Camara digital',
                  },
                },
                style: {
                  padding: '0.75rem 1rem 0 1rem',
                  textColor: '#0f172a',
                },
              },
              {
                id: 'genel_home_static_card_4_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$899.99',
                    tr: '$899.99',
                    de: '$899.99',
                    fr: '$899.99',
                    es: '$899.99',
                  },
                },
                style: {
                  padding: '0.25rem 1rem 1rem 1rem',
                  textColor: '#6366f1',
                },
              },
            ],
          },
        ],
      },

      // 4. Spacer
      {
        id: 'genel_home_spacer',
        type: 'spacer',
        props: {
          height: '2rem',
        },
      },

      // 5. Category Showcase — 6 categories, 3 columns
      {
        id: 'genel_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Shop by Category',
            tr: 'Kategorilere Goz At',
            de: 'Nach Kategorie einkaufen',
            fr: 'Acheter par categorie',
            es: 'Comprar por categoria',
          },
          subtitle: {
            en: 'Browse our curated collections',
            tr: 'Secilmis koleksiyonlarimiza goz atin',
            de: 'Durchsuchen Sie unsere kuratierten Kollektionen',
            fr: 'Parcourez nos collections selectionnees',
            es: 'Explora nuestras colecciones seleccionadas',
          },
          limit: 6,
          columns: 3,
        },
        style: {
          padding: '3rem 2rem',
        },
      },

      // 6. Static Category Cards — columns(3) with html children
      {
        id: 'genel_home_static_categories',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          padding: '0 2rem 3rem 2rem',
          maxWidth: '1280px',
        },
        children: [
          {
            id: 'genel_home_static_cat_1',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Electronics</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Discover the latest tech</p></div></div>',
                tr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Elektronik</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">En son teknolojiyi kesfedin</p></div></div>',
                de: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Elektronik</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Entdecken Sie die neueste Technik</p></div></div>',
                fr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Electronique</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Decouvrez les dernieres technologies</p></div></div>',
                es: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Electronica</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Descubre la ultima tecnologia</p></div></div>',
              },
            },
          },
          {
            id: 'genel_home_static_cat_2',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Fashion</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Trending styles for every season</p></div></div>',
                tr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Moda</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Her mevsim icin trend stiller</p></div></div>',
                de: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Mode</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Trendige Styles fuer jede Saison</p></div></div>',
                fr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Mode</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Les tendances de chaque saison</p></div></div>',
                es: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Moda</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Estilos de tendencia para cada temporada</p></div></div>',
              },
            },
          },
          {
            id: 'genel_home_static_cat_3',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Home &amp; Living</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Create your perfect space</p></div></div>',
                tr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Ev &amp; Yasam</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Mukemmel mekaninizi olusturun</p></div></div>',
                de: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Heim &amp; Wohnen</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Gestalten Sie Ihren perfekten Raum</p></div></div>',
                fr: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Maison &amp; Deco</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Creez votre espace parfait</p></div></div>',
                es: '<div style="position:relative;background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent);padding:1.5rem;"><h3 style="color:#fff;margin:0;font-size:1.5rem;font-weight:700;">Hogar &amp; Vida</h3><p style="color:rgba(255,255,255,0.85);margin:0.25rem 0 0;font-size:0.95rem;">Crea tu espacio perfecto</p></div></div>',
              },
            },
          },
        ],
      },

      // 7. Banner — Free shipping
      {
        id: 'genel_home_banner',
        type: 'banner',
        props: {
          title: {
            en: 'Free shipping on orders over $100',
            tr: '100$ ustu siparislerde ucretsiz kargo',
            de: 'Kostenloser Versand ab 100$',
            fr: 'Livraison gratuite a partir de 100$',
            es: 'Envio gratis en pedidos superiores a $100',
          },
          subtitle: {
            en: 'Shop today and save on delivery — quality products at your doorstep',
            tr: 'Bugun alisveris yapin, kargoda tasarruf edin — kaliteli urunler kapilarinda',
            de: 'Kaufen Sie heute ein und sparen Sie Versandkosten — Qualitaetsprodukte an Ihrer Haustuer',
            fr: 'Achetez aujourd\'hui et economisez sur la livraison — des produits de qualite a votre porte',
            es: 'Compra hoy y ahorra en el envio — productos de calidad en tu puerta',
          },
          buttonText: {
            en: 'Shop Now',
            tr: 'Alisverise Basla',
            de: 'Jetzt einkaufen',
            fr: 'Acheter maintenant',
            es: 'Comprar ahora',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80',
          height: 280,
        },
        style: {
          textColor: '#ffffff',
          padding: '3rem 2rem',
        },
      },

      // 8. Trust Badges — html block with flexbox
      {
        id: 'genel_home_trust_badges',
        type: 'html',
        props: {
          content: {
            en: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:3rem 2rem;background:var(--color-muted,#f1f5f9);flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F69A;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Free Shipping</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F4AC;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">24/7 Support</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F512;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Secure Payment</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x21A9;&#xFE0F;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Easy Returns</span></div></div>',
            tr: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:3rem 2rem;background:var(--color-muted,#f1f5f9);flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F69A;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Ucretsiz Kargo</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F4AC;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">7/24 Destek</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F512;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Guvenli Odeme</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x21A9;&#xFE0F;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Kolay Iade</span></div></div>',
            de: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:3rem 2rem;background:var(--color-muted,#f1f5f9);flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F69A;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Kostenloser Versand</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F4AC;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">24/7 Support</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F512;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Sichere Zahlung</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x21A9;&#xFE0F;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Einfache Rueckgabe</span></div></div>',
            fr: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:3rem 2rem;background:var(--color-muted,#f1f5f9);flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F69A;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Livraison gratuite</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F4AC;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Support 24/7</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F512;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Paiement securise</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x21A9;&#xFE0F;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Retours faciles</span></div></div>',
            es: '<div style="display:flex;justify-content:center;align-items:center;gap:3rem;padding:3rem 2rem;background:var(--color-muted,#f1f5f9);flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F69A;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Envio gratuito</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F4AC;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Soporte 24/7</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x1F512;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Pago seguro</span></div><div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><span style="font-size:2.5rem;">&#x21A9;&#xFE0F;</span><span style="font-size:0.95rem;font-weight:600;color:#0f172a;">Devoluciones faciles</span></div></div>',
          },
        },
      },

      // 9. Newsletter
      {
        id: 'genel_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'Stay in the Loop',
            tr: 'Gelismelerden Haberdar Olun',
            de: 'Bleiben Sie auf dem Laufenden',
            fr: 'Restez informe',
            es: 'Mantengase informado',
          },
          description: {
            en: 'Subscribe for exclusive deals, new arrivals, and insider-only discounts',
            tr: 'Ozel firsatlar, yeni urunler ve sadece uyelerimize ozel indirimler icin abone olun',
            de: 'Abonnieren Sie fuer exklusive Angebote, Neuheiten und Insider-Rabatte',
            fr: 'Abonnez-vous pour des offres exclusives, des nouveautes et des remises reservees aux membres',
            es: 'Suscribase para ofertas exclusivas, novedades y descuentos solo para miembros',
          },
          buttonText: {
            en: 'Subscribe',
            tr: 'Abone Ol',
            de: 'Abonnieren',
            fr: 'S\'abonner',
            es: 'Suscribirse',
          },
        },
        style: {
          padding: '3rem 2rem',
          backgroundColor: '#0f172a',
          textColor: '#ffffff',
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
        id: 'genel_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'Store',
            tr: 'Magaza',
            de: 'Shop',
            fr: 'Boutique',
            es: 'Tienda',
          },
          logoUrl: '',
        },
      },
      {
        id: 'genel_header_nav',
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
              label: { en: 'Categories', tr: 'Kategoriler', de: 'Kategorien', fr: 'Categories', es: 'Categorias' },
              link: '/pages/categories',
            },
            {
              label: { en: 'About', tr: 'Hakkimizda', de: 'Uber uns', fr: 'A propos', es: 'Sobre nosotros' },
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
        id: 'genel_header_search',
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
        id: 'genel_header_cart',
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
        id: 'genel_footer_columns',
        type: 'columns',
        props: { columns: 4, gap: '2rem' },
        style: {
          padding: '3rem 2rem',
          maxWidth: '1280px',
        },
        children: [
          // Col 1 — About
          {
            id: 'genel_footer_col1',
            type: 'container',
            props: {},
            children: [
              {
                id: 'genel_footer_col1_about',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Store</h4>' +
                      '<p style="margin:0;font-size:0.9rem;line-height:1.6;color:#64748b;">Your one-stop destination for quality products. We curate the finest selection across electronics, fashion, home and more — delivering trust, value, and style to your doorstep.</p>',
                    tr:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Magaza</h4>' +
                      '<p style="margin:0;font-size:0.9rem;line-height:1.6;color:#64748b;">Kaliteli urunler icin tek adresiniz. Elektronik, moda, ev ve daha fazlasi icin en iyi secimi bir araya getiriyoruz — guven, deger ve stili kapilarinda sunuyoruz.</p>',
                    de:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Shop</h4>' +
                      '<p style="margin:0;font-size:0.9rem;line-height:1.6;color:#64748b;">Ihre Anlaufstelle fuer Qualitaetsprodukte. Wir kuratieren die beste Auswahl aus Elektronik, Mode, Wohnen und mehr — und liefern Vertrauen, Wert und Stil an Ihre Haustuer.</p>',
                    fr:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Boutique</h4>' +
                      '<p style="margin:0;font-size:0.9rem;line-height:1.6;color:#64748b;">Votre destination unique pour des produits de qualite. Nous selectionnons le meilleur en electronique, mode, maison et plus — livrant confiance, valeur et style a votre porte.</p>',
                    es:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Tienda</h4>' +
                      '<p style="margin:0;font-size:0.9rem;line-height:1.6;color:#64748b;">Tu destino unico para productos de calidad. Seleccionamos lo mejor en electronica, moda, hogar y mas — entregando confianza, valor y estilo a tu puerta.</p>',
                  },
                },
              },
            ],
          },
          // Col 2 — Quick Links
          {
            id: 'genel_footer_col2',
            type: 'container',
            props: {},
            children: [
              {
                id: 'genel_footer_col2_links',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Quick Links</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Home</a></li>' +
                      '<li><a href="/pages/shop" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Shop</a></li>' +
                      '<li><a href="/pages/categories" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Categories</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#64748b;text-decoration:none;font-size:0.9rem;">New Arrivals</a></li></ul>',
                    tr:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Hizli Baglantilar</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Ana Sayfa</a></li>' +
                      '<li><a href="/pages/shop" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Magaza</a></li>' +
                      '<li><a href="/pages/categories" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Kategoriler</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Yeni Gelenler</a></li></ul>',
                    de:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Schnellzugriff</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Startseite</a></li>' +
                      '<li><a href="/pages/shop" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Shop</a></li>' +
                      '<li><a href="/pages/categories" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Kategorien</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Neuheiten</a></li></ul>',
                    fr:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Liens rapides</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Accueil</a></li>' +
                      '<li><a href="/pages/shop" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Boutique</a></li>' +
                      '<li><a href="/pages/categories" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Categories</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Nouveautes</a></li></ul>',
                    es:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Enlaces rapidos</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Inicio</a></li>' +
                      '<li><a href="/pages/shop" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Tienda</a></li>' +
                      '<li><a href="/pages/categories" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Categorias</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Novedades</a></li></ul>',
                  },
                },
              },
            ],
          },
          // Col 3 — Customer Service
          {
            id: 'genel_footer_col3',
            type: 'container',
            props: {},
            children: [
              {
                id: 'genel_footer_col3_links',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Customer Service</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/faq" style="color:#64748b;text-decoration:none;font-size:0.9rem;">FAQ</a></li>' +
                      '<li><a href="/pages/contact" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Contact</a></li>' +
                      '<li><a href="/pages/privacy" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Privacy Policy</a></li>' +
                      '<li><a href="/pages/terms" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Terms of Service</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Shipping Info</a></li></ul>',
                    tr:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Musteri Hizmetleri</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/faq" style="color:#64748b;text-decoration:none;font-size:0.9rem;">SSS</a></li>' +
                      '<li><a href="/pages/contact" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Iletisim</a></li>' +
                      '<li><a href="/pages/privacy" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Gizlilik Politikasi</a></li>' +
                      '<li><a href="/pages/terms" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Kullanim Kosullari</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Kargo Bilgileri</a></li></ul>',
                    de:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Kundenservice</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/faq" style="color:#64748b;text-decoration:none;font-size:0.9rem;">FAQ</a></li>' +
                      '<li><a href="/pages/contact" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Kontakt</a></li>' +
                      '<li><a href="/pages/privacy" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Datenschutzrichtlinie</a></li>' +
                      '<li><a href="/pages/terms" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Nutzungsbedingungen</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Versandinformationen</a></li></ul>',
                    fr:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Service client</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/faq" style="color:#64748b;text-decoration:none;font-size:0.9rem;">FAQ</a></li>' +
                      '<li><a href="/pages/contact" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Contact</a></li>' +
                      '<li><a href="/pages/privacy" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Politique de confidentialite</a></li>' +
                      '<li><a href="/pages/terms" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Conditions d\'utilisation</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Informations de livraison</a></li></ul>',
                    es:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Servicio al cliente</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/faq" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Preguntas frecuentes</a></li>' +
                      '<li><a href="/pages/contact" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Contacto</a></li>' +
                      '<li><a href="/pages/privacy" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Politica de privacidad</a></li>' +
                      '<li><a href="/pages/terms" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Terminos de servicio</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#64748b;text-decoration:none;font-size:0.9rem;">Informacion de envio</a></li></ul>',
                  },
                },
              },
            ],
          },
          // Col 4 — Contact
          {
            id: 'genel_footer_col4',
            type: 'container',
            props: {},
            children: [
              {
                id: 'genel_footer_col4_contact',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Contact</h4>' +
                      '<div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;color:#64748b;">' +
                      '<p style="margin:0;">Email: info@example.com</p>' +
                      '<p style="margin:0;">Phone: +1 (555) 000-0000</p>' +
                      '<p style="margin:0;">123 Commerce Street<br/>New York, NY 10001</p></div>',
                    tr:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Iletisim</h4>' +
                      '<div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;color:#64748b;">' +
                      '<p style="margin:0;">E-posta: info@example.com</p>' +
                      '<p style="margin:0;">Telefon: +1 (555) 000-0000</p>' +
                      '<p style="margin:0;">123 Ticaret Caddesi<br/>Istanbul, Turkiye</p></div>',
                    de:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Kontakt</h4>' +
                      '<div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;color:#64748b;">' +
                      '<p style="margin:0;">E-Mail: info@example.com</p>' +
                      '<p style="margin:0;">Telefon: +1 (555) 000-0000</p>' +
                      '<p style="margin:0;">123 Handelsstrasse<br/>Berlin, Deutschland</p></div>',
                    fr:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Contact</h4>' +
                      '<div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;color:#64748b;">' +
                      '<p style="margin:0;">E-mail: info@example.com</p>' +
                      '<p style="margin:0;">Telephone: +1 (555) 000-0000</p>' +
                      '<p style="margin:0;">123 Rue du Commerce<br/>Paris, France</p></div>',
                    es:
                      '<h4 style="margin:0 0 0.75rem;font-size:1.1rem;font-weight:700;">Contacto</h4>' +
                      '<div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;color:#64748b;">' +
                      '<p style="margin:0;">Correo: info@example.com</p>' +
                      '<p style="margin:0;">Telefono: +1 (555) 000-0000</p>' +
                      '<p style="margin:0;">123 Calle Comercio<br/>Madrid, Espana</p></div>',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        id: 'genel_footer_social',
        type: 'social-links',
        props: {
          links: [
            { platform: 'instagram', url: '#' },
            { platform: 'facebook', url: '#' },
            { platform: 'twitter', url: '#' },
            { platform: 'pinterest', url: '#' },
          ],
        },
        style: {
          padding: '1rem 0',
          textAlign: 'center',
        },
      },
      {
        id: 'genel_footer_copyright',
        type: 'text',
        props: {
          tag: 'p',
          content: {
            en: '\u00a9 2026 Store. All rights reserved.',
            tr: '\u00a9 2026 Magaza. Tum haklari saklidir.',
            de: '\u00a9 2026 Shop. Alle Rechte vorbehalten.',
            fr: '\u00a9 2026 Boutique. Tous droits reserves.',
            es: '\u00a9 2026 Tienda. Todos los derechos reservados.',
          },
        },
        style: {
          textAlign: 'center',
          padding: '1rem 0',
        },
      },
    ],
  },
};
