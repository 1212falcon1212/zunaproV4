import type { ThemeBundle } from '../types.js';

export const mobilyaBundle: ThemeBundle = {
  manifest: {
    id: 'mobilya',
    name: 'Mobilya',
    description: 'Warm, elegant furniture store theme with room-based navigation',
    sector: 'mobilya',
    category: 'sector',
    colorPalette: ['#8B5E3C', '#6B7280', '#D4A574', '#FFFBF5', '#2D1810'],
    config: {
      primary: '#8B5E3C',
      secondary: '#6B7280',
      accent: '#D4A574',
      background: '#FFFBF5',
      foreground: '#2D1810',
      muted: '#F5EDE3',
      border: '#E8DDD0',
      fonts: { heading: 'Playfair Display', body: 'Lato' },
      borderRadius: 'lg',
      layout: {
        headerStyle: 'centered',
        productGridColumns: 3,
        footerColumns: 4,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero Banner', type: 'hero' },
      { id: 'room-navigator', name: 'Shop by Room', type: 'custom', component: 'room-navigator' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'categories', name: 'Categories', type: 'categories-grid' },
      { id: 'material-banner', name: 'Materials', type: 'custom', component: 'material-filter' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Home Page
  // ---------------------------------------------------------------------------
  homePage: {
    version: 1,
    blocks: [
      // 1. Hero — Living room photo, warm tones, 2 buttons
      {
        id: 'mobilya_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'Furnish Your Dream Home',
            tr: 'Hayalinizdeki Evi Dosheyin',
            de: 'Richten Sie Ihr Traumhaus ein',
            fr: 'Meublez la maison de vos reves',
            es: 'Amuebla la casa de tus suenos',
          },
          subtitle: {
            en: 'Handcrafted furniture for every room — timeless design meets modern comfort',
            tr: 'Her oda icin el yapimi mobilyalar — zamansiz tasarim modern konforla bulusuyor',
            de: 'Handgefertigte Moebel fuer jeden Raum — zeitloses Design trifft modernen Komfort',
            fr: 'Meubles artisanaux pour chaque piece — design intemporel et confort moderne',
            es: 'Muebles artesanales para cada habitacion — diseno atemporal y confort moderno',
          },
          buttonText: {
            en: 'Explore Collection',
            tr: 'Koleksiyonu Kesfet',
            de: 'Kollektion entdecken',
            fr: 'Explorer la collection',
            es: 'Explorar coleccion',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
          overlayOpacity: 0.4,
          secondaryButtonText: {
            en: 'View Catalog',
            tr: 'Katalogu Gor',
            de: 'Katalog ansehen',
            fr: 'Voir le catalogue',
            es: 'Ver catalogo',
          },
          secondaryButtonLink: '/pages/categories',
        },
        style: {
          backgroundColor: '#3E2723',
          textColor: '#FFF8E1',
          padding: '5rem 2rem',
        },
      },

      // 2. Shop by Room — heading + 3 large room photo cards with overlay text
      {
        id: 'mobilya_home_rooms_title',
        type: 'text',
        props: {
          tag: 'h2',
          content: {
            en: 'Shop by Room',
            tr: 'Odaya Gore Alisveris',
            de: 'Nach Raum einkaufen',
            fr: 'Acheter par piece',
            es: 'Comprar por habitacion',
          },
        },
        style: {
          textAlign: 'center',
          padding: '3rem 0 1.5rem 0',
          textColor: '#2D1810',
        },
      },
      {
        id: 'mobilya_home_rooms_grid',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          padding: '0 2rem 3rem 2rem',
          maxWidth: '1200px',
        },
        children: [
          {
            id: 'mobilya_home_room_living',
            type: 'html',
            props: {
              content: {
                en: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Living Room</span></div></div></a>',
                tr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Oturma Odasi</span></div></div></a>',
                de: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Wohnzimmer</span></div></div></a>',
                fr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Salon</span></div></div></a>',
                es: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Sala de Estar</span></div></div></a>',
              },
            },
          },
          {
            id: 'mobilya_home_room_bedroom',
            type: 'html',
            props: {
              content: {
                en: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Bedroom</span></div></div></a>',
                tr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Yatak Odasi</span></div></div></a>',
                de: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Schlafzimmer</span></div></div></a>',
                fr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Chambre</span></div></div></a>',
                es: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Dormitorio</span></div></div></a>',
              },
            },
          },
          {
            id: 'mobilya_home_room_kitchen',
            type: 'html',
            props: {
              content: {
                en: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Kitchen</span></div></div></a>',
                tr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Mutfak</span></div></div></a>',
                de: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Kueche</span></div></div></a>',
                fr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Cuisine</span></div></div></a>',
                es: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80);background-size:cover;background-position:center;height:320px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.5rem;font-weight:700;">Cocina</span></div></div></a>',
              },
            },
          },
        ],
      },

      // 3. Product Showcase — Bestselling Pieces
      {
        id: 'mobilya_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'Bestselling Pieces',
            tr: 'En Cok Satan Parcalar',
            de: 'Bestverkaufte Stuecke',
            fr: 'Pieces les plus vendues',
            es: 'Piezas mas vendidas',
          },
          limit: 6,
          columns: 3,
        },
        style: {
          padding: '3rem 2rem',
        },
      },

      // 4. Static Furniture Product Cards — Sofa, Dining Table, Floor Lamp
      {
        id: 'mobilya_home_featured_items',
        type: 'columns',
        props: { columns: 3, gap: '2rem' },
        style: {
          padding: '2rem 2rem 3rem 2rem',
          maxWidth: '1200px',
        },
        children: [
          {
            id: 'mobilya_home_item_sofa',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '0',
            },
            children: [
              {
                id: 'mobilya_home_item_sofa_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
                  alt: {
                    en: 'Modern Velvet Sofa',
                    tr: 'Modern Kadife Koltuk',
                    de: 'Modernes Samtsofa',
                    fr: 'Canape en velours moderne',
                    es: 'Sofa de terciopelo moderno',
                  },
                },
                style: {
                  borderRadius: '12px 12px 0 0',
                },
              },
              {
                id: 'mobilya_home_item_sofa_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Modern Velvet Sofa',
                    tr: 'Modern Kadife Koltuk',
                    de: 'Modernes Samtsofa',
                    fr: 'Canape en velours moderne',
                    es: 'Sofa de terciopelo moderno',
                  },
                },
                style: {
                  padding: '1rem 1rem 0.25rem 1rem',
                  textColor: '#2D1810',
                },
              },
              {
                id: 'mobilya_home_item_sofa_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$1,299',
                    tr: '$1,299',
                    de: '$1.299',
                    fr: '1 299 $',
                    es: '$1,299',
                  },
                },
                style: {
                  padding: '0 1rem 1rem 1rem',
                  textColor: '#8B5E3C',
                },
              },
            ],
          },
          {
            id: 'mobilya_home_item_table',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '0',
            },
            children: [
              {
                id: 'mobilya_home_item_table_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
                  alt: {
                    en: 'Oak Dining Table',
                    tr: 'Mese Yemek Masasi',
                    de: 'Eichen-Esstisch',
                    fr: 'Table a manger en chene',
                    es: 'Mesa de comedor de roble',
                  },
                },
                style: {
                  borderRadius: '12px 12px 0 0',
                },
              },
              {
                id: 'mobilya_home_item_table_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Oak Dining Table',
                    tr: 'Mese Yemek Masasi',
                    de: 'Eichen-Esstisch',
                    fr: 'Table a manger en chene',
                    es: 'Mesa de comedor de roble',
                  },
                },
                style: {
                  padding: '1rem 1rem 0.25rem 1rem',
                  textColor: '#2D1810',
                },
              },
              {
                id: 'mobilya_home_item_table_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$899',
                    tr: '$899',
                    de: '$899',
                    fr: '899 $',
                    es: '$899',
                  },
                },
                style: {
                  padding: '0 1rem 1rem 1rem',
                  textColor: '#8B5E3C',
                },
              },
            ],
          },
          {
            id: 'mobilya_home_item_lamp',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '0',
            },
            children: [
              {
                id: 'mobilya_home_item_lamp_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab166?w=800&q=80',
                  alt: {
                    en: 'Minimalist Floor Lamp',
                    tr: 'Minimalist Lambader',
                    de: 'Minimalistische Stehlampe',
                    fr: 'Lampadaire minimaliste',
                    es: 'Lampara de pie minimalista',
                  },
                },
                style: {
                  borderRadius: '12px 12px 0 0',
                },
              },
              {
                id: 'mobilya_home_item_lamp_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Minimalist Floor Lamp',
                    tr: 'Minimalist Lambader',
                    de: 'Minimalistische Stehlampe',
                    fr: 'Lampadaire minimaliste',
                    es: 'Lampara de pie minimalista',
                  },
                },
                style: {
                  padding: '1rem 1rem 0.25rem 1rem',
                  textColor: '#2D1810',
                },
              },
              {
                id: 'mobilya_home_item_lamp_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$349',
                    tr: '$349',
                    de: '$349',
                    fr: '349 $',
                    es: '$349',
                  },
                },
                style: {
                  padding: '0 1rem 1rem 1rem',
                  textColor: '#8B5E3C',
                },
              },
            ],
          },
        ],
      },

      // 5. Dual Banner — Free assembly + Design consultation
      {
        id: 'mobilya_home_dual_banner',
        type: 'columns',
        props: { columns: 2, gap: '1.5rem' },
        style: { padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' },
        children: [
          {
            id: 'mobilya_banner_left',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,94,60,0.8),rgba(139,94,60,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Free Assembly</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Professional setup included with every furniture purchase</p></div></div>',
                tr: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,94,60,0.8),rgba(139,94,60,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Ucretsiz Montaj</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Her mobilya aliminizda profesyonel kurulum dahil</p></div></div>',
                de: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,94,60,0.8),rgba(139,94,60,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Kostenlose Montage</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Professionelle Einrichtung bei jedem Moebelkauf inklusive</p></div></div>',
                fr: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,94,60,0.8),rgba(139,94,60,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Assemblage Gratuit</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Installation professionnelle incluse avec chaque achat de meubles</p></div></div>',
                es: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,94,60,0.8),rgba(139,94,60,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Montaje Gratuito</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Configuracion profesional incluida con cada compra de muebles</p></div></div>',
              },
            },
          },
          {
            id: 'mobilya_banner_right',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(45,24,16,0.8),rgba(45,24,16,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Design Consultation</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Book a free session with our interior design experts</p></div></div>',
                tr: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(45,24,16,0.8),rgba(45,24,16,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Tasarim Danismanligi</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Ic mekan tasarim uzmanlarimizla ucretsiz gorusme ayirtin</p></div></div>',
                de: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(45,24,16,0.8),rgba(45,24,16,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Design-Beratung</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Buchen Sie eine kostenlose Sitzung mit unseren Innenarchitektur-Experten</p></div></div>',
                fr: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(45,24,16,0.8),rgba(45,24,16,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Consultation Design</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Reservez une session gratuite avec nos experts en design d interieur</p></div></div>',
                es: '<div style="position:relative;height:280px;border-radius:12px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(45,24,16,0.8),rgba(45,24,16,0.4))"></div><div style="position:relative;padding:2.5rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700">Consulta de Diseno</h3><p style="margin:0;opacity:0.9;font-size:0.95rem">Reserve una sesion gratuita con nuestros expertos en diseno de interiores</p></div></div>',
              },
            },
          },
        ],
      },

      // 6. Material Showcase — Oak, Walnut, Marble, Leather
      {
        id: 'mobilya_home_materials',
        type: 'columns',
        props: { columns: 4, gap: '1.5rem' },
        style: {
          padding: '3rem 2rem',
          maxWidth: '1200px',
        },
        children: [
          {
            id: 'mobilya_home_mat_oak',
            type: 'container',
            props: {},
            children: [
              {
                id: 'mobilya_home_mat_oak_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
                  alt: {
                    en: 'Oak Wood',
                    tr: 'Mese Ahsap',
                    de: 'Eichenholz',
                    fr: 'Bois de chene',
                    es: 'Madera de roble',
                  },
                  aspectRatio: '1/1',
                },
                style: {
                  borderRadius: '12px',
                },
              },
              {
                id: 'mobilya_home_mat_oak_label',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: 'Oak',
                    tr: 'Mese',
                    de: 'Eiche',
                    fr: 'Chene',
                    es: 'Roble',
                  },
                },
                style: {
                  textAlign: 'center',
                  padding: '0.75rem 0',
                  textColor: '#2D1810',
                },
              },
            ],
          },
          {
            id: 'mobilya_home_mat_walnut',
            type: 'container',
            props: {},
            children: [
              {
                id: 'mobilya_home_mat_walnut_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400&q=80',
                  alt: {
                    en: 'Walnut Wood',
                    tr: 'Ceviz Ahsap',
                    de: 'Nussbaumholz',
                    fr: 'Bois de noyer',
                    es: 'Madera de nogal',
                  },
                  aspectRatio: '1/1',
                },
                style: {
                  borderRadius: '12px',
                },
              },
              {
                id: 'mobilya_home_mat_walnut_label',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: 'Walnut',
                    tr: 'Ceviz',
                    de: 'Nussbaum',
                    fr: 'Noyer',
                    es: 'Nogal',
                  },
                },
                style: {
                  textAlign: 'center',
                  padding: '0.75rem 0',
                  textColor: '#2D1810',
                },
              },
            ],
          },
          {
            id: 'mobilya_home_mat_marble',
            type: 'container',
            props: {},
            children: [
              {
                id: 'mobilya_home_mat_marble_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80',
                  alt: {
                    en: 'Marble',
                    tr: 'Mermer',
                    de: 'Marmor',
                    fr: 'Marbre',
                    es: 'Marmol',
                  },
                  aspectRatio: '1/1',
                },
                style: {
                  borderRadius: '12px',
                },
              },
              {
                id: 'mobilya_home_mat_marble_label',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: 'Marble',
                    tr: 'Mermer',
                    de: 'Marmor',
                    fr: 'Marbre',
                    es: 'Marmol',
                  },
                },
                style: {
                  textAlign: 'center',
                  padding: '0.75rem 0',
                  textColor: '#2D1810',
                },
              },
            ],
          },
          {
            id: 'mobilya_home_mat_leather',
            type: 'container',
            props: {},
            children: [
              {
                id: 'mobilya_home_mat_leather_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80',
                  alt: {
                    en: 'Leather',
                    tr: 'Deri',
                    de: 'Leder',
                    fr: 'Cuir',
                    es: 'Cuero',
                  },
                  aspectRatio: '1/1',
                },
                style: {
                  borderRadius: '12px',
                },
              },
              {
                id: 'mobilya_home_mat_leather_label',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: 'Leather',
                    tr: 'Deri',
                    de: 'Leder',
                    fr: 'Cuir',
                    es: 'Cuero',
                  },
                },
                style: {
                  textAlign: 'center',
                  padding: '0.75rem 0',
                  textColor: '#2D1810',
                },
              },
            ],
          },
        ],
      },

      // 7. Category Showcase
      {
        id: 'mobilya_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Browse Categories',
            tr: 'Kategorilere Goz At',
            de: 'Kategorien durchsuchen',
            fr: 'Parcourir les categories',
            es: 'Explorar categorias',
          },
          limit: 6,
          columns: 3,
        },
        style: {
          padding: '3rem 2rem',
        },
      },

      // 8. Room Category Overlay Cards — Living Room, Bedroom, Office (different images)
      {
        id: 'mobilya_home_rooms2_grid',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          padding: '2rem 2rem 3rem 2rem',
          maxWidth: '1200px',
        },
        children: [
          {
            id: 'mobilya_home_room2_living',
            type: 'html',
            props: {
              content: {
                en: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Living Room</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Sofas, Armchairs & Tables</span></div></div></a>',
                tr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Oturma Odasi</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Koltuklar, Berjerler ve Masalar</span></div></div></a>',
                de: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Wohnzimmer</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Sofas, Sessel und Tische</span></div></div></a>',
                fr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Salon</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Canapes, fauteuils et tables</span></div></div></a>',
                es: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Sala de Estar</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Sofas, sillones y mesas</span></div></div></a>',
              },
            },
          },
          {
            id: 'mobilya_home_room2_bedroom',
            type: 'html',
            props: {
              content: {
                en: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Bedroom</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Beds, Wardrobes & Nightstands</span></div></div></a>',
                tr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Yatak Odasi</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Yataklar, Dolaplar ve Komodinler</span></div></div></a>',
                de: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Schlafzimmer</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Betten, Schraenke und Nachttische</span></div></div></a>',
                fr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Chambre</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Lits, armoires et tables de chevet</span></div></div></a>',
                es: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Dormitorio</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Camas, armarios y mesitas de noche</span></div></div></a>',
              },
            },
          },
          {
            id: 'mobilya_home_room2_office',
            type: 'html',
            props: {
              content: {
                en: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Office</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Desks, Chairs & Shelving</span></div></div></a>',
                tr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Ofis</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Masalar, Sandalyeler ve Raflar</span></div></div></a>',
                de: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Buero</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Schreibtische, Stuehle und Regale</span></div></div></a>',
                fr: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Bureau</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Bureaux, chaises et etageres</span></div></div></a>',
                es: '<a href="/pages/categories" style="text-decoration:none;display:block;"><div style="background-image:url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80);background-size:cover;background-position:center;height:280px;border-radius:12px;position:relative;overflow:hidden;"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(45,24,16,0.75),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem;"><span style="color:#fff;font-family:Playfair Display,serif;font-size:1.35rem;font-weight:700;">Oficina</span><span style="color:#D4A574;font-family:Lato,sans-serif;font-size:0.875rem;margin-top:0.25rem;">Escritorios, sillas y estanterias</span></div></div></a>',
              },
            },
          },
        ],
      },

      // 9. Spacer
      {
        id: 'mobilya_home_spacer',
        type: 'spacer',
        props: {
          height: '3rem',
        },
      },

      // 10. Newsletter — Design Inspiration
      {
        id: 'mobilya_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'Design Inspiration',
            tr: 'Tasarim Ilhami',
            de: 'Design-Inspiration',
            fr: 'Inspiration design',
            es: 'Inspiracion de diseno',
          },
          description: {
            en: 'Get interior design tips, new arrivals and exclusive offers delivered to your inbox',
            tr: 'Ic mekan tasarim ipuclari, yeni urunler ve ozel firsatlari e-postaniza alin',
            de: 'Erhalten Sie Einrichtungstipps, Neuheiten und exklusive Angebote direkt in Ihr Postfach',
            fr: 'Recevez des conseils en decoration, les nouveautes et des offres exclusives dans votre boite mail',
            es: 'Recibe consejos de diseno de interiores, novedades y ofertas exclusivas en tu correo',
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
          backgroundColor: '#F5EDE3',
          textColor: '#2D1810',
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
        id: 'mobilya_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'Furniture Store',
            tr: 'Mobilya Magazasi',
            de: 'Moebelhaus',
            fr: 'Magasin de meubles',
            es: 'Tienda de muebles',
          },
          logoUrl: '',
        },
      },
      {
        id: 'mobilya_header_nav',
        type: 'navigation-menu',
        props: {
          items: [
            {
              label: { en: 'Home', tr: 'Ana Sayfa', de: 'Startseite', fr: 'Accueil', es: 'Inicio' },
              link: '/',
            },
            {
              label: { en: 'Furniture', tr: 'Mobilya', de: 'Moebel', fr: 'Meubles', es: 'Muebles' },
              link: '/pages/shop',
            },
            {
              label: { en: 'Rooms', tr: 'Odalar', de: 'Raeume', fr: 'Pieces', es: 'Habitaciones' },
              link: '/pages/categories',
            },
            {
              label: { en: 'Collections', tr: 'Koleksiyonlar', de: 'Kollektionen', fr: 'Collections', es: 'Colecciones' },
              link: '/pages/collections',
            },
            {
              label: { en: 'About', tr: 'Hakkimizda', de: 'Ueber uns', fr: 'A propos', es: 'Sobre nosotros' },
              link: '/pages/about',
            },
          ],
        },
      },
      {
        id: 'mobilya_header_search',
        type: 'search-bar',
        props: {
          placeholder: {
            en: 'Search furniture...',
            tr: 'Mobilya ara...',
            de: 'Moebel suchen...',
            fr: 'Rechercher des meubles...',
            es: 'Buscar muebles...',
          },
        },
      },
      {
        id: 'mobilya_header_cart',
        type: 'cart-icon',
        props: {
          showCount: true,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Footer — 4 columns: Brand Story | Rooms | Help & Support | Showroom
  // ---------------------------------------------------------------------------
  footer: {
    version: 1,
    blocks: [
      {
        id: 'mobilya_footer_columns',
        type: 'columns',
        props: { columns: 4, gap: '2rem' },
        style: {
          padding: '3rem 2rem',
          backgroundColor: '#2D1810',
          textColor: '#F5EDE3',
        },
        children: [
          // Column 1 — Brand Story
          {
            id: 'mobilya_footer_col1',
            type: 'container',
            props: {},
            children: [
              {
                id: 'mobilya_footer_col1_brand',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.25rem;margin-bottom:0.75rem;">Furniture Store</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.6;opacity:0.85;">We believe every home tells a story. Our furniture is crafted from sustainably sourced hardwoods by skilled artisans who honor generations of woodworking tradition. From concept to delivery, every piece is designed to bring warmth, beauty, and lasting comfort to your living spaces.</p>',
                    tr:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.25rem;margin-bottom:0.75rem;">Mobilya Magazasi</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.6;opacity:0.85;">Her evin bir hikayesi olduguna inaniyoruz. Mobilyalarimiz, nesiller boyu suregelen ahsap isleme gelenegini onurlandiran usta zanaatkarlar tarafindan surdurulebilir kaynaklardan elde edilen sert agaclardan uretilmektedir. Konseptten teslimata kadar her parca, yasam alanlariniza sicaklik, guzellik ve kalici konfor getirmek icin tasarlanmistir.</p>',
                    de:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.25rem;margin-bottom:0.75rem;">Moebelhaus</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.6;opacity:0.85;">Wir glauben, dass jedes Zuhause eine Geschichte erzaehlt. Unsere Moebel werden aus nachhaltig gewonnenem Hartholz von erfahrenen Handwerkern gefertigt, die eine generationenalte Holzbearbeitungstradition ehren. Vom Konzept bis zur Lieferung ist jedes Stueck darauf ausgelegt, Waerme, Schoenheit und dauerhaften Komfort in Ihre Wohnraeume zu bringen.</p>',
                    fr:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.25rem;margin-bottom:0.75rem;">Magasin de meubles</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.6;opacity:0.85;">Nous croyons que chaque maison raconte une histoire. Nos meubles sont fabriques a partir de bois durs issus de sources durables par des artisans qualifies qui honorent des generations de tradition du travail du bois. De la conception a la livraison, chaque piece est concue pour apporter chaleur, beaute et confort durable a vos espaces de vie.</p>',
                    es:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.25rem;margin-bottom:0.75rem;">Tienda de muebles</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.6;opacity:0.85;">Creemos que cada hogar cuenta una historia. Nuestros muebles estan elaborados con maderas duras de origen sostenible por artesanos expertos que honran generaciones de tradicion en el trabajo de la madera. Desde el concepto hasta la entrega, cada pieza esta disenada para aportar calidez, belleza y comodidad duradera a tus espacios.</p>',
                  },
                },
              },
            ],
          },
          // Column 2 — Rooms
          {
            id: 'mobilya_footer_col2',
            type: 'container',
            props: {},
            children: [
              {
                id: 'mobilya_footer_col2_rooms',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Rooms</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Living Room</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Bedroom</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Kitchen</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Office</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Outdoor</a></li>' +
                      '</ul>',
                    tr:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Odalar</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Oturma Odasi</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Yatak Odasi</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Mutfak</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Ofis</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Dis Mekan</a></li>' +
                      '</ul>',
                    de:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Raeume</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Wohnzimmer</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Schlafzimmer</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Kueche</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Buero</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Aussenbereich</a></li>' +
                      '</ul>',
                    fr:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Pieces</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Salon</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Chambre</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Cuisine</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Bureau</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Exterieur</a></li>' +
                      '</ul>',
                    es:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Habitaciones</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Sala de Estar</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Dormitorio</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Cocina</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Oficina</a></li>' +
                      '<li><a href="/pages/categories" style="color:#D4A574;text-decoration:none;">Exterior</a></li>' +
                      '</ul>',
                  },
                },
              },
            ],
          },
          // Column 3 — Help & Support
          {
            id: 'mobilya_footer_col3',
            type: 'container',
            props: {},
            children: [
              {
                id: 'mobilya_footer_col3_help',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Help & Support</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/faq" style="color:#D4A574;text-decoration:none;">FAQ</a></li>' +
                      '<li><a href="/pages/contact" style="color:#D4A574;text-decoration:none;">Contact Us</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#D4A574;text-decoration:none;">Shipping & Delivery</a></li>' +
                      '<li><a href="/pages/returns" style="color:#D4A574;text-decoration:none;">Returns & Exchanges</a></li>' +
                      '<li><a href="/pages/assembly" style="color:#D4A574;text-decoration:none;">Assembly Guide</a></li>' +
                      '</ul>',
                    tr:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Yardim ve Destek</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/faq" style="color:#D4A574;text-decoration:none;">SSS</a></li>' +
                      '<li><a href="/pages/contact" style="color:#D4A574;text-decoration:none;">Bize Ulasin</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#D4A574;text-decoration:none;">Kargo ve Teslimat</a></li>' +
                      '<li><a href="/pages/returns" style="color:#D4A574;text-decoration:none;">Iade ve Degisim</a></li>' +
                      '<li><a href="/pages/assembly" style="color:#D4A574;text-decoration:none;">Montaj Kilavuzu</a></li>' +
                      '</ul>',
                    de:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Hilfe & Support</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/faq" style="color:#D4A574;text-decoration:none;">FAQ</a></li>' +
                      '<li><a href="/pages/contact" style="color:#D4A574;text-decoration:none;">Kontakt</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#D4A574;text-decoration:none;">Versand & Lieferung</a></li>' +
                      '<li><a href="/pages/returns" style="color:#D4A574;text-decoration:none;">Rueckgabe & Umtausch</a></li>' +
                      '<li><a href="/pages/assembly" style="color:#D4A574;text-decoration:none;">Montageanleitung</a></li>' +
                      '</ul>',
                    fr:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Aide & Support</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/faq" style="color:#D4A574;text-decoration:none;">FAQ</a></li>' +
                      '<li><a href="/pages/contact" style="color:#D4A574;text-decoration:none;">Nous contacter</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#D4A574;text-decoration:none;">Livraison</a></li>' +
                      '<li><a href="/pages/returns" style="color:#D4A574;text-decoration:none;">Retours & Echanges</a></li>' +
                      '<li><a href="/pages/assembly" style="color:#D4A574;text-decoration:none;">Guide de montage</a></li>' +
                      '</ul>',
                    es:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Ayuda y Soporte</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;font-size:0.875rem;line-height:2;">' +
                      '<li><a href="/pages/faq" style="color:#D4A574;text-decoration:none;">Preguntas frecuentes</a></li>' +
                      '<li><a href="/pages/contact" style="color:#D4A574;text-decoration:none;">Contacto</a></li>' +
                      '<li><a href="/pages/shipping" style="color:#D4A574;text-decoration:none;">Envio y Entrega</a></li>' +
                      '<li><a href="/pages/returns" style="color:#D4A574;text-decoration:none;">Devoluciones y Cambios</a></li>' +
                      '<li><a href="/pages/assembly" style="color:#D4A574;text-decoration:none;">Guia de montaje</a></li>' +
                      '</ul>',
                  },
                },
              },
            ],
          },
          // Column 4 — Showroom
          {
            id: 'mobilya_footer_col4',
            type: 'container',
            props: {},
            children: [
              {
                id: 'mobilya_footer_col4_showroom',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Showroom</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.8;opacity:0.85;">' +
                      '123 Design District<br/>New York, NY 10001<br/><br/>' +
                      '<strong>Hours</strong><br/>Mon — Sat: 10:00 AM — 7:00 PM<br/>Sun: 11:00 AM — 5:00 PM<br/><br/>' +
                      '<strong>Phone</strong><br/>+1 (555) 234-5678' +
                      '</p>',
                    tr:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Showroom</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.8;opacity:0.85;">' +
                      '123 Tasarim Caddesi<br/>Istanbul, Turkiye<br/><br/>' +
                      '<strong>Calisma Saatleri</strong><br/>Pzt — Cmt: 10:00 — 19:00<br/>Paz: 11:00 — 17:00<br/><br/>' +
                      '<strong>Telefon</strong><br/>+90 (212) 234-5678' +
                      '</p>',
                    de:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Showroom</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.8;opacity:0.85;">' +
                      '123 Design-Viertel<br/>Berlin, Deutschland<br/><br/>' +
                      '<strong>Oeffnungszeiten</strong><br/>Mo — Sa: 10:00 — 19:00<br/>So: 11:00 — 17:00<br/><br/>' +
                      '<strong>Telefon</strong><br/>+49 (30) 234-5678' +
                      '</p>',
                    fr:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Showroom</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.8;opacity:0.85;">' +
                      '123 Quartier du Design<br/>Paris, France<br/><br/>' +
                      '<strong>Horaires</strong><br/>Lun — Sam: 10h00 — 19h00<br/>Dim: 11h00 — 17h00<br/><br/>' +
                      '<strong>Telephone</strong><br/>+33 (1) 234-5678' +
                      '</p>',
                    es:
                      '<h4 style="font-family:Playfair Display,serif;font-size:1.1rem;margin-bottom:0.75rem;">Showroom</h4>' +
                      '<p style="font-size:0.875rem;line-height:1.8;opacity:0.85;">' +
                      '123 Distrito de Diseno<br/>Madrid, Espana<br/><br/>' +
                      '<strong>Horario</strong><br/>Lun — Sab: 10:00 — 19:00<br/>Dom: 11:00 — 17:00<br/><br/>' +
                      '<strong>Telefono</strong><br/>+34 (91) 234-5678' +
                      '</p>',
                  },
                },
              },
            ],
          },
        ],
      },
      // Social links
      {
        id: 'mobilya_footer_social',
        type: 'social-links',
        props: {
          links: [
            { platform: 'instagram', url: '#' },
            { platform: 'facebook', url: '#' },
            { platform: 'pinterest', url: '#' },
          ],
        },
        style: {
          padding: '1.5rem 2rem',
          backgroundColor: '#2D1810',
          textAlign: 'center',
        },
      },
      // Copyright
      {
        id: 'mobilya_footer_copyright',
        type: 'text',
        props: {
          tag: 'p',
          content: {
            en: '\u00a9 2026 Furniture Store. All rights reserved. Crafted with care.',
            tr: '\u00a9 2026 Mobilya Magazasi. Tum haklari saklidir. Ozenle uretilmistir.',
            de: '\u00a9 2026 Moebelhaus. Alle Rechte vorbehalten. Mit Sorgfalt gefertigt.',
            fr: '\u00a9 2026 Magasin de meubles. Tous droits reserves. Fabrique avec soin.',
            es: '\u00a9 2026 Tienda de muebles. Todos los derechos reservados. Elaborado con esmero.',
          },
        },
        style: {
          textAlign: 'center',
          padding: '1rem 2rem 2rem 2rem',
          backgroundColor: '#2D1810',
          textColor: '#F5EDE3',
        },
      },
    ],
  },
};
