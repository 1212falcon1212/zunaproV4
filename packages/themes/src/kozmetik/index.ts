import type { ThemeBundle } from '../types.js';

export const kozmetikBundle: ThemeBundle = {
  manifest: {
    id: 'kozmetik',
    name: 'Kozmetik',
    description: 'Soft, elegant beauty and cosmetics theme with pastel pink accents and rounded elements',
    sector: 'kozmetik',
    category: 'sector',
    colorPalette: ['#EC4899', '#9CA3AF', '#F472B6', '#FFF5F7', '#1F2937'],
    config: {
      primary: '#EC4899',
      secondary: '#9CA3AF',
      accent: '#F472B6',
      background: '#FFF5F7',
      foreground: '#1F2937',
      muted: '#FDF2F8',
      border: '#FBCFE8',
      fonts: { heading: 'Poppins', body: 'Inter' },
      borderRadius: 'xl',
      layout: {
        headerStyle: 'centered',
        productGridColumns: 4,
        footerColumns: 3,
      },
    },
    sections: [
      { id: 'hero', name: 'Hero Banner', type: 'hero' },
      { id: 'bestsellers', name: 'Bestsellers', type: 'custom', component: 'bestseller-grid' },
      { id: 'featured', name: 'Featured Products', type: 'featured-products' },
      { id: 'ingredients', name: 'Ingredient Spotlight', type: 'custom', component: 'ingredient-cards' },
      { id: 'categories', name: 'Categories', type: 'categories-grid' },
      { id: 'banner', name: 'Banner', type: 'banner' },
      { id: 'skin-quiz', name: 'Skin Quiz CTA', type: 'custom', component: 'skin-quiz-cta' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Home Page — 11 blocks
  // ---------------------------------------------------------------------------
  homePage: {
    version: 1,
    blocks: [
      // 1. Hero
      {
        id: 'kozmetik_home_hero',
        type: 'hero',
        props: {
          title: {
            en: 'Reveal Your Natural Beauty',
            tr: 'Dogal Guzelliginizi Ortaya Cikarin',
            de: 'Enthuellen Sie Ihre natuerliche Schoenheit',
            fr: 'Revelez votre beaute naturelle',
            es: 'Revela tu belleza natural',
          },
          subtitle: {
            en: 'Clean beauty, real results. Science meets nature.',
            tr: 'Temiz guzellik, gercek sonuclar. Bilim dogayla bulusuyor.',
            de: 'Reine Schoenheit, echte Ergebnisse. Wissenschaft trifft Natur.',
            fr: 'Beaute propre, vrais resultats. La science rencontre la nature.',
            es: 'Belleza limpia, resultados reales. La ciencia se encuentra con la naturaleza.',
          },
          buttonText: {
            en: 'Shop Bestsellers',
            tr: 'Cok Satanlari Kesfet',
            de: 'Bestseller entdecken',
            fr: 'Decouvrir les best-sellers',
            es: 'Descubrir los mas vendidos',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=80',
          overlayOpacity: 0.3,
          secondaryButtonText: {
            en: 'Take the Skin Quiz',
            tr: 'Cilt Testini Yap',
            de: 'Hauttest machen',
            fr: 'Faire le test de peau',
            es: 'Hacer el test de piel',
          },
          secondaryButtonLink: '/pages/skin-quiz',
        },
        style: {
          backgroundColor: '#831843',
          textColor: '#FFF5F7',
          padding: '5rem 2rem',
        },
      },

      // 2. STATIC: Bestseller product cards with round images
      {
        id: 'kozmetik_home_bestsellers_section',
        type: 'text',
        props: {
          tag: 'h2',
          content: {
            en: 'Bestsellers',
            tr: 'Cok Satanlar',
            de: 'Bestseller',
            fr: 'Meilleures ventes',
            es: 'Los mas vendidos',
          },
        },
        style: { textAlign: 'center', padding: '3rem 0 1rem 0' },
      },
      {
        id: 'kozmetik_home_bestsellers_grid',
        type: 'columns',
        props: { columns: 4, gap: '1.5rem' },
        style: { padding: '0 2rem 2rem 2rem', maxWidth: '1200px', margin: '0 auto' },
        children: [
          {
            id: 'kozmetik_bs_1',
            type: 'container',
            props: {},
            style: { textAlign: 'center', padding: '1.5rem' },
            children: [
              {
                id: 'kozmetik_bs_1_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
                  alt: { en: 'Glow Serum', tr: 'Isiltili Serum', de: 'Glow Serum', fr: 'Serum eclat', es: 'Serum luminoso' },
                },
                style: { borderRadius: '50%', maxWidth: '180px', margin: '0 auto' },
              },
              {
                id: 'kozmetik_bs_1_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Glow Serum',
                    tr: 'Isiltili Serum',
                    de: 'Glow Serum',
                    fr: 'Serum Eclat',
                    es: 'Serum Luminoso',
                  },
                },
                style: { padding: '0.75rem 0 0 0' },
              },
              {
                id: 'kozmetik_bs_1_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: { en: '★★★★★ $59.99', tr: '★★★★★ $59.99', de: '★★★★★ $59.99', fr: '★★★★★ 59,99 $', es: '★★★★★ $59.99' },
                },
                style: { textColor: '#EC4899' },
              },
            ],
          },
          {
            id: 'kozmetik_bs_2',
            type: 'container',
            props: {},
            style: { textAlign: 'center', padding: '1.5rem' },
            children: [
              {
                id: 'kozmetik_bs_2_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
                  alt: { en: 'Hydra Cream', tr: 'Nemlendirici Krem', de: 'Hydra Creme', fr: 'Creme Hydra', es: 'Crema Hidratante' },
                },
                style: { borderRadius: '50%', maxWidth: '180px', margin: '0 auto' },
              },
              {
                id: 'kozmetik_bs_2_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Hydra Cream',
                    tr: 'Nemlendirici Krem',
                    de: 'Hydra Creme',
                    fr: 'Creme Hydra',
                    es: 'Crema Hidratante',
                  },
                },
                style: { padding: '0.75rem 0 0 0' },
              },
              {
                id: 'kozmetik_bs_2_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: { en: '★★★★☆ $45.99', tr: '★★★★☆ $45.99', de: '★★★★☆ $45.99', fr: '★★★★☆ 45,99 $', es: '★★★★☆ $45.99' },
                },
                style: { textColor: '#EC4899' },
              },
            ],
          },
          {
            id: 'kozmetik_bs_3',
            type: 'container',
            props: {},
            style: { textAlign: 'center', padding: '1.5rem' },
            children: [
              {
                id: 'kozmetik_bs_3_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
                  alt: { en: 'Velvet Lip', tr: 'Kadife Dudak', de: 'Samt-Lippenstift', fr: 'Levres Velours', es: 'Labios Terciopelo' },
                },
                style: { borderRadius: '50%', maxWidth: '180px', margin: '0 auto' },
              },
              {
                id: 'kozmetik_bs_3_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Velvet Lip',
                    tr: 'Kadife Dudak',
                    de: 'Samt-Lippenstift',
                    fr: 'Levres Velours',
                    es: 'Labios Terciopelo',
                  },
                },
                style: { padding: '0.75rem 0 0 0' },
              },
              {
                id: 'kozmetik_bs_3_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: { en: '★★★★★ $29.99', tr: '★★★★★ $29.99', de: '★★★★★ $29.99', fr: '★★★★★ 29,99 $', es: '★★★★★ $29.99' },
                },
                style: { textColor: '#EC4899' },
              },
            ],
          },
          {
            id: 'kozmetik_bs_4',
            type: 'container',
            props: {},
            style: { textAlign: 'center', padding: '1.5rem' },
            children: [
              {
                id: 'kozmetik_bs_4_img',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&q=80',
                  alt: { en: 'Eye Palette', tr: 'Goz Paleti', de: 'Augen-Palette', fr: 'Palette Yeux', es: 'Paleta de Ojos' },
                },
                style: { borderRadius: '50%', maxWidth: '180px', margin: '0 auto' },
              },
              {
                id: 'kozmetik_bs_4_name',
                type: 'text',
                props: {
                  tag: 'h3',
                  content: {
                    en: 'Eye Palette',
                    tr: 'Goz Paleti',
                    de: 'Augen-Palette',
                    fr: 'Palette Yeux',
                    es: 'Paleta de Ojos',
                  },
                },
                style: { padding: '0.75rem 0 0 0' },
              },
              {
                id: 'kozmetik_bs_4_price',
                type: 'text',
                props: {
                  tag: 'p',
                  content: { en: '★★★★☆ $49.99', tr: '★★★★☆ $49.99', de: '★★★★☆ $49.99', fr: '★★★★☆ 49,99 $', es: '★★★★☆ $49.99' },
                },
                style: { textColor: '#EC4899' },
              },
            ],
          },
        ],
      },

      // 3. Product showcase (production API)
      {
        id: 'kozmetik_home_products',
        type: 'product-showcase',
        props: {
          title: {
            en: 'New Arrivals',
            tr: 'Yeni Gelenler',
            de: 'Neuheiten',
            fr: 'Nouveautes',
            es: 'Novedades',
          },
          limit: 8,
          columns: 4,
        },
      },

      // 4. Spacer
      {
        id: 'kozmetik_home_spacer1',
        type: 'spacer',
        props: { height: '2rem' },
      },

      // 5. UNIQUE: Ingredient Spotlight
      {
        id: 'kozmetik_home_ingredients_title',
        type: 'text',
        props: {
          tag: 'h2',
          content: {
            en: 'Ingredient Spotlight',
            tr: 'Icindekiler Odagi',
            de: 'Inhaltsstoffe im Fokus',
            fr: 'Ingredients en vedette',
            es: 'Ingredientes destacados',
          },
        },
        style: { textAlign: 'center', padding: '2rem 0 1rem 0' },
      },
      {
        id: 'kozmetik_home_ingredients_grid',
        type: 'columns',
        props: { columns: 3, gap: '2rem' },
        style: { padding: '0 2rem 3rem 2rem', maxWidth: '1100px', margin: '0 auto' },
        children: [
          {
            id: 'kozmetik_ingr_1',
            type: 'html',
            props: {
              content: {
                en: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" alt="Hyaluronic Acid" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Hyaluronic Acid</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Deep hydration that plumps and smooths. Our star ingredient holds 1000x its weight in water.</p></div>',
                tr: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" alt="Hyaluronik Asit" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Hyaluronik Asit</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Cildi dolgunlastiran ve puruzsuklestiren derin nemlendirme. Yildiz icerdegimiz agirliginin 1000 katini su tutar.</p></div>',
                de: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" alt="Hyaluronsaeure" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Hyaluronsaeure</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Tiefgehende Feuchtigkeit, die aufpolstert und glaettet. Unser Star-Inhaltsstoff haelt das 1000-fache seines Gewichts an Wasser.</p></div>',
                fr: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" alt="Acide Hyaluronique" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Acide Hyaluronique</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Hydratation profonde qui repulpe et lisse. Notre ingredient star retient 1000 fois son poids en eau.</p></div>',
                es: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80" alt="Acido Hialuronico" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Acido Hialuronico</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Hidratacion profunda que rellena y suaviza. Nuestro ingrediente estrella retiene 1000 veces su peso en agua.</p></div>',
              },
            },
          },
          {
            id: 'kozmetik_ingr_2',
            type: 'html',
            props: {
              content: {
                en: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=400&q=80" alt="Vitamin C" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Vitamin C</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Brightens skin and fades dark spots. A powerful antioxidant for radiant, even-toned skin.</p></div>',
                tr: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=400&q=80" alt="C Vitamini" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">C Vitamini</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Cildi aydinlatir ve koyu lekeleri giderir. Isiltili ve esit tonlu bir cilt icin guclu bir antioksidan.</p></div>',
                de: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=400&q=80" alt="Vitamin C" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Vitamin C</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Hellt die Haut auf und reduziert dunkle Flecken. Ein starkes Antioxidans fuer strahlende, gleichmaessige Haut.</p></div>',
                fr: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=400&q=80" alt="Vitamine C" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Vitamine C</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Eclaircit la peau et estompe les taches sombres. Un puissant antioxydant pour une peau eclatante et uniforme.</p></div>',
                es: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=400&q=80" alt="Vitamina C" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Vitamina C</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Ilumina la piel y desvanece las manchas oscuras. Un potente antioxidante para una piel radiante y uniforme.</p></div>',
              },
            },
          },
          {
            id: 'kozmetik_ingr_3',
            type: 'html',
            props: {
              content: {
                en: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80" alt="Retinol" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Retinol</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">The gold standard for anti-aging. Boosts collagen, refines texture, and reduces fine lines.</p></div>',
                tr: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80" alt="Retinol" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Retinol</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Yaslanma karsiti altin standart. Kolajen uretimini arttirir, dokuyu iyilestirir ve ince cizgileri azaltir.</p></div>',
                de: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80" alt="Retinol" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Retinol</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Der Goldstandard der Anti-Aging-Pflege. Steigert Kollagen, verfeinert die Textur und reduziert feine Linien.</p></div>',
                fr: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80" alt="Retinol" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Retinol</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">Le standard de reference anti-age. Stimule le collagene, affine la texture et reduit les rides fines.</p></div>',
                es: '<div style="text-align:center;background:#FDF2F8;border-radius:16px;padding:2.5rem 1.5rem"><img src="https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80" alt="Retinol" loading="lazy" style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;display:block" /><h3 style="margin:0 0 0.5rem;font-size:1.2rem;color:#1F2937">Retinol</h3><p style="margin:0;color:#6B7280;font-size:0.9rem;line-height:1.5">El estandar de oro anti-envejecimiento. Estimula el colageno, refina la textura y reduce las lineas finas.</p></div>',
              },
            },
          },
        ],
      },

      // 6. Category showcase (production API)
      {
        id: 'kozmetik_home_categories',
        type: 'category-showcase',
        props: {
          title: {
            en: 'Shop by Category',
            tr: 'Kategorilere Goz At',
            de: 'Nach Kategorie einkaufen',
            fr: 'Acheter par categorie',
            es: 'Comprar por categoria',
          },
          limit: 6,
          columns: 3,
        },
      },

      // 7. STATIC: Beauty category cards with pastel overlay
      {
        id: 'kozmetik_home_cat_static',
        type: 'columns',
        props: { columns: 3, gap: '1.5rem' },
        style: { padding: '0 2rem 3rem 2rem', maxWidth: '1200px', margin: '0 auto' },
        children: [
          {
            id: 'kozmetik_cat_1',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Skincare</span></div></div>',
                tr: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Cilt Bakimi</span></div></div>',
                de: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Hautpflege</span></div></div>',
                fr: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Soins de la peau</span></div></div>',
                es: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Cuidado de la piel</span></div></div>',
              },
            },
          },
          {
            id: 'kozmetik_cat_2',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Makeup</span></div></div>',
                tr: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Makyaj</span></div></div>',
                de: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Make-up</span></div></div>',
                fr: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Maquillage</span></div></div>',
                es: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Maquillaje</span></div></div>',
              },
            },
          },
          {
            id: 'kozmetik_cat_3',
            type: 'html',
            props: {
              content: {
                en: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Haircare</span></div></div>',
                tr: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Sac Bakimi</span></div></div>',
                de: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Haarpflege</span></div></div>',
                fr: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Soins capillaires</span></div></div>',
                es: '<div style="position:relative;height:250px;border-radius:16px;overflow:hidden;background-image:url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80);background-size:cover;background-position:center"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(236,72,153,0.7),transparent);display:flex;align-items:flex-end;padding:1.5rem"><span style="color:#fff;font-size:1.3rem;font-weight:600">Cuidado del cabello</span></div></div>',
              },
            },
          },
        ],
      },

      // 8. Banner
      {
        id: 'kozmetik_home_banner',
        type: 'banner',
        props: {
          title: {
            en: 'Free gift with orders over $75',
            tr: '75$ ustu siparislerde ucretsiz hediye',
            de: 'Kostenloses Geschenk ab 75$',
            fr: 'Cadeau gratuit pour toute commande superieure a 75$',
            es: 'Regalo gratis en pedidos superiores a $75',
          },
          subtitle: {
            en: 'Treat yourself — you deserve it',
            tr: 'Kendinize iyilik yapin — hak ediyorsunuz',
            de: 'Goennen Sie sich etwas — Sie haben es verdient',
            fr: 'Faites-vous plaisir — vous le meritez',
            es: 'Date un capricho — te lo mereces',
          },
          buttonText: {
            en: 'Shop Now',
            tr: 'Alisverise Basla',
            de: 'Jetzt einkaufen',
            fr: 'Acheter maintenant',
            es: 'Comprar ahora',
          },
          buttonLink: '/pages/shop',
          backgroundImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80',
          height: '260px',
        },
        style: {
          textColor: '#ffffff',
        },
      },

      // 9. UNIQUE: Skin Quiz CTA
      {
        id: 'kozmetik_home_quiz',
        type: 'html',
        props: {
          content: {
            en: '<div style="background:linear-gradient(135deg,#FDF2F8,#FBCFE8);padding:4rem 2rem;text-align:center;border-radius:16px;margin:0 2rem"><h2 style="margin:0 0 1rem;font-size:2rem;color:#1F2937">Find Your Perfect Routine</h2><p style="margin:0 0 2rem;color:#6B7280;font-size:1.1rem;max-width:500px;margin-left:auto;margin-right:auto">Take our 2-minute skin quiz and get a personalized skincare routine tailored just for you.</p><div style="display:inline-block;background:#EC4899;color:white;padding:0.875rem 2.5rem;border-radius:50px;font-weight:600;font-size:1rem;cursor:pointer">Take the Quiz</div></div>',
            tr: '<div style="background:linear-gradient(135deg,#FDF2F8,#FBCFE8);padding:4rem 2rem;text-align:center;border-radius:16px;margin:0 2rem"><h2 style="margin:0 0 1rem;font-size:2rem;color:#1F2937">Mukemmel Rutininizi Bulun</h2><p style="margin:0 0 2rem;color:#6B7280;font-size:1.1rem;max-width:500px;margin-left:auto;margin-right:auto">2 dakikalik cilt testimizi yapin ve size ozel kisisellestirilmis bir cilt bakim rutini alin.</p><div style="display:inline-block;background:#EC4899;color:white;padding:0.875rem 2.5rem;border-radius:50px;font-weight:600;font-size:1rem;cursor:pointer">Testi Baslat</div></div>',
            de: '<div style="background:linear-gradient(135deg,#FDF2F8,#FBCFE8);padding:4rem 2rem;text-align:center;border-radius:16px;margin:0 2rem"><h2 style="margin:0 0 1rem;font-size:2rem;color:#1F2937">Finden Sie Ihre perfekte Routine</h2><p style="margin:0 0 2rem;color:#6B7280;font-size:1.1rem;max-width:500px;margin-left:auto;margin-right:auto">Machen Sie unser 2-Minuten-Hautquiz und erhalten Sie eine personalisierte Pflegeroutine.</p><div style="display:inline-block;background:#EC4899;color:white;padding:0.875rem 2.5rem;border-radius:50px;font-weight:600;font-size:1rem;cursor:pointer">Quiz starten</div></div>',
            fr: '<div style="background:linear-gradient(135deg,#FDF2F8,#FBCFE8);padding:4rem 2rem;text-align:center;border-radius:16px;margin:0 2rem"><h2 style="margin:0 0 1rem;font-size:2rem;color:#1F2937">Trouvez votre routine ideale</h2><p style="margin:0 0 2rem;color:#6B7280;font-size:1.1rem;max-width:500px;margin-left:auto;margin-right:auto">Faites notre quiz de 2 minutes et obtenez une routine de soins personnalisee.</p><div style="display:inline-block;background:#EC4899;color:white;padding:0.875rem 2.5rem;border-radius:50px;font-weight:600;font-size:1rem;cursor:pointer">Faire le quiz</div></div>',
            es: '<div style="background:linear-gradient(135deg,#FDF2F8,#FBCFE8);padding:4rem 2rem;text-align:center;border-radius:16px;margin:0 2rem"><h2 style="margin:0 0 1rem;font-size:2rem;color:#1F2937">Encuentra tu rutina perfecta</h2><p style="margin:0 0 2rem;color:#6B7280;font-size:1.1rem;max-width:500px;margin-left:auto;margin-right:auto">Realiza nuestro quiz de 2 minutos y obtiene una rutina de cuidado personalizada.</p><div style="display:inline-block;background:#EC4899;color:white;padding:0.875rem 2.5rem;border-radius:50px;font-weight:600;font-size:1rem;cursor:pointer">Hacer el quiz</div></div>',
          },
        },
        style: { padding: '2rem 0' },
      },

      // 10. Divider — dotted pink
      {
        id: 'kozmetik_home_divider',
        type: 'divider',
        props: {},
        style: {
          backgroundColor: 'transparent',
          maxWidth: '60%',
          margin: '1rem auto',
          customCss: 'border-top: 2px dotted #EC4899; height: 0;',
        },
      },

      // 11. Newsletter
      {
        id: 'kozmetik_home_newsletter',
        type: 'newsletter',
        props: {
          title: {
            en: 'Beauty Insider',
            tr: 'Guzellik Dunyasi',
            de: 'Beauty-Insider',
            fr: 'Initie Beaute',
            es: 'Insider de Belleza',
          },
          description: {
            en: 'Join our community for exclusive tips, early access, and member-only offers',
            tr: 'Ozel ipuclari, erken erisim ve sadece uyelere ozel firsatlar icin toplulugumuza katilin',
            de: 'Treten Sie unserer Community bei fuer exklusive Tipps, fruehen Zugang und Mitglieder-Angebote',
            fr: 'Rejoignez notre communaute pour des conseils exclusifs, un acces anticipe et des offres reservees aux membres',
            es: 'Unete a nuestra comunidad para consejos exclusivos, acceso anticipado y ofertas solo para miembros',
          },
        },
        style: {
          backgroundColor: '#FDF2F8',
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
        id: 'kozmetik_header_logo',
        type: 'logo',
        props: {
          storeName: {
            en: 'Glow Beauty',
            tr: 'Glow Guzellik',
            de: 'Glow Beauty',
            fr: 'Glow Beaute',
            es: 'Glow Belleza',
          },
          logoUrl: '',
        },
      },
      {
        id: 'kozmetik_header_nav',
        type: 'navigation-menu',
        props: {
          items: [
            {
              label: { en: 'Home', tr: 'Ana Sayfa', de: 'Startseite', fr: 'Accueil', es: 'Inicio' },
              link: '/',
            },
            {
              label: { en: 'Skincare', tr: 'Cilt Bakimi', de: 'Hautpflege', fr: 'Soins', es: 'Cuidado' },
              link: '/pages/skincare',
            },
            {
              label: { en: 'Makeup', tr: 'Makyaj', de: 'Make-up', fr: 'Maquillage', es: 'Maquillaje' },
              link: '/pages/makeup',
            },
            {
              label: { en: 'Haircare', tr: 'Sac Bakimi', de: 'Haarpflege', fr: 'Capillaire', es: 'Cabello' },
              link: '/pages/haircare',
            },
            {
              label: { en: 'Sale', tr: 'Indirim', de: 'Sale', fr: 'Soldes', es: 'Oferta' },
              link: '/pages/sale',
            },
          ],
        },
      },
      {
        id: 'kozmetik_header_search',
        type: 'search-bar',
        props: {
          placeholder: {
            en: 'Search beauty products...',
            tr: 'Guzellik urunleri ara...',
            de: 'Beauty-Produkte suchen...',
            fr: 'Rechercher...',
            es: 'Buscar productos...',
          },
        },
      },
      {
        id: 'kozmetik_header_cart',
        type: 'cart-icon',
        props: { showCount: true },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Footer — 3 columns
  // ---------------------------------------------------------------------------
  footer: {
    version: 1,
    blocks: [
      {
        id: 'kozmetik_footer_columns',
        type: 'columns',
        props: { columns: 3, gap: '2rem' },
        children: [
          {
            id: 'kozmetik_footer_col1',
            type: 'container',
            props: {},
            children: [
              {
                id: 'kozmetik_footer_discover',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4>Discover</h4><ul><li><a href="/pages/skincare">Skincare</a></li><li><a href="/pages/makeup">Makeup</a></li><li><a href="/pages/haircare">Haircare</a></li><li><a href="/pages/fragrance">Fragrance</a></li><li><a href="/pages/tools">Tools & Brushes</a></li></ul>',
                    tr: '<h4>Kesfet</h4><ul><li><a href="/pages/skincare">Cilt Bakimi</a></li><li><a href="/pages/makeup">Makyaj</a></li><li><a href="/pages/haircare">Sac Bakimi</a></li><li><a href="/pages/fragrance">Parfum</a></li><li><a href="/pages/tools">Araclar ve Fircalar</a></li></ul>',
                    de: '<h4>Entdecken</h4><ul><li><a href="/pages/skincare">Hautpflege</a></li><li><a href="/pages/makeup">Make-up</a></li><li><a href="/pages/haircare">Haarpflege</a></li><li><a href="/pages/fragrance">Duefte</a></li><li><a href="/pages/tools">Werkzeuge & Pinsel</a></li></ul>',
                    fr: '<h4>Decouvrir</h4><ul><li><a href="/pages/skincare">Soins</a></li><li><a href="/pages/makeup">Maquillage</a></li><li><a href="/pages/haircare">Capillaire</a></li><li><a href="/pages/fragrance">Parfum</a></li><li><a href="/pages/tools">Outils & Pinceaux</a></li></ul>',
                    es: '<h4>Descubrir</h4><ul><li><a href="/pages/skincare">Cuidado</a></li><li><a href="/pages/makeup">Maquillaje</a></li><li><a href="/pages/haircare">Cabello</a></li><li><a href="/pages/fragrance">Fragancia</a></li><li><a href="/pages/tools">Herramientas y Brochas</a></li></ul>',
                  },
                },
              },
            ],
          },
          {
            id: 'kozmetik_footer_col2',
            type: 'container',
            props: {},
            children: [
              {
                id: 'kozmetik_footer_support',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4>Support</h4><ul><li><a href="/pages/faq">FAQ</a></li><li><a href="/pages/contact">Contact Us</a></li><li><a href="/pages/shipping">Shipping</a></li><li><a href="/pages/returns">Returns</a></li><li><a href="/pages/track">Track Order</a></li></ul>',
                    tr: '<h4>Destek</h4><ul><li><a href="/pages/faq">SSS</a></li><li><a href="/pages/contact">Iletisim</a></li><li><a href="/pages/shipping">Kargo</a></li><li><a href="/pages/returns">Iade</a></li><li><a href="/pages/track">Siparis Takibi</a></li></ul>',
                    de: '<h4>Support</h4><ul><li><a href="/pages/faq">FAQ</a></li><li><a href="/pages/contact">Kontakt</a></li><li><a href="/pages/shipping">Versand</a></li><li><a href="/pages/returns">Retouren</a></li><li><a href="/pages/track">Bestellung verfolgen</a></li></ul>',
                    fr: '<h4>Assistance</h4><ul><li><a href="/pages/faq">FAQ</a></li><li><a href="/pages/contact">Contact</a></li><li><a href="/pages/shipping">Livraison</a></li><li><a href="/pages/returns">Retours</a></li><li><a href="/pages/track">Suivi de commande</a></li></ul>',
                    es: '<h4>Soporte</h4><ul><li><a href="/pages/faq">FAQ</a></li><li><a href="/pages/contact">Contacto</a></li><li><a href="/pages/shipping">Envio</a></li><li><a href="/pages/returns">Devoluciones</a></li><li><a href="/pages/track">Rastrear pedido</a></li></ul>',
                  },
                },
              },
            ],
          },
          {
            id: 'kozmetik_footer_col3',
            type: 'container',
            props: {},
            children: [
              {
                id: 'kozmetik_footer_about',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h4>About Glow Beauty</h4><p>Clean, cruelty-free beauty that celebrates every skin type. Follow us for tips, tutorials, and new launches.</p>',
                    tr: '<h4>Glow Guzellik Hakkinda</h4><p>Her cilt tipini kutlayan temiz, hayvan deneysiz guzellik. Ipuclari, ogreticiler ve yeni urunler icin bizi takip edin.</p>',
                    de: '<h4>Ueber Glow Beauty</h4><p>Saubere, tierversuchsfreie Schoenheit, die jeden Hauttyp feiert. Folgen Sie uns fuer Tipps, Tutorials und neue Produkte.</p>',
                    fr: '<h4>A propos de Glow Beaute</h4><p>Beaute propre et sans cruaute qui celebre chaque type de peau. Suivez-nous pour des conseils et nouveautes.</p>',
                    es: '<h4>Sobre Glow Belleza</h4><p>Belleza limpia y libre de crueldad que celebra cada tipo de piel. Siguenos para consejos, tutoriales y lanzamientos.</p>',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        id: 'kozmetik_footer_social',
        type: 'social-links',
        props: {
          links: [
            { platform: 'instagram', url: '#' },
            { platform: 'tiktok', url: '#' },
            { platform: 'pinterest', url: '#' },
          ],
        },
      },
      {
        id: 'kozmetik_footer_copyright',
        type: 'text',
        props: {
          tag: 'p',
          content: {
            en: '\u00a9 2026 Glow Beauty. All rights reserved.',
            tr: '\u00a9 2026 Glow Guzellik. Tum haklari saklidir.',
            de: '\u00a9 2026 Glow Beauty. Alle Rechte vorbehalten.',
            fr: '\u00a9 2026 Glow Beaute. Tous droits reserves.',
            es: '\u00a9 2026 Glow Belleza. Todos los derechos reservados.',
          },
        },
        style: { textAlign: 'center', padding: '1rem 0' },
      },
    ],
  },
};
