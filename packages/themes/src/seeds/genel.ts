import type { SectorSeedData } from './types';
import type { PageContent, Block } from '@zunapro/types';

export const genelSeedData: SectorSeedData = {
  categories: [
    // --- Parent categories ---
    {
      name: { en: 'Electronics', tr: 'Elektronik', de: 'Elektronik', fr: 'Electronique', es: 'Electronica' },
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=800&fit=crop',
      sortOrder: 1,
      isFeatured: true,
    },
    {
      name: { en: 'Fashion', tr: 'Moda', de: 'Mode', fr: 'Mode', es: 'Moda' },
      slug: 'fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=800&fit=crop',
      sortOrder: 2,
      isFeatured: true,
    },
    {
      name: { en: 'Home & Living', tr: 'Ev & Yasam', de: 'Haus & Wohnen', fr: 'Maison & Deco', es: 'Hogar & Vida' },
      slug: 'home-living',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop',
      sortOrder: 3,
      isFeatured: true,
    },
    {
      name: { en: 'Sports & Outdoor', tr: 'Spor & Outdoor', de: 'Sport & Outdoor', fr: 'Sport & Plein air', es: 'Deporte & Exterior' },
      slug: 'sports-outdoor',
      image: 'https://images.unsplash.com/photo-1461896836934-bd45ba64b740?w=800&h=800&fit=crop',
      sortOrder: 4,
      isFeatured: true,
    },
    {
      name: { en: 'Beauty & Health', tr: 'Guzellik & Saglik', de: 'Beauty & Gesundheit', fr: 'Beaute & Sante', es: 'Belleza & Salud' },
      slug: 'beauty-health',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
      sortOrder: 5,
      isFeatured: true,
    },
    {
      name: { en: 'Books & Stationery', tr: 'Kitap & Kirtasiye', de: 'Buecher & Schreibwaren', fr: 'Livres & Papeterie', es: 'Libros & Papeleria' },
      slug: 'books-stationery',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
      sortOrder: 6,
      isFeatured: true,
    },
    {
      name: { en: 'Toys & Games', tr: 'Oyuncak & Oyun', de: 'Spielzeug & Spiele', fr: 'Jouets & Jeux', es: 'Juguetes & Juegos' },
      slug: 'toys-games',
      image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop',
      sortOrder: 7,
      isFeatured: true,
    },
    {
      name: { en: 'Automotive', tr: 'Otomotiv', de: 'Automobil', fr: 'Automobile', es: 'Automotriz' },
      slug: 'automotive',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop',
      sortOrder: 8,
      isFeatured: true,
    },
    // --- Subcategories ---
    {
      name: { en: 'Smartphones', tr: 'Akilli Telefonlar', de: 'Smartphones', fr: 'Smartphones', es: 'Smartphones' },
      slug: 'smartphones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
      sortOrder: 1,
      parentSlug: 'electronics',
    },
    {
      name: { en: 'Laptops', tr: 'Dizustu Bilgisayar', de: 'Laptops', fr: 'Ordinateurs portables', es: 'Portatiles' },
      slug: 'laptops',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
      sortOrder: 2,
      parentSlug: 'electronics',
    },
    {
      name: { en: 'Headphones', tr: 'Kulaklik', de: 'Kopfhoerer', fr: 'Ecouteurs', es: 'Auriculares' },
      slug: 'headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      sortOrder: 3,
      parentSlug: 'electronics',
    },
    {
      name: { en: 'Women Clothing', tr: 'Kadin Giyim', de: 'Damenbekleidung', fr: 'Vetements femme', es: 'Ropa mujer' },
      slug: 'women-clothing',
      image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&h=800&fit=crop',
      sortOrder: 1,
      parentSlug: 'fashion',
    },
    {
      name: { en: 'Men Clothing', tr: 'Erkek Giyim', de: 'Herrenbekleidung', fr: 'Vetements homme', es: 'Ropa hombre' },
      slug: 'men-clothing',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=800&fit=crop',
      sortOrder: 2,
      parentSlug: 'fashion',
    },
    {
      name: { en: 'Shoes', tr: 'Ayakkabi', de: 'Schuhe', fr: 'Chaussures', es: 'Zapatos' },
      slug: 'shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      sortOrder: 3,
      parentSlug: 'fashion',
    },
    {
      name: { en: 'Furniture', tr: 'Mobilya', de: 'Moebel', fr: 'Meubles', es: 'Muebles' },
      slug: 'furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      sortOrder: 1,
      parentSlug: 'home-living',
    },
    {
      name: { en: 'Kitchen', tr: 'Mutfak', de: 'Kueche', fr: 'Cuisine', es: 'Cocina' },
      slug: 'kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
      sortOrder: 2,
      parentSlug: 'home-living',
    },
  ],

  products: [
    { name: { en: 'iPhone 15 Pro Max', tr: 'iPhone 15 Pro Max' }, description: { en: 'Latest Apple flagship with A17 Pro chip', tr: 'A17 Pro cipli en yeni Apple amiral gemisi' }, slug: 'iphone-15-pro-max', price: 1199, compareAtPrice: 1399, sku: 'ELEC-001', isFeatured: true, stock: 50, images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop'], categorySlug: 'smartphones', status: 'active' },
    { name: { en: 'Samsung Galaxy S24 Ultra', tr: 'Samsung Galaxy S24 Ultra' }, description: { en: 'AI-powered Samsung flagship', tr: 'Yapay zeka destekli Samsung amiral gemisi' }, slug: 'samsung-galaxy-s24', price: 1099, sku: 'ELEC-002', isFeatured: true, stock: 75, images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop'], categorySlug: 'smartphones', status: 'active' },
    { name: { en: 'MacBook Pro 16" M3 Max', tr: 'MacBook Pro 16" M3 Max' }, description: { en: 'Ultimate power for professionals', tr: 'Profesyoneller icin kesintisiz guc' }, slug: 'macbook-pro-16-m3', price: 2499, sku: 'ELEC-004', isFeatured: true, stock: 30, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'], categorySlug: 'laptops', status: 'active' },
    { name: { en: 'Sony WH-1000XM5', tr: 'Sony WH-1000XM5' }, description: { en: 'Industry-leading noise cancellation', tr: 'Sektorde lider gurultu engelleme' }, slug: 'sony-wh1000xm5', price: 349, compareAtPrice: 399, sku: 'ELEC-006', isFeatured: true, stock: 100, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop'], categorySlug: 'headphones', status: 'active' },
    { name: { en: 'Nike Air Max 270', tr: 'Nike Air Max 270' }, description: { en: 'Iconic lifestyle sneaker', tr: 'Ikonik yasam tarzi spor ayakkabi' }, slug: 'nike-air-max-270', price: 150, compareAtPrice: 180, sku: 'FASH-005', isFeatured: true, stock: 90, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'], categorySlug: 'shoes', status: 'active' },
    { name: { en: 'Cashmere Blend Coat', tr: 'Karisim Kasmir Palto' }, description: { en: 'Elegant winter coat in premium cashmere blend', tr: 'Premium kasmir karisimli sik kis paltosu' }, slug: 'cashmere-blend-coat', price: 299, compareAtPrice: 450, sku: 'FASH-001', isFeatured: true, stock: 35, images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop'], categorySlug: 'women-clothing', status: 'active' },
    { name: { en: 'Scandinavian Sofa Set', tr: 'Iskandinav Koltuk Takimi' }, description: { en: 'Modern 3-seater sofa in premium fabric', tr: 'Premium kumasta modern 3 kisilik koltuk' }, slug: 'scandinavian-sofa-set', price: 899, compareAtPrice: 1199, sku: 'HOME-001', isFeatured: true, stock: 15, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop'], categorySlug: 'furniture', status: 'active' },
    { name: { en: 'Carbon Road Bike', tr: 'Karbon Yol Bisikleti' }, description: { en: 'Lightweight carbon frame road bicycle', tr: 'Hafif karbon cerceveli yol bisikleti' }, slug: 'carbon-road-bike', price: 1899, compareAtPrice: 2299, sku: 'SPRT-001', isFeatured: true, stock: 10, images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=600&fit=crop'], categorySlug: 'sports-outdoor', status: 'active' },
    { name: { en: 'Vitamin C Serum', tr: 'C Vitamini Serumu' }, description: { en: 'Anti-aging brightening serum', tr: 'Yaslanma karsiti aydinlatici serum' }, slug: 'vitamin-c-serum', price: 39, compareAtPrice: 55, sku: 'BEAU-001', isFeatured: true, stock: 200, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'], categorySlug: 'beauty-health', status: 'active' },
    { name: { en: 'LEGO Architecture Set', tr: 'LEGO Mimari Seti' }, description: { en: 'Iconic skyline building set 1500+ pieces', tr: 'Ikonik sehir silueti yapim seti 1500+ parca' }, slug: 'lego-architecture-set', price: 129, compareAtPrice: 159, sku: 'TOYS-001', isFeatured: true, stock: 30, images: ['https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=600&fit=crop'], categorySlug: 'toys-games', status: 'active' },
  ],

  pages: [
    // ---- HOME ----
    {
      slug: 'home',
      title: {
        en: 'Home',
        tr: 'Ana Sayfa',
        de: 'Startseite',
        fr: 'Accueil',
        es: 'Inicio',
      },
      content: {
        version: 1,
        blocks: [
          // 1. Banner Grid
          {
            id: 'seed_genel_home_banner_grid',
            type: 'banner-grid' as Block['type'],
            props: {
              slides: [
                {
                  id: 'slide_1',
                  image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
                  title: {
                    en: 'Discover Our Collection',
                    tr: 'Koleksiyonumuzu Keşfedin',
                    de: 'Entdecken Sie unsere Kollektion',
                    fr: 'Decouvrez notre collection',
                    es: 'Descubra nuestra coleccion',
                  },
                  subtitle: {
                    en: 'Handpicked products for every taste and occasion',
                    tr: 'Her zevke ve vesileye özenle seçilmiş ürünler',
                    de: 'Handverlesene Produkte fuer jeden Geschmack und Anlass',
                    fr: 'Des produits selectionnes pour tous les gouts et occasions',
                    es: 'Productos seleccionados para todos los gustos y ocasiones',
                  },
                  buttonText: {
                    en: 'Shop Now',
                    tr: 'Alışverişe Başla',
                    de: 'Jetzt einkaufen',
                    fr: 'Acheter maintenant',
                    es: 'Comprar ahora',
                  },
                  buttonLink: '/products',
                  textColor: 'white',
                  textPosition: 'left',
                  overlayOpacity: 0.35,
                },
                {
                  id: 'slide_2',
                  image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
                  title: {
                    en: 'New Arrivals',
                    tr: 'Yeni Gelenler',
                    de: 'Neuheiten',
                    fr: 'Nouveautes',
                    es: 'Novedades',
                  },
                  subtitle: {
                    en: 'Check out our latest products',
                    tr: 'En yeni ürünlerimize göz atın',
                    de: 'Entdecken Sie unsere neuesten Produkte',
                    fr: 'Decouvrez nos derniers produits',
                    es: 'Echa un vistazo a nuestros ultimos productos',
                  },
                  buttonText: {
                    en: 'View All',
                    tr: 'Tümünü Gör',
                    de: 'Alle anzeigen',
                    fr: 'Voir tout',
                    es: 'Ver todo',
                  },
                  buttonLink: '/products',
                  textColor: 'white',
                  textPosition: 'left',
                  overlayOpacity: 0.4,
                },
              ],
              sideBanners: [
                {
                  id: 'side_1',
                  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
                  title: {
                    en: 'Special Collection',
                    tr: 'Özel Koleksiyon',
                    de: 'Sonderkollektion',
                    fr: 'Collection speciale',
                    es: 'Coleccion especial',
                  },
                  buttonText: {
                    en: 'View Details',
                    tr: 'Detayları Gör',
                    de: 'Details ansehen',
                    fr: 'Voir les details',
                    es: 'Ver detalles',
                  },
                  buttonLink: '/categories/ozel-koleksiyon',
                  textColor: 'white',
                  countdown: '2026-12-31T00:00:00',
                },
                {
                  id: 'side_2',
                  image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop',
                  title: {
                    en: 'Sale Items',
                    tr: 'İndirimli Ürünler',
                    de: 'Sale-Artikel',
                    fr: 'Articles en solde',
                    es: 'Articulos en oferta',
                  },
                  buttonText: {
                    en: 'Shop Sale',
                    tr: 'İndirimleri Gör',
                    de: 'Sale ansehen',
                    fr: 'Voir les soldes',
                    es: 'Ver ofertas',
                  },
                  buttonLink: '/categories/indirimli',
                  textColor: 'white',
                },
                {
                  id: 'side_3',
                  image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
                  title: {
                    en: 'Gift Ideas',
                    tr: 'Hediye Fikirleri',
                    de: 'Geschenkideen',
                    fr: 'Idees cadeaux',
                    es: 'Ideas para regalos',
                  },
                  buttonText: {
                    en: 'View Details',
                    tr: 'Detayları Gör',
                    de: 'Details ansehen',
                    fr: 'Voir les details',
                    es: 'Ver detalles',
                  },
                  buttonLink: '/categories/hediye-fikirleri',
                  textColor: 'white',
                },
              ],
              autoplay: true,
              autoplayInterval: 5000,
              height: '560px',
              gap: '10px',
            },
            style: {
              padding: '1.5rem 0',
            },
          },
          // 2. Spacer
          {
            id: 'seed_genel_home_spacer1',
            type: 'spacer',
            props: { height: '1.5rem' },
          },
          // 3. Category Showcase Carousel
          {
            id: 'seed_genel_home_categories',
            type: 'category-showcase',
            props: {
              title: {
                en: 'Shop by Category',
                tr: 'Kategoriye Göre Alışveriş',
                de: 'Nach Kategorie einkaufen',
                fr: 'Acheter par categorie',
                es: 'Comprar por categoria',
              },
              layout: 'carousel',
              featuredOnly: true,
              limit: 10,
            },
          },
          // 4. Spacer
          {
            id: 'seed_genel_home_spacer2',
            type: 'spacer',
            props: { height: '2rem' },
          },
          // 5. Category Products — Electronics (with side banner)
          {
            id: 'seed_genel_home_cat_electronics',
            type: 'category-products' as Block['type'],
            props: {
              title: {
                en: 'Electronics',
                tr: 'Elektronik',
                de: 'Elektronik',
                fr: 'Electronique',
                es: 'Electronica',
              },
              categorySlug: 'electronics',
              limit: 8,
              columns: 4,
              showViewAll: true,
              viewAllLink: '/categories/electronics',
              sideBanner: {
                image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop',
                title: {
                  en: 'Tech Deals',
                  tr: 'Teknoloji Fırsatları',
                  de: 'Technik-Angebote',
                  fr: 'Offres Tech',
                  es: 'Ofertas Tech',
                },
                buttonText: {
                  en: 'Shop Now',
                  tr: 'Hemen Al',
                  de: 'Jetzt kaufen',
                  fr: 'Acheter',
                  es: 'Comprar',
                },
                buttonLink: '/categories/electronics',
              },
            },
          },
          // 6. Spacer
          {
            id: 'seed_genel_home_spacer3',
            type: 'spacer',
            props: { height: '2rem' },
          },
          // 7. Category Products — Home & Living (no side banner, wider)
          {
            id: 'seed_genel_home_cat_homeliving',
            type: 'category-products' as Block['type'],
            props: {
              title: {
                en: 'Home & Living',
                tr: 'Ev & Yaşam',
                de: 'Haus & Wohnen',
                fr: 'Maison & Deco',
                es: 'Hogar & Vida',
              },
              categorySlug: 'home-living',
              limit: 10,
              columns: 5,
              showViewAll: true,
              viewAllLink: '/categories/home-living',
            },
          },
          // 8. Spacer
          {
            id: 'seed_genel_home_spacer4',
            type: 'spacer',
            props: { height: '2rem' },
          },
          // 9. Promo Banners (3 banners)
          {
            id: 'seed_genel_home_promo_banners',
            type: 'promo-banners' as Block['type'],
            props: {
              banners: [
                {
                  id: 'promo_1',
                  image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800&h=400&fit=crop',
                  title: {
                    en: 'Free Shipping',
                    tr: 'Ücretsiz Kargo',
                    de: 'Kostenloser Versand',
                    fr: 'Livraison gratuite',
                    es: 'Envio gratuito',
                  },
                  subtitle: {
                    en: 'On orders over $100',
                    tr: '100$ üzeri siparişlerde',
                    de: 'Bei Bestellungen ueber 100$',
                    fr: 'Pour les commandes de plus de 100$',
                    es: 'En pedidos superiores a 100$',
                  },
                  buttonText: { en: 'Shop Now', tr: 'Alışveriş Yap', de: 'Jetzt einkaufen', fr: 'Acheter', es: 'Comprar' },
                  buttonLink: '/products',
                  backgroundColor: '#1a1a2e',
                  textColor: 'white',
                },
                {
                  id: 'promo_2',
                  image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
                  title: {
                    en: 'Summer Sale',
                    tr: 'Yaz İndirimi',
                    de: 'Sommerschlussverkauf',
                    fr: 'Soldes d\'ete',
                    es: 'Rebajas de verano',
                  },
                  subtitle: {
                    en: 'Up to 50% off selected items',
                    tr: 'Seçili ürünlerde %50\'ye varan indirim',
                    de: 'Bis zu 50% Rabatt auf ausgewaehlte Artikel',
                    fr: 'Jusqu\'a 50% de reduction sur les articles selectionnes',
                    es: 'Hasta un 50% de descuento en articulos seleccionados',
                  },
                  buttonText: { en: 'View Deals', tr: 'Fırsatları Gör', de: 'Angebote ansehen', fr: 'Voir les offres', es: 'Ver ofertas' },
                  buttonLink: '/products',
                  backgroundColor: '#16213e',
                  textColor: 'white',
                },
                {
                  id: 'promo_3',
                  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
                  title: {
                    en: 'New Collection',
                    tr: 'Yeni Koleksiyon',
                    de: 'Neue Kollektion',
                    fr: 'Nouvelle collection',
                    es: 'Nueva coleccion',
                  },
                  subtitle: {
                    en: 'Discover the latest trends',
                    tr: 'En son trendleri keşfedin',
                    de: 'Entdecken Sie die neuesten Trends',
                    fr: 'Decouvrez les dernieres tendances',
                    es: 'Descubre las ultimas tendencias',
                  },
                  buttonText: { en: 'Explore', tr: 'Keşfet', de: 'Entdecken', fr: 'Explorer', es: 'Explorar' },
                  buttonLink: '/products',
                  backgroundColor: '#0f3460',
                  textColor: 'white',
                },
              ],
              layout: 'three-column',
              gap: '1rem',
            },
          },
          // 10. Spacer
          {
            id: 'seed_genel_home_spacer5',
            type: 'spacer',
            props: { height: '2rem' },
          },
          // 11. Product Showcase — Featured
          {
            id: 'seed_genel_home_products',
            type: 'product-showcase',
            props: {
              title: {
                en: 'Featured Products',
                tr: 'Öne Çıkan Ürünler',
                de: 'Empfohlene Produkte',
                fr: 'Produits en vedette',
                es: 'Productos destacados',
              },
              limit: 10,
              columns: 5,
              featuredOnly: true,
              showViewAll: true,
              viewAllLink: '/featured',
            },
          },
          // 12. Spacer
          {
            id: 'seed_genel_home_spacer6',
            type: 'spacer',
            props: { height: '2rem' },
          },
          // 13. Blog Posts
          {
            id: 'seed_genel_home_blog',
            type: 'blog-posts' as Block['type'],
            props: {
              title: {
                en: 'Our Articles',
                tr: 'Yazılarımız',
                de: 'Unsere Artikel',
                fr: 'Nos articles',
                es: 'Nuestros articulos',
              },
              limit: 4,
              columns: 4,
              showExcerpt: true,
              showDate: true,
              showAuthor: true,
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Discover our curated collection of premium products. Shop trending items, new arrivals, and exclusive deals.',
        tr: 'Premium urunlerden olusan ozenle secilmis koleksiyonumuzu kesfedin. Trend urunler, yeni gelenler ve ozel firsatlar.',
        de: 'Entdecken Sie unsere kuratierte Kollektion hochwertiger Produkte. Trendprodukte, Neuheiten und exklusive Angebote.',
        fr: 'Decouvrez notre collection de produits premium. Articles tendance, nouveautes et offres exclusives.',
        es: 'Descubra nuestra coleccion de productos premium. Articulos de tendencia, novedades y ofertas exclusivas.',
      },
    },

    // ---- ABOUT ----
    {
      slug: 'about',
      title: {
        en: 'About Us',
        tr: 'Hakkımızda',
        de: 'Über uns',
        fr: 'À propos',
        es: 'Sobre nosotros',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_genel_about_hero',
            type: 'hero',
            props: {
              title: {
                en: 'About Us',
                tr: 'Hakkımızda',
                de: 'Über uns',
                fr: 'À propos de nous',
                es: 'Sobre nosotros',
              },
              subtitle: {
                en: 'Discover our story, our values, and the passion that drives everything we do',
                tr: 'Hikayemizi, değerlerimizi ve yaptığımız her şeyi yönlendiren tutkumuzu keşfedin',
                de: 'Entdecken Sie unsere Geschichte, unsere Werte und die Leidenschaft, die alles antreibt',
                fr: 'Découvrez notre histoire, nos valeurs et la passion qui anime tout ce que nous faisons',
                es: 'Descubra nuestra historia, nuestros valores y la pasión que impulsa todo lo que hacemos',
              },
              backgroundImage:
                'https://images.unsplash.com/photo-1556740758-90de940099b7?w=1920&q=80',
              overlayOpacity: 0.55,
            },
            style: {
              padding: '0',
            },
          },
          {
            id: 'seed_genel_about_spacer_1',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_genel_about_story_columns',
            type: 'columns',
            props: { columns: 2, gap: '2rem' },
            style: {
              padding: '0 2rem',
              maxWidth: '1200px',
            },
            children: [
              {
                id: 'seed_genel_about_story_image',
                type: 'image',
                props: {
                  src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
                  alt: {
                    en: 'Our professional team at work',
                    tr: 'Çalışan profesyonel ekibimiz',
                    de: 'Unser professionelles Team bei der Arbeit',
                    fr: 'Notre équipe professionnelle au travail',
                    es: 'Nuestro equipo profesional en acción',
                  },
                  aspectRatio: '4/3',
                },
                style: {
                  borderRadius: '0.75rem',
                },
              },
              {
                id: 'seed_genel_about_story_text',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Our Story</h2><p style="line-height:1.75;margin-bottom:1rem;color:#4a5568">Founded with the belief that everyone deserves access to quality products at fair prices, our store has grown from a passionate idea into a thriving online destination trusted by thousands of customers.</p><p style="line-height:1.75;color:#4a5568">We carefully curate every item in our catalogue, working directly with manufacturers and artisans to bring you the very best. Our team is dedicated to providing an exceptional shopping experience — from the moment you browse to the moment your order arrives at your door.</p>',
                    tr: '<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Hikayemiz</h2><p style="line-height:1.75;margin-bottom:1rem;color:#4a5568">Herkesin uygun fiyatlarla kaliteli ürünlere erişimi hak ettiği inancıyla kurulan mağazamız, tutkulu bir fikirden binlerce müşterinin güvendiği gelişen bir online alışveriş destinasyonuna dönüşmüştür.</p><p style="line-height:1.75;color:#4a5568">Kataloğumuzdaki her ürünü özenle seçiyoruz, size en iyisini sunmak için üreticiler ve zanaatkarlarla doğrudan çalışıyoruz. Ekibimiz, göz attığınız andan siparişiniz kapınıza ulaşana kadar olağanüstü bir alışveriş deneyimi sunmaya adanmıştır.</p>',
                    de: '<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Unsere Geschichte</h2><p style="line-height:1.75;margin-bottom:1rem;color:#4a5568">Gegründet mit der Überzeugung, dass jeder Zugang zu Qualitätsprodukten zu fairen Preisen verdient, ist unser Shop von einer leidenschaftlichen Idee zu einem florierenden Online-Ziel gewachsen, dem Tausende von Kunden vertrauen.</p><p style="line-height:1.75;color:#4a5568">Wir kuratieren sorgfältig jeden Artikel in unserem Katalog und arbeiten direkt mit Herstellern und Handwerkern zusammen. Unser Team ist bestrebt, ein außergewöhnliches Einkaufserlebnis zu bieten.</p>',
                    fr: '<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Notre histoire</h2><p style="line-height:1.75;margin-bottom:1rem;color:#4a5568">Fondée avec la conviction que chacun mérite un accès à des produits de qualité à des prix justes, notre boutique est passée d\'une idée passionnée à une destination en ligne florissante à laquelle des milliers de clients font confiance.</p><p style="line-height:1.75;color:#4a5568">Nous sélectionnons soigneusement chaque article de notre catalogue, en travaillant directement avec les fabricants et artisans. Notre équipe se consacre à offrir une expérience d\'achat exceptionnelle.</p>',
                    es: '<h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Nuestra historia</h2><p style="line-height:1.75;margin-bottom:1rem;color:#4a5568">Fundada con la creencia de que todos merecen acceso a productos de calidad a precios justos, nuestra tienda ha crecido de una idea apasionada a un destino en línea próspero en el que confían miles de clientes.</p><p style="line-height:1.75;color:#4a5568">Seleccionamos cuidadosamente cada artículo de nuestro catálogo, trabajando directamente con fabricantes y artesanos. Nuestro equipo está dedicado a brindar una experiencia de compra excepcional.</p>',
                  },
                },
              },
            ],
          },
          {
            id: 'seed_genel_about_spacer_2',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_genel_about_values_columns',
            type: 'columns',
            props: { columns: 3, gap: '1.5rem' },
            style: {
              padding: '2rem',
              maxWidth: '1200px',
              backgroundColor: '#f7fafc',
            },
            children: [
              {
                id: 'seed_genel_about_value_quality',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">✦</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Quality Products</h3><p style="color:#718096;line-height:1.6">Every product is carefully selected and tested by our team to ensure it meets our high standards before reaching you.</p></div>',
                    tr: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">✦</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Kaliteli Ürünler</h3><p style="color:#718096;line-height:1.6">Her ürün, size ulaşmadan önce yüksek standartlarımızı karşıladığından emin olmak için ekibimiz tarafından özenle seçilir ve test edilir.</p></div>',
                    de: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">✦</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Qualitätsprodukte</h3><p style="color:#718096;line-height:1.6">Jedes Produkt wird sorgfältig ausgewählt und von unserem Team getestet, um sicherzustellen, dass es unseren hohen Standards entspricht.</p></div>',
                    fr: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">✦</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Produits de qualité</h3><p style="color:#718096;line-height:1.6">Chaque produit est soigneusement sélectionné et testé par notre équipe pour garantir qu\'il répond à nos normes élevées.</p></div>',
                    es: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">✦</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Productos de calidad</h3><p style="color:#718096;line-height:1.6">Cada producto es cuidadosamente seleccionado y probado por nuestro equipo para garantizar que cumpla con nuestros altos estándares.</p></div>',
                  },
                },
              },
              {
                id: 'seed_genel_about_value_shipping',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">⚡</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Fast Shipping</h3><p style="color:#718096;line-height:1.6">We process and ship orders quickly so you receive your products as fast as possible, with tracking available every step of the way.</p></div>',
                    tr: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">⚡</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Hızlı Kargo</h3><p style="color:#718096;line-height:1.6">Siparişleri hızla işleyip göndererek ürünlerinizi en kısa sürede elinize ulaştırıyoruz. Her adımda kargo takibi mevcuttur.</p></div>',
                    de: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">⚡</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Schneller Versand</h3><p style="color:#718096;line-height:1.6">Wir bearbeiten und versenden Bestellungen schnell, damit Sie Ihre Produkte so schnell wie möglich erhalten, mit Sendungsverfolgung.</p></div>',
                    fr: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">⚡</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Livraison rapide</h3><p style="color:#718096;line-height:1.6">Nous traitons et expédions rapidement les commandes pour que vous receviez vos produits le plus vite possible, avec suivi à chaque étape.</p></div>',
                    es: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">⚡</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Envío rápido</h3><p style="color:#718096;line-height:1.6">Procesamos y enviamos pedidos rápidamente para que reciba sus productos lo antes posible, con seguimiento disponible en cada paso.</p></div>',
                  },
                },
              },
              {
                id: 'seed_genel_about_value_support',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">💬</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">24/7 Support</h3><p style="color:#718096;line-height:1.6">Our customer support team is available around the clock to help you with any questions, concerns, or issues you may have.</p></div>',
                    tr: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">💬</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">7/24 Destek</h3><p style="color:#718096;line-height:1.6">Müşteri destek ekibimiz, herhangi bir soru, endişe veya sorununuz için günün her saatinde size yardımcı olmak için hazırdır.</p></div>',
                    de: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">💬</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">24/7 Support</h3><p style="color:#718096;line-height:1.6">Unser Kundensupport-Team steht Ihnen rund um die Uhr zur Verfügung, um bei Fragen oder Anliegen zu helfen.</p></div>',
                    fr: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">💬</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Support 24/7</h3><p style="color:#718096;line-height:1.6">Notre équipe de support client est disponible 24h/24 pour vous aider avec toutes vos questions ou préoccupations.</p></div>',
                    es: '<div style="text-align:center;padding:2rem 1rem"><div style="font-size:2.5rem;margin-bottom:0.75rem">💬</div><h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:var(--color-primary)">Soporte 24/7</h3><p style="color:#718096;line-height:1.6">Nuestro equipo de soporte al cliente está disponible las 24 horas para ayudarlo con cualquier pregunta o inquietud.</p></div>',
                  },
                },
              },
            ],
          },
          {
            id: 'seed_genel_about_spacer_3',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_genel_about_mission',
            type: 'text',
            props: {
              tag: 'div',
              content: {
                en: '<div style="text-align:center"><h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Our Mission</h2><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto 1rem">We believe that great shopping experiences start with trust. Our mission is to provide a curated selection of high-quality products, delivered with care and backed by exceptional customer service.</p><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto">Every decision we make — from the products we source to the partners we work with — is guided by our commitment to quality, transparency, and putting our customers first. We are not just building a store; we are building a community of people who value quality and authenticity.</p></div>',
                tr: '<div style="text-align:center"><h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Misyonumuz</h2><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto 1rem">Harika alışveriş deneyimlerinin güvenle başladığına inanıyoruz. Misyonumuz, özenle seçilmiş yüksek kaliteli ürünleri, dikkatle teslim etmek ve olağanüstü müşteri hizmetiyle desteklemektir.</p><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto">Temin ettiğimiz ürünlerden birlikte çalıştığımız ortaklara kadar verdiğimiz her karar, kaliteye, şeffaflığa ve müşterilerimizi ön planda tutma taahhüdümüzle yönlendirilmektedir. Sadece bir mağaza değil, kalite ve özgünlüğe değer veren bir topluluk inşa ediyoruz.</p></div>',
                de: '<div style="text-align:center"><h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Unsere Mission</h2><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto 1rem">Wir glauben, dass großartige Einkaufserlebnisse mit Vertrauen beginnen. Unsere Mission ist es, eine kuratierte Auswahl hochwertiger Produkte anzubieten, die mit Sorgfalt geliefert und durch außergewöhnlichen Kundenservice unterstützt werden.</p><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto">Jede Entscheidung, die wir treffen, wird von unserem Engagement für Qualität, Transparenz und Kundenorientierung geleitet. Wir bauen nicht nur einen Shop, sondern eine Gemeinschaft von Menschen, die Qualität und Authentizität schätzen.</p></div>',
                fr: '<div style="text-align:center"><h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Notre mission</h2><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto 1rem">Nous croyons que les grandes expériences d\'achat commencent par la confiance. Notre mission est de proposer une sélection de produits de haute qualité, livrés avec soin et soutenus par un service client exceptionnel.</p><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto">Chaque décision que nous prenons est guidée par notre engagement envers la qualité, la transparence et la priorité donnée à nos clients. Nous ne construisons pas seulement une boutique, mais une communauté de personnes qui valorisent la qualité et l\'authenticité.</p></div>',
                es: '<div style="text-align:center"><h2 style="font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:var(--color-primary)">Nuestra misión</h2><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto 1rem">Creemos que las grandes experiencias de compra comienzan con la confianza. Nuestra misión es ofrecer una selección curada de productos de alta calidad, entregados con cuidado y respaldados por un servicio al cliente excepcional.</p><p style="line-height:1.75;color:#4a5568;max-width:700px;margin:0 auto">Cada decisión que tomamos está guiada por nuestro compromiso con la calidad, la transparencia y poner a nuestros clientes primero. No solo estamos construyendo una tienda, sino una comunidad de personas que valoran la calidad y la autenticidad.</p></div>',
              },
            },
            style: {
              padding: '2rem',
              maxWidth: '900px',
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Learn about our story, mission, and commitment to quality products and customer satisfaction.',
        tr: 'Hikayemizi, misyonumuzu ve kaliteli ürünlere olan bağlılığımızı öğrenin.',
        de: 'Erfahren Sie mehr über unsere Geschichte, Mission und unser Engagement für Qualitätsprodukte.',
        fr: 'Découvrez notre histoire, notre mission et notre engagement envers la qualité.',
        es: 'Conozca nuestra historia, misión y compromiso con productos de calidad.',
      },
    },

    // ---- CONTACT ----
    {
      slug: 'contact',
      title: {
        en: 'Contact Us',
        tr: 'İletişim',
        de: 'Kontakt',
        fr: 'Contact',
        es: 'Contacto',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_genel_contact_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Contact Us',
                tr: 'İletişim',
                de: 'Kontaktieren Sie uns',
                fr: 'Contactez-nous',
                es: 'Contáctenos',
              },
              subtitle: {
                en: "We'd love to hear from you",
                tr: 'Sizden haber almak isteriz',
                de: 'Wir würden gerne von Ihnen hören',
                fr: 'Nous serions ravis de vous entendre',
                es: 'Nos encantaría saber de usted',
              },
            },
            style: {
              backgroundColor: '#1a1a2e',
              textColor: '#ffffff',
              padding: '4rem 2rem',
              textAlign: 'center' as const,
            },
          },
          {
            id: 'seed_contact_spacer_1',
            type: 'spacer',
            props: { height: '1.5rem' },
          },
          {
            id: 'seed_contact_form',
            type: 'contact-form' as Block['type'],
            props: {
              title: {
                en: 'Get in Touch',
                tr: 'Bize Ulaşın',
                de: 'Kontaktieren Sie uns',
                fr: 'Contactez-nous',
                es: 'Contáctenos',
              },
              showContactInfo: true,
              layout: 'side-by-side',
            },
          },
          {
            id: 'seed_contact_spacer_2',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_contact_cards_columns',
            type: 'columns',
            props: { columns: 3, gap: '2rem' },
            children: [
              {
                id: 'seed_contact_card_phone',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Phone</h3><p>+1 (555) 000-0000</p><p style="color:#666;font-size:0.9rem">Mon-Fri 9:00 AM - 6:00 PM</p></div>',
                    tr: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Telefon</h3><p>+1 (555) 000-0000</p><p style="color:#666;font-size:0.9rem">Pzt-Cum 09:00 - 18:00</p></div>',
                    de: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Telefon</h3><p>+1 (555) 000-0000</p><p style="color:#666;font-size:0.9rem">Mo-Fr 9:00 - 18:00</p></div>',
                    fr: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Téléphone</h3><p>+1 (555) 000-0000</p><p style="color:#666;font-size:0.9rem">Lun-Ven 9h00 - 18h00</p></div>',
                    es: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Teléfono</h3><p>+1 (555) 000-0000</p><p style="color:#666;font-size:0.9rem">Lun-Vie 9:00 - 18:00</p></div>',
                  },
                },
                style: {
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                },
              },
              {
                id: 'seed_contact_card_email',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Email</h3><p>info@example.com</p><p style="color:#666;font-size:0.9rem">We reply within 24 hours</p></div>',
                    tr: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">E-posta</h3><p>info@example.com</p><p style="color:#666;font-size:0.9rem">24 saat içinde yanıt veriyoruz</p></div>',
                    de: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">E-Mail</h3><p>info@example.com</p><p style="color:#666;font-size:0.9rem">Wir antworten innerhalb von 24 Stunden</p></div>',
                    fr: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">E-mail</h3><p>info@example.com</p><p style="color:#666;font-size:0.9rem">Nous répondons sous 24 heures</p></div>',
                    es: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Correo</h3><p>info@example.com</p><p style="color:#666;font-size:0.9rem">Respondemos en 24 horas</p></div>',
                  },
                },
                style: {
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                },
              },
              {
                id: 'seed_contact_card_address',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Address</h3><p>123 Commerce Street</p><p>Suite 100, New York, NY 10001</p></div>',
                    tr: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Adres</h3><p>123 Ticaret Sokağı</p><p>Suite 100, New York, NY 10001</p></div>',
                    de: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Adresse</h3><p>123 Commerce Street</p><p>Suite 100, New York, NY 10001</p></div>',
                    fr: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Adresse</h3><p>123 Commerce Street</p><p>Suite 100, New York, NY 10001</p></div>',
                    es: '<div style="text-align:center;padding:2rem"><h3 style="margin-bottom:0.5rem">Dirección</h3><p>123 Commerce Street</p><p>Suite 100, New York, NY 10001</p></div>',
                  },
                },
                style: {
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                },
              },
            ],
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Contact Us - Get in touch with us. Find our contact information, business hours, and address.',
        tr: 'İletişim - Bizimle iletişime geçin. İletişim bilgilerimizi, çalışma saatlerimizi ve adresimizi bulun.',
        de: 'Kontakt - Nehmen Sie Kontakt mit uns auf. Finden Sie unsere Kontaktdaten, Geschäftszeiten und Adresse.',
        fr: 'Contact - Contactez-nous. Trouvez nos coordonnées, horaires et adresse.',
        es: 'Contacto - Póngase en contacto con nosotros. Encuentre nuestra información de contacto, horarios y dirección.',
      },
    },

    // ---- FAQ ----
    {
      slug: 'faq',
      title: {
        en: 'FAQ',
        tr: 'SSS',
        de: 'FAQ',
        fr: 'FAQ',
        es: 'Preguntas frecuentes',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_genel_faq_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Frequently Asked Questions',
                tr: 'Sikca Sorulan Sorular',
                de: 'Haeufig gestellte Fragen',
                fr: 'Questions frequemment posees',
                es: 'Preguntas frecuentes',
              },
            },
            style: {
              backgroundColor: '#2d3436',
              textColor: '#ffffff',
              padding: '2rem 0',
            },
          },
          {
            id: 'seed_genel_faq_accordion',
            type: 'accordion',
            props: {
              items: [
                {
                  title: {
                    en: 'What are your shipping options?',
                    tr: 'Kargo secenekleriniz nelerdir?',
                    de: 'Welche Versandoptionen gibt es?',
                    fr: 'Quelles sont vos options de livraison?',
                    es: 'Cuales son sus opciones de envio?',
                  },
                  content: {
                    en: 'We offer standard shipping (5-7 business days), express shipping (2-3 business days), and overnight delivery. Free shipping is available on orders over $100. International shipping is available to select countries.',
                    tr: 'Standart kargo (5-7 is gunu), hizli kargo (2-3 is gunu) ve ertesi gun teslimat sunuyoruz. 100$ uzeri siparislerde ucretsiz kargo mevcuttur. Secili ulkelere uluslararasi kargo da yapilmaktadir.',
                    de: 'Wir bieten Standardversand (5-7 Werktage), Expressversand (2-3 Werktage) und Overnight-Lieferung an. Kostenloser Versand ist bei Bestellungen ueber 100$ verfuegbar. Internationaler Versand ist in ausgewaehlte Laender moeglich.',
                    fr: 'Nous proposons la livraison standard (5-7 jours ouvrables), la livraison express (2-3 jours ouvrables) et la livraison le lendemain. La livraison gratuite est disponible pour les commandes de plus de 100$. La livraison internationale est disponible dans certains pays.',
                    es: 'Ofrecemos envio estandar (5-7 dias habiles), envio expres (2-3 dias habiles) y entrega al dia siguiente. El envio gratuito esta disponible en pedidos superiores a 100$. El envio internacional esta disponible a paises seleccionados.',
                  },
                },
                {
                  title: {
                    en: 'What is your return policy?',
                    tr: 'Iade politikaniz nedir?',
                    de: 'Wie ist Ihre Rueckgaberichtlinie?',
                    fr: 'Quelle est votre politique de retour?',
                    es: 'Cual es su politica de devolucion?',
                  },
                  content: {
                    en: 'We accept returns within 30 days of purchase. Items must be unused and in their original packaging. Refunds are processed within 5-10 business days after we receive the returned item. Shipping costs for returns are covered by the customer unless the item arrived damaged or defective.',
                    tr: 'Satin alim tarihinden itibaren 30 gun icinde iade kabul ediyoruz. Urunler kullanilmamis ve orijinal ambalajinda olmalidir. Iade edilen urunu aldiktan sonra 5-10 is gunu icinde geri odeme yapilir. Urun hasarli veya kusurlu gelmedigini surece iade kargo ucreti musteriye aittir.',
                    de: 'Wir akzeptieren Ruecksendungen innerhalb von 30 Tagen nach dem Kauf. Artikel muessen unbenutzt und in der Originalverpackung sein. Rueckerstattungen werden innerhalb von 5-10 Werktagen nach Erhalt des zurueckgesendeten Artikels bearbeitet.',
                    fr: 'Nous acceptons les retours dans les 30 jours suivant l\'achat. Les articles doivent etre inutilises et dans leur emballage d\'origine. Les remboursements sont traites dans les 5 a 10 jours ouvrables apres reception de l\'article retourne.',
                    es: 'Aceptamos devoluciones dentro de los 30 dias posteriores a la compra. Los articulos deben estar sin usar y en su embalaje original. Los reembolsos se procesan dentro de 5 a 10 dias habiles despues de recibir el articulo devuelto.',
                  },
                },
                {
                  title: {
                    en: 'How can I track my order?',
                    tr: 'Siparisimi nasil takip edebilirim?',
                    de: 'Wie kann ich meine Bestellung verfolgen?',
                    fr: 'Comment puis-je suivre ma commande?',
                    es: 'Como puedo rastrear mi pedido?',
                  },
                  content: {
                    en: 'Once your order ships, you will receive a confirmation email with a tracking number. You can use this number on the carrier\'s website to track your package. You can also check your order status at any time by logging into your account and visiting the Orders section.',
                    tr: 'Sipaarisiniz kargoya verildiginde, takip numarasi iceren bir onay e-postasi alacaksiniz. Bu numarayi kargo firmasinin web sitesinde kullanarak paketinizi takip edebilirsiniz. Ayrica hesabiniza giris yaparak Siparisler bolumunden siparis durumunuzu kontrol edebilirsiniz.',
                    de: 'Sobald Ihre Bestellung versandt wird, erhalten Sie eine Bestaetigungs-E-Mail mit einer Sendungsverfolgungsnummer. Sie koennen diese Nummer auf der Website des Spediteurs verwenden, um Ihr Paket zu verfolgen.',
                    fr: 'Une fois votre commande expediee, vous recevrez un e-mail de confirmation avec un numero de suivi. Vous pouvez utiliser ce numero sur le site du transporteur pour suivre votre colis.',
                    es: 'Una vez que se envie su pedido, recibira un correo electronico de confirmacion con un numero de seguimiento. Puede usar este numero en el sitio web del transportista para rastrear su paquete.',
                  },
                },
                {
                  title: {
                    en: 'Do you offer gift wrapping?',
                    tr: 'Hediye paketi hizmeti sunuyor musunuz?',
                    de: 'Bieten Sie Geschenkverpackung an?',
                    fr: 'Proposez-vous l\'emballage cadeau?',
                    es: 'Ofrecen envoltorio de regalo?',
                  },
                  content: {
                    en: 'Yes, we offer premium gift wrapping for an additional $5 per item. You can select this option during checkout. We also include a personalised gift message at no extra charge. Gift-wrapped items are presented in our signature boxes with ribbon and tissue paper.',
                    tr: 'Evet, urun basina 5$ ek ucretle premium hediye paketi sunuyoruz. Bu secenegi odeme sirasinda secebilirsiniz. Ayrica ek ucret olmadan kisisellestirilmis hediye mesaji da ekliyoruz. Hediye paketli urunler kurdele ve pelur kagitla ozel kutularimizda sunulur.',
                    de: 'Ja, wir bieten Premium-Geschenkverpackung fuer zusaetzlich 5$ pro Artikel an. Sie koennen diese Option waehrend des Bestellvorgangs auswaehlen. Wir fuegen auch eine personalisierte Geschenknachricht ohne zusaetzliche Kosten hinzu.',
                    fr: 'Oui, nous proposons un emballage cadeau premium pour 5$ supplementaires par article. Vous pouvez selectionner cette option lors du paiement. Nous incluons egalement un message cadeau personnalise sans frais supplementaires.',
                    es: 'Si, ofrecemos envoltorio de regalo premium por 5$ adicionales por articulo. Puede seleccionar esta opcion durante el pago. Tambien incluimos un mensaje de regalo personalizado sin cargo adicional.',
                  },
                },
                {
                  title: {
                    en: 'What payment methods do you accept?',
                    tr: 'Hangi odeme yontemlerini kabul ediyorsunuz?',
                    de: 'Welche Zahlungsmethoden akzeptieren Sie?',
                    fr: 'Quels modes de paiement acceptez-vous?',
                    es: 'Que metodos de pago aceptan?',
                  },
                  content: {
                    en: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption. We also offer instalment payment options through our partner services for orders over $200.',
                    tr: 'Tum onemli kredi kartlarini (Visa, Mastercard, American Express), PayPal, Apple Pay ve Google Pay kabul ediyoruz. Tum islemler SSL sifreleme ile guvence altindadir. 200$ uzeri siparisler icin is ortaklarimiz araciligiyla taksit secenekleri de sunuyoruz.',
                    de: 'Wir akzeptieren alle gaengigen Kreditkarten (Visa, Mastercard, American Express), PayPal, Apple Pay und Google Pay. Alle Transaktionen sind mit SSL-Verschluesselung gesichert.',
                    fr: 'Nous acceptons toutes les principales cartes de credit (Visa, Mastercard, American Express), PayPal, Apple Pay et Google Pay. Toutes les transactions sont securisees par un cryptage SSL.',
                    es: 'Aceptamos todas las principales tarjetas de credito (Visa, Mastercard, American Express), PayPal, Apple Pay y Google Pay. Todas las transacciones estan protegidas con cifrado SSL.',
                  },
                },
              ],
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Find answers to frequently asked questions about shipping, returns, payments, and more.',
        tr: 'Kargo, iade, odeme ve daha fazlasi hakkinda sikca sorulan sorularin yanitlarini bulun.',
        de: 'Finden Sie Antworten auf haeufig gestellte Fragen zu Versand, Ruecksendungen, Zahlungen und mehr.',
        fr: 'Trouvez les reponses aux questions frequemment posees sur la livraison, les retours, les paiements et plus.',
        es: 'Encuentre respuestas a preguntas frecuentes sobre envio, devoluciones, pagos y mas.',
      },
    },

    // ---- SHOP ----
    {
      slug: 'shop',
      title: {
        en: 'Shop',
        tr: 'Magaza',
        de: 'Shop',
        fr: 'Boutique',
        es: 'Tienda',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_genel_shop_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Shop',
                tr: 'Magaza',
                de: 'Shop',
                fr: 'Boutique',
                es: 'Tienda',
              },
            },
            style: {
              padding: '2rem 0',
            },
          },
          {
            id: 'seed_genel_shop_listing',
            type: 'product-listing',
            props: {
              showFilters: true,
              showSearch: true,
              productsPerPage: 12,
              columns: 4,
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Browse our full catalogue of products. Filter by category, price, and more.',
        tr: 'Tum urun katalogumuza goz atin. Kategori, fiyat ve daha fazlasina gore filtreleyin.',
        de: 'Durchsuchen Sie unseren vollstaendigen Produktkatalog. Filtern Sie nach Kategorie, Preis und mehr.',
        fr: 'Parcourez notre catalogue complet de produits. Filtrez par categorie, prix et plus.',
        es: 'Explore nuestro catalogo completo de productos. Filtre por categoria, precio y mas.',
      },
    },

    // ---- CATEGORIES ----
    {
      slug: 'categories',
      title: {
        en: 'Categories',
        tr: 'Kategoriler',
        de: 'Kategorien',
        fr: 'Categories',
        es: 'Categorias',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_genel_categories_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Categories',
                tr: 'Kategoriler',
                de: 'Kategorien',
                fr: 'Categories',
                es: 'Categorias',
              },
            },
            style: {
              padding: '2rem 0',
            },
          },
          {
            id: 'seed_genel_categories_listing',
            type: 'category-listing',
            props: {
              columns: 4,
              showProductCount: true,
              layout: 'grid',
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Browse all product categories. Find exactly what you are looking for.',
        tr: 'Tum urun kategorilerine goz atin. Aradiginizi tam olarak bulun.',
        de: 'Durchsuchen Sie alle Produktkategorien. Finden Sie genau das, was Sie suchen.',
        fr: 'Parcourez toutes les categories de produits. Trouvez exactement ce que vous cherchez.',
        es: 'Explore todas las categorias de productos. Encuentre exactamente lo que busca.',
      },
    },

    // ---- PRODUCTS ----
    {
      slug: 'products',
      title: {
        en: 'All Products',
        tr: 'Tum Urunler',
        de: 'Alle Produkte',
        fr: 'Tous les produits',
        es: 'Todos los productos',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_genel_products_hero',
            type: 'hero',
            props: {
              title: {
                en: 'All Products',
                tr: 'Tum Urunler',
                de: 'Alle Produkte',
                fr: 'Tous les produits',
                es: 'Todos los productos',
              },
            },
            style: {
              padding: '2rem 0',
            },
          },
          {
            id: 'seed_genel_products_listing',
            type: 'product-listing',
            props: {
              showFilters: false,
              showSearch: true,
              productsPerPage: 24,
              columns: 4,
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Explore our complete product range. Search and discover items across all categories.',
        tr: 'Tum urun yelpazemizi kesfedin. Tum kategorilerde arama yapin ve urunleri kesfedin.',
        de: 'Entdecken Sie unser komplettes Produktsortiment. Suchen und entdecken Sie Artikel aus allen Kategorien.',
        fr: 'Explorez notre gamme complete de produits. Recherchez et decouvrez des articles dans toutes les categories.',
        es: 'Explore nuestra gama completa de productos. Busque y descubra articulos en todas las categorias.',
      },
    },
  ],

  header: { version: 1, blocks: [] },
  footer: { version: 1, blocks: [] },

  settings: [
    { key: 'site_name', value: { en: 'My Store', tr: 'Magazam', de: 'Mein Shop', fr: 'Ma Boutique', es: 'Mi Tienda' }, group: 'general' },
    { key: 'default_locale', value: 'tr', group: 'general' },
    { key: 'locales', value: ['en', 'tr', 'de', 'fr', 'es'], group: 'general' },
    { key: 'default_currency', value: 'USD', group: 'general' },
    { key: 'currencies', value: ['USD', 'EUR', 'TRY'], group: 'general' },
    { key: 'sector', value: 'genel', group: 'general' },
  ],

  blogPosts: [
    {
      title: { en: 'Best Gaming Laptop Models of 2024', tr: '2024 Yılının En İyi Oyun Dizüstü Bilgisayarları' },
      slug: 'best-gaming-laptops-2024',
      excerpt: {
        en: 'Discover the top gaming laptops that deliver exceptional performance, stunning displays, and cutting-edge technology for the ultimate gaming experience.',
        tr: 'Üstün performans, çarpıcı ekranlar ve en son teknolojiyle nihai oyun deneyimi sunan en iyi oyun dizüstü bilgisayarlarını keşfedin.',
      },
      content: {
        en: '<p>The gaming laptop market has evolved significantly in 2024, with manufacturers pushing the boundaries of performance and portability. From the latest NVIDIA RTX 40-series GPUs to high-refresh-rate OLED displays, this year\'s lineup offers something for every gamer.</p><p>Our top picks include the ASUS ROG Zephyrus G16, the Razer Blade 16, and the Lenovo Legion Pro 7i. Each model brings unique strengths to the table, whether you prioritize raw performance, build quality, or battery life.</p><p>When choosing a gaming laptop, consider factors like GPU performance, display quality, thermal management, and overall value for money. Our detailed comparisons and benchmarks will help you make the right decision.</p>',
        tr: '<p>Oyun dizüstü bilgisayar pazarı 2024 yılında önemli ölçüde gelişti ve üreticiler performans ile taşınabilirlik sınırlarını zorlamaya devam ediyor. En son NVIDIA RTX 40 serisi GPU\'lardan yüksek yenileme hızlı OLED ekranlara kadar bu yılın serisi her oyuncu için bir şeyler sunuyor.</p><p>En iyi seçimlerimiz arasında ASUS ROG Zephyrus G16, Razer Blade 16 ve Lenovo Legion Pro 7i yer alıyor. Her model, ham performans, yapı kalitesi veya pil ömrü gibi farklı alanlarda güçlü yönler sunuyor.</p><p>Oyun dizüstü bilgisayarı seçerken GPU performansı, ekran kalitesi, termal yönetim ve genel fiyat-performans oranı gibi faktörleri göz önünde bulundurun.</p>',
      },
      featuredImage: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=400&fit=crop',
      author: 'Tech Editor',
      category: 'Technology',
      tags: ['gaming', 'laptops', 'technology'],
      status: 'published' as const,
      publishedAt: '2024-11-14T10:00:00Z',
    },
    {
      title: { en: 'Top 10 Smartphone Accessories You Need', tr: 'İhtiyacınız Olan En İyi 10 Akıllı Telefon Aksesuarı' },
      slug: 'top-10-smartphone-accessories',
      excerpt: {
        en: 'From wireless chargers to premium cases, explore the must-have smartphone accessories that enhance your daily experience.',
        tr: 'Kablosuz şarj cihazlarından premium kılıflara kadar günlük deneyiminizi geliştiren olmazsa olmaz akıllı telefon aksesuarlarını keşfedin.',
      },
      content: {
        en: '<p>Smartphones are central to our daily lives, and the right accessories can significantly enhance your experience. Whether you are looking for protection, convenience, or productivity, we have compiled a list of the top 10 must-have accessories for 2024.</p><p>Our picks range from MagSafe-compatible wireless chargers and durable cases to portable power banks and Bluetooth earbuds. Each item has been tested and reviewed by our team to ensure it meets our quality standards.</p><p>Investing in quality accessories not only protects your device but also unlocks new capabilities and improves your overall smartphone experience.</p>',
        tr: '<p>Akıllı telefonlar günlük hayatımızın merkezinde yer alıyor ve doğru aksesuarlar deneyiminizi önemli ölçüde geliştirebilir. Koruma, kolaylık veya üretkenlik arıyorsanız, 2024 için olmazsa olmaz en iyi 10 aksesuarı sizin için derledik.</p><p>Seçimlerimiz MagSafe uyumlu kablosuz şarj cihazlarından dayanıklı kılıflara, taşınabilir güç bankalarından Bluetooth kulaklıklara kadar uzanıyor.</p><p>Kaliteli aksesuarlara yatırım yapmak yalnızca cihazınızı korumakla kalmaz, aynı zamanda yeni yeteneklerin kilidini açar ve genel akıllı telefon deneyiminizi iyileştirir.</p>',
      },
      featuredImage: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&h=400&fit=crop',
      author: 'Gadget Reviewer',
      category: 'Reviews',
      tags: ['smartphones', 'accessories', 'reviews'],
      status: 'published' as const,
      publishedAt: '2024-11-10T14:30:00Z',
    },
    {
      title: { en: 'E-Commerce Trends Shaping 2025', tr: '2025\'i Şekillendiren E-Ticaret Trendleri' },
      slug: 'ecommerce-trends-2025',
      excerpt: {
        en: 'Stay ahead of the curve with our analysis of the biggest e-commerce trends that will define the online shopping landscape in 2025.',
        tr: 'Online alışveriş manzarasını tanımlayacak en büyük e-ticaret trendlerine ilişkin analizimizle öne geçin.',
      },
      content: {
        en: '<p>The e-commerce landscape is constantly evolving, and 2025 promises to bring transformative changes. From AI-powered personalization to augmented reality shopping experiences, the future of online retail is more exciting than ever.</p><p>Key trends include the rise of social commerce, voice-assisted shopping, same-day delivery expectations, and sustainability-focused purchasing decisions. Businesses that adapt early to these trends will have a significant competitive advantage.</p><p>Our comprehensive analysis examines each trend in detail, providing actionable insights for both consumers and businesses looking to stay ahead in the rapidly changing digital marketplace.</p>',
        tr: '<p>E-ticaret manzarası sürekli gelişiyor ve 2025 dönüştürücü değişiklikler getirmeyi vaat ediyor. Yapay zeka destekli kişiselleştirmeden artırılmış gerçeklik alışveriş deneyimlerine kadar çevrimiçi perakendeciliğin geleceği her zamankinden daha heyecan verici.</p><p>Öne çıkan trendler arasında sosyal ticaretin yükselişi, sesli alışveriş, aynı gün teslimat beklentileri ve sürdürülebilirlik odaklı satın alma kararları yer alıyor.</p><p>Kapsamlı analizimiz her trendi ayrıntılı olarak inceleyerek hem tüketiciler hem de işletmeler için uygulanabilir içgörüler sunuyor.</p>',
      },
      featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      author: 'Market Analyst',
      category: 'News',
      tags: ['ecommerce', 'trends', 'business'],
      status: 'published' as const,
      publishedAt: '2024-11-08T09:00:00Z',
    },
    {
      title: { en: 'Complete Guide to Smart Home Setup', tr: 'Akıllı Ev Kurulumu İçin Eksiksiz Rehber' },
      slug: 'smart-home-setup-guide',
      excerpt: {
        en: 'A step-by-step guide to transforming your home with smart devices, from lighting and security to entertainment and energy management.',
        tr: 'Aydınlatma ve güvenlikten eğlence ve enerji yönetimine kadar evinizi akıllı cihazlarla dönüştürmek için adım adım rehber.',
      },
      content: {
        en: '<p>Setting up a smart home might seem daunting, but with the right approach, you can create a connected living space that enhances comfort, security, and efficiency. This guide walks you through every step of the process.</p><p>Start with a smart hub as your central control point. We recommend platforms like Apple HomeKit, Google Home, or Amazon Alexa depending on your existing ecosystem. From there, you can gradually add smart lighting, thermostats, security cameras, and door locks.</p><p>Key considerations include Wi-Fi coverage, device compatibility, privacy settings, and budget planning. Our guide covers all of these topics with practical tips and product recommendations to help you build your ideal smart home.</p>',
        tr: '<p>Akıllı ev kurmak göz korkutucu görünebilir, ancak doğru yaklaşımla konforu, güvenliği ve verimliliği artıran bağlantılı bir yaşam alanı oluşturabilirsiniz. Bu rehber sürecin her adımında size yol gösterir.</p><p>Merkezi kontrol noktanız olarak akıllı bir hub ile başlayın. Mevcut ekosistelinize bağlı olarak Apple HomeKit, Google Home veya Amazon Alexa gibi platformları öneriyoruz. Oradan akıllı aydınlatma, termostatlar, güvenlik kameraları ve kapı kilitleri ekleyebilirsiniz.</p><p>Önemli hususlar arasında Wi-Fi kapsama alanı, cihaz uyumluluğu, gizlilik ayarları ve bütçe planlaması yer alıyor.</p>',
      },
      featuredImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=400&fit=crop',
      author: 'Home Tech Expert',
      category: 'Guides',
      tags: ['smart-home', 'technology', 'guides'],
      status: 'published' as const,
      publishedAt: '2024-11-05T11:00:00Z',
    },
  ],
};
