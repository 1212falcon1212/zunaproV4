import type { SectorSeedData } from './types';
import type { PageContent, Block } from '@zunapro/types';

// ---------------------------------------------------------------------------
// Teknoloji (Technology) Sector Seed Data
// ---------------------------------------------------------------------------

export const teknolojiSeedData: SectorSeedData = {
  // -------------------------------------------------------------------------
  // Categories
  // -------------------------------------------------------------------------
  categories: [
    {
      name: {
        en: 'Computers',
        tr: 'Bilgisayarlar',
        de: 'Computer',
        fr: 'Ordinateurs',
        es: 'Computadoras',
      },
      slug: 'bilgisayarlar',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
      sortOrder: 1,
    },
    {
      name: {
        en: 'Phones',
        tr: 'Telefonlar',
        de: 'Telefone',
        fr: 'Telephones',
        es: 'Telefonos',
      },
      slug: 'telefonlar',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
      sortOrder: 2,
    },
    {
      name: {
        en: 'Accessories',
        tr: 'Aksesuarlar',
        de: 'Zubehoer',
        fr: 'Accessoires',
        es: 'Accesorios',
      },
      slug: 'aksesuarlar',
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop',
      sortOrder: 3,
    },
    {
      name: {
        en: 'Software',
        tr: 'Yazilim',
        de: 'Software',
        fr: 'Logiciels',
        es: 'Software',
      },
      slug: 'yazilim',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
      sortOrder: 4,
    },
    {
      name: {
        en: 'Gaming',
        tr: 'Oyun',
        de: 'Gaming',
        fr: 'Jeux',
        es: 'Gaming',
      },
      slug: 'oyun',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
      sortOrder: 5,
    },
  ],

  // -------------------------------------------------------------------------
  // Products
  // -------------------------------------------------------------------------
  products: [
    {
      name: {
        en: 'Professional Laptop',
        tr: 'Profesyonel Laptop',
        de: 'Professioneller Laptop',
        fr: 'Ordinateur Portable Professionnel',
        es: 'Laptop Profesional',
      },
      description: {
        en: 'A high-performance laptop designed for professionals and power users. Equipped with the latest processor, 32 GB RAM, and a stunning 15.6-inch Retina display. Perfect for software development, video editing, and multitasking.',
        tr: 'Profesyoneller ve guclu kullanicilar icin tasarlanmis yuksek performansli bir laptop. En son islemci, 32 GB RAM ve muhtesem 15.6 inc Retina ekranla donanimlidir. Yazilim gelistirme, video duzenleme ve coklu gorev icin idealdir.',
        de: 'Ein leistungsstarker Laptop fuer Profis und Power-User. Ausgestattet mit dem neuesten Prozessor, 32 GB RAM und einem beeindruckenden 15,6-Zoll-Retina-Display. Perfekt fuer Softwareentwicklung, Videobearbeitung und Multitasking.',
        fr: 'Un ordinateur portable haute performance concu pour les professionnels et les utilisateurs exigeants. Equipe du dernier processeur, de 32 Go de RAM et d\'un superbe ecran Retina de 15,6 pouces. Parfait pour le developpement logiciel, le montage video et le multitache.',
        es: 'Una laptop de alto rendimiento disenada para profesionales y usuarios avanzados. Equipada con el ultimo procesador, 32 GB de RAM y una impresionante pantalla Retina de 15,6 pulgadas. Perfecta para desarrollo de software, edicion de video y multitarea.',
      },
      slug: 'profesyonel-laptop',
      price: 15000,
      compareAtPrice: 17500,
      sku: 'TEK-001',
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop',
      ],
      categorySlug: 'bilgisayarlar',
      status: 'active',
    },
    {
      name: {
        en: 'Smartphone',
        tr: 'Akilli Telefon',
        de: 'Smartphone',
        fr: 'Smartphone',
        es: 'Telefono Inteligente',
      },
      description: {
        en: 'Experience the next generation of mobile technology with this flagship smartphone. Features a 6.7-inch AMOLED display, triple camera system with 108 MP main sensor, and all-day battery life. Sleek design meets cutting-edge performance.',
        tr: 'Bu amiral gemisi akilli telefonla mobil teknolojinin yeni neslini deneyimleyin. 6.7 inc AMOLED ekran, 108 MP ana sensorlu uclu kamera sistemi ve gun boyu pil omru sunar. Sik tasarim, en son teknolojiyle bulusuyor.',
        de: 'Erleben Sie die naechste Generation der Mobiltechnologie mit diesem Flaggschiff-Smartphone. Mit 6,7-Zoll-AMOLED-Display, Dreifach-Kamerasystem mit 108-MP-Hauptsensor und ganztaegiger Akkulaufzeit. Elegantes Design trifft auf modernste Leistung.',
        fr: 'Decouvrez la prochaine generation de technologie mobile avec ce smartphone phare. Ecran AMOLED de 6,7 pouces, systeme triple camera avec capteur principal de 108 MP et autonomie d\'une journee complete. Un design elegant allie a des performances de pointe.',
        es: 'Experimenta la proxima generacion de tecnologia movil con este smartphone insignia. Pantalla AMOLED de 6,7 pulgadas, sistema de triple camara con sensor principal de 108 MP y bateria para todo el dia. Diseno elegante con rendimiento de vanguardia.',
      },
      slug: 'akilli-telefon',
      price: 12000,
      compareAtPrice: 13500,
      sku: 'TEK-002',
      stock: 100,
      images: [
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop',
      ],
      categorySlug: 'telefonlar',
      status: 'active',
    },
    {
      name: {
        en: 'Wireless Headphones',
        tr: 'Kablosuz Kulaklik',
        de: 'Kabellose Kopfhoerer',
        fr: 'Ecouteurs sans fil',
        es: 'Auriculares Inalambricos',
      },
      description: {
        en: 'Premium wireless headphones with active noise cancellation and spatial audio. Enjoy up to 30 hours of battery life, ultra-comfortable ear cushions, and Hi-Res Audio certification. Ideal for music lovers and remote workers alike.',
        tr: 'Aktif gurultu onleme ve mekansal ses ozellikli premium kablosuz kulaklik. 30 saate kadar pil omru, ultra konforlu kulak yastiklari ve Hi-Res Audio sertifikasi sunar. Muzik severler ve uzaktan calisanlar icin idealdir.',
        de: 'Premium-Funkkopfhoerer mit aktiver Geraeuschunterdrueckung und Raumklang. Bis zu 30 Stunden Akkulaufzeit, ultrakomfortable Ohrpolster und Hi-Res-Audio-Zertifizierung. Ideal fuer Musikliebhaber und Remote-Arbeiter.',
        fr: 'Ecouteurs sans fil premium avec reduction de bruit active et audio spatial. Jusqu\'a 30 heures d\'autonomie, coussinets ultra-confortables et certification Hi-Res Audio. Ideal pour les melomanes et les travailleurs a distance.',
        es: 'Auriculares inalambricos premium con cancelacion activa de ruido y audio espacial. Hasta 30 horas de bateria, almohadillas ultra comodas y certificacion Hi-Res Audio. Ideales para amantes de la musica y trabajadores remotos.',
      },
      slug: 'kablosuz-kulaklik',
      price: 2500,
      compareAtPrice: 3200,
      sku: 'TEK-003',
      stock: 200,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop',
      ],
      categorySlug: 'aksesuarlar',
      status: 'active',
    },
    {
      name: {
        en: 'Mechanical Keyboard',
        tr: 'Mekanik Klavye',
        de: 'Mechanische Tastatur',
        fr: 'Clavier Mecanique',
        es: 'Teclado Mecanico',
      },
      description: {
        en: 'A tactile mechanical keyboard built for speed and precision. Features hot-swappable switches, per-key RGB lighting, and a durable aluminium frame. Whether you are coding or gaming, this keyboard elevates your experience.',
        tr: 'Hiz ve hassasiyet icin uretilmis dokunsal bir mekanik klavye. Degistirilebilir anahtarlar, tus basi RGB aydinlatma ve dayanikli aluminyum govde sunar. Kod yazarken veya oyun oynarken deneyiminizi ust seviyeye tasiyin.',
        de: 'Eine taktile mechanische Tastatur fuer Geschwindigkeit und Praezision. Mit austauschbaren Schaltern, Einzeltasten-RGB-Beleuchtung und einem robusten Aluminiumrahmen. Ob beim Programmieren oder Gaming, diese Tastatur hebt Ihr Erlebnis auf ein neues Level.',
        fr: 'Un clavier mecanique tactile concu pour la vitesse et la precision. Switches interchangeables a chaud, eclairage RGB par touche et cadre en aluminium durable. Que vous codiez ou jouiez, ce clavier eleve votre experience.',
        es: 'Un teclado mecanico tactil construido para velocidad y precision. Interruptores intercambiables en caliente, iluminacion RGB por tecla y marco de aluminio duradero. Ya sea programando o jugando, este teclado eleva tu experiencia.',
      },
      slug: 'mekanik-klavye',
      price: 1800,
      compareAtPrice: 2200,
      sku: 'TEK-004',
      stock: 150,
      images: [
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=600&fit=crop',
      ],
      categorySlug: 'aksesuarlar',
      status: 'active',
    },
    {
      name: {
        en: 'Tablet',
        tr: 'Tablet',
        de: 'Tablet',
        fr: 'Tablette',
        es: 'Tableta',
      },
      description: {
        en: 'A versatile tablet that adapts to your lifestyle. With a 12.9-inch Liquid Retina XDR display, M-series chip, and stylus support, it is ideal for drawing, note-taking, and streaming. Lightweight yet incredibly powerful.',
        tr: 'Yasam tarziniza uyum saglayan cok yonlu bir tablet. 12.9 inc Liquid Retina XDR ekran, M serisi cip ve kalem destegi ile cizim, not alma ve izleme icin idealdir. Hafif ama inanilmaz guclu.',
        de: 'Ein vielseitiges Tablet, das sich Ihrem Lebensstil anpasst. Mit 12,9-Zoll-Liquid-Retina-XDR-Display, M-Serie-Chip und Stift-Unterstuetzung ist es ideal zum Zeichnen, Notieren und Streamen. Leicht und dennoch unglaublich leistungsstark.',
        fr: 'Une tablette polyvalente qui s\'adapte a votre style de vie. Avec un ecran Liquid Retina XDR de 12,9 pouces, une puce Serie M et la prise en charge du stylet, elle est ideale pour le dessin, la prise de notes et le streaming. Legere mais incroyablement puissante.',
        es: 'Una tableta versatil que se adapta a tu estilo de vida. Con pantalla Liquid Retina XDR de 12,9 pulgadas, chip Serie M y soporte para lapiz, es ideal para dibujo, toma de notas y streaming. Ligera pero increiblemente potente.',
      },
      slug: 'tablet',
      price: 8500,
      compareAtPrice: 9500,
      sku: 'TEK-005',
      stock: 75,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=600&fit=crop',
      ],
      categorySlug: 'bilgisayarlar',
      status: 'active',
    },
    {
      name: {
        en: 'Smartwatch',
        tr: 'Akilli Saat',
        de: 'Smartwatch',
        fr: 'Montre Connectee',
        es: 'Reloj Inteligente',
      },
      description: {
        en: 'Stay connected and track your health with this premium smartwatch. Features heart-rate monitoring, GPS, sleep tracking, and a stunning always-on AMOLED display. Water-resistant up to 50 metres and compatible with both iOS and Android.',
        tr: 'Bu premium akilli saatle bagli kalin ve sagliginizi takip edin. Kalp atisi takibi, GPS, uyku izleme ve muhtesem her zaman acik AMOLED ekran sunar. 50 metreye kadar su direncli, hem iOS hem Android uyumludur.',
        de: 'Bleiben Sie verbunden und verfolgen Sie Ihre Gesundheit mit dieser Premium-Smartwatch. Mit Herzfrequenzmessung, GPS, Schlafueberwachung und einem atemberaubenden Always-On-AMOLED-Display. Wasserbestaendig bis 50 Meter und kompatibel mit iOS und Android.',
        fr: 'Restez connecte et suivez votre sante avec cette montre connectee premium. Surveillance de la frequence cardiaque, GPS, suivi du sommeil et un superbe ecran AMOLED toujours actif. Resistante a l\'eau jusqu\'a 50 metres et compatible iOS et Android.',
        es: 'Mantente conectado y controla tu salud con este smartwatch premium. Monitoreo de frecuencia cardiaca, GPS, seguimiento del sueno y una impresionante pantalla AMOLED siempre encendida. Resistente al agua hasta 50 metros y compatible con iOS y Android.',
      },
      slug: 'akilli-saat',
      price: 4500,
      compareAtPrice: 5200,
      sku: 'TEK-006',
      stock: 120,
      images: [
        'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=600&fit=crop',
      ],
      categorySlug: 'aksesuarlar',
      status: 'active',
    },
  ],

  // -------------------------------------------------------------------------
  // Pages
  // -------------------------------------------------------------------------
  pages: [
    // -- HOME --
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
          {
            id: 'seed_teknoloji_home_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Meet Technology',
                tr: 'Teknolojiyle Tanisin',
                de: 'Entdecken Sie Technologie',
                fr: 'Decouvrez la Technologie',
                es: 'Conoce la Tecnologia',
              },
              subtitle: {
                en: 'Discover the latest gadgets and devices that power your world.',
                tr: 'Dunyanizi guclendiren en yeni cihazlari ve teknolojileri kesfedin.',
                de: 'Entdecken Sie die neuesten Geraete und Technologien, die Ihre Welt antreiben.',
                fr: 'Decouvrez les derniers gadgets et appareils qui alimentent votre monde.',
                es: 'Descubre los ultimos gadgets y dispositivos que impulsan tu mundo.',
              },
              backgroundImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=800&fit=crop',
              buttonText: {
                en: 'Shop Now',
                tr: 'Alisverise Basla',
                de: 'Jetzt einkaufen',
                fr: 'Acheter maintenant',
                es: 'Comprar ahora',
              },
              buttonLink: '/pages/shop',
            },
          },
          {
            id: 'seed_teknoloji_home_spacer1',
            type: 'spacer',
            props: { height: '3rem' },
          },
          {
            id: 'seed_teknoloji_home_products',
            type: 'product-showcase',
            props: {
              title: {
                en: 'Featured Products',
                tr: 'One Cikan Urunler',
                de: 'Empfohlene Produkte',
                fr: 'Produits en vedette',
                es: 'Productos destacados',
              },
              limit: 8,
              columns: 4,
            },
          },
          {
            id: 'seed_teknoloji_home_spacer2',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_teknoloji_home_categories',
            type: 'category-showcase',
            props: {
              title: {
                en: 'Browse Categories',
                tr: 'Kategorilere Gozat',
                de: 'Kategorien durchsuchen',
                fr: 'Parcourir les categories',
                es: 'Explorar categorias',
              },
              limit: 6,
              columns: 3,
            },
          },
          {
            id: 'seed_teknoloji_home_spacer3',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_teknoloji_home_banner',
            type: 'banner',
            props: {
              title: {
                en: 'Free Shipping on Orders Over $100',
                tr: '100$ Uzeri Siparislerde Ucretsiz Kargo',
                de: 'Kostenloser Versand ab 100$',
                fr: 'Livraison gratuite pour les commandes de plus de 100$',
                es: 'Envio gratis en pedidos superiores a 100$',
              },
              backgroundImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=400&fit=crop',
            },
          },
          {
            id: 'seed_teknoloji_home_spacer4',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_teknoloji_home_newsletter',
            type: 'newsletter',
            props: {
              title: {
                en: 'Stay Ahead of the Curve',
                tr: 'Teknolojide Bir Adim Onde Olun',
                de: 'Bleiben Sie der Technik voraus',
                fr: 'Gardez une longueur d\'avance',
                es: 'Mantente a la vanguardia',
              },
              description: {
                en: 'Subscribe for the latest tech news, product launches, and exclusive deals.',
                tr: 'En son teknoloji haberleri, urun lansmanlar ve ozel firsatlar icin abone olun.',
                de: 'Abonnieren Sie die neuesten Tech-News, Produkteinfuehrungen und exklusive Angebote.',
                fr: 'Abonnez-vous pour les dernieres nouvelles tech, lancements de produits et offres exclusives.',
                es: 'Suscribete para las ultimas noticias tech, lanzamientos de productos y ofertas exclusivas.',
              },
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Tech Store — Discover the latest laptops, phones, and accessories.',
        tr: 'Teknoloji Magazasi — En yeni laptop, telefon ve aksesuarlari kesfedin.',
        de: 'Technik-Shop — Entdecken Sie die neuesten Laptops, Telefone und Zubehoer.',
        fr: 'Boutique Tech — Decouvrez les derniers ordinateurs, telephones et accessoires.',
        es: 'Tienda Tech — Descubre los ultimos laptops, telefonos y accesorios.',
      },
    },

    // -- SHOP --
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
            id: 'seed_teknoloji_shop_hero',
            type: 'hero',
            props: {
              title: {
                en: 'All Products',
                tr: 'Tum Urunler',
                de: 'Alle Produkte',
                fr: 'Tous les produits',
                es: 'Todos los productos',
              },
              subtitle: {
                en: 'Browse our full range of technology products.',
                tr: 'Tum teknoloji urunlerimize gozatin.',
                de: 'Durchsuchen Sie unser gesamtes Sortiment an Technikprodukten.',
                fr: 'Parcourez notre gamme complete de produits technologiques.',
                es: 'Explore nuestra gama completa de productos tecnologicos.',
              },
              size: 'small',
            },
          },
          {
            id: 'seed_teknoloji_shop_listing',
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
        en: 'Shop — Browse all technology products.',
        tr: 'Magaza — Tum teknoloji urunlerini kesfet.',
        de: 'Shop — Alle Technikprodukte durchsuchen.',
        fr: 'Boutique — Parcourir tous les produits technologiques.',
        es: 'Tienda — Explora todos los productos tecnologicos.',
      },
    },

    // -- CATEGORIES --
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
            id: 'seed_teknoloji_categories_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Categories',
                tr: 'Kategoriler',
                de: 'Kategorien',
                fr: 'Categories',
                es: 'Categorias',
              },
              subtitle: {
                en: 'Find exactly what you need by exploring our product categories.',
                tr: 'Urun kategorilerimizi kesfederek tam ihtiyaciniz olani bulun.',
                de: 'Finden Sie genau das, was Sie brauchen, indem Sie unsere Produktkategorien durchsuchen.',
                fr: 'Trouvez exactement ce dont vous avez besoin en explorant nos categories de produits.',
                es: 'Encuentra exactamente lo que necesitas explorando nuestras categorias de productos.',
              },
              size: 'small',
            },
          },
          {
            id: 'seed_teknoloji_categories_listing',
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
        en: 'Categories — Explore technology product categories.',
        tr: 'Kategoriler — Teknoloji urun kategorilerini kesfet.',
        de: 'Kategorien — Technologie-Produktkategorien durchsuchen.',
        fr: 'Categories — Explorer les categories de produits technologiques.',
        es: 'Categorias — Explora las categorias de productos tecnologicos.',
      },
    },

    // -- PRODUCTS --
    {
      slug: 'products',
      title: {
        en: 'Products',
        tr: 'Urunler',
        de: 'Produkte',
        fr: 'Produits',
        es: 'Productos',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_teknoloji_products_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Products',
                tr: 'Urunler',
                de: 'Produkte',
                fr: 'Produits',
                es: 'Productos',
              },
              subtitle: {
                en: 'Explore our complete technology product catalog.',
                tr: 'Teknoloji urun katalogumuzu kesfedin.',
                de: 'Entdecken Sie unseren kompletten Technologie-Produktkatalog.',
                fr: 'Decouvrez notre catalogue complet de produits technologiques.',
                es: 'Explora nuestro catalogo completo de productos tecnologicos.',
              },
              size: 'small',
            },
          },
          {
            id: 'seed_teknoloji_products_listing',
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
        en: 'Products — Full technology product catalog.',
        tr: 'Urunler — Tam teknoloji urun katalogu.',
        de: 'Produkte — Vollstaendiger Technologie-Produktkatalog.',
        fr: 'Produits — Catalogue complet de produits technologiques.',
        es: 'Productos — Catalogo completo de productos tecnologicos.',
      },
    },

    // -- ABOUT --
    {
      slug: 'about',
      title: {
        en: 'About Us',
        tr: 'Hakkimizda',
        de: 'Uber uns',
        fr: 'A propos',
        es: 'Sobre nosotros',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_teknoloji_about_hero',
            type: 'hero',
            props: {
              title: {
                en: 'About Us',
                tr: 'Hakkimizda',
                de: 'Uber uns',
                fr: 'A propos de nous',
                es: 'Sobre nosotros',
              },
              subtitle: {
                en: 'Passionate about technology, dedicated to our customers.',
                tr: 'Teknolojiye tutku ile bagli, musterilerimize adanmis.',
                de: 'Leidenschaftlich fuer Technologie, engagiert fuer unsere Kunden.',
                fr: 'Passionnes par la technologie, devoues a nos clients.',
                es: 'Apasionados por la tecnologia, dedicados a nuestros clientes.',
              },
              backgroundImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&h=800&fit=crop',
            },
          },
          {
            id: 'seed_teknoloji_about_text',
            type: 'text',
            props: {
              tag: 'div',
              content: {
                en: '<p>We are a team of technology enthusiasts on a mission to bring the best gadgets and devices to your doorstep. Founded in 2020, we have grown from a small startup into a trusted destination for tech lovers across the globe. We carefully curate every product in our catalog to ensure it meets our high standards for quality, performance, and value.</p><p>Our commitment extends beyond sales. We provide expert guidance, detailed reviews, and responsive after-sales support so you can make informed decisions and enjoy your purchases for years to come. Innovation drives everything we do, and we are constantly expanding our range to keep you ahead of the curve.</p>',
                tr: '<p>En iyi cihaz ve teknolojileri kapiiniza getirme goreviyle yola cikan bir teknoloji tutkunlari ekibiyiz. 2020 yilinda kurulan firmamiz, kucuk bir girisimden dunyanin dort bir yanindaki teknoloji severlerin guvenligi bir adrese donusmustur. Katalogumuzdaki her urunu kalite, performans ve deger acisindan yuksek standartlarimizi karsiladigindan emin olmak icin ozenle seciyoruz.</p><p>Taahhudumuz satisin otesine uzanir. Uzman rehberligi, detayli incelemeler ve duyarli satis sonrasi destek sunarak bilinclili kararlar vermenizi ve alisverislerinizden uzun yillar keyif almanizi sagliyoruz. Yenilik yaptigimiz her seyin itici gucudur ve sizi teknolojide bir adim onde tutmak icin yelpazemizi surekli genisletiyoruz.</p>',
                de: '<p>Wir sind ein Team von Technologie-Enthusiasten mit der Mission, die besten Gadgets und Geraete zu Ihnen zu bringen. 2020 gegruendet, sind wir von einem kleinen Startup zu einer vertrauenswuerdigen Anlaufstelle fuer Technikliebhaber weltweit gewachsen. Wir kuratieren jedes Produkt in unserem Katalog sorgfaeltig, um sicherzustellen, dass es unseren hohen Anspruechen an Qualitaet, Leistung und Preis-Leistung genuegt.</p><p>Unser Engagement geht ueber den Verkauf hinaus. Wir bieten fachkundige Beratung, detaillierte Bewertungen und reaktionsschnellen After-Sales-Support, damit Sie fundierte Entscheidungen treffen und Ihre Einkaufe jahrelang geniessen koennen. Innovation treibt alles an, was wir tun, und wir erweitern staendig unser Sortiment, um Sie der Technik voraus zu halten.</p>',
                fr: '<p>Nous sommes une equipe de passionnes de technologie dont la mission est de vous apporter les meilleurs gadgets et appareils. Fondee en 2020, notre entreprise est passee d\'une petite startup a une destination de confiance pour les amateurs de technologie du monde entier. Nous selectionnons soigneusement chaque produit de notre catalogue pour nous assurer qu\'il repond a nos normes elevees de qualite, de performance et de rapport qualite-prix.</p><p>Notre engagement va au-dela de la vente. Nous fournissons des conseils d\'experts, des avis detailles et un support apres-vente reactif pour que vous puissiez prendre des decisions eclairees et profiter de vos achats pendant des annees. L\'innovation guide tout ce que nous faisons, et nous elargissons constamment notre gamme pour vous garder en avance sur la courbe.</p>',
                es: '<p>Somos un equipo de entusiastas de la tecnologia con la mision de llevar los mejores gadgets y dispositivos a tu puerta. Fundada en 2020, hemos crecido de una pequena startup a un destino de confianza para los amantes de la tecnologia en todo el mundo. Seleccionamos cuidadosamente cada producto de nuestro catalogo para asegurar que cumpla con nuestros altos estandares de calidad, rendimiento y valor.</p><p>Nuestro compromiso va mas alla de las ventas. Proporcionamos orientacion experta, resenas detalladas y soporte postventa receptivo para que puedas tomar decisiones informadas y disfrutar de tus compras durante anos. La innovacion impulsa todo lo que hacemos, y estamos constantemente ampliando nuestra gama para mantenerte a la vanguardia.</p>',
              },
            },
            style: {
              maxWidth: '800px',
              margin: '0 auto',
              padding: '2rem 1rem',
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'About Us — Learn about our passion for technology and our mission.',
        tr: 'Hakkimizda — Teknoloji tutkumuzu ve gorevimizi ogreni.',
        de: 'Uber uns — Erfahren Sie mehr ueber unsere Leidenschaft fuer Technologie.',
        fr: 'A propos — Decouvrez notre passion pour la technologie et notre mission.',
        es: 'Sobre nosotros — Conoce nuestra pasion por la tecnologia y nuestra mision.',
      },
    },

    // -- CONTACT --
    {
      slug: 'contact',
      title: {
        en: 'Contact',
        tr: 'Iletisim',
        de: 'Kontakt',
        fr: 'Contact',
        es: 'Contacto',
      },
      content: {
        version: 1,
        blocks: [
          {
            id: 'seed_teknoloji_contact_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Contact Us',
                tr: 'Bize Ulasin',
                de: 'Kontaktieren Sie uns',
                fr: 'Contactez-nous',
                es: 'Contactenos',
              },
              subtitle: {
                en: 'We are here to help. Reach out to our support team.',
                tr: 'Yardim etmek icin buradayiz. Destek ekibimize ulasin.',
                de: 'Wir sind fuer Sie da. Kontaktieren Sie unser Support-Team.',
                fr: 'Nous sommes la pour vous aider. Contactez notre equipe de support.',
                es: 'Estamos aqui para ayudar. Contacta con nuestro equipo de soporte.',
              },
            },
          },
          {
            id: 'seed_teknoloji_contact_columns',
            type: 'columns',
            props: { columns: 2, gap: '2rem' },
            children: [
              {
                id: 'seed_teknoloji_contact_info',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h3>Contact Information</h3><p><strong>Email:</strong> support@techstore.com</p><p><strong>Phone:</strong> +1 (555) 123-4567</p><p><strong>Address:</strong> 123 Innovation Avenue, Tech District, CA 94105</p>',
                    tr: '<h3>Iletisim Bilgileri</h3><p><strong>E-posta:</strong> support@techstore.com</p><p><strong>Telefon:</strong> +1 (555) 123-4567</p><p><strong>Adres:</strong> 123 Inovasyon Caddesi, Teknoloji Bolgesi, CA 94105</p>',
                    de: '<h3>Kontaktinformationen</h3><p><strong>E-Mail:</strong> support@techstore.com</p><p><strong>Telefon:</strong> +1 (555) 123-4567</p><p><strong>Adresse:</strong> 123 Innovation Avenue, Tech District, CA 94105</p>',
                    fr: '<h3>Informations de contact</h3><p><strong>E-mail:</strong> support@techstore.com</p><p><strong>Telephone:</strong> +1 (555) 123-4567</p><p><strong>Adresse:</strong> 123 Innovation Avenue, Tech District, CA 94105</p>',
                    es: '<h3>Informacion de contacto</h3><p><strong>Correo:</strong> support@techstore.com</p><p><strong>Telefono:</strong> +1 (555) 123-4567</p><p><strong>Direccion:</strong> 123 Innovation Avenue, Tech District, CA 94105</p>',
                  },
                },
              },
              {
                id: 'seed_teknoloji_contact_hours',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h3>Business Hours</h3><p><strong>Monday - Friday:</strong> 09:00 - 18:00</p><p><strong>Saturday:</strong> 10:00 - 16:00</p><p><strong>Sunday:</strong> Closed</p><p>Our online support chat is available 24/7.</p>',
                    tr: '<h3>Calisma Saatleri</h3><p><strong>Pazartesi - Cuma:</strong> 09:00 - 18:00</p><p><strong>Cumartesi:</strong> 10:00 - 16:00</p><p><strong>Pazar:</strong> Kapali</p><p>Online destek sohbetimiz 7/24 kullanilabilir.</p>',
                    de: '<h3>Geschaeftszeiten</h3><p><strong>Montag - Freitag:</strong> 09:00 - 18:00</p><p><strong>Samstag:</strong> 10:00 - 16:00</p><p><strong>Sonntag:</strong> Geschlossen</p><p>Unser Online-Support-Chat ist rund um die Uhr verfuegbar.</p>',
                    fr: '<h3>Heures d\'ouverture</h3><p><strong>Lundi - Vendredi:</strong> 09:00 - 18:00</p><p><strong>Samedi:</strong> 10:00 - 16:00</p><p><strong>Dimanche:</strong> Ferme</p><p>Notre chat de support en ligne est disponible 24h/24, 7j/7.</p>',
                    es: '<h3>Horario comercial</h3><p><strong>Lunes - Viernes:</strong> 09:00 - 18:00</p><p><strong>Sabado:</strong> 10:00 - 16:00</p><p><strong>Domingo:</strong> Cerrado</p><p>Nuestro chat de soporte en linea esta disponible las 24 horas del dia, los 7 dias de la semana.</p>',
                  },
                },
              },
            ],
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Contact Us — Get in touch with our support team.',
        tr: 'Iletisim — Destek ekibimizle iletisime gecin.',
        de: 'Kontakt — Nehmen Sie Kontakt mit unserem Support-Team auf.',
        fr: 'Contact — Contactez notre equipe de support.',
        es: 'Contacto — Ponte en contacto con nuestro equipo de soporte.',
      },
    },

    // -- FAQ --
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
            id: 'seed_teknoloji_faq_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Frequently Asked Questions',
                tr: 'Sikca Sorulan Sorular',
                de: 'Haeufig gestellte Fragen',
                fr: 'Questions frequemment posees',
                es: 'Preguntas frecuentes',
              },
              subtitle: {
                en: 'Find quick answers to common questions about our products and services.',
                tr: 'Urunlerimiz ve hizmetlerimiz hakkinda sik sorulan sorularin hizli yanitlarini bulun.',
                de: 'Finden Sie schnelle Antworten auf haeufige Fragen zu unseren Produkten und Dienstleistungen.',
                fr: 'Trouvez des reponses rapides aux questions courantes sur nos produits et services.',
                es: 'Encuentra respuestas rapidas a preguntas comunes sobre nuestros productos y servicios.',
              },
            },
          },
          {
            id: 'seed_teknoloji_faq_accordion',
            type: 'accordion',
            props: {
              items: [
                {
                  question: {
                    en: 'What warranty do your products come with?',
                    tr: 'Urunleriniz hangi garantiyle geliyor?',
                    de: 'Welche Garantie haben Ihre Produkte?',
                    fr: 'Quelle garantie accompagne vos produits?',
                    es: 'Que garantia tienen sus productos?',
                  },
                  answer: {
                    en: 'All our products come with a minimum 2-year manufacturer warranty. Extended warranty plans of up to 5 years are available at checkout. Warranty covers hardware defects and manufacturing issues but does not cover accidental damage or misuse.',
                    tr: 'Tum urunlerimiz minimum 2 yillik uretici garantisi ile gelmektedir. Odeme sirasinda 5 yila kadar uzatilmis garanti planlari mevcuttur. Garanti, donanim kusurlarini ve uretim sorunlarini kapsar ancak kaza sonucu hasar veya yanlis kullanimii kapsamaz.',
                    de: 'Alle unsere Produkte haben mindestens 2 Jahre Herstellergarantie. Erweiterte Garantieplaene von bis zu 5 Jahren sind beim Checkout verfuegbar. Die Garantie deckt Hardwaredefekte und Herstellungsfehler ab, nicht jedoch Unfallschaeden oder Missbrauch.',
                    fr: 'Tous nos produits sont accompagnes d\'une garantie fabricant minimale de 2 ans. Des extensions de garantie jusqu\'a 5 ans sont disponibles lors du paiement. La garantie couvre les defauts materiels et les problemes de fabrication, mais ne couvre pas les dommages accidentels ou la mauvaise utilisation.',
                    es: 'Todos nuestros productos vienen con un minimo de 2 anos de garantia del fabricante. Planes de garantia extendida de hasta 5 anos estan disponibles al pagar. La garantia cubre defectos de hardware y problemas de fabricacion, pero no cubre danos accidentales o mal uso.',
                  },
                },
                {
                  question: {
                    en: 'Where can I find detailed product specifications?',
                    tr: 'Detayli urun ozelliklerini nerede bulabilirim?',
                    de: 'Wo finde ich detaillierte Produktspezifikationen?',
                    fr: 'Ou puis-je trouver les specifications detaillees des produits?',
                    es: 'Donde puedo encontrar las especificaciones detalladas del producto?',
                  },
                  answer: {
                    en: 'Every product page includes a full specifications tab with detailed technical information such as processor, memory, display, battery, and connectivity options. If you need additional details, feel free to contact our support team.',
                    tr: 'Her urun sayfasi islemci, bellek, ekran, batarya ve baglanti secenekleri gibi detayli teknik bilgiler iceren tam bir ozellikler sekmesi icerir. Ek bilgiye ihtiyaciniz varsa, destek ekibimizle iletisime gecmekten cekinmeyin.',
                    de: 'Jede Produktseite enthaelt einen vollstaendigen Spezifikations-Tab mit detaillierten technischen Informationen wie Prozessor, Speicher, Display, Akku und Konnektivitaetsoptionen. Fuer zusaetzliche Details koennen Sie gerne unser Support-Team kontaktieren.',
                    fr: 'Chaque page produit comprend un onglet de specifications complet avec des informations techniques detaillees telles que le processeur, la memoire, l\'ecran, la batterie et les options de connectivite. Pour des details supplementaires, n\'hesitez pas a contacter notre equipe de support.',
                    es: 'Cada pagina de producto incluye una pestana de especificaciones completa con informacion tecnica detallada como procesador, memoria, pantalla, bateria y opciones de conectividad. Si necesitas detalles adicionales, no dudes en contactar a nuestro equipo de soporte.',
                  },
                },
                {
                  question: {
                    en: 'Are your products compatible with my existing devices?',
                    tr: 'Urunleriniz mevcut cihazlarimla uyumlu mu?',
                    de: 'Sind Ihre Produkte mit meinen vorhandenen Geraeten kompatibel?',
                    fr: 'Vos produits sont-ils compatibles avec mes appareils existants?',
                    es: 'Son sus productos compatibles con mis dispositivos existentes?',
                  },
                  answer: {
                    en: 'We list compatibility information on every product page, including supported operating systems, connection types, and minimum requirements. Our support team can also help verify compatibility before you purchase.',
                    tr: 'Her urun sayfasinda desteklenen isletim sistemleri, baglanti turleri ve minimum gereksinimler dahil uyumluluk bilgilerini listeliyoruz. Destek ekibimiz de satin almadan once uyumlulugu dogrulamaniza yardimci olabilir.',
                    de: 'Wir listen auf jeder Produktseite Kompatibilitaetsinformationen auf, einschliesslich unterstuetzter Betriebssysteme, Verbindungstypen und Mindestanforderungen. Unser Support-Team kann die Kompatibilitaet vor dem Kauf ebenfalls ueberpruefen.',
                    fr: 'Nous listons les informations de compatibilite sur chaque page produit, y compris les systemes d\'exploitation pris en charge, les types de connexion et les exigences minimales. Notre equipe de support peut egalement verifier la compatibilite avant votre achat.',
                    es: 'Listamos la informacion de compatibilidad en cada pagina de producto, incluyendo sistemas operativos compatibles, tipos de conexion y requisitos minimos. Nuestro equipo de soporte tambien puede verificar la compatibilidad antes de tu compra.',
                  },
                },
                {
                  question: {
                    en: 'What is your return and exchange policy?',
                    tr: 'Iade ve degisim politikaniz nedir?',
                    de: 'Was ist Ihre Rueckgabe- und Umtauschpolitik?',
                    fr: 'Quelle est votre politique de retour et d\'echange?',
                    es: 'Cual es su politica de devolucion e intercambio?',
                  },
                  answer: {
                    en: 'We offer a 30-day hassle-free return policy for unused products in their original packaging. If you receive a defective item, we will replace it free of charge or issue a full refund. Simply contact our support team to initiate the return process.',
                    tr: 'Orijinal ambalajinda kullanilmamis urunler icin 30 gunluk sorunsuz iade politikasi sunuyoruz. Arizado bir urun alirsaniz, ucretsiz olarak degistirir veya tam iade yapariz. Iade surecini baslatmak icin destek ekibimizle iletisime gecmeniz yeterlidir.',
                    de: 'Wir bieten eine 30-taegige unkomplizierte Rueckgabepolitik fuer unbenutzte Produkte in Originalverpackung. Wenn Sie einen defekten Artikel erhalten, tauschen wir ihn kostenlos um oder erstatten den vollen Betrag. Kontaktieren Sie einfach unser Support-Team, um den Rueckgabeprozess einzuleiten.',
                    fr: 'Nous offrons une politique de retour sans tracas de 30 jours pour les produits non utilises dans leur emballage d\'origine. Si vous recevez un article defectueux, nous le remplacerons gratuitement ou emettrons un remboursement complet. Contactez simplement notre equipe de support pour initier le processus de retour.',
                    es: 'Ofrecemos una politica de devolucion sin complicaciones de 30 dias para productos sin usar en su embalaje original. Si recibes un articulo defectuoso, lo reemplazaremos sin cargo o emitiremos un reembolso completo. Simplemente contacta a nuestro equipo de soporte para iniciar el proceso de devolucion.',
                  },
                },
                {
                  question: {
                    en: 'Do you offer technical support after purchase?',
                    tr: 'Satin alma sonrasi teknik destek sunuyor musunuz?',
                    de: 'Bieten Sie nach dem Kauf technischen Support an?',
                    fr: 'Offrez-vous un support technique apres l\'achat?',
                    es: 'Ofrecen soporte tecnico despues de la compra?',
                  },
                  answer: {
                    en: 'Yes, we provide free technical support for all products purchased from our store. Our expert team is available via live chat, email, and phone during business hours. We also maintain a comprehensive knowledge base with setup guides, troubleshooting tips, and video tutorials.',
                    tr: 'Evet, magazamizdan satin alinan tum urunler icin ucretsiz teknik destek sagliyoruz. Uzman ekibimiz canli sohbet, e-posta ve telefon araciligiyla mesai saatlerinde hizmetinizdedir. Ayrica kurulum kilavuzlari, sorun giderme ipuclari ve video egitimler iceren kapsamli bir bilgi bankasi tutuyoruz.',
                    de: 'Ja, wir bieten kostenlosen technischen Support fuer alle in unserem Shop gekauften Produkte. Unser Expertenteam ist waehrend der Geschaeftszeiten per Live-Chat, E-Mail und Telefon erreichbar. Wir pflegen ausserdem eine umfassende Wissensdatenbank mit Einrichtungsanleitungen, Fehlerbehebungstipps und Video-Tutorials.',
                    fr: 'Oui, nous fournissons un support technique gratuit pour tous les produits achetes dans notre magasin. Notre equipe d\'experts est disponible par chat en direct, e-mail et telephone pendant les heures d\'ouverture. Nous maintenons egalement une base de connaissances complete avec des guides d\'installation, des conseils de depannage et des tutoriels video.',
                    es: 'Si, proporcionamos soporte tecnico gratuito para todos los productos comprados en nuestra tienda. Nuestro equipo de expertos esta disponible por chat en vivo, correo electronico y telefono durante el horario comercial. Tambien mantenemos una base de conocimientos completa con guias de configuracion, consejos de solucion de problemas y tutoriales en video.',
                  },
                },
              ],
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'FAQ — Answers to common questions about tech products and support.',
        tr: 'SSS — Teknoloji urunleri ve destek hakkinda sik sorulan sorularin yanitlari.',
        de: 'FAQ — Antworten auf haeufige Fragen zu Technikprodukten und Support.',
        fr: 'FAQ — Reponses aux questions courantes sur les produits tech et le support.',
        es: 'Preguntas frecuentes — Respuestas a preguntas comunes sobre productos tech y soporte.',
      },
    },
  ],

  // -------------------------------------------------------------------------
  // Header — empty blocks to use common default
  // -------------------------------------------------------------------------
  header: {
    version: 1,
    blocks: [],
  },

  // -------------------------------------------------------------------------
  // Footer — empty blocks to use common default
  // -------------------------------------------------------------------------
  footer: {
    version: 1,
    blocks: [],
  },

  // -------------------------------------------------------------------------
  // Settings
  // -------------------------------------------------------------------------
  settings: [
    { key: 'sector', value: 'teknoloji', group: 'general' },
    { key: 'currency', value: 'TRY', group: 'general' },
    { key: 'store_name', value: { en: 'Tech Store', tr: 'Teknoloji Magazasi', de: 'Technik-Shop', fr: 'Boutique Tech', es: 'Tienda Tech' }, group: 'general' },
    { key: 'primary_color', value: '#2563eb', group: 'appearance' },
    { key: 'secondary_color', value: '#1e40af', group: 'appearance' },
  ],
};
