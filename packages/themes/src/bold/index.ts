import type { ThemeBundle } from '../types.js';

export const boldBundle: ThemeBundle = {
  manifest: {
    id: 'bold',
    name: 'Bold',
    description: 'High-energy Nike/Figma style theme with vibrant gradients and strong visual impact',
    sector: 'genel',
    category: 'universal',
    colorPalette: ['#7C3AED', '#6B7280', '#F59E0B', '#FFFFFF', '#111827'],
    config: {
      primary: '#7C3AED',
      secondary: '#6B7280',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#111827',
      muted: '#F3F4F6',
      border: '#E5E7EB',
      fonts: { heading: 'Sora', body: 'Inter' },
      borderRadius: 'xl',
      layout: {
        headerStyle: 'standard',
        productGridColumns: 3,
        footerColumns: 2,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero Banner', type: 'hero' },
      { id: 'ticker', name: 'Trend Ticker', type: 'custom', component: 'html' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'static-products', name: 'Static Product Cards', type: 'custom', component: 'columns' },
      { id: 'features', name: 'Feature Cards', type: 'custom', component: 'columns' },
      { id: 'banner', name: 'Flash Sale Banner', type: 'banner' },
      { id: 'categories', name: 'Categories Grid', type: 'categories-grid' },
      { id: 'reviews', name: 'Customer Reviews', type: 'custom', component: 'html' },
    ],
  },

  homePage: {
    version: 1,
    blocks: [
      // 1. Hero — Vibrant gradient background
      {
        id: 'bold_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'Make a Statement',
            tr: 'Fark Yaratin',
            de: 'Setzen Sie ein Zeichen',
            fr: 'Faites sensation',
            es: 'Haz una declaracion',
          },
          subtitle: {
            en: 'Bold products for those who refuse to blend in',
            tr: 'Siraданliga karsi duranlar icin cesur urunler',
            de: 'Mutige Produkte fuer alle, die auffallen wollen',
            fr: 'Des produits audacieux pour ceux qui refusent la banalite',
            es: 'Productos atrevidos para quienes se niegan a pasar desapercibidos',
          },
          buttonText: {
            en: 'Shop Now',
            tr: 'Alisverise Basla',
            de: 'Jetzt einkaufen',
            fr: 'Acheter maintenant',
            es: 'Comprar ahora',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
          overlayOpacity: 0.3,
          secondaryButtonText: {
            en: 'Explore Collections',
            tr: 'Koleksiyonlari Kesfet',
            de: 'Kollektionen entdecken',
            fr: 'Explorer les collections',
            es: 'Explorar colecciones',
          },
          secondaryButtonLink: '/pages/categories',
        },
        style: {
          backgroundColor: '#7C3AED',
          textColor: '#FFFFFF',
          padding: '6rem 2rem',
          customCss: 'background:linear-gradient(135deg,#7C3AED 0%,#5B21B6 50%,#F59E0B 100%);',
        },
      },

      // 2. HTML — Trend Ticker horizontal band
      {
        id: 'bold_home_ticker',
        type: 'html',
        props: {
          content: {
            en: '<div style="background:#7C3AED;color:white;padding:0.75rem 0;text-align:center;font-size:0.85rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;overflow:hidden;white-space:nowrap;">\uD83D\uDD25 TRENDING NOW &nbsp;\u2022&nbsp; FREE SHIPPING &nbsp;\u2022&nbsp; NEW ARRIVALS &nbsp;\u2022&nbsp; BEST SELLERS &nbsp;\u2022&nbsp; TRENDING NOW &nbsp;\u2022&nbsp; FREE SHIPPING &nbsp;\u2022&nbsp; NEW ARRIVALS &nbsp;\u2022&nbsp; BEST SELLERS</div>',
            tr: '<div style="background:#7C3AED;color:white;padding:0.75rem 0;text-align:center;font-size:0.85rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;overflow:hidden;white-space:nowrap;">\uD83D\uDD25 TREND &nbsp;\u2022&nbsp; UCRETSIZ KARGO &nbsp;\u2022&nbsp; YENI GELENLER &nbsp;\u2022&nbsp; COK SATANLAR &nbsp;\u2022&nbsp; TREND &nbsp;\u2022&nbsp; UCRETSIZ KARGO &nbsp;\u2022&nbsp; YENI GELENLER &nbsp;\u2022&nbsp; COK SATANLAR</div>',
            de: '<div style="background:#7C3AED;color:white;padding:0.75rem 0;text-align:center;font-size:0.85rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;overflow:hidden;white-space:nowrap;">\uD83D\uDD25 IM TREND &nbsp;\u2022&nbsp; KOSTENLOSER VERSAND &nbsp;\u2022&nbsp; NEUHEITEN &nbsp;\u2022&nbsp; BESTSELLER &nbsp;\u2022&nbsp; IM TREND &nbsp;\u2022&nbsp; KOSTENLOSER VERSAND &nbsp;\u2022&nbsp; NEUHEITEN &nbsp;\u2022&nbsp; BESTSELLER</div>',
            fr: '<div style="background:#7C3AED;color:white;padding:0.75rem 0;text-align:center;font-size:0.85rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;overflow:hidden;white-space:nowrap;">\uD83D\uDD25 TENDANCE &nbsp;\u2022&nbsp; LIVRAISON GRATUITE &nbsp;\u2022&nbsp; NOUVEAUTES &nbsp;\u2022&nbsp; MEILLEURES VENTES &nbsp;\u2022&nbsp; TENDANCE &nbsp;\u2022&nbsp; LIVRAISON GRATUITE &nbsp;\u2022&nbsp; NOUVEAUTES &nbsp;\u2022&nbsp; MEILLEURES VENTES</div>',
            es: '<div style="background:#7C3AED;color:white;padding:0.75rem 0;text-align:center;font-size:0.85rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;overflow:hidden;white-space:nowrap;">\uD83D\uDD25 EN TENDENCIA &nbsp;\u2022&nbsp; ENVIO GRATIS &nbsp;\u2022&nbsp; NOVEDADES &nbsp;\u2022&nbsp; LOS MAS VENDIDOS &nbsp;\u2022&nbsp; EN TENDENCIA &nbsp;\u2022&nbsp; ENVIO GRATIS &nbsp;\u2022&nbsp; NOVEDADES &nbsp;\u2022&nbsp; LOS MAS VENDIDOS</div>',
          },
        },
      },

      // 3. Product Showcase — 6 products, 3 columns
      {
        id: 'bold_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'Hot Right Now',
            tr: 'Su An Trend',
            de: 'Gerade angesagt',
            fr: 'Tendances du moment',
            es: 'Lo mas popular ahora',
          },
          limit: 6,
          columns: 3,
        },
      },

      // 4. Columns(3) — Static product cards with colorful backgrounds
      {
        id: 'bold_home_static_products',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          padding: '3rem 2rem',
          maxWidth: '1200px',
        },
        children: [
          {
            id: 'bold_static_product_1',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#F3F4F6',
              borderRadius: '16px',
              padding: '1.5rem',
              customCss: 'overflow:hidden;',
            },
            children: [
              {
                id: 'bold_static_product_1_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
                  alt: {
                    en: 'Bold Runner Sneakers',
                    tr: 'Bold Runner Spor Ayakkabi',
                    de: 'Bold Runner Sneakers',
                    fr: 'Baskets Bold Runner',
                    es: 'Zapatillas Bold Runner',
                  },
                },
                style: {
                  borderRadius: '12px',
                },
              },
              {
                id: 'bold_static_product_1_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Bold Runner',
                    tr: 'Bold Runner',
                    de: 'Bold Runner',
                    fr: 'Bold Runner',
                    es: 'Bold Runner',
                  },
                },
                style: {
                  padding: '0.75rem 0 0.25rem 0',
                  textColor: '#111827',
                  customCss: 'font-family:Sora,sans-serif;font-weight:700;font-size:1.25rem;',
                },
              },
              {
                id: 'bold_static_product_1_price',
                type: 'text',
                props: {
                  tag: 'span',
                  content: {
                    en: '$159.99',
                    tr: '$159.99',
                    de: '$159.99',
                    fr: '$159.99',
                    es: '$159.99',
                  },
                },
                style: {
                  textColor: '#7C3AED',
                  customCss: 'font-family:Sora,sans-serif;font-weight:800;font-size:1.5rem;',
                },
              },
            ],
          },
          {
            id: 'bold_static_product_2',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#F3F4F6',
              borderRadius: '16px',
              padding: '1.5rem',
              customCss: 'overflow:hidden;',
            },
            children: [
              {
                id: 'bold_static_product_2_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
                  alt: {
                    en: 'Statement Watch',
                    tr: 'Statement Saat',
                    de: 'Statement Uhr',
                    fr: 'Montre Statement',
                    es: 'Reloj Statement',
                  },
                },
                style: {
                  borderRadius: '12px',
                },
              },
              {
                id: 'bold_static_product_2_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Statement Watch',
                    tr: 'Statement Saat',
                    de: 'Statement Uhr',
                    fr: 'Montre Statement',
                    es: 'Reloj Statement',
                  },
                },
                style: {
                  padding: '0.75rem 0 0.25rem 0',
                  textColor: '#111827',
                  customCss: 'font-family:Sora,sans-serif;font-weight:700;font-size:1.25rem;',
                },
              },
              {
                id: 'bold_static_product_2_price',
                type: 'text',
                props: {
                  tag: 'span',
                  content: {
                    en: '$299.99',
                    tr: '$299.99',
                    de: '$299.99',
                    fr: '$299.99',
                    es: '$299.99',
                  },
                },
                style: {
                  textColor: '#7C3AED',
                  customCss: 'font-family:Sora,sans-serif;font-weight:800;font-size:1.5rem;',
                },
              },
            ],
          },
          {
            id: 'bold_static_product_3',
            type: 'container',
            props: {},
            style: {
              backgroundColor: '#F3F4F6',
              borderRadius: '16px',
              padding: '1.5rem',
              customCss: 'overflow:hidden;',
            },
            children: [
              {
                id: 'bold_static_product_3_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
                  alt: {
                    en: 'Flex Shades Sunglasses',
                    tr: 'Flex Shades Gunes Gozlugu',
                    de: 'Flex Shades Sonnenbrille',
                    fr: 'Lunettes de soleil Flex Shades',
                    es: 'Gafas de sol Flex Shades',
                  },
                },
                style: {
                  borderRadius: '12px',
                },
              },
              {
                id: 'bold_static_product_3_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Flex Shades',
                    tr: 'Flex Shades',
                    de: 'Flex Shades',
                    fr: 'Flex Shades',
                    es: 'Flex Shades',
                  },
                },
                style: {
                  padding: '0.75rem 0 0.25rem 0',
                  textColor: '#111827',
                  customCss: 'font-family:Sora,sans-serif;font-weight:700;font-size:1.25rem;',
                },
              },
              {
                id: 'bold_static_product_3_price',
                type: 'text',
                props: {
                  tag: 'span',
                  content: {
                    en: '$89.99',
                    tr: '$89.99',
                    de: '$89.99',
                    fr: '$89.99',
                    es: '$89.99',
                  },
                },
                style: {
                  textColor: '#7C3AED',
                  customCss: 'font-family:Sora,sans-serif;font-weight:800;font-size:1.5rem;',
                },
              },
            ],
          },
        ],
      },

      // 5. Spacer
      {
        id: 'bold_home_spacer',
        type: 'spacer',
        props: { height: '1.5rem' },
      },

      // 6. Columns(3) — Feature cards with gradient backgrounds
      {
        id: 'bold_home_features',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: {
          padding: '0 2rem 3rem 2rem',
          maxWidth: '1200px',
        },
        children: [
          {
            id: 'bold_feature_card_1',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:linear-gradient(135deg,#7C3AED,#5B21B6);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#9889;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Fast Delivery</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">Get it in 24 hours</p></div>',
                tr: '<div style="background:linear-gradient(135deg,#7C3AED,#5B21B6);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#9889;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Hizli Teslimat</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">24 saat icinde elinizde</p></div>',
                de: '<div style="background:linear-gradient(135deg,#7C3AED,#5B21B6);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#9889;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Schnelle Lieferung</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">In 24 Stunden bei Ihnen</p></div>',
                fr: '<div style="background:linear-gradient(135deg,#7C3AED,#5B21B6);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#9889;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Livraison rapide</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">Recevez-le en 24 heures</p></div>',
                es: '<div style="background:linear-gradient(135deg,#7C3AED,#5B21B6);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#9889;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Entrega rapida</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">Recibelo en 24 horas</p></div>',
              },
            },
          },
          {
            id: 'bold_feature_card_2',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#8617;&#65039;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Easy Returns</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">30-day hassle-free</p></div>',
                tr: '<div style="background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#8617;&#65039;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Kolay Iade</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">30 gun sorunsuz iade</p></div>',
                de: '<div style="background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#8617;&#65039;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Einfache Retouren</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">30 Tage problemlos</p></div>',
                fr: '<div style="background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#8617;&#65039;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Retours faciles</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">30 jours sans tracas</p></div>',
                es: '<div style="background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#8617;&#65039;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Devoluciones faciles</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">30 dias sin complicaciones</p></div>',
              },
            },
          },
          {
            id: 'bold_feature_card_3',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:linear-gradient(135deg,#EC4899,#BE185D);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#127873;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Rewards</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">Earn points on every purchase</p></div>',
                tr: '<div style="background:linear-gradient(135deg,#EC4899,#BE185D);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#127873;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Oduller</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">Her alisveriste puan kazanin</p></div>',
                de: '<div style="background:linear-gradient(135deg,#EC4899,#BE185D);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#127873;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Belohnungen</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">Sammeln Sie Punkte bei jedem Einkauf</p></div>',
                fr: '<div style="background:linear-gradient(135deg,#EC4899,#BE185D);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#127873;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Recompenses</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">Gagnez des points a chaque achat</p></div>',
                es: '<div style="background:linear-gradient(135deg,#EC4899,#BE185D);border-radius:16px;padding:2rem;color:white;text-align:center;"><div style="font-size:2.5rem;margin-bottom:0.75rem;">&#127873;</div><h3 style="font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;margin:0 0 0.5rem 0;">Recompensas</h3><p style="margin:0;opacity:0.9;font-size:0.95rem;">Gana puntos en cada compra</p></div>',
              },
            },
          },
        ],
      },

      // 7. Triple Banner — Flash Sale, New Arrivals, Rewards
      {
        id: 'bold_home_triple_banner',
        type: 'columns',
        props: { columns: 3, gap: '1rem' },
        style: { padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' },
        children: [
          {
            id: 'bold_banner_1',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,58,237,0.85),rgba(124,58,237,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">⚡</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">FLASH SALE</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Up to 60% off selected items</p></div></div>',
                tr: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,58,237,0.85),rgba(124,58,237,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">⚡</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">FLAS INDIRIM</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Secili urunlerde %60 a varan indirim</p></div></div>',
                de: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,58,237,0.85),rgba(124,58,237,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">⚡</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">FLASH SALE</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Bis zu 60% Rabatt auf ausgewaehlte Artikel</p></div></div>',
                fr: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,58,237,0.85),rgba(124,58,237,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">⚡</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">VENTE FLASH</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Jusqu a 60% de reduction sur une selection</p></div></div>',
                es: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,58,237,0.85),rgba(124,58,237,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">⚡</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">OFERTA RELAMPAGO</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Hasta 60% de descuento en articulos seleccionados</p></div></div>',
              },
            },
          },
          {
            id: 'bold_banner_2',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(245,158,11,0.85),rgba(245,158,11,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🆕</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">NEW ARRIVALS</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Be the first to shop new drops</p></div></div>',
                tr: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(245,158,11,0.85),rgba(245,158,11,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🆕</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">YENI GELENLER</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Yeni urunleri ilk siz kesfet</p></div></div>',
                de: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(245,158,11,0.85),rgba(245,158,11,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🆕</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">NEUHEITEN</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Entdecken Sie neue Produkte zuerst</p></div></div>',
                fr: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(245,158,11,0.85),rgba(245,158,11,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🆕</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">NOUVEAUTES</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Decouvrez les nouveaux produits en premier</p></div></div>',
                es: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(245,158,11,0.85),rgba(245,158,11,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🆕</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">NOVEDADES</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Se el primero en comprar lo nuevo</p></div></div>',
              },
            },
          },
          {
            id: 'bold_banner_3',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(236,72,153,0.85),rgba(236,72,153,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🎁</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">REWARDS</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Earn points on every purchase</p></div></div>',
                tr: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(236,72,153,0.85),rgba(236,72,153,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🎁</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">ODULLER</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Her aliverisde puan kazan</p></div></div>',
                de: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(236,72,153,0.85),rgba(236,72,153,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🎁</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">PRAEMIEN</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Sammeln Sie Punkte bei jedem Einkauf</p></div></div>',
                fr: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(236,72,153,0.85),rgba(236,72,153,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🎁</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">RECOMPENSES</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Gagnez des points a chaque achat</p></div></div>',
                es: '<div style="position:relative;height:240px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(236,72,153,0.85),rgba(236,72,153,0.4))"></div><div style="position:relative;padding:2rem;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%"><span style="font-size:2rem;margin-bottom:0.25rem">🎁</span><h3 style="margin:0 0 0.25rem;font-size:1.3rem;font-weight:800">RECOMPENSAS</h3><p style="margin:0;opacity:0.9;font-size:0.85rem">Gana puntos en cada compra</p></div></div>',
              },
            },
          },
        ],
      },

      // 8. Category Showcase — 4 categories, 4 columns
      {
        id: 'bold_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Explore Categories',
            tr: 'Kategorileri Kesfet',
            de: 'Kategorien entdecken',
            fr: 'Explorer les categories',
            es: 'Explorar categorias',
          },
          limit: 4,
          columns: 4,
        },
      },

      // 9. Columns(4) — Static bold category cards with vibrant colors
      {
        id: 'bold_home_static_categories',
        type: 'columns',
        props: { columns: 4, gap: '1.5rem' },
        style: {
          padding: '0 2rem 3rem 2rem',
          maxWidth: '1200px',
        },
        children: [
          {
            id: 'bold_cat_sneakers',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:#7C3AED;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Sneakers</h3></div>',
                tr: '<div style="background:#7C3AED;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Spor Ayakkabi</h3></div>',
                de: '<div style="background:#7C3AED;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Sneakers</h3></div>',
                fr: '<div style="background:#7C3AED;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Baskets</h3></div>',
                es: '<div style="background:#7C3AED;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Zapatillas</h3></div>',
              },
            },
          },
          {
            id: 'bold_cat_accessories',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:#F59E0B;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Accessories</h3></div>',
                tr: '<div style="background:#F59E0B;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Aksesuarlar</h3></div>',
                de: '<div style="background:#F59E0B;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Accessoires</h3></div>',
                fr: '<div style="background:#F59E0B;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Accessoires</h3></div>',
                es: '<div style="background:#F59E0B;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Accesorios</h3></div>',
              },
            },
          },
          {
            id: 'bold_cat_streetwear',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:#EC4899;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Streetwear</h3></div>',
                tr: '<div style="background:#EC4899;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Sokak Modasi</h3></div>',
                de: '<div style="background:#EC4899;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Streetwear</h3></div>',
                fr: '<div style="background:#EC4899;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Streetwear</h3></div>',
                es: '<div style="background:#EC4899;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Streetwear</h3></div>',
              },
            },
          },
          {
            id: 'bold_cat_sports',
            type: 'html',
            props: {
              content: {
                en: '<div style="background:#10B981;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Sports</h3></div>',
                tr: '<div style="background:#10B981;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Spor</h3></div>',
                de: '<div style="background:#10B981;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Sport</h3></div>',
                fr: '<div style="background:#10B981;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Sports</h3></div>',
                es: '<div style="background:#10B981;border-radius:16px;height:200px;display:flex;align-items:center;justify-content:center;color:white;"><h3 style="font-family:Sora,sans-serif;font-size:1.5rem;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:2px;">Deportes</h3></div>',
              },
            },
          },
        ],
      },

      // 10. HTML — Customer Reviews testimonial grid
      {
        id: 'bold_home_reviews',
        type: 'html',
        props: {
          content: {
            en: '<div style="padding:3rem 2rem;max-width:1200px;margin:0 auto;">' +
              '<h2 style="font-family:Sora,sans-serif;font-size:2rem;font-weight:800;text-align:center;margin:0 0 2rem 0;color:#111827;">What Our Customers Say</h2>' +
              '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Absolutely love the quality. These sneakers are next level!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#7C3AED;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">AK</div><span style="font-weight:600;color:#111827;">Alex K.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Fast shipping and the packaging was incredible. Will buy again!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#F59E0B;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">SM</div><span style="font-weight:600;color:#111827;">Sara M.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"The bold designs are exactly what I was looking for. 10/10!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#EC4899;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">JR</div><span style="font-weight:600;color:#111827;">Jamie R.</span></div>' +
              '</div>' +
              '</div></div>',
            tr: '<div style="padding:3rem 2rem;max-width:1200px;margin:0 auto;">' +
              '<h2 style="font-family:Sora,sans-serif;font-size:2rem;font-weight:800;text-align:center;margin:0 0 2rem 0;color:#111827;">Musterilerimiz Ne Diyor</h2>' +
              '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Kaliteye bayildim. Bu spor ayakkabilar baska bir seviye!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#7C3AED;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">AK</div><span style="font-weight:600;color:#111827;">Ayse K.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Hizli kargo ve paketleme muhtesemdi. Tekrar alacagim!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#F59E0B;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">SM</div><span style="font-weight:600;color:#111827;">Selin M.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Cesur tasarimlar tam aradimid seydi. 10 uzerinden 10!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#EC4899;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">JR</div><span style="font-weight:600;color:#111827;">Jale R.</span></div>' +
              '</div>' +
              '</div></div>',
            de: '<div style="padding:3rem 2rem;max-width:1200px;margin:0 auto;">' +
              '<h2 style="font-family:Sora,sans-serif;font-size:2rem;font-weight:800;text-align:center;margin:0 0 2rem 0;color:#111827;">Was unsere Kunden sagen</h2>' +
              '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Ich liebe die Qualitaet. Diese Sneakers sind naechstes Level!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#7C3AED;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">AK</div><span style="font-weight:600;color:#111827;">Anna K.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Schneller Versand und die Verpackung war unglaublich. Kaufe wieder!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#F59E0B;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">SM</div><span style="font-weight:600;color:#111827;">Stefan M.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Die mutigen Designs sind genau das, was ich gesucht habe. 10/10!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#EC4899;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">JR</div><span style="font-weight:600;color:#111827;">Julia R.</span></div>' +
              '</div>' +
              '</div></div>',
            fr: '<div style="padding:3rem 2rem;max-width:1200px;margin:0 auto;">' +
              '<h2 style="font-family:Sora,sans-serif;font-size:2rem;font-weight:800;text-align:center;margin:0 0 2rem 0;color:#111827;">Ce que disent nos clients</h2>' +
              '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"J\'adore la qualite. Ces baskets sont d\'un autre niveau !"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#7C3AED;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">AK</div><span style="font-weight:600;color:#111827;">Amelie K.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Livraison rapide et l\'emballage etait incroyable. J\'acheterai a nouveau !"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#F59E0B;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">SM</div><span style="font-weight:600;color:#111827;">Sophie M.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Les designs audacieux sont exactement ce que je cherchais. 10/10 !"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#EC4899;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">JR</div><span style="font-weight:600;color:#111827;">Jules R.</span></div>' +
              '</div>' +
              '</div></div>',
            es: '<div style="padding:3rem 2rem;max-width:1200px;margin:0 auto;">' +
              '<h2 style="font-family:Sora,sans-serif;font-size:2rem;font-weight:800;text-align:center;margin:0 0 2rem 0;color:#111827;">Lo que dicen nuestros clientes</h2>' +
              '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Me encanta la calidad. Estas zapatillas son de otro nivel!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#7C3AED;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">AK</div><span style="font-weight:600;color:#111827;">Andrea K.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Envio rapido y el empaque fue increible. Comprare de nuevo!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#F59E0B;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">SM</div><span style="font-weight:600;color:#111827;">Sofia M.</span></div>' +
              '</div>' +
              '<div style="background:white;border:1px solid #E5E7EB;border-radius:16px;padding:1.5rem;">' +
              '<div style="color:#F59E0B;font-size:1.25rem;margin-bottom:0.75rem;">\u2605\u2605\u2605\u2605\u2605</div>' +
              '<p style="color:#374151;font-size:0.95rem;line-height:1.6;margin:0 0 1rem 0;">"Los disenos atrevidos son exactamente lo que buscaba. 10/10!"</p>' +
              '<div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;border-radius:50%;background:#EC4899;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">JR</div><span style="font-weight:600;color:#111827;">Javier R.</span></div>' +
              '</div>' +
              '</div></div>',
          },
        },
      },

      // 11. Newsletter — Join the Movement
      {
        id: 'bold_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'Join the Movement',
            tr: 'Harekete Katilin',
            de: 'Werden Sie Teil der Bewegung',
            fr: 'Rejoignez le mouvement',
            es: 'Unase al movimiento',
          },
          description: {
            en: 'Get exclusive drops, early access, and bold offers straight to your inbox',
            tr: 'Ozel firsatlar, erken erisim ve cesur teklifler dogrudan gelen kutunuza',
            de: 'Erhalten Sie exklusive Angebote, fruehen Zugang und mutige Deals direkt in Ihren Posteingang',
            fr: 'Recevez des offres exclusives, un acces anticipe et des deals audacieux directement dans votre boite',
            es: 'Reciba ofertas exclusivas, acceso anticipado y descuentos atrevidos directo en su bandeja',
          },
        },
        style: {
          backgroundColor: '#7C3AED',
          textColor: '#FFFFFF',
          padding: '4rem 2rem',
        },
      },
    ],
  },

  header: {
    version: 1,
    blocks: [
      {
        id: 'bold_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'BOLD',
            tr: 'BOLD',
            de: 'BOLD',
            fr: 'BOLD',
            es: 'BOLD',
          },
          logoUrl: '',
        },
      },
      {
        id: 'bold_header_nav',
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
              label: { en: 'New', tr: 'Yeni', de: 'Neu', fr: 'Nouveau', es: 'Nuevo' },
              link: '/pages/new-arrivals',
            },
            {
              label: { en: 'Sale', tr: 'Indirim', de: 'Sale', fr: 'Soldes', es: 'Ofertas' },
              link: '/pages/sale',
            },
            {
              label: { en: 'About', tr: 'Hakkimizda', de: 'Ueber uns', fr: 'A propos', es: 'Sobre nosotros' },
              link: '/pages/about',
            },
          ],
        },
      },
      {
        id: 'bold_header_search',
        type: 'search-bar',
        props: {
          placeholder: {
            en: 'Search products...',
            tr: 'Urun ara...',
            de: 'Produkte suchen...',
            fr: 'Rechercher des produits...',
            es: 'Buscar productos...',
          },
        },
      },
      {
        id: 'bold_header_cart',
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
      // Upper section: 2 columns — links + newsletter description
      {
        id: 'bold_footer_upper',
        type: 'columns',
        props: { columns: 2, gap: '3rem' },
        style: {
          backgroundColor: '#111827',
          textColor: '#FFFFFF',
          padding: '3rem 2rem',
        },
        children: [
          {
            id: 'bold_footer_links_col',
            type: 'container',
            props: {},
            children: [
              {
                id: 'bold_footer_links_list',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Shop</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/shop" style="color:#D1D5DB;text-decoration:none;">Shop</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#D1D5DB;text-decoration:none;">New Arrivals</a></li>' +
                      '<li><a href="/pages/sale" style="color:#D1D5DB;text-decoration:none;">Sale</a></li>' +
                      '<li><a href="/pages/gift-cards" style="color:#D1D5DB;text-decoration:none;">Gift Cards</a></li>' +
                      '<li><a href="/pages/about" style="color:#D1D5DB;text-decoration:none;">About</a></li></ul>',
                    tr: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Magaza</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/shop" style="color:#D1D5DB;text-decoration:none;">Magaza</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#D1D5DB;text-decoration:none;">Yeni Gelenler</a></li>' +
                      '<li><a href="/pages/sale" style="color:#D1D5DB;text-decoration:none;">Indirim</a></li>' +
                      '<li><a href="/pages/gift-cards" style="color:#D1D5DB;text-decoration:none;">Hediye Kartlari</a></li>' +
                      '<li><a href="/pages/about" style="color:#D1D5DB;text-decoration:none;">Hakkimizda</a></li></ul>',
                    de: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Shop</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/shop" style="color:#D1D5DB;text-decoration:none;">Shop</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#D1D5DB;text-decoration:none;">Neuheiten</a></li>' +
                      '<li><a href="/pages/sale" style="color:#D1D5DB;text-decoration:none;">Sale</a></li>' +
                      '<li><a href="/pages/gift-cards" style="color:#D1D5DB;text-decoration:none;">Geschenkkarten</a></li>' +
                      '<li><a href="/pages/about" style="color:#D1D5DB;text-decoration:none;">Ueber uns</a></li></ul>',
                    fr: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Boutique</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/shop" style="color:#D1D5DB;text-decoration:none;">Boutique</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#D1D5DB;text-decoration:none;">Nouveautes</a></li>' +
                      '<li><a href="/pages/sale" style="color:#D1D5DB;text-decoration:none;">Soldes</a></li>' +
                      '<li><a href="/pages/gift-cards" style="color:#D1D5DB;text-decoration:none;">Cartes cadeaux</a></li>' +
                      '<li><a href="/pages/about" style="color:#D1D5DB;text-decoration:none;">A propos</a></li></ul>',
                    es: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Tienda</h4>' +
                      '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">' +
                      '<li><a href="/pages/shop" style="color:#D1D5DB;text-decoration:none;">Tienda</a></li>' +
                      '<li><a href="/pages/new-arrivals" style="color:#D1D5DB;text-decoration:none;">Novedades</a></li>' +
                      '<li><a href="/pages/sale" style="color:#D1D5DB;text-decoration:none;">Ofertas</a></li>' +
                      '<li><a href="/pages/gift-cards" style="color:#D1D5DB;text-decoration:none;">Tarjetas regalo</a></li>' +
                      '<li><a href="/pages/about" style="color:#D1D5DB;text-decoration:none;">Sobre nosotros</a></li></ul>',
                  },
                },
              },
            ],
          },
          {
            id: 'bold_footer_newsletter_col',
            type: 'container',
            props: {},
            children: [
              {
                id: 'bold_footer_newsletter_desc',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Stay Bold</h4>' +
                      '<p style="color:#D1D5DB;line-height:1.6;margin:0;">Subscribe to our newsletter for exclusive drops, early access to new collections, and bold offers you won\'t find anywhere else. No spam, just the good stuff.</p>',
                    tr: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Cesur Kalin</h4>' +
                      '<p style="color:#D1D5DB;line-height:1.6;margin:0;">Ozel firsatlar, yeni koleksiyonlara erken erisim ve baska yerde bulamayacaginiz teklifler icin bultenimize abone olun. Spam yok, sadece iyi seyler.</p>',
                    de: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Bleiben Sie mutig</h4>' +
                      '<p style="color:#D1D5DB;line-height:1.6;margin:0;">Abonnieren Sie unseren Newsletter fuer exklusive Angebote, fruehen Zugang zu neuen Kollektionen und mutige Deals, die Sie nirgendwo anders finden. Kein Spam, nur das Gute.</p>',
                    fr: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Restez audacieux</h4>' +
                      '<p style="color:#D1D5DB;line-height:1.6;margin:0;">Abonnez-vous a notre newsletter pour des offres exclusives, un acces anticipe aux nouvelles collections et des deals audacieux introuvables ailleurs. Pas de spam, que du bon.</p>',
                    es: '<h4 style="font-family:Sora,sans-serif;font-size:1.1rem;font-weight:700;margin:0 0 1rem 0;color:white;">Mantengase audaz</h4>' +
                      '<p style="color:#D1D5DB;line-height:1.6;margin:0;">Suscribase a nuestro boletin para ofertas exclusivas, acceso anticipado a nuevas colecciones y descuentos atrevidos que no encontrara en otro lugar. Sin spam, solo lo bueno.</p>',
                  },
                },
              },
            ],
          },
        ],
      },

      // Lower section: 2 columns — social text + copyright
      {
        id: 'bold_footer_lower',
        type: 'columns',
        props: { columns: 2, gap: '2rem' },
        style: {
          backgroundColor: '#111827',
          textColor: '#FFFFFF',
          padding: '0 2rem 2rem 2rem',
          customCss: 'border-top:1px solid #374151;padding-top:1.5rem;',
        },
        children: [
          {
            id: 'bold_footer_social_text',
            type: 'text',
            props: {
              tag: 'div',
              content: {
                en: '<div style="display:flex;gap:1.5rem;font-family:Sora,sans-serif;font-size:0.9rem;font-weight:600;">' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Instagram</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">TikTok</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Twitter</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">YouTube</a></div>',
                tr: '<div style="display:flex;gap:1.5rem;font-family:Sora,sans-serif;font-size:0.9rem;font-weight:600;">' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Instagram</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">TikTok</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Twitter</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">YouTube</a></div>',
                de: '<div style="display:flex;gap:1.5rem;font-family:Sora,sans-serif;font-size:0.9rem;font-weight:600;">' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Instagram</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">TikTok</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Twitter</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">YouTube</a></div>',
                fr: '<div style="display:flex;gap:1.5rem;font-family:Sora,sans-serif;font-size:0.9rem;font-weight:600;">' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Instagram</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">TikTok</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Twitter</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">YouTube</a></div>',
                es: '<div style="display:flex;gap:1.5rem;font-family:Sora,sans-serif;font-size:0.9rem;font-weight:600;">' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Instagram</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">TikTok</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">Twitter</a>' +
                  '<a href="#" style="color:#D1D5DB;text-decoration:none;">YouTube</a></div>',
              },
            },
          },
          {
            id: 'bold_footer_copyright',
            type: 'text',
            props: {
              tag: 'p',
              content: {
                en: '\u00a9 2026 BOLD. All rights reserved.',
                tr: '\u00a9 2026 BOLD. Tum haklari saklidir.',
                de: '\u00a9 2026 BOLD. Alle Rechte vorbehalten.',
                fr: '\u00a9 2026 BOLD. Tous droits reserves.',
                es: '\u00a9 2026 BOLD. Todos los derechos reservados.',
              },
            },
            style: {
              textAlign: 'right',
            },
          },
        ],
      },

      // Social links component
      {
        id: 'bold_footer_social',
        type: 'social-links',
        props: {
          links: [
            { platform: 'instagram', url: '#' },
            { platform: 'tiktok', url: '#' },
            { platform: 'twitter', url: '#' },
            { platform: 'youtube', url: '#' },
          ],
        },
        style: {
          backgroundColor: '#111827',
          padding: '0 2rem 2rem 2rem',
        },
      },
    ],
  },
};
