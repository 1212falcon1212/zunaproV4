import type { SectorSeedData } from './types';
import type { PageContent, Block } from '@zunapro/types';

// ---------------------------------------------------------------------------
// Giyim (Fashion / Clothing) Sector Seed Data
// ---------------------------------------------------------------------------

export const giyimSeedData: SectorSeedData = {
  // -------------------------------------------------------------------------
  // Categories
  // -------------------------------------------------------------------------
  categories: [
    {
      name: {
        en: 'Women\'s Fashion',
        tr: 'Kadin Giyim',
        de: 'Damenmode',
        fr: 'Mode Femme',
        es: 'Moda Mujer',
      },
      slug: 'kadin',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
      sortOrder: 1,
    },
    {
      name: {
        en: 'Men\'s Fashion',
        tr: 'Erkek Giyim',
        de: 'Herrenmode',
        fr: 'Mode Homme',
        es: 'Moda Hombre',
      },
      slug: 'erkek',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=600&fit=crop',
      sortOrder: 2,
    },
    {
      name: {
        en: 'Kids',
        tr: 'Cocuk Giyim',
        de: 'Kindermode',
        fr: 'Mode Enfant',
        es: 'Moda Infantil',
      },
      slug: 'cocuk',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=600&fit=crop',
      sortOrder: 3,
    },
    {
      name: {
        en: 'Shoes',
        tr: 'Ayakkabi',
        de: 'Schuhe',
        fr: 'Chaussures',
        es: 'Zapatos',
      },
      slug: 'ayakkabi',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
      sortOrder: 4,
    },
    {
      name: {
        en: 'Accessories',
        tr: 'Aksesuar',
        de: 'Accessoires',
        fr: 'Accessoires',
        es: 'Accesorios',
      },
      slug: 'aksesuar',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=600&fit=crop',
      sortOrder: 5,
    },
  ],

  // -------------------------------------------------------------------------
  // Products
  // -------------------------------------------------------------------------
  products: [
    {
      name: {
        en: 'Designer Dress',
        tr: 'Tasarim Elbise',
        de: 'Designerkleid',
        fr: 'Robe de Createur',
        es: 'Vestido de Disenador',
      },
      description: {
        en: 'An elegant designer dress crafted from premium silk blend fabric. The flowing silhouette and intricate detailing make it perfect for evening events, cocktail parties, and special occasions. Available in multiple sizes with a flattering fit.',
        tr: 'Premium ipek karisimi kumastan uretilmis zarif bir tasarim elbise. Akici silueti ve detayli isciiligi ile aksam etkinlikleri, kokteyl partileri ve ozel gunler icin mukemmeldir. Birden fazla bedende, vucuda oturan bir kalipla mevcuttur.',
        de: 'Ein elegantes Designerkleid aus hochwertigem Seidenmischgewebe. Die fliessende Silhouette und die aufwendigen Details machen es perfekt fuer Abendveranstaltungen, Cocktailpartys und besondere Anlaesse. In mehreren Groessen mit schmeichelhafter Passform erhaeltlich.',
        fr: 'Une robe de createur elegante confectionnee a partir d\'un tissu en melange de soie premium. La silhouette fluide et les details elabores la rendent parfaite pour les soirees, les cocktails et les occasions speciales. Disponible en plusieurs tailles avec une coupe flatteuse.',
        es: 'Un elegante vestido de disenador confeccionado con tela de mezcla de seda premium. La silueta fluida y los detalles intrincados lo hacen perfecto para eventos nocturnos, fiestas de coctel y ocasiones especiales. Disponible en multiples tallas con un corte favorecedor.',
      },
      slug: 'tasarim-elbise',
      price: 2200,
      compareAtPrice: 2800,
      sku: 'GIY-001',
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=600&fit=crop',
      ],
      categorySlug: 'kadin',
      status: 'active',
    },
    {
      name: {
        en: 'Premium Suit',
        tr: 'Premium Takim Elbise',
        de: 'Premium-Anzug',
        fr: 'Costume Premium',
        es: 'Traje Premium',
      },
      description: {
        en: 'A meticulously tailored premium suit made from Italian wool. Features a slim-fit cut, satin-lined interior, and handstitched lapels. Perfect for business meetings, formal events, and making a lasting impression wherever you go.',
        tr: 'Italyan yununden ozenle dikilmis premium bir takim elbise. Dar kesim, saten astari ve el dikisi yakalarla donatilmistir. Is toplantilari, resmi etkinlikler ve gittiginiz her yerde kalici bir izlenim birakmak icin mukemmeldir.',
        de: 'Ein akribisch geschneiderter Premium-Anzug aus italienischer Wolle. Mit Slim-Fit-Schnitt, Satin-Futter und handgenaehten Revers. Perfekt fuer Geschaeftstreffen, formelle Veranstaltungen und um ueberall einen bleibenden Eindruck zu hinterlassen.',
        fr: 'Un costume premium minutieusement taille en laine italienne. Coupe ajustee, interieur double en satin et revers cousus a la main. Parfait pour les reunions d\'affaires, les evenements formels et pour faire une impression durable partout ou vous allez.',
        es: 'Un traje premium meticulosamente confeccionado en lana italiana. Corte slim fit, interior forrado en satin y solapas cosidas a mano. Perfecto para reuniones de negocios, eventos formales y causar una impresion duradera dondequiera que vayas.',
      },
      slug: 'premium-takim-elbise',
      price: 4500,
      compareAtPrice: 5500,
      sku: 'GIY-002',
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
      ],
      categorySlug: 'erkek',
      status: 'active',
    },
    {
      name: {
        en: 'Leather Jacket',
        tr: 'Deri Ceket',
        de: 'Lederjacke',
        fr: 'Veste en Cuir',
        es: 'Chaqueta de Cuero',
      },
      description: {
        en: 'A timeless leather jacket made from genuine lambskin leather with a buttery soft touch. Features a classic biker silhouette, YKK zippers, and quilted lining for warmth. This jacket only gets better with age and is a wardrobe essential for any season.',
        tr: 'Yumusacik dokuslu gercek kuzu derisinden uretilmis zamansiz bir deri ceket. Klasik biker silueti, YKK fermuarlar ve sicaklik icin kapitone astar sunar. Yillar gectikce daha da guzel gorunen bu ceket, her mevsim icin gardrop vazgecilmezidir.',
        de: 'Eine zeitlose Lederjacke aus echtem Lammleder mit butterweichem Griff. Mit klassischer Biker-Silhouette, YKK-Reissverschluessen und gestepptem Futter fuer Waerme. Diese Jacke wird mit dem Alter nur besser und ist ein Kleiderschrank-Essential fuer jede Saison.',
        fr: 'Une veste en cuir intemporelle en veritable cuir d\'agneau au toucher soyeux. Silhouette biker classique, fermetures YKK et doublure matelassee pour la chaleur. Cette veste ne fait que s\'ameliorer avec le temps et est un essentiel de garde-robe pour toute saison.',
        es: 'Una chaqueta de cuero atemporal hecha de genuino cuero de cordero con un tacto suave como la mantequilla. Silueta biker clasica, cremalleras YKK y forro acolchado para calidez. Esta chaqueta solo mejora con el tiempo y es esencial en cualquier armario para cualquier temporada.',
      },
      slug: 'deri-ceket',
      price: 3800,
      compareAtPrice: 4500,
      sku: 'GIY-003',
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=600&fit=crop',
      ],
      categorySlug: 'erkek',
      status: 'active',
    },
    {
      name: {
        en: 'Sneakers',
        tr: 'Spor Ayakkabi',
        de: 'Sneakers',
        fr: 'Baskets',
        es: 'Zapatillas Deportivas',
      },
      description: {
        en: 'Premium sneakers designed for both comfort and style. Featuring a lightweight EVA midsole, breathable knit upper, and durable rubber outsole. Whether you are hitting the gym or strolling through the city, these sneakers keep you moving in style.',
        tr: 'Hem konfor hem stil icin tasarlanmis premium spor ayakkabilar. Hafif EVA orta taban, nefes alan orgu ust kisim ve dayanikli kaucuk dis tabanla donatilmistir. Spor salonuna giderken veya sehirde gezinirken bu ayakkabilar sizi stil icinde hareket ettirir.',
        de: 'Premium-Sneaker fuer Komfort und Stil. Mit leichter EVA-Zwischensohle, atmungsaktivem Strick-Obermaterial und strapazierfaehiger Gummi-Aussensohle. Ob im Fitnessstudio oder beim Stadtbummel, diese Sneaker halten Sie stilvoll in Bewegung.',
        fr: 'Des baskets premium concues pour le confort et le style. Semelle intermediaire EVA legere, tige en tricot respirant et semelle exterieure en caoutchouc durable. Que vous alliez a la salle de sport ou que vous vous promeniez en ville, ces baskets vous gardent en mouvement avec style.',
        es: 'Zapatillas premium disenadas tanto para comodidad como para estilo. Con entresuela de EVA ligera, parte superior de tejido transpirable y suela de goma duradera. Ya sea en el gimnasio o paseando por la ciudad, estas zapatillas te mantienen en movimiento con estilo.',
      },
      slug: 'spor-ayakkabi',
      price: 1500,
      compareAtPrice: 1900,
      sku: 'GIY-004',
      stock: 100,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop',
      ],
      categorySlug: 'ayakkabi',
      status: 'active',
    },
    {
      name: {
        en: 'Kids Set',
        tr: 'Cocuk Seti',
        de: 'Kinder-Set',
        fr: 'Ensemble Enfant',
        es: 'Conjunto Infantil',
      },
      description: {
        en: 'A playful and comfortable kids clothing set that includes a printed T-shirt and matching jogger pants. Made from 100% organic cotton, it is soft on sensitive skin and built to withstand everyday adventures. Machine washable and available in sizes 2-12.',
        tr: 'Baskili bir tisort ve uyumlu jogger pantolon iceren eglenceli ve rahat bir cocuk giyim seti. %100 organik pamuktan uretilmistir, hassas ciltlere karsi yumusak ve gunluk maceralara dayaniklidir. Makinede yikanabilir ve 2-12 yas bedenlerinde mevcuttur.',
        de: 'Ein verspieltes und bequemes Kinderkleidungs-Set mit bedrucktem T-Shirt und passender Jogginghose. Aus 100% Bio-Baumwolle, sanft zu empfindlicher Haut und fuer den Alltag gemacht. Maschinenwaesche und in den Groessen 2-12 erhaeltlich.',
        fr: 'Un ensemble de vetements pour enfants ludique et confortable comprenant un T-shirt imprime et un pantalon de jogging assorti. Fabrique en 100% coton biologique, doux pour les peaux sensibles et concu pour resister aux aventures quotidiennes. Lavable en machine et disponible en tailles 2-12.',
        es: 'Un conjunto de ropa infantil divertido y comodo que incluye camiseta estampada y pantalon jogger a juego. Fabricado con 100% algodon organico, es suave con la piel sensible y esta hecho para resistir las aventuras diarias. Lavable a maquina y disponible en tallas 2-12.',
      },
      slug: 'cocuk-seti',
      price: 650,
      compareAtPrice: 850,
      sku: 'GIY-005',
      stock: 200,
      images: [
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&h=600&fit=crop',
      ],
      categorySlug: 'cocuk',
      status: 'active',
    },
    {
      name: {
        en: 'Designer Bag',
        tr: 'Tasarim Canta',
        de: 'Designertasche',
        fr: 'Sac de Createur',
        es: 'Bolso de Disenador',
      },
      description: {
        en: 'A sophisticated designer handbag crafted from premium vegan leather. Features a spacious interior with multiple compartments, gold-tone hardware, and an adjustable crossbody strap. Elevate any outfit from day to night with this versatile accessory.',
        tr: 'Premium vegan deriden uretilmis sofistike bir tasarim el cantasi. Birden fazla bolmeli genis ic mekan, altin tonlu aksesuar ve ayarlanabilir capraz askiya sahiptir. Bu cok yonlu aksesuar ile herhangi bir kiyafeti gunduzden geceye tasiyin.',
        de: 'Eine raffinierte Designer-Handtasche aus hochwertigem veganem Leder. Geraeumiger Innenraum mit mehreren Faechern, goldfarbene Beschlaege und ein verstellbarer Crossbody-Riemen. Werten Sie jedes Outfit von Tag zu Nacht mit diesem vielseitigen Accessoire auf.',
        fr: 'Un sac a main de createur sophistique fabrique en cuir vegan premium. Interieur spacieux avec plusieurs compartiments, quincaillerie doree et bandouliere reglable. Sublimez n\'importe quelle tenue du jour a la nuit avec cet accessoire polyvalent.',
        es: 'Un sofisticado bolso de disenador elaborado en cuero vegano premium. Interior espacioso con multiples compartimentos, herrajes dorados y correa cruzada ajustable. Eleva cualquier atuendo del dia a la noche con este versatil accesorio.',
      },
      slug: 'tasarim-canta',
      price: 2800,
      compareAtPrice: 3500,
      sku: 'GIY-006',
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop',
      ],
      categorySlug: 'aksesuar',
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
            id: 'seed_giyim_home_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Collections That Reflect Your Style',
                tr: 'Tarzinizi Yansitan Koleksiyonlar',
                de: 'Kollektionen, die Ihren Stil widerspiegeln',
                fr: 'Des collections qui refletent votre style',
                es: 'Colecciones que reflejan tu estilo',
              },
              subtitle: {
                en: 'Explore curated fashion for every occasion and every season.',
                tr: 'Her mevsim ve her ozel gun icin secilmis moda koleksiyonlarini kesfedin.',
                de: 'Entdecken Sie kuratierte Mode fuer jeden Anlass und jede Saison.',
                fr: 'Explorez une mode soigneusement selectionnee pour chaque occasion et chaque saison.',
                es: 'Explora moda seleccionada para cada ocasion y cada temporada.',
              },
              backgroundImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=800&fit=crop',
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
            id: 'seed_giyim_home_spacer1',
            type: 'spacer',
            props: { height: '3rem' },
          },
          {
            id: 'seed_giyim_home_products',
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
            id: 'seed_giyim_home_spacer2',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_giyim_home_categories',
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
          },
          {
            id: 'seed_giyim_home_spacer3',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_giyim_home_banner',
            type: 'banner',
            props: {
              title: {
                en: 'New Season Collection — Up to 40% Off',
                tr: 'Yeni Sezon Koleksiyonu — %40\'a Varan Indirim',
                de: 'Neue Saisonkollektion — Bis zu 40% Rabatt',
                fr: 'Collection Nouvelle Saison — Jusqu\'a 40% de reduction',
                es: 'Coleccion Nueva Temporada — Hasta 40% de descuento',
              },
              backgroundImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=400&fit=crop',
            },
          },
          {
            id: 'seed_giyim_home_spacer4',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_giyim_home_newsletter',
            type: 'newsletter',
            props: {
              title: {
                en: 'Join Our Fashion Community',
                tr: 'Moda Toplulugumuza Katilin',
                de: 'Treten Sie unserer Mode-Community bei',
                fr: 'Rejoignez notre communaute mode',
                es: 'Unete a nuestra comunidad de moda',
              },
              description: {
                en: 'Subscribe for exclusive deals, new arrivals, and style inspiration delivered to your inbox.',
                tr: 'Ozel firsatlar, yeni gelenler ve stil ilhamini e-postaniza almak icin abone olun.',
                de: 'Abonnieren Sie exklusive Angebote, Neuheiten und Stilinspirationen direkt in Ihren Posteingang.',
                fr: 'Abonnez-vous pour des offres exclusives, les nouveautes et l\'inspiration mode livrees dans votre boite mail.',
                es: 'Suscribete para ofertas exclusivas, novedades e inspiracion de estilo directamente en tu bandeja de entrada.',
              },
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Fashion Store — Curated collections for women, men, and kids.',
        tr: 'Moda Magazasi — Kadin, erkek ve cocuk icin secilmis koleksiyonlar.',
        de: 'Modeshop — Kuratierte Kollektionen fuer Damen, Herren und Kinder.',
        fr: 'Boutique Mode — Collections selectionnees pour femmes, hommes et enfants.',
        es: 'Tienda de Moda — Colecciones seleccionadas para mujer, hombre y ninos.',
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
            id: 'seed_giyim_shop_hero',
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
                en: 'Browse our complete fashion collection.',
                tr: 'Tum moda koleksiyonumuza gozatin.',
                de: 'Durchsuchen Sie unsere komplette Modekollektion.',
                fr: 'Parcourez notre collection de mode complete.',
                es: 'Explora nuestra coleccion completa de moda.',
              },
              size: 'small',
            },
          },
          {
            id: 'seed_giyim_shop_listing',
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
        en: 'Shop — Browse all fashion products.',
        tr: 'Magaza — Tum moda urunlerini kesfet.',
        de: 'Shop — Alle Modeprodukte durchsuchen.',
        fr: 'Boutique — Parcourir tous les produits de mode.',
        es: 'Tienda — Explora todos los productos de moda.',
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
            id: 'seed_giyim_categories_hero',
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
                en: 'Discover fashion for every style and occasion.',
                tr: 'Her tarza ve ozel gune uygun modayi kesfedin.',
                de: 'Entdecken Sie Mode fuer jeden Stil und jeden Anlass.',
                fr: 'Decouvrez la mode pour chaque style et chaque occasion.',
                es: 'Descubre moda para cada estilo y cada ocasion.',
              },
              size: 'small',
            },
          },
          {
            id: 'seed_giyim_categories_listing',
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
        en: 'Categories — Explore fashion categories.',
        tr: 'Kategoriler — Moda kategorilerini kesfet.',
        de: 'Kategorien — Mode-Kategorien durchsuchen.',
        fr: 'Categories — Explorer les categories de mode.',
        es: 'Categorias — Explora las categorias de moda.',
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
            id: 'seed_giyim_products_hero',
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
                en: 'Explore our complete fashion product catalog.',
                tr: 'Tum moda urun katalogumuzu kesfedin.',
                de: 'Entdecken Sie unseren kompletten Mode-Produktkatalog.',
                fr: 'Decouvrez notre catalogue complet de produits de mode.',
                es: 'Explora nuestro catalogo completo de productos de moda.',
              },
              size: 'small',
            },
          },
          {
            id: 'seed_giyim_products_listing',
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
        en: 'Products — Full fashion product catalog.',
        tr: 'Urunler — Tam moda urun katalogu.',
        de: 'Produkte — Vollstaendiger Mode-Produktkatalog.',
        fr: 'Produits — Catalogue complet de produits de mode.',
        es: 'Productos — Catalogo completo de productos de moda.',
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
            id: 'seed_giyim_about_hero',
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
                en: 'Where passion for fashion meets timeless craftsmanship.',
                tr: 'Moda tutkusunun zamansiz iscilikle bulustutu yer.',
                de: 'Wo Leidenschaft fuer Mode auf zeitlose Handwerkskunst trifft.',
                fr: 'La ou la passion de la mode rencontre un savoir-faire intemporel.',
                es: 'Donde la pasion por la moda se encuentra con la artesania atemporal.',
              },
              backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop',
            },
          },
          {
            id: 'seed_giyim_about_text',
            type: 'text',
            props: {
              tag: 'div',
              content: {
                en: '<p>We believe that fashion is more than clothing — it is a form of self-expression. Our journey began in a small atelier with a vision to create accessible, high-quality fashion that empowers people to feel confident and authentic. Today, we curate collections from established and emerging designers who share our commitment to quality and sustainability.</p><p>Every piece in our store is carefully selected to balance timeless elegance with contemporary trends. We work directly with artisans and ethical manufacturers to ensure fair labour practices and environmentally responsible production. From the fabric we source to the packaging we ship in, sustainability guides every decision we make.</p>',
                tr: '<p>Modanin giyimden daha fazlasi olduguna inaniyoruz — moda bir kendini ifade bicimidir. Yolculugumuz, insanlarin kendilerine guvenmelerini ve ozgun hissetmelerini saglayan ulasılabilir, yuksek kaliteli moda yaratma vizyonuyla kucuk bir atolyede basladi. Bugun, kalite ve surdurulebilirlige olan bagliligimizi paylasan yerlesik ve yukselen tasarimcilardan koleksiyonlar seciyoruz.</p><p>Magazamizdaki her parca, zamansiz zarafeti cagdas trendlerle dengelemek icin ozenle secilmistir. Adil calisma uygulamalari ve cevre dostu uretimi saglamak icin zanaatkarlar ve etik ureticilerle dogrudan calisiyoruz. Tedarik ettigimiz kumastan gonderdigimiz ambalaja kadar surdurulebilirlik aldigimiz her karara rehberlik eder.</p>',
                de: '<p>Wir glauben, dass Mode mehr als Kleidung ist — sie ist eine Form des Selbstausdrucks. Unsere Reise begann in einem kleinen Atelier mit der Vision, zugaengliche, hochwertige Mode zu schaffen, die Menschen dazu ermutigt, sich selbstbewusst und authentisch zu fuehlen. Heute kuratieren wir Kollektionen von etablierten und aufstrebenden Designern, die unser Engagement fuer Qualitaet und Nachhaltigkeit teilen.</p><p>Jedes Stueck in unserem Shop wird sorgfaeltig ausgewaehlt, um zeitlose Eleganz mit zeitgenoessischen Trends in Einklang zu bringen. Wir arbeiten direkt mit Kunsthandwerkern und ethischen Herstellern zusammen, um faire Arbeitspraktiken und umweltverantwortliche Produktion sicherzustellen. Von den Stoffen, die wir beschaffen, bis zur Verpackung, in der wir versenden, leitet Nachhaltigkeit jede Entscheidung.</p>',
                fr: '<p>Nous croyons que la mode est plus que des vetements — c\'est une forme d\'expression de soi. Notre parcours a commence dans un petit atelier avec la vision de creer une mode accessible et de haute qualite qui permet aux gens de se sentir confiants et authentiques. Aujourd\'hui, nous selectionnons des collections de createurs etablis et emergents qui partagent notre engagement envers la qualite et la durabilite.</p><p>Chaque piece de notre magasin est soigneusement selectionnee pour equilibrer l\'elegance intemporelle avec les tendances contemporaines. Nous travaillons directement avec des artisans et des fabricants ethiques pour garantir des pratiques de travail equitables et une production respectueuse de l\'environnement. Du tissu que nous sourcons a l\'emballage dans lequel nous expedions, la durabilite guide chaque decision que nous prenons.</p>',
                es: '<p>Creemos que la moda es mas que ropa — es una forma de autoexpresion. Nuestro viaje comenzo en un pequeno taller con la vision de crear moda accesible y de alta calidad que empodere a las personas para sentirse seguras y autenticas. Hoy, seleccionamos colecciones de disenadores establecidos y emergentes que comparten nuestro compromiso con la calidad y la sostenibilidad.</p><p>Cada pieza en nuestra tienda se selecciona cuidadosamente para equilibrar la elegancia atemporal con las tendencias contemporaneas. Trabajamos directamente con artesanos y fabricantes eticos para garantizar practicas laborales justas y produccion ambientalmente responsable. Desde la tela que obtenemos hasta el empaque en que enviamos, la sostenibilidad guia cada decision que tomamos.</p>',
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
        en: 'About Us — Our story, values, and commitment to sustainable fashion.',
        tr: 'Hakkimizda — Hikayemiz, degerlerimiz ve surdurulebilir modaya bagliligimiz.',
        de: 'Uber uns — Unsere Geschichte, Werte und unser Engagement fuer nachhaltige Mode.',
        fr: 'A propos — Notre histoire, nos valeurs et notre engagement pour une mode durable.',
        es: 'Sobre nosotros — Nuestra historia, valores y compromiso con la moda sostenible.',
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
            id: 'seed_giyim_contact_hero',
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
                en: 'We would love to hear from you. Our team is ready to help.',
                tr: 'Sizden haber almak isteriz. Ekibimiz yardima hazir.',
                de: 'Wir freuen uns, von Ihnen zu hoeren. Unser Team steht Ihnen gerne zur Verfuegung.',
                fr: 'Nous aimerions avoir de vos nouvelles. Notre equipe est prete a vous aider.',
                es: 'Nos encantaria saber de ti. Nuestro equipo esta listo para ayudar.',
              },
            },
          },
          {
            id: 'seed_giyim_contact_columns',
            type: 'columns',
            props: { columns: 2, gap: '2rem' },
            children: [
              {
                id: 'seed_giyim_contact_info',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h3>Contact Information</h3><p><strong>Email:</strong> hello@fashionstore.com</p><p><strong>Phone:</strong> +1 (555) 987-6543</p><p><strong>Address:</strong> 456 Fashion Boulevard, Style District, NY 10001</p>',
                    tr: '<h3>Iletisim Bilgileri</h3><p><strong>E-posta:</strong> hello@fashionstore.com</p><p><strong>Telefon:</strong> +1 (555) 987-6543</p><p><strong>Adres:</strong> 456 Moda Bulvari, Stil Bolgesi, NY 10001</p>',
                    de: '<h3>Kontaktinformationen</h3><p><strong>E-Mail:</strong> hello@fashionstore.com</p><p><strong>Telefon:</strong> +1 (555) 987-6543</p><p><strong>Adresse:</strong> 456 Fashion Boulevard, Style District, NY 10001</p>',
                    fr: '<h3>Informations de contact</h3><p><strong>E-mail:</strong> hello@fashionstore.com</p><p><strong>Telephone:</strong> +1 (555) 987-6543</p><p><strong>Adresse:</strong> 456 Fashion Boulevard, Style District, NY 10001</p>',
                    es: '<h3>Informacion de contacto</h3><p><strong>Correo:</strong> hello@fashionstore.com</p><p><strong>Telefono:</strong> +1 (555) 987-6543</p><p><strong>Direccion:</strong> 456 Fashion Boulevard, Style District, NY 10001</p>',
                  },
                },
              },
              {
                id: 'seed_giyim_contact_hours',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h3>Store Hours</h3><p><strong>Monday - Friday:</strong> 10:00 - 20:00</p><p><strong>Saturday:</strong> 10:00 - 18:00</p><p><strong>Sunday:</strong> 12:00 - 17:00</p><p>Online orders are processed 7 days a week.</p>',
                    tr: '<h3>Magaza Saatleri</h3><p><strong>Pazartesi - Cuma:</strong> 10:00 - 20:00</p><p><strong>Cumartesi:</strong> 10:00 - 18:00</p><p><strong>Pazar:</strong> 12:00 - 17:00</p><p>Online siparisler haftanin 7 gunu islenir.</p>',
                    de: '<h3>Ladenoeeffnungszeiten</h3><p><strong>Montag - Freitag:</strong> 10:00 - 20:00</p><p><strong>Samstag:</strong> 10:00 - 18:00</p><p><strong>Sonntag:</strong> 12:00 - 17:00</p><p>Online-Bestellungen werden 7 Tage die Woche bearbeitet.</p>',
                    fr: '<h3>Horaires du magasin</h3><p><strong>Lundi - Vendredi:</strong> 10:00 - 20:00</p><p><strong>Samedi:</strong> 10:00 - 18:00</p><p><strong>Dimanche:</strong> 12:00 - 17:00</p><p>Les commandes en ligne sont traitees 7 jours sur 7.</p>',
                    es: '<h3>Horario de la tienda</h3><p><strong>Lunes - Viernes:</strong> 10:00 - 20:00</p><p><strong>Sabado:</strong> 10:00 - 18:00</p><p><strong>Domingo:</strong> 12:00 - 17:00</p><p>Los pedidos en linea se procesan los 7 dias de la semana.</p>',
                  },
                },
              },
            ],
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Contact Us — Get in touch with our fashion team.',
        tr: 'Iletisim — Moda ekibimizle iletisime gecin.',
        de: 'Kontakt — Nehmen Sie Kontakt mit unserem Mode-Team auf.',
        fr: 'Contact — Contactez notre equipe mode.',
        es: 'Contacto — Ponte en contacto con nuestro equipo de moda.',
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
            id: 'seed_giyim_faq_hero',
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
                en: 'Everything you need to know about ordering, sizing, and returns.',
                tr: 'Siparis, beden ve iadeler hakkinda bilmeniz gereken her sey.',
                de: 'Alles, was Sie ueber Bestellung, Groessen und Retouren wissen muessen.',
                fr: 'Tout ce que vous devez savoir sur les commandes, les tailles et les retours.',
                es: 'Todo lo que necesitas saber sobre pedidos, tallas y devoluciones.',
              },
            },
          },
          {
            id: 'seed_giyim_faq_accordion',
            type: 'accordion',
            props: {
              items: [
                {
                  question: {
                    en: 'How do I find the right size?',
                    tr: 'Dogru bedeni nasil bulurum?',
                    de: 'Wie finde ich die richtige Groesse?',
                    fr: 'Comment trouver la bonne taille?',
                    es: 'Como encuentro la talla correcta?',
                  },
                  answer: {
                    en: 'Each product page includes a detailed size guide with measurements in both centimetres and inches. We recommend measuring yourself and comparing with our charts before ordering. If you are between sizes, we generally suggest going one size up for a more comfortable fit.',
                    tr: 'Her urun sayfasinda hem santimetre hem de inc olcumleri iceren detayli bir beden rehberi bulunur. Siparis vermeden once kendinizi olcmenizi ve tablolarimizla karsilastirmanizi oneririz. Iki beden arasindaysaniz, daha rahat bir kalip icin genellikle bir beden buyuk almayi oneririiz.',
                    de: 'Jede Produktseite enthaelt einen detaillierten Groessenleitfaden mit Massen in Zentimetern und Zoll. Wir empfehlen, sich vor der Bestellung zu vermessen und mit unseren Tabellen zu vergleichen. Wenn Sie zwischen zwei Groessen liegen, empfehlen wir in der Regel eine Groesse groesser fuer eine bequemere Passform.',
                    fr: 'Chaque page produit comprend un guide des tailles detaille avec des mesures en centimetres et en pouces. Nous recommandons de prendre vos mesures et de les comparer avec nos tableaux avant de commander. Si vous etes entre deux tailles, nous suggerons generalement de prendre la taille au-dessus pour un ajustement plus confortable.',
                    es: 'Cada pagina de producto incluye una guia de tallas detallada con medidas en centimetros y pulgadas. Recomendamos medirte y comparar con nuestras tablas antes de ordenar. Si estas entre dos tallas, generalmente sugerimos elegir una talla mas grande para un ajuste mas comodo.',
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
                    en: 'We offer free returns and exchanges within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with tags attached. Simply initiate a return request from your account dashboard, print the prepaid label, and drop off the package at the nearest courier point.',
                    tr: 'Teslimat tarihinden itibaren 30 gun icinde ucretsiz iade ve degisim sunuyoruz. Urunler giyilmemis, yikanmamis ve etiketleri takilmis orijinal ambalajinda olmalidir. Hesap panelinizden iade talebi baslatin, on odemeli etiketi yazdiirin ve paketi en yakin kurye noktasina birakin.',
                    de: 'Wir bieten kostenlose Retouren und Umtausch innerhalb von 30 Tagen nach Lieferung. Artikel muessen ungetragen, ungewaschen und in ihrer Originalverpackung mit angebrachten Etiketten sein. Starten Sie einfach eine Retourenanfrage ueber Ihr Konto-Dashboard, drucken Sie das vorfrankierte Etikett aus und geben Sie das Paket an der naechsten Kurierstelle ab.',
                    fr: 'Nous offrons des retours et echanges gratuits dans les 30 jours suivant la livraison. Les articles doivent etre non portes, non laves et dans leur emballage d\'origine avec les etiquettes attachees. Initiez simplement une demande de retour depuis votre tableau de bord, imprimez l\'etiquette prepayee et deposez le colis au point relais le plus proche.',
                    es: 'Ofrecemos devoluciones y cambios gratuitos dentro de los 30 dias posteriores a la entrega. Los articulos deben estar sin usar, sin lavar y en su embalaje original con las etiquetas adjuntas. Simplemente inicia una solicitud de devolucion desde tu panel de cuenta, imprime la etiqueta prepagada y entrega el paquete en el punto de mensajeria mas cercano.',
                  },
                },
                {
                  question: {
                    en: 'How should I care for my garments?',
                    tr: 'Kiyafetlerime nasil bakim yapmaliyim?',
                    de: 'Wie sollte ich meine Kleidung pflegen?',
                    fr: 'Comment dois-je entretenir mes vetements?',
                    es: 'Como debo cuidar mis prendas?',
                  },
                  answer: {
                    en: 'Care instructions are included on the label of every garment and on the product page. As a general rule, wash dark colours separately, use cold water for delicate fabrics, and air-dry whenever possible to preserve colour and shape. Leather items should be stored in dust bags and treated with a quality leather conditioner periodically.',
                    tr: 'Bakim talimatlari her kiyafetin etiketinde ve urun sayfasinda yer alir. Genel bir kural olarak koyu renkleri ayri yikayin, hassas kumaslar icin soguk su kullanin ve renk ve formu korumak icin mumkun oldugunda havalandirarak kurulayun. Deri urunler toz torbalarinda saklanmali ve duzenli olarak kaliteli bir deri bakim kremi ile muamele edilmelidir.',
                    de: 'Pflegehinweise befinden sich auf dem Etikett jedes Kleidungsstuecks und auf der Produktseite. Als allgemeine Regel waschen Sie dunkle Farben separat, verwenden Sie kaltes Wasser fuer empfindliche Stoffe und trocknen Sie wenn moeglich an der Luft, um Farbe und Form zu erhalten. Lederartikel sollten in Staubbeuteln aufbewahrt und regelmaessig mit einer hochwertigen Lederpflege behandelt werden.',
                    fr: 'Les instructions d\'entretien sont incluses sur l\'etiquette de chaque vetement et sur la page produit. En regle generale, lavez les couleurs foncees separement, utilisez de l\'eau froide pour les tissus delicats et sechez a l\'air libre autant que possible pour preserver la couleur et la forme. Les articles en cuir doivent etre stockes dans des housses anti-poussiere et traites periodiquement avec un conditionneur de cuir de qualite.',
                    es: 'Las instrucciones de cuidado se incluyen en la etiqueta de cada prenda y en la pagina del producto. Como regla general, lava los colores oscuros por separado, usa agua fria para telas delicadas y seca al aire siempre que sea posible para preservar el color y la forma. Los articulos de cuero deben guardarse en bolsas antipolvo y tratarse periodicamente con un acondicionador de cuero de calidad.',
                  },
                },
                {
                  question: {
                    en: 'How long does shipping take?',
                    tr: 'Kargo ne kadar surede ulasir?',
                    de: 'Wie lange dauert der Versand?',
                    fr: 'Combien de temps prend la livraison?',
                    es: 'Cuanto tarda el envio?',
                  },
                  answer: {
                    en: 'Standard shipping takes 3-5 business days domestically and 7-14 business days for international orders. Express shipping options are available at checkout, with delivery in 1-2 business days for domestic orders. All orders include tracking so you can follow your package every step of the way.',
                    tr: 'Standart kargo yurt icinde 3-5 is gunu, uluslararasi siparisler icin 7-14 is gunu icerisinde ulasir. Odeme sirasinda hizli kargo secenekleri mevcuttur; yurt ici siparislerde 1-2 is gununde teslimat yapilir. Tum siparislere takip numarasi eklenir, boylece paketinizi her asamada izleyebilirsiniz.',
                    de: 'Der Standardversand dauert im Inland 3-5 Werktage und fuer internationale Bestellungen 7-14 Werktage. Expressversandoptionen sind beim Checkout verfuegbar, mit Lieferung in 1-2 Werktagen fuer inlaendische Bestellungen. Alle Bestellungen enthalten eine Sendungsverfolgung, damit Sie Ihr Paket auf Schritt und Tritt verfolgen koennen.',
                    fr: 'La livraison standard prend 3 a 5 jours ouvrables en national et 7 a 14 jours ouvrables pour les commandes internationales. Des options de livraison express sont disponibles lors du paiement, avec une livraison en 1 a 2 jours ouvrables pour les commandes nationales. Toutes les commandes incluent le suivi pour que vous puissiez suivre votre colis a chaque etape.',
                    es: 'El envio estandar tarda 3-5 dias habiles a nivel nacional y 7-14 dias habiles para pedidos internacionales. Las opciones de envio express estan disponibles al pagar, con entrega en 1-2 dias habiles para pedidos nacionales. Todos los pedidos incluyen seguimiento para que puedas rastrear tu paquete en cada paso del camino.',
                  },
                },
                {
                  question: {
                    en: 'Are your products authentic?',
                    tr: 'Urunleriniz orijinal mi?',
                    de: 'Sind Ihre Produkte authentisch?',
                    fr: 'Vos produits sont-ils authentiques?',
                    es: 'Son sus productos autenticos?',
                  },
                  answer: {
                    en: 'Absolutely. We source all products directly from brands and authorised distributors. Every item comes with a certificate of authenticity and an original brand tag. We have a zero-tolerance policy for counterfeit goods, and our quality assurance team inspects every shipment before it reaches our warehouse.',
                    tr: 'Kesinlikle. Tum urunleri dogrudan markalardan ve yetkili distributoerlerden tedarik ediyoruz. Her urun orijinallik sertifikasi ve marka etiketi ile birlikte gelir. Sahte urunlere karsi sifir tolerans politikamiz vardir ve kalite guvence ekibimiz her gonderiyi depomuzua ulasmadan once denetler.',
                    de: 'Absolut. Wir beziehen alle Produkte direkt von Marken und autorisierten Haendlern. Jeder Artikel wird mit einem Echtheitszertifikat und einem Original-Markenetikett geliefert. Wir haben eine Null-Toleranz-Politik fuer Faelschungen, und unser Qualitaetssicherungsteam prueft jede Lieferung, bevor sie unser Lager erreicht.',
                    fr: 'Absolument. Nous sourcons tous les produits directement aupres des marques et des distributeurs autorises. Chaque article est accompagne d\'un certificat d\'authenticite et d\'une etiquette de marque originale. Nous appliquons une politique de tolerance zero pour les produits contrefaits, et notre equipe d\'assurance qualite inspecte chaque expedition avant qu\'elle n\'atteigne notre entrepot.',
                    es: 'Absolutamente. Obtenemos todos los productos directamente de las marcas y distribuidores autorizados. Cada articulo viene con un certificado de autenticidad y una etiqueta de marca original. Tenemos una politica de tolerancia cero para productos falsificados, y nuestro equipo de control de calidad inspecciona cada envio antes de que llegue a nuestro almacen.',
                  },
                },
              ],
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'FAQ — Answers to common questions about sizing, returns, and shipping.',
        tr: 'SSS — Beden, iade ve kargo hakkinda sik sorulan sorularin yanitlari.',
        de: 'FAQ — Antworten auf haeufige Fragen zu Groessen, Retouren und Versand.',
        fr: 'FAQ — Reponses aux questions courantes sur les tailles, retours et livraison.',
        es: 'Preguntas frecuentes — Respuestas a preguntas comunes sobre tallas, devoluciones y envios.',
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
    { key: 'sector', value: 'giyim', group: 'general' },
    { key: 'currency', value: 'TRY', group: 'general' },
    { key: 'store_name', value: { en: 'Fashion Store', tr: 'Moda Magazasi', de: 'Modeshop', fr: 'Boutique Mode', es: 'Tienda de Moda' }, group: 'general' },
    { key: 'primary_color', value: '#be185d', group: 'appearance' },
    { key: 'secondary_color', value: '#9d174d', group: 'appearance' },
  ],
};
