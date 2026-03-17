import type { ThemeBundle } from '../types.js';

export const elegantBundle: ThemeBundle = {
  manifest: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Net-A-Porter / Dior inspired luxury theme with serif typography, gold accents, and zero border radius',
    sector: 'genel',
    category: 'universal',
    colorPalette: ['#1C1917', '#78716C', '#B8860B', '#FFFDF7', '#F5F0E8'],
    config: {
      primary: '#1C1917',
      secondary: '#78716C',
      accent: '#B8860B',
      background: '#FFFDF7',
      foreground: '#1C1917',
      muted: '#F5F0E8',
      border: '#D6CFC4',
      fonts: { heading: 'Cormorant Garamond', body: 'Inter' },
      borderRadius: 'none',
      layout: {
        headerStyle: 'centered',
        productGridColumns: 2,
        footerColumns: 4,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero Banner', type: 'hero' },
      { id: 'curated-edit', name: 'Curated Edit', type: 'custom', component: 'curated-edit' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'divider', name: 'Gold Divider', type: 'custom', component: 'divider' },
      { id: 'categories', name: 'Categories', type: 'categories-grid' },
      { id: 'heritage', name: 'Brand Heritage', type: 'custom', component: 'heritage' },
    ],
  },

  homePage: {
    version: 1,
    blocks: [
      // 1. Hero — dark luxury still-life
      {
        id: 'elegant_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'Timeless Elegance',
            tr: 'Zamansiz Zarafet',
            de: 'Zeitlose Eleganz',
            fr: '\u00c9l\u00e9gance Intemporelle',
            es: 'Elegancia Atemporal',
          },
          subtitle: {
            en: 'Where luxury meets refinement. Discover pieces crafted for the extraordinary.',
            tr: 'L\u00fcks\u00fcn incelikle bulu\u015ftu\u011fu yer. S\u0131ra d\u0131\u015f\u0131 i\u00e7in tasarlanm\u0131\u015f par\u00e7alar\u0131 ke\u015ffedin.',
            de: 'Wo Luxus auf Raffinesse trifft. Entdecken Sie St\u00fccke, die f\u00fcr das Au\u00dfergew\u00f6hnliche gefertigt wurden.',
            fr: 'L\u00e0 o\u00f9 le luxe rencontre le raffinement. D\u00e9couvrez des pi\u00e8ces cr\u00e9\u00e9es pour l\u2019extraordinaire.',
            es: 'Donde el lujo se encuentra con el refinamiento. Descubra piezas creadas para lo extraordinario.',
          },
          buttonText: {
            en: 'Discover the Collection',
            tr: 'Koleksiyonu Ke\u015ffedin',
            de: 'Kollektion Entdecken',
            fr: 'D\u00e9couvrir la Collection',
            es: 'Descubrir la Colecci\u00f3n',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
          overlayOpacity: 0.5,
          buttonStyle: {
            backgroundColor: '#B8860B',
            color: '#FFFDF7',
            border: 'none',
            fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          },
          secondaryButtonText: {
            en: 'View Lookbook',
            tr: 'Lookbook\u2019u G\u00f6r\u00fcn',
            de: 'Lookbook Ansehen',
            fr: 'Voir le Lookbook',
            es: 'Ver Lookbook',
          },
          secondaryButtonLink: '/pages/categories',
        },
        style: {
          backgroundColor: '#1C1917',
          textColor: '#FFFDF7',
          padding: '6rem 2rem',
        },
      },

      // 2. Spacer — dignified breathing room
      {
        id: 'elegant_home_spacer1',
        type: 'spacer',
        props: { height: '3rem' },
        style: {},
      },

      // 3. Curated Edit — editorial heading + 2 large image columns
      {
        id: 'elegant_home_curated_title',
        type: 'text',
        props: {
          tag: 'h2',
          content: {
            en: 'The Curated Edit',
            tr: 'Se\u00e7kin Koleksiyon',
            de: 'Die Kuratierte Auswahl',
            fr: 'La S\u00e9lection Curis\u00e9e',
            es: 'La Selecci\u00f3n Curada',
          },
        },
        style: {
          textAlign: 'center',
          padding: '0 2rem 2rem 2rem',
          textColor: '#1C1917',
          customCss: 'font-family: "Cormorant Garamond", serif; font-size: 2.5rem; font-weight: 300; letter-spacing: 3px; text-transform: uppercase;',
        },
      },
      {
        id: 'elegant_home_curated_columns',
        type: 'columns',
        props: { columns: 2, gap: '2rem' },
        style: {
          padding: '0 2rem 3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          {
            id: 'elegant_home_curated_left',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Spring Collection</span></div></div>',
                tr: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Bahar Koleksiyonu</span></div></div>',
                de: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Fr\u00fchlingskollektion</span></div></div>',
                fr: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Collection Printemps</span></div></div>',
                es: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Colecci\u00f3n Primavera</span></div></div>',
              },
            },
          },
          {
            id: 'elegant_home_curated_right',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Accessories</span></div></div>',
                tr: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Aksesuarlar</span></div></div>',
                de: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Accessoires</span></div></div>',
                fr: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Accessoires</span></div></div>',
                es: '<div style="position:relative;height:400px;background:url(\'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.35);display:flex;align-items:flex-end;justify-content:center;padding:2rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;">Accesorios</span></div></div>',
              },
            },
          },
        ],
      },

      // 4. Product Showcase — 4 products, 2 columns, luxury display
      {
        id: 'elegant_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'The Collection',
            tr: 'Koleksiyon',
            de: 'Die Kollektion',
            fr: 'La Collection',
            es: 'La Colecci\u00f3n',
          },
          limit: 4,
          columns: 2,
        },
        style: {
          padding: '3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
      },

      // 5. Static luxury products — 2 large format with gold price
      {
        id: 'elegant_home_luxury_products',
        type: 'columns',
        props: { columns: 2, gap: '3rem' },
        style: {
          padding: '3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          {
            id: 'elegant_home_luxury_left',
            type: 'container',
            props: {},
            children: [
              {
                id: 'elegant_home_luxury_left_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
                  alt: {
                    en: 'The Heritage Bag',
                    tr: 'Miras \u00c7anta',
                    de: 'Die Heritage-Tasche',
                    fr: 'Le Sac H\u00e9ritage',
                    es: 'El Bolso Heritage',
                  },
                },
                style: {
                  customCss: 'width:100%;height:500px;object-fit:cover;border:1px solid #B8860B;',
                },
              },
              {
                id: 'elegant_home_luxury_left_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'The Heritage Bag',
                    tr: 'Miras \u00c7anta',
                    de: 'Die Heritage-Tasche',
                    fr: 'Le Sac H\u00e9ritage',
                    es: 'El Bolso Heritage',
                  },
                },
                style: {
                  padding: '1rem 0 0.25rem 0',
                  customCss: 'font-family: "Cormorant Garamond", serif; font-size: 1.5rem; font-weight: 400; letter-spacing: 1px;',
                },
              },
              {
                id: 'elegant_home_luxury_left_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$2,450',
                    tr: '$2,450',
                    de: '$2.450',
                    fr: '2 450 $',
                    es: '$2.450',
                  },
                },
                style: {
                  textColor: '#B8860B',
                  customCss: 'font-family: "Cormorant Garamond", serif; font-size: 1.25rem; letter-spacing: 1px;',
                },
              },
            ],
          },
          {
            id: 'elegant_home_luxury_right',
            type: 'container',
            props: {},
            children: [
              {
                id: 'elegant_home_luxury_right_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800&q=80',
                  alt: {
                    en: 'Diamond Pendant',
                    tr: 'P\u0131rlanta Kolye',
                    de: 'Diamant-Anh\u00e4nger',
                    fr: 'Pendentif Diamant',
                    es: 'Colgante de Diamante',
                  },
                },
                style: {
                  customCss: 'width:100%;height:500px;object-fit:cover;border:1px solid #B8860B;',
                },
              },
              {
                id: 'elegant_home_luxury_right_title',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Diamond Pendant',
                    tr: 'P\u0131rlanta Kolye',
                    de: 'Diamant-Anh\u00e4nger',
                    fr: 'Pendentif Diamant',
                    es: 'Colgante de Diamante',
                  },
                },
                style: {
                  padding: '1rem 0 0.25rem 0',
                  customCss: 'font-family: "Cormorant Garamond", serif; font-size: 1.5rem; font-weight: 400; letter-spacing: 1px;',
                },
              },
              {
                id: 'elegant_home_luxury_right_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: {
                    en: '$3,200',
                    tr: '$3,200',
                    de: '$3.200',
                    fr: '3 200 $',
                    es: '$3.200',
                  },
                },
                style: {
                  textColor: '#B8860B',
                  customCss: 'font-family: "Cormorant Garamond", serif; font-size: 1.25rem; letter-spacing: 1px;',
                },
              },
            ],
          },
        ],
      },

      // 6. Gold Divider — thin, centered, 40% width
      {
        id: 'elegant_home_divider',
        type: 'divider',
        props: {},
        style: {
          backgroundColor: '#B8860B',
          maxWidth: '40%',
          margin: '3rem auto',
          customCss: 'height: 1px;',
        },
      },

      // 7. Category Showcase — 4 categories, 2 columns
      {
        id: 'elegant_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Collections',
            tr: 'Koleksiyonlar',
            de: 'Kollektionen',
            fr: 'Collections',
            es: 'Colecciones',
          },
          limit: 4,
          columns: 2,
        },
        style: {
          padding: '3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
      },

      // 8. Static luxury categories — Fine Jewelry & Designer Bags
      {
        id: 'elegant_home_static_categories',
        type: 'columns',
        props: { columns: 2, gap: '2rem' },
        style: {
          padding: '2rem 2rem 4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [
          {
            id: 'elegant_home_cat_jewelry',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1515562141589-67f0d999abf6?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Fine Jewelry</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">Explore Collection</span></div></div>',
                tr: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1515562141589-67f0d999abf6?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">M\u00fccevherat</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">Koleksiyonu Ke\u015ffedin</span></div></div>',
                de: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1515562141589-67f0d999abf6?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Feiner Schmuck</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">Kollektion Entdecken</span></div></div>',
                fr: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1515562141589-67f0d999abf6?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Haute Joaillerie</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">D\u00e9couvrir la Collection</span></div></div>',
                es: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1515562141589-67f0d999abf6?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Alta Joyer\u00eda</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">Explorar Colecci\u00f3n</span></div></div>',
              },
            },
          },
          {
            id: 'elegant_home_cat_bags',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Designer Bags</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">Explore Collection</span></div></div>',
                tr: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Tasar\u0131m \u00c7antalar</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">Koleksiyonu Ke\u015ffedin</span></div></div>',
                de: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Designer-Taschen</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">Kollektion Entdecken</span></div></div>',
                fr: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Sacs de Cr\u00e9ateurs</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">D\u00e9couvrir la Collection</span></div></div>',
                es: '<div style="position:relative;height:350px;background:url(\'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80\') center/cover no-repeat;border:1px solid #B8860B;overflow:hidden;"><div style="position:absolute;inset:0;background:rgba(28,25,23,0.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;"><span style="font-family:\'Cormorant Garamond\',serif;font-size:1.75rem;color:#B8860B;letter-spacing:3px;text-transform:uppercase;">Bolsos de Dise\u00f1o</span><span style="font-family:Inter,sans-serif;font-size:0.8rem;color:#FFFDF7;letter-spacing:2px;text-transform:uppercase;">Explorar Colecci\u00f3n</span></div></div>',
              },
            },
          },
        ],
      },

      // 9. Brand Heritage — dark bg, gold serif text
      {
        id: 'elegant_home_heritage',
        type: 'html',
        props: {
          content: {
            en: '<div style="background:#1C1917;color:#B8860B;text-align:center;padding:4rem 2rem;font-family:\'Cormorant Garamond\',serif;font-size:1.25rem;letter-spacing:1px;line-height:2;"><p style="margin:0;font-size:0.85rem;text-transform:uppercase;letter-spacing:4px;color:#78716C;margin-bottom:1rem;">Est. 2026</p><p style="margin:0;font-size:1.5rem;font-style:italic;">Curating the finest for the discerning.</p><p style="margin:0.5rem 0 0 0;font-size:1rem;color:#D6CFC4;">Where heritage meets modern luxury.</p></div>',
            tr: '<div style="background:#1C1917;color:#B8860B;text-align:center;padding:4rem 2rem;font-family:\'Cormorant Garamond\',serif;font-size:1.25rem;letter-spacing:1px;line-height:2;"><p style="margin:0;font-size:0.85rem;text-transform:uppercase;letter-spacing:4px;color:#78716C;margin-bottom:1rem;">2026\'dan Beri</p><p style="margin:0;font-size:1.5rem;font-style:italic;">Se\u00e7kin zevkler i\u00e7in en iyisini sunuyoruz.</p><p style="margin:0.5rem 0 0 0;font-size:1rem;color:#D6CFC4;">Miras\u0131n modern l\u00fcksle bulu\u015ftu\u011fu yer.</p></div>',
            de: '<div style="background:#1C1917;color:#B8860B;text-align:center;padding:4rem 2rem;font-family:\'Cormorant Garamond\',serif;font-size:1.25rem;letter-spacing:1px;line-height:2;"><p style="margin:0;font-size:0.85rem;text-transform:uppercase;letter-spacing:4px;color:#78716C;margin-bottom:1rem;">Gegr\u00fcndet 2026</p><p style="margin:0;font-size:1.5rem;font-style:italic;">Das Feinste f\u00fcr anspruchsvolle Kenner.</p><p style="margin:0.5rem 0 0 0;font-size:1rem;color:#D6CFC4;">Wo Tradition auf modernen Luxus trifft.</p></div>',
            fr: '<div style="background:#1C1917;color:#B8860B;text-align:center;padding:4rem 2rem;font-family:\'Cormorant Garamond\',serif;font-size:1.25rem;letter-spacing:1px;line-height:2;"><p style="margin:0;font-size:0.85rem;text-transform:uppercase;letter-spacing:4px;color:#78716C;margin-bottom:1rem;">\u00c9tabli en 2026</p><p style="margin:0;font-size:1.5rem;font-style:italic;">S\u00e9lectionner le meilleur pour les connaisseurs.</p><p style="margin:0.5rem 0 0 0;font-size:1rem;color:#D6CFC4;">L\u00e0 o\u00f9 l\u2019h\u00e9ritage rencontre le luxe moderne.</p></div>',
            es: '<div style="background:#1C1917;color:#B8860B;text-align:center;padding:4rem 2rem;font-family:\'Cormorant Garamond\',serif;font-size:1.25rem;letter-spacing:1px;line-height:2;"><p style="margin:0;font-size:0.85rem;text-transform:uppercase;letter-spacing:4px;color:#78716C;margin-bottom:1rem;">Fundada en 2026</p><p style="margin:0;font-size:1.5rem;font-style:italic;">Seleccionando lo mejor para los conocedores.</p><p style="margin:0.5rem 0 0 0;font-size:1rem;color:#D6CFC4;">Donde la herencia se encuentra con el lujo moderno.</p></div>',
          },
        },
      },

      // 10. Newsletter — "The Inner Circle", cream bg
      {
        id: 'elegant_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'The Inner Circle',
            tr: '\u0130\u00e7 \u00c7ember',
            de: 'Der Innere Kreis',
            fr: 'Le Cercle Priv\u00e9',
            es: 'El C\u00edrculo \u00cdntimo',
          },
          description: {
            en: 'Join our exclusive membership for private previews, early access to collections, and invitations to intimate events.',
            tr: '\u00d6zel \u00f6nizlemeler, koleksiyonlara erken eri\u015fim ve \u00f6zel etkinliklere davetiyeler i\u00e7in se\u00e7kin \u00fcyeli\u011fimize kat\u0131l\u0131n.',
            de: 'Treten Sie unserer exklusiven Mitgliedschaft bei f\u00fcr private Vorschauen, fr\u00fchen Zugang zu Kollektionen und Einladungen zu intimen Events.',
            fr: 'Rejoignez notre cercle exclusif pour des aper\u00e7us priv\u00e9s, un acc\u00e8s anticip\u00e9 aux collections et des invitations \u00e0 des \u00e9v\u00e9nements intimes.',
            es: '\u00danase a nuestra membres\u00eda exclusiva para vistas previas privadas, acceso anticipado a colecciones e invitaciones a eventos \u00edntimos.',
          },
          buttonText: {
            en: 'Request Membership',
            tr: '\u00dcyelik Talep Edin',
            de: 'Mitgliedschaft Beantragen',
            fr: 'Demander l\u2019Adh\u00e9sion',
            es: 'Solicitar Membres\u00eda',
          },
        },
        style: {
          backgroundColor: '#F5F0E8',
          textColor: '#1C1917',
          padding: '4rem 2rem',
          textAlign: 'center',
        },
      },
    ],
  },

  header: {
    version: 1,
    blocks: [
      {
        id: 'elegant_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'MAISON \u00c9L\u00c9GANTE',
            tr: 'MAISON \u00c9L\u00c9GANTE',
            de: 'MAISON \u00c9L\u00c9GANTE',
            fr: 'MAISON \u00c9L\u00c9GANTE',
            es: 'MAISON \u00c9L\u00c9GANTE',
          },
          logoUrl: '',
        },
        style: {
          customCss: 'font-family: "Cormorant Garamond", serif; font-size: 1.75rem; letter-spacing: 4px; font-weight: 300;',
        },
      },
      {
        id: 'elegant_header_nav',
        type: 'navigation-menu',
        props: {
          items: [
            {
              label: { en: 'Home', tr: 'Ana Sayfa', de: 'Startseite', fr: 'Accueil', es: 'Inicio' },
              link: '/',
            },
            {
              label: { en: 'Collections', tr: 'Koleksiyonlar', de: 'Kollektionen', fr: 'Collections', es: 'Colecciones' },
              link: '/pages/categories',
            },
            {
              label: { en: 'Designers', tr: 'Tasar\u0131mc\u0131lar', de: 'Designer', fr: 'Cr\u00e9ateurs', es: 'Dise\u00f1adores' },
              link: '/pages/designers',
            },
            {
              label: { en: 'The Edit', tr: 'Se\u00e7ki', de: 'Die Auswahl', fr: 'La S\u00e9lection', es: 'La Selecci\u00f3n' },
              link: '/pages/edit',
            },
            {
              label: { en: 'Contact', tr: '\u0130leti\u015fim', de: 'Kontakt', fr: 'Contact', es: 'Contacto' },
              link: '/pages/contact',
            },
          ],
        },
        style: {
          customCss: 'font-family: Inter, sans-serif; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase;',
        },
      },
      {
        id: 'elegant_header_search',
        type: 'search-bar',
        props: {
          placeholder: {
            en: 'Search collections...',
            tr: 'Koleksiyonlarda ara...',
            de: 'Kollektionen durchsuchen...',
            fr: 'Rechercher dans les collections...',
            es: 'Buscar en colecciones...',
          },
        },
      },
      {
        id: 'elegant_header_cart',
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
      // 4-column footer
      {
        id: 'elegant_footer_main',
        type: 'container',
        props: {},
        style: {
          backgroundColor: '#1C1917',
          textColor: '#D6CFC4',
          padding: '4rem 2rem 2rem 2rem',
        },
        children: [
          {
            id: 'elegant_footer_columns',
            type: 'columns',
            props: { columns: 4, gap: '2rem' },
            style: {
              maxWidth: '1200px',
              margin: '0 auto',
            },
            children: [
              // Col 1 — The House
              {
                id: 'elegant_footer_col1',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">The House</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/about" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">About</a></li><li><a href="/pages/heritage" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Heritage</a></li><li><a href="/pages/craftsmanship" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Craftsmanship</a></li><li><a href="/pages/press" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Press</a></li></ul>',
                    tr: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Maison</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/about" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Hakk\u0131m\u0131zda</a></li><li><a href="/pages/heritage" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Miras</a></li><li><a href="/pages/craftsmanship" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Zanatk\u00e2rl\u0131k</a></li><li><a href="/pages/press" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Bas\u0131n</a></li></ul>',
                    de: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Das Haus</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/about" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">\u00dcber Uns</a></li><li><a href="/pages/heritage" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Tradition</a></li><li><a href="/pages/craftsmanship" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Handwerkskunst</a></li><li><a href="/pages/press" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Presse</a></li></ul>',
                    fr: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">La Maison</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/about" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">\u00c0 Propos</a></li><li><a href="/pages/heritage" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">H\u00e9ritage</a></li><li><a href="/pages/craftsmanship" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Savoir-Faire</a></li><li><a href="/pages/press" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Presse</a></li></ul>',
                    es: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">La Casa</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/about" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Acerca de</a></li><li><a href="/pages/heritage" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Herencia</a></li><li><a href="/pages/craftsmanship" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Artesan\u00eda</a></li><li><a href="/pages/press" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Prensa</a></li></ul>',
                  },
                },
              },
              // Col 2 — Collections
              {
                id: 'elegant_footer_col2',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Collections</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/new-arrivals" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">New Arrivals</a></li><li><a href="/pages/fine-jewelry" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Fine Jewelry</a></li><li><a href="/pages/designer-bags" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Designer Bags</a></li><li><a href="/pages/accessories" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Accessories</a></li><li><a href="/pages/gifts" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Gifts</a></li></ul>',
                    tr: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Koleksiyonlar</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/new-arrivals" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Yeni Gelenler</a></li><li><a href="/pages/fine-jewelry" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">M\u00fccevherat</a></li><li><a href="/pages/designer-bags" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Tasar\u0131m \u00c7antalar</a></li><li><a href="/pages/accessories" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Aksesuarlar</a></li><li><a href="/pages/gifts" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Hediyeler</a></li></ul>',
                    de: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Kollektionen</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/new-arrivals" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Neuheiten</a></li><li><a href="/pages/fine-jewelry" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Feiner Schmuck</a></li><li><a href="/pages/designer-bags" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Designer-Taschen</a></li><li><a href="/pages/accessories" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Accessoires</a></li><li><a href="/pages/gifts" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Geschenke</a></li></ul>',
                    fr: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Collections</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/new-arrivals" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Nouveaut\u00e9s</a></li><li><a href="/pages/fine-jewelry" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Haute Joaillerie</a></li><li><a href="/pages/designer-bags" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Sacs de Cr\u00e9ateurs</a></li><li><a href="/pages/accessories" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Accessoires</a></li><li><a href="/pages/gifts" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Cadeaux</a></li></ul>',
                    es: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Colecciones</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/new-arrivals" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Novedades</a></li><li><a href="/pages/fine-jewelry" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Alta Joyer\u00eda</a></li><li><a href="/pages/designer-bags" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Bolsos de Dise\u00f1o</a></li><li><a href="/pages/accessories" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Accesorios</a></li><li><a href="/pages/gifts" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Regalos</a></li></ul>',
                  },
                },
              },
              // Col 3 — Client Services
              {
                id: 'elegant_footer_col3',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Client Services</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/contact" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Contact</a></li><li><a href="/pages/shipping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Shipping</a></li><li><a href="/pages/returns" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Returns</a></li><li><a href="/pages/care-guide" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Care Guide</a></li><li><a href="/pages/personal-shopping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Personal Shopping</a></li></ul>',
                    tr: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">M\u00fc\u015fteri Hizmetleri</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/contact" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">\u0130leti\u015fim</a></li><li><a href="/pages/shipping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Kargo</a></li><li><a href="/pages/returns" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">\u0130ade</a></li><li><a href="/pages/care-guide" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Bak\u0131m Rehberi</a></li><li><a href="/pages/personal-shopping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Ki\u015fisel Al\u0131\u015fveri\u015f</a></li></ul>',
                    de: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Kundenservice</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/contact" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Kontakt</a></li><li><a href="/pages/shipping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Versand</a></li><li><a href="/pages/returns" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">R\u00fccksendungen</a></li><li><a href="/pages/care-guide" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Pflegeanleitung</a></li><li><a href="/pages/personal-shopping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Personal Shopping</a></li></ul>',
                    fr: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Service Client</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/contact" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Contact</a></li><li><a href="/pages/shipping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Livraison</a></li><li><a href="/pages/returns" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Retours</a></li><li><a href="/pages/care-guide" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Guide d\u2019Entretien</a></li><li><a href="/pages/personal-shopping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Personal Shopping</a></li></ul>',
                    es: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Atenci\u00f3n al Cliente</h4><ul style="list-style:none;padding:0;margin:0;line-height:2.2;"><li><a href="/pages/contact" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Contacto</a></li><li><a href="/pages/shipping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Env\u00edo</a></li><li><a href="/pages/returns" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Devoluciones</a></li><li><a href="/pages/care-guide" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Gu\u00eda de Cuidado</a></li><li><a href="/pages/personal-shopping" style="color:#D6CFC4;text-decoration:none;font-size:0.85rem;letter-spacing:1px;">Compra Personal</a></li></ul>',
                  },
                },
              },
              // Col 4 — The Inner Circle
              {
                id: 'elegant_footer_col4',
                type: 'container',
                props: {},
                children: [
                  {
                    id: 'elegant_footer_col4_text',
                    type: 'text',
                    props: {
                      tag: 'div',
                      content: {
                        en: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">The Inner Circle</h4><p style="color:#D6CFC4;font-size:0.85rem;line-height:1.8;letter-spacing:0.5px;margin-bottom:1.5rem;">Our most discerning clients enjoy exclusive previews, bespoke services, and invitations to private events worldwide.</p>',
                        tr: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">\u0130\u00e7 \u00c7ember</h4><p style="color:#D6CFC4;font-size:0.85rem;line-height:1.8;letter-spacing:0.5px;margin-bottom:1.5rem;">En se\u00e7kin m\u00fc\u015fterilerimiz \u00f6zel \u00f6nizlemeler, ki\u015fiye \u00f6zel hizmetler ve d\u00fcnya genelindeki \u00f6zel etkinliklere davetlerden yararlan\u0131r.</p>',
                        de: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Der Innere Kreis</h4><p style="color:#D6CFC4;font-size:0.85rem;line-height:1.8;letter-spacing:0.5px;margin-bottom:1.5rem;">Unsere anspruchsvollsten Kunden genie\u00dfen exklusive Vorschauen, ma\u00dfgeschneiderte Services und Einladungen zu privaten Veranstaltungen weltweit.</p>',
                        fr: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">Le Cercle Priv\u00e9</h4><p style="color:#D6CFC4;font-size:0.85rem;line-height:1.8;letter-spacing:0.5px;margin-bottom:1.5rem;">Nos clients les plus exigeants b\u00e9n\u00e9ficient d\u2019aper\u00e7us exclusifs, de services sur mesure et d\u2019invitations \u00e0 des \u00e9v\u00e9nements priv\u00e9s dans le monde entier.</p>',
                        es: '<h4 style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:#B8860B;letter-spacing:2px;text-transform:uppercase;margin-bottom:1rem;">El C\u00edrculo \u00cdntimo</h4><p style="color:#D6CFC4;font-size:0.85rem;line-height:1.8;letter-spacing:0.5px;margin-bottom:1.5rem;">Nuestros clientes m\u00e1s exigentes disfrutan de vistas previas exclusivas, servicios personalizados e invitaciones a eventos privados en todo el mundo.</p>',
                      },
                    },
                  },
                  {
                    id: 'elegant_footer_col4_social',
                    type: 'social-links',
                    props: {
                      links: [
                        { platform: 'instagram', url: '#' },
                        { platform: 'pinterest', url: '#' },
                        { platform: 'facebook', url: '#' },
                        { platform: 'twitter', url: '#' },
                      ],
                    },
                  },
                ],
              },
            ],
          },

          // Gold divider
          {
            id: 'elegant_footer_divider',
            type: 'divider',
            props: {},
            style: {
              backgroundColor: '#B8860B',
              maxWidth: '100%',
              margin: '2rem auto 1.5rem auto',
              customCss: 'height: 1px; opacity: 0.4;',
            },
          },

          // Copyright — centered, serif
          {
            id: 'elegant_footer_copyright',
            type: 'text',
            props: {
              tag: 'p',
              content: {
                en: '\u00a9 2026 Maison \u00c9l\u00e9gante. All rights reserved. Crafted with distinction.',
                tr: '\u00a9 2026 Maison \u00c9l\u00e9gante. T\u00fcm haklar\u0131 sakl\u0131d\u0131r. \u00d6zenle tasarland\u0131.',
                de: '\u00a9 2026 Maison \u00c9l\u00e9gante. Alle Rechte vorbehalten. Mit Auszeichnung gefertigt.',
                fr: '\u00a9 2026 Maison \u00c9l\u00e9gante. Tous droits r\u00e9serv\u00e9s. Confectionn\u00e9 avec distinction.',
                es: '\u00a9 2026 Maison \u00c9l\u00e9gante. Todos los derechos reservados. Creado con distinci\u00f3n.',
              },
            },
            style: {
              textAlign: 'center',
              textColor: '#78716C',
              padding: '0.5rem 0',
              customCss: 'font-family: "Cormorant Garamond", serif; font-size: 0.85rem; letter-spacing: 1px;',
            },
          },
        ],
      },
    ],
  },
};
