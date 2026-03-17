import type { ThemeBundle } from '../types.js';

export const gidaBundle: ThemeBundle = {
  manifest: {
    id: 'gida',
    name: 'Gida',
    description: 'Fresh organic food and grocery theme with natural tones',
    sector: 'gida',
    category: 'sector',
    colorPalette: ['#16A34A', '#6B7280', '#84CC16', '#FEFCE8', '#1A2E05'],
    config: {
      primary: '#16A34A',
      secondary: '#6B7280',
      accent: '#84CC16',
      background: '#FEFCE8',
      foreground: '#1A2E05',
      muted: '#F0FDF4',
      border: '#BBF7D0',
      fonts: { heading: 'Nunito', body: 'Inter' },
      borderRadius: 'lg',
      layout: {
        headerStyle: 'standard',
        productGridColumns: 4,
        footerColumns: 2,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero Banner', type: 'hero' },
      { id: 'delivery-bar', name: 'Delivery Promise Bar', type: 'custom', component: 'delivery-bar' },
      { id: 'categories', name: 'Categories Grid', type: 'categories-grid' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'banner', name: 'Promo Banner', type: 'banner' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Home Page — 10 blocks
  // ---------------------------------------------------------------------------
  homePage: {
    version: 1,
    blocks: [
      // 1. Hero — Fresh produce hero
      {
        id: 'gida_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'Farm Fresh, Delivered',
            tr: 'Ciftlikten Sofraniza',
            de: 'Frisch vom Bauernhof, geliefert',
            fr: 'Frais de la ferme, livre',
            es: 'Del campo a tu mesa',
          },
          subtitle: {
            en: 'Organic produce and wholesome groceries from local farms, delivered to your doorstep',
            tr: 'Yerel ciftliklerden organik urunler ve saglikli gidalar, kapiniza kadar',
            de: 'Bio-Produkte und gesunde Lebensmittel von lokalen Bauernhoefen, bis an Ihre Haustuer',
            fr: 'Produits bio et epicerie saine des fermes locales, livres a votre porte',
            es: 'Productos organicos y alimentos saludables de granjas locales, entregados en tu puerta',
          },
          buttonText: {
            en: 'Shop Now',
            tr: 'Alisverise Basla',
            de: 'Jetzt einkaufen',
            fr: 'Acheter maintenant',
            es: 'Comprar ahora',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80',
          overlayOpacity: 0.4,
          secondaryButtonText: {
            en: 'View Recipes',
            tr: 'Tarifleri Gor',
            de: 'Rezepte ansehen',
            fr: 'Voir les recettes',
            es: 'Ver recetas',
          },
          secondaryButtonLink: '/pages/recipes',
        },
        style: {
          backgroundColor: '#14532D',
          textColor: '#ECFDF5',
          padding: '5rem 2rem',
        },
      },

      // 2. Delivery Promise Bar — 3 trust icons
      {
        id: 'gida_home_delivery_bar',
        type: 'html',
        props: {
          content: {
            en:
              '<div style="display:flex;justify-content:center;align-items:center;gap:2.5rem;padding:1.5rem 1rem;flex-wrap:wrap">' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83D\uDE9A Same Day Delivery' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDF3F 100% Organic' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDFE1 Local Farms' +
                '</span>' +
              '</div>',
            tr:
              '<div style="display:flex;justify-content:center;align-items:center;gap:2.5rem;padding:1.5rem 1rem;flex-wrap:wrap">' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83D\uDE9A Ayni Gun Teslimat' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDF3F %100 Organik' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDFE1 Yerel Ciftlikler' +
                '</span>' +
              '</div>',
            de:
              '<div style="display:flex;justify-content:center;align-items:center;gap:2.5rem;padding:1.5rem 1rem;flex-wrap:wrap">' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83D\uDE9A Lieferung am selben Tag' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDF3F 100% Bio' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDFE1 Lokale Bauernhoefe' +
                '</span>' +
              '</div>',
            fr:
              '<div style="display:flex;justify-content:center;align-items:center;gap:2.5rem;padding:1.5rem 1rem;flex-wrap:wrap">' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83D\uDE9A Livraison le jour meme' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDF3F 100% Biologique' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDFE1 Fermes locales' +
                '</span>' +
              '</div>',
            es:
              '<div style="display:flex;justify-content:center;align-items:center;gap:2.5rem;padding:1.5rem 1rem;flex-wrap:wrap">' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83D\uDE9A Entrega el mismo dia' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDF3F 100% Organico' +
                '</span>' +
                '<span style="background:#DCFCE7;color:#166534;padding:0.6rem 1.4rem;border-radius:8px;font-weight:600;font-size:0.95rem;white-space:nowrap">' +
                  '\uD83C\uDFE1 Granjas locales' +
                '</span>' +
              '</div>',
          },
        },
        style: {
          backgroundColor: '#F0FDF4',
          customCss: 'border-top:2px solid #BBF7D0;border-bottom:2px solid #BBF7D0',
        },
      },

      // 3. Category Showcase — 6 categories
      {
        id: 'gida_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Shop by Category',
            tr: 'Kategoriye Gore Alisveris',
            de: 'Nach Kategorie einkaufen',
            fr: 'Acheter par categorie',
            es: 'Comprar por categoria',
          },
          limit: 6,
          columns: 3,
        },
        style: {
          padding: '3rem 2rem',
        },
      },

      // 4. Columns(3) — Static food category cards with overlay
      {
        id: 'gida_home_food_categories',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          padding: '0 2rem 3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          {
            id: 'gida_home_food_cat_fruits',
            type: 'html',
            props: {
              content: {
                en:
                  '<a href="/categories/fruits-vegetables" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80" alt="Fruits & Vegetables" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Fruits & Vegetables</span>' +
                    '</div>' +
                  '</a>',
                tr:
                  '<a href="/categories/fruits-vegetables" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80" alt="Meyve & Sebze" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Meyve & Sebze</span>' +
                    '</div>' +
                  '</a>',
                de:
                  '<a href="/categories/fruits-vegetables" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80" alt="Obst & Gemuese" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Obst & Gemuese</span>' +
                    '</div>' +
                  '</a>',
                fr:
                  '<a href="/categories/fruits-vegetables" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80" alt="Fruits & Legumes" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Fruits & Legumes</span>' +
                    '</div>' +
                  '</a>',
                es:
                  '<a href="/categories/fruits-vegetables" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80" alt="Frutas y Verduras" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Frutas y Verduras</span>' +
                    '</div>' +
                  '</a>',
              },
            },
          },
          {
            id: 'gida_home_food_cat_dairy',
            type: 'html',
            props: {
              content: {
                en:
                  '<a href="/categories/dairy-eggs" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1628088062854-d1870b14eb09?w=600&q=80" alt="Dairy & Eggs" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Dairy & Eggs</span>' +
                    '</div>' +
                  '</a>',
                tr:
                  '<a href="/categories/dairy-eggs" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1628088062854-d1870b14eb09?w=600&q=80" alt="Sut Urunleri & Yumurta" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Sut Urunleri & Yumurta</span>' +
                    '</div>' +
                  '</a>',
                de:
                  '<a href="/categories/dairy-eggs" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1628088062854-d1870b14eb09?w=600&q=80" alt="Milchprodukte & Eier" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Milchprodukte & Eier</span>' +
                    '</div>' +
                  '</a>',
                fr:
                  '<a href="/categories/dairy-eggs" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1628088062854-d1870b14eb09?w=600&q=80" alt="Produits laitiers & Oeufs" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Produits laitiers & Oeufs</span>' +
                    '</div>' +
                  '</a>',
                es:
                  '<a href="/categories/dairy-eggs" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1628088062854-d1870b14eb09?w=600&q=80" alt="Lacteos y Huevos" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Lacteos y Huevos</span>' +
                    '</div>' +
                  '</a>',
              },
            },
          },
          {
            id: 'gida_home_food_cat_bakery',
            type: 'html',
            props: {
              content: {
                en:
                  '<a href="/categories/bakery" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" alt="Bakery" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Bakery</span>' +
                    '</div>' +
                  '</a>',
                tr:
                  '<a href="/categories/bakery" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" alt="Firindan" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Firindan</span>' +
                    '</div>' +
                  '</a>',
                de:
                  '<a href="/categories/bakery" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" alt="Baeckerei" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Baeckerei</span>' +
                    '</div>' +
                  '</a>',
                fr:
                  '<a href="/categories/bakery" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" alt="Boulangerie" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Boulangerie</span>' +
                    '</div>' +
                  '</a>',
                es:
                  '<a href="/categories/bakery" style="display:block;position:relative;height:260px;border-radius:12px;overflow:hidden;text-decoration:none">' +
                    '<img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80" alt="Panaderia" style="width:100%;height:100%;object-fit:cover" />' +
                    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(20,83,45,0.75) 0%,rgba(20,83,45,0.1) 60%);display:flex;align-items:flex-end;padding:1.5rem">' +
                      '<span style="color:#fff;font-size:1.25rem;font-weight:700">Panaderia</span>' +
                    '</div>' +
                  '</a>',
              },
            },
          },
        ],
      },

      // 5. Product Showcase — 8 products, 4 columns
      {
        id: 'gida_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'Popular Products',
            tr: 'Populer Urunler',
            de: 'Beliebte Produkte',
            fr: 'Produits populaires',
            es: 'Productos populares',
          },
          subtitle: {
            en: 'Handpicked fresh goods from our best sellers',
            tr: 'En cok satanlarimizdan el secme taze urunler',
            de: 'Handverlesene frische Waren aus unseren Bestsellern',
            fr: 'Produits frais selectionnes parmi nos meilleures ventes',
            es: 'Productos frescos seleccionados de nuestros mas vendidos',
          },
          limit: 8,
          columns: 4,
        },
        style: {
          padding: '3rem 2rem',
        },
      },

      // 6. Columns(4) — Static product cards
      {
        id: 'gida_home_product_cards',
        type: 'columns',
        props: { columns: 4, gap: '1.5rem' },
        style: {
          padding: '0 2rem 3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          // Organic Avocados
          {
            id: 'gida_home_card_avocado',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              customCss: 'overflow:hidden;border:1px solid #BBF7D0',
            },
            children: [
              {
                id: 'gida_home_card_avocado_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80',
                  alt: {
                    en: 'Organic Avocados',
                    tr: 'Organik Avokado',
                    de: 'Bio-Avocados',
                    fr: 'Avocats bio',
                    es: 'Aguacates organicos',
                  },
                },
                style: {
                  customCss: 'width:100%;height:200px;object-fit:cover',
                },
              },
              {
                id: 'gida_home_card_avocado_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Organic Avocados',
                    tr: 'Organik Avokado',
                    de: 'Bio-Avocados',
                    fr: 'Avocats bio',
                    es: 'Aguacates organicos',
                  },
                },
                style: {
                  padding: '1rem 1rem 0 1rem',
                  textColor: '#1A2E05',
                  customCss: 'font-size:1.05rem;font-weight:700',
                },
              },
              {
                id: 'gida_home_card_avocado_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$4.99',
                    tr: '$4.99',
                    de: '$4.99',
                    fr: '$4.99',
                    es: '$4.99',
                  },
                },
                style: {
                  padding: '0.25rem 1rem 1rem 1rem',
                  textColor: '#16A34A',
                  customCss: 'font-size:1.15rem;font-weight:800',
                },
              },
            ],
          },
          // Fresh Salmon
          {
            id: 'gida_home_card_salmon',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              customCss: 'overflow:hidden;border:1px solid #BBF7D0',
            },
            children: [
              {
                id: 'gida_home_card_salmon_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=800&q=80',
                  alt: {
                    en: 'Fresh Salmon',
                    tr: 'Taze Somon',
                    de: 'Frischer Lachs',
                    fr: 'Saumon frais',
                    es: 'Salmon fresco',
                  },
                },
                style: {
                  customCss: 'width:100%;height:200px;object-fit:cover',
                },
              },
              {
                id: 'gida_home_card_salmon_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Fresh Salmon',
                    tr: 'Taze Somon',
                    de: 'Frischer Lachs',
                    fr: 'Saumon frais',
                    es: 'Salmon fresco',
                  },
                },
                style: {
                  padding: '1rem 1rem 0 1rem',
                  textColor: '#1A2E05',
                  customCss: 'font-size:1.05rem;font-weight:700',
                },
              },
              {
                id: 'gida_home_card_salmon_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$12.99',
                    tr: '$12.99',
                    de: '$12.99',
                    fr: '$12.99',
                    es: '$12.99',
                  },
                },
                style: {
                  padding: '0.25rem 1rem 1rem 1rem',
                  textColor: '#16A34A',
                  customCss: 'font-size:1.15rem;font-weight:800',
                },
              },
            ],
          },
          // Sourdough Bread
          {
            id: 'gida_home_card_bread',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              customCss: 'overflow:hidden;border:1px solid #BBF7D0',
            },
            children: [
              {
                id: 'gida_home_card_bread_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80',
                  alt: {
                    en: 'Sourdough Bread',
                    tr: 'Eksi Maya Ekmek',
                    de: 'Sauerteigbrot',
                    fr: 'Pain au levain',
                    es: 'Pan de masa madre',
                  },
                },
                style: {
                  customCss: 'width:100%;height:200px;object-fit:cover',
                },
              },
              {
                id: 'gida_home_card_bread_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Sourdough Bread',
                    tr: 'Eksi Maya Ekmek',
                    de: 'Sauerteigbrot',
                    fr: 'Pain au levain',
                    es: 'Pan de masa madre',
                  },
                },
                style: {
                  padding: '1rem 1rem 0 1rem',
                  textColor: '#1A2E05',
                  customCss: 'font-size:1.05rem;font-weight:700',
                },
              },
              {
                id: 'gida_home_card_bread_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$6.49',
                    tr: '$6.49',
                    de: '$6.49',
                    fr: '$6.49',
                    es: '$6.49',
                  },
                },
                style: {
                  padding: '0.25rem 1rem 1rem 1rem',
                  textColor: '#16A34A',
                  customCss: 'font-size:1.15rem;font-weight:800',
                },
              },
            ],
          },
          // Greek Yogurt
          {
            id: 'gida_home_card_yogurt',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              customCss: 'overflow:hidden;border:1px solid #BBF7D0',
            },
            children: [
              {
                id: 'gida_home_card_yogurt_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
                  alt: {
                    en: 'Greek Yogurt',
                    tr: 'Yunan Yogurdu',
                    de: 'Griechischer Joghurt',
                    fr: 'Yaourt grec',
                    es: 'Yogur griego',
                  },
                },
                style: {
                  customCss: 'width:100%;height:200px;object-fit:cover',
                },
              },
              {
                id: 'gida_home_card_yogurt_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Greek Yogurt',
                    tr: 'Yunan Yogurdu',
                    de: 'Griechischer Joghurt',
                    fr: 'Yaourt grec',
                    es: 'Yogur griego',
                  },
                },
                style: {
                  padding: '1rem 1rem 0 1rem',
                  textColor: '#1A2E05',
                  customCss: 'font-size:1.05rem;font-weight:700',
                },
              },
              {
                id: 'gida_home_card_yogurt_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$3.99',
                    tr: '$3.99',
                    de: '$3.99',
                    fr: '$3.99',
                    es: '$3.99',
                  },
                },
                style: {
                  padding: '0.25rem 1rem 1rem 1rem',
                  textColor: '#16A34A',
                  customCss: 'font-size:1.15rem;font-weight:800',
                },
              },
            ],
          },
        ],
      },

      // 7. Dual Banner — Subscribe & Save + Same Day Delivery
      {
        id: 'gida_home_dual_banner',
        type: 'columns',
        props: { columns: 2, gap: '1.5rem' },
        style: { padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' },
        children: [
          {
            id: 'gida_banner_left',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(22,163,74,0.85),rgba(22,163,74,0.5))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Subscribe &amp; Save 15%</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Weekly fresh deliveries straight to your door</p></div></div>',
                tr: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(22,163,74,0.85),rgba(22,163,74,0.5))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Abone Ol ve %15 Tasarruf Et</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Haftalik taze teslimatlar kapiniza kadar</p></div></div>',
                de: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(22,163,74,0.85),rgba(22,163,74,0.5))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Abonnieren &amp; 15% Sparen</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Woechentlich frische Lieferungen direkt an Ihre Tuer</p></div></div>',
                fr: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(22,163,74,0.85),rgba(22,163,74,0.5))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Abonnez-vous et economisez 15%</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Livraisons fraiches hebdomadaires directement a votre porte</p></div></div>',
                es: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(22,163,74,0.85),rgba(22,163,74,0.5))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Suscribete y Ahorra 15%</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Entregas frescas semanales directamente en tu puerta</p></div></div>',
              },
            },
          },
          {
            id: 'gida_banner_right',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,46,5,0.8),rgba(26,46,5,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Same Day Delivery</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Order before 2pm for delivery today</p></div></div>',
                tr: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,46,5,0.8),rgba(26,46,5,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Ayni Gun Teslimat</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Saat 14:00 oncesi siparisler bugun teslim edilir</p></div></div>',
                de: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,46,5,0.8),rgba(26,46,5,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Lieferung am selben Tag</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Bestellen Sie vor 14 Uhr fuer Lieferung heute</p></div></div>',
                fr: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,46,5,0.8),rgba(26,46,5,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Livraison le Jour Meme</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Commandez avant 14h pour une livraison aujourd hui</p></div></div>',
                es: '<div style="position:relative;height:260px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,46,5,0.8),rgba(26,46,5,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Entrega el Mismo Dia</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Pide antes de las 14h para entrega hoy</p></div></div>',
              },
            },
          },
        ],
      },

      // 8. Columns(2) — Recipe Cards
      {
        id: 'gida_home_recipes',
        type: 'columns',
        props: { columns: 2, gap: '2rem' },
        style: {
          padding: '3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          {
            id: 'gida_home_recipe_mediterranean',
            type: 'html',
            props: {
              content: {
                en:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Mediterranean Bowl</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 min</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Easy</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/mediterranean-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">View Recipe \u2192</a>' +
                    '</div>' +
                  '</div>',
                tr:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Akdeniz Kasesi</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 dk</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Kolay</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/mediterranean-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">Tarifi Gor \u2192</a>' +
                    '</div>' +
                  '</div>',
                de:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Mediterrane Bowl</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 Min</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Einfach</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/mediterranean-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">Rezept ansehen \u2192</a>' +
                    '</div>' +
                  '</div>',
                fr:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Bowl Mediterraneen</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 min</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Facile</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/mediterranean-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">Voir la recette \u2192</a>' +
                    '</div>' +
                  '</div>',
                es:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Bowl Mediterraneo</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 min</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Facil</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/mediterranean-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">Ver receta \u2192</a>' +
                    '</div>' +
                  '</div>',
              },
            },
          },
          {
            id: 'gida_home_recipe_smoothie',
            type: 'html',
            props: {
              content: {
                en:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Berry Smoothie Bowl</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 min</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Easy</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/berry-smoothie-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">View Recipe \u2192</a>' +
                    '</div>' +
                  '</div>',
                tr:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Cilek Smoothie Kasesi</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 dk</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Kolay</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/berry-smoothie-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">Tarifi Gor \u2192</a>' +
                    '</div>' +
                  '</div>',
                de:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Beeren-Smoothie-Bowl</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 Min</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Einfach</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/berry-smoothie-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">Rezept ansehen \u2192</a>' +
                    '</div>' +
                  '</div>',
                fr:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Smoothie Bowl aux Baies</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 min</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Facile</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/berry-smoothie-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">Voir la recette \u2192</a>' +
                    '</div>' +
                  '</div>',
                es:
                  '<div style="border:1px solid #BBF7D0;border-radius:12px;overflow:hidden;background:#fff">' +
                    '<div style="height:200px;background:url(https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80) center/cover"></div>' +
                    '<div style="padding:1.25rem">' +
                      '<h3 style="margin:0 0 0.5rem 0;font-size:1.15rem;font-weight:700;color:#1A2E05">Bowl de Smoothie de Bayas</h3>' +
                      '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem">' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\u23F1 15 min</span>' +
                        '<span style="background:#F0FDF4;color:#166534;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem;font-weight:600">\uD83D\uDFE2 Facil</span>' +
                      '</div>' +
                      '<a href="/pages/recipes/berry-smoothie-bowl" style="color:#16A34A;font-weight:600;text-decoration:none;font-size:0.95rem">Ver receta \u2192</a>' +
                    '</div>' +
                  '</div>',
              },
            },
          },
        ],
      },

      // 9. Spacer
      {
        id: 'gida_home_spacer',
        type: 'spacer',
        props: {
          height: '2rem',
        },
      },

      // 10. Newsletter — Fresh Picks Weekly
      {
        id: 'gida_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'Fresh Picks Weekly',
            tr: 'Haftalik Taze Secimler',
            de: 'Woechentliche Frische-Auswahl',
            fr: 'Selections Fraiches Hebdomadaires',
            es: 'Selecciones Frescas Semanales',
          },
          description: {
            en: 'Get weekly meal plans, seasonal recipes, and exclusive deals delivered to your inbox',
            tr: 'Haftalik yemek planlari, mevsimsel tarifler ve ozel firsatlari e-postaniza alin',
            de: 'Erhalten Sie woechentliche Essensplaene, saisonale Rezepte und exklusive Angebote per E-Mail',
            fr: 'Recevez des plans de repas hebdomadaires, des recettes de saison et des offres exclusives',
            es: 'Recibe planes de comidas semanales, recetas de temporada y ofertas exclusivas en tu correo',
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
          backgroundColor: '#F0FDF4',
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
        id: 'gida_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'FreshMarket',
            tr: 'FreshMarket',
            de: 'FreshMarket',
            fr: 'FreshMarket',
            es: 'FreshMarket',
          },
          logoUrl: '',
        },
      },
      {
        id: 'gida_header_nav',
        type: 'navigation-menu',
        props: {
          items: [
            {
              label: { en: 'Home', tr: 'Ana Sayfa', de: 'Startseite', fr: 'Accueil', es: 'Inicio' },
              link: '/',
            },
            {
              label: { en: 'Produce', tr: 'Taze Urunler', de: 'Frischware', fr: 'Fruits & Legumes', es: 'Productos Frescos' },
              link: '/categories/produce',
            },
            {
              label: { en: 'Dairy', tr: 'Sut Urunleri', de: 'Milchprodukte', fr: 'Produits laitiers', es: 'Lacteos' },
              link: '/categories/dairy',
            },
            {
              label: { en: 'Bakery', tr: 'Firindan', de: 'Baeckerei', fr: 'Boulangerie', es: 'Panaderia' },
              link: '/categories/bakery',
            },
            {
              label: { en: 'Recipes', tr: 'Tarifler', de: 'Rezepte', fr: 'Recettes', es: 'Recetas' },
              link: '/pages/recipes',
            },
          ],
        },
      },
      {
        id: 'gida_header_search',
        type: 'search-bar',
        props: {
          placeholder: {
            en: 'Search fresh products...',
            tr: 'Taze urunleri ara...',
            de: 'Frische Produkte suchen...',
            fr: 'Rechercher des produits frais...',
            es: 'Buscar productos frescos...',
          },
        },
      },
      {
        id: 'gida_header_cart',
        type: 'cart-icon',
        props: {
          showCount: true,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Footer — 2 columns, clean grocery style
  // ---------------------------------------------------------------------------
  footer: {
    version: 1,
    blocks: [
      {
        id: 'gida_footer_columns',
        type: 'columns',
        props: { columns: 2, gap: '3rem' },
        style: {
          padding: '3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          // Column 1 — Brand + nav links
          {
            id: 'gida_footer_col1',
            type: 'html',
            props: {
              content: {
                en:
                  '<div>' +
                    '<h3 style="font-size:1.4rem;font-weight:800;color:#1A2E05;margin:0 0 0.75rem 0">FreshMarket</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'We partner with local farmers and producers to bring you the freshest organic groceries. ' +
                      'From farm to table, every product is handpicked for quality and taste.' +
                    '</p>' +
                    '<nav style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="/pages/shop" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Shop</a>' +
                      '<a href="/pages/about" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">About</a>' +
                      '<a href="/pages/blog" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Blog</a>' +
                      '<a href="/pages/careers" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Careers</a>' +
                      '<a href="/pages/contact" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Contact</a>' +
                    '</nav>' +
                  '</div>',
                tr:
                  '<div>' +
                    '<h3 style="font-size:1.4rem;font-weight:800;color:#1A2E05;margin:0 0 0.75rem 0">FreshMarket</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Yerel ciftciler ve ureticilerle is birligi yaparak en taze organik gida urunlerini sizlere ulastiriyoruz. ' +
                      'Ciftlikten sofraya, her urun kalite ve lezzet icin ozenle secilmistir.' +
                    '</p>' +
                    '<nav style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="/pages/shop" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Magaza</a>' +
                      '<a href="/pages/about" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Hakkimizda</a>' +
                      '<a href="/pages/blog" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Blog</a>' +
                      '<a href="/pages/careers" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Kariyer</a>' +
                      '<a href="/pages/contact" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Iletisim</a>' +
                    '</nav>' +
                  '</div>',
                de:
                  '<div>' +
                    '<h3 style="font-size:1.4rem;font-weight:800;color:#1A2E05;margin:0 0 0.75rem 0">FreshMarket</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Wir arbeiten mit lokalen Bauern und Produzenten zusammen, um Ihnen die frischesten Bio-Lebensmittel zu liefern. ' +
                      'Vom Bauernhof auf den Tisch — jedes Produkt wird sorgfaeltig nach Qualitaet und Geschmack ausgewaehlt.' +
                    '</p>' +
                    '<nav style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="/pages/shop" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Shop</a>' +
                      '<a href="/pages/about" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Ueber uns</a>' +
                      '<a href="/pages/blog" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Blog</a>' +
                      '<a href="/pages/careers" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Karriere</a>' +
                      '<a href="/pages/contact" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Kontakt</a>' +
                    '</nav>' +
                  '</div>',
                fr:
                  '<div>' +
                    '<h3 style="font-size:1.4rem;font-weight:800;color:#1A2E05;margin:0 0 0.75rem 0">FreshMarket</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Nous collaborons avec des agriculteurs et producteurs locaux pour vous offrir les produits bio les plus frais. ' +
                      'De la ferme a la table, chaque produit est selectionne pour sa qualite et son gout.' +
                    '</p>' +
                    '<nav style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="/pages/shop" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Boutique</a>' +
                      '<a href="/pages/about" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">A propos</a>' +
                      '<a href="/pages/blog" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Blog</a>' +
                      '<a href="/pages/careers" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Carrieres</a>' +
                      '<a href="/pages/contact" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Contact</a>' +
                    '</nav>' +
                  '</div>',
                es:
                  '<div>' +
                    '<h3 style="font-size:1.4rem;font-weight:800;color:#1A2E05;margin:0 0 0.75rem 0">FreshMarket</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Trabajamos con agricultores y productores locales para ofrecerte los productos organicos mas frescos. ' +
                      'Del campo a la mesa, cada producto es seleccionado por su calidad y sabor.' +
                    '</p>' +
                    '<nav style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="/pages/shop" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Tienda</a>' +
                      '<a href="/pages/about" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Nosotros</a>' +
                      '<a href="/pages/blog" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Blog</a>' +
                      '<a href="/pages/careers" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Empleo</a>' +
                      '<a href="/pages/contact" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Contacto</a>' +
                    '</nav>' +
                  '</div>',
              },
            },
          },
          // Column 2 — Newsletter description + social links as text
          {
            id: 'gida_footer_col2',
            type: 'html',
            props: {
              content: {
                en:
                  '<div>' +
                    '<h3 style="font-size:1.1rem;font-weight:700;color:#1A2E05;margin:0 0 0.75rem 0">Stay Connected</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Follow us for fresh recipes, seasonal tips, and behind-the-scenes looks at our partner farms.' +
                    '</p>' +
                    '<div style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Instagram</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Facebook</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">YouTube</a>' +
                    '</div>' +
                  '</div>',
                tr:
                  '<div>' +
                    '<h3 style="font-size:1.1rem;font-weight:700;color:#1A2E05;margin:0 0 0.75rem 0">Bagli Kalin</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Taze tarifler, mevsimsel ipuclari ve partner ciftliklerimizin kamera arkasi icin bizi takip edin.' +
                    '</p>' +
                    '<div style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Instagram</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Facebook</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">YouTube</a>' +
                    '</div>' +
                  '</div>',
                de:
                  '<div>' +
                    '<h3 style="font-size:1.1rem;font-weight:700;color:#1A2E05;margin:0 0 0.75rem 0">Bleiben Sie verbunden</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Folgen Sie uns fuer frische Rezepte, saisonale Tipps und Einblicke hinter die Kulissen unserer Partnerbauernhoefe.' +
                    '</p>' +
                    '<div style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Instagram</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Facebook</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">YouTube</a>' +
                    '</div>' +
                  '</div>',
                fr:
                  '<div>' +
                    '<h3 style="font-size:1.1rem;font-weight:700;color:#1A2E05;margin:0 0 0.75rem 0">Restez connecte</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Suivez-nous pour des recettes fraiches, des astuces de saison et des coulisses de nos fermes partenaires.' +
                    '</p>' +
                    '<div style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Instagram</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Facebook</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">YouTube</a>' +
                    '</div>' +
                  '</div>',
                es:
                  '<div>' +
                    '<h3 style="font-size:1.1rem;font-weight:700;color:#1A2E05;margin:0 0 0.75rem 0">Mantente conectado</h3>' +
                    '<p style="color:#4B5563;font-size:0.95rem;line-height:1.6;margin:0 0 1.25rem 0">' +
                      'Siguenos para recetas frescas, consejos de temporada y un vistazo detras de escena de nuestras granjas asociadas.' +
                    '</p>' +
                    '<div style="display:flex;gap:1.25rem;flex-wrap:wrap">' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Instagram</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">Facebook</a>' +
                      '<a href="#" style="color:#16A34A;text-decoration:none;font-weight:600;font-size:0.9rem">YouTube</a>' +
                    '</div>' +
                  '</div>',
              },
            },
          },
        ],
      },
      // Copyright — centered
      {
        id: 'gida_footer_copyright',
        type: 'text',
        props: {
          tag: 'p',
          content: {
            en: '\u00a9 2026 FreshMarket. All rights reserved.',
            tr: '\u00a9 2026 FreshMarket. Tum haklari saklidir.',
            de: '\u00a9 2026 FreshMarket. Alle Rechte vorbehalten.',
            fr: '\u00a9 2026 FreshMarket. Tous droits reserves.',
            es: '\u00a9 2026 FreshMarket. Todos los derechos reservados.',
          },
        },
        style: {
          textAlign: 'center',
          padding: '1.5rem 0',
          customCss: 'border-top:1px solid #BBF7D0',
        },
      },
    ],
  },
};
