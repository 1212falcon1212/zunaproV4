import type { SectorSeedData } from './types';
import type { PageContent, Block } from '@zunapro/types';

export const genelSeedData: SectorSeedData = {
  categories: [
    {
      name: {
        en: 'Popular Products',
        tr: 'Populer Urunler',
        de: 'Beliebte Produkte',
        fr: 'Produits populaires',
        es: 'Productos populares',
      },
      slug: 'populer',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop',
      sortOrder: 1,
    },
    {
      name: {
        en: 'New Arrivals',
        tr: 'Yeni Gelenler',
        de: 'Neuheiten',
        fr: 'Nouveautes',
        es: 'Novedades',
      },
      slug: 'yeni-gelenler',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      sortOrder: 2,
    },
    {
      name: {
        en: 'Sale Items',
        tr: 'Indirimli Urunler',
        de: 'Sale-Artikel',
        fr: 'Articles en solde',
        es: 'Articulos en oferta',
      },
      slug: 'indirimli',
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=600&fit=crop',
      sortOrder: 3,
    },
    {
      name: {
        en: 'Special Collection',
        tr: 'Ozel Koleksiyon',
        de: 'Sonderkollektion',
        fr: 'Collection speciale',
        es: 'Coleccion especial',
      },
      slug: 'ozel-koleksiyon',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      sortOrder: 4,
    },
    {
      name: {
        en: 'Gift Ideas',
        tr: 'Hediye Fikirleri',
        de: 'Geschenkideen',
        fr: 'Idees cadeaux',
        es: 'Ideas para regalos',
      },
      slug: 'hediye',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=800&h=600&fit=crop',
      sortOrder: 5,
    },
  ],

  products: [
    {
      name: {
        en: 'Premium Gift Set',
        tr: 'Premium Hediye Seti',
        de: 'Premium-Geschenkset',
        fr: 'Coffret cadeau premium',
        es: 'Set de regalo premium',
      },
      description: {
        en: 'A beautifully curated gift set featuring our most loved items. Perfect for birthdays, anniversaries, or any special occasion. Each piece is individually wrapped and presented in an elegant gift box.',
        tr: 'En sevilen urunlerimizden olusan ozenle secilmis bir hediye seti. Dogum gunleri, yildonumleri veya herhangi bir ozel gun icin mukemmel. Her parca ayri ayri paketlenmis ve sik bir hediye kutusunda sunulmaktadir.',
        de: 'Ein wunderschoen zusammengestelltes Geschenkset mit unseren beliebtesten Artikeln. Perfekt fuer Geburtstage, Jahrestage oder jeden besonderen Anlass. Jedes Stueck ist einzeln verpackt und in einer eleganten Geschenkbox praesentiert.',
        fr: 'Un coffret cadeau soigneusement compose avec nos articles les plus apprecies. Parfait pour les anniversaires ou toute occasion speciale. Chaque piece est emballee individuellement et presentee dans un elegant coffret.',
        es: 'Un set de regalo cuidadosamente seleccionado con nuestros articulos mas queridos. Perfecto para cumpleanos, aniversarios o cualquier ocasion especial. Cada pieza esta envuelta individualmente y presentada en una elegante caja de regalo.',
      },
      slug: 'premium-hediye-seti',
      price: 450,
      sku: 'GEN-001',
      stock: 100,
      images: [
        'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549465220-1a8b9238f4e1?w=800&h=600&fit=crop',
      ],
      categorySlug: 'hediye',
      status: 'active',
    },
    {
      name: {
        en: 'Special Design Product',
        tr: 'Ozel Tasarim Urun',
        de: 'Spezialdesign-Produkt',
        fr: 'Produit design special',
        es: 'Producto de diseno especial',
      },
      description: {
        en: 'A uniquely designed product that stands out from the crowd. Crafted with attention to detail using premium materials. This exclusive piece adds a touch of sophistication to any collection.',
        tr: 'Kalabaliktan siyrilan benzersiz tasarimli bir urun. Premium malzemeler kullanilarak detaylara ozen gosterilerek uretilmistir. Bu ozel parca herhangi bir koleksiyona zarafet katar.',
        de: 'Ein einzigartig gestaltetes Produkt, das sich von der Masse abhebt. Mit Liebe zum Detail aus hochwertigen Materialien gefertigt. Dieses exklusive Stueck verleiht jeder Kollektion eine besondere Note.',
        fr: 'Un produit au design unique qui se demarque. Fabrique avec une attention aux details en utilisant des materiaux premium. Cette piece exclusive ajoute une touche de sophistication a toute collection.',
        es: 'Un producto de diseno unico que destaca entre la multitud. Elaborado con atencion al detalle utilizando materiales premium. Esta pieza exclusiva agrega un toque de sofisticacion a cualquier coleccion.',
      },
      slug: 'ozel-tasarim-urun',
      price: 750,
      sku: 'GEN-002',
      stock: 80,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
      ],
      categorySlug: 'ozel-koleksiyon',
      status: 'active',
    },
    {
      name: {
        en: 'Trending Product',
        tr: 'Trend Urun',
        de: 'Trendprodukt',
        fr: 'Produit tendance',
        es: 'Producto de tendencia',
      },
      description: {
        en: 'The must-have item of the season that everyone is talking about. Combining modern aesthetics with everyday practicality. Join thousands of satisfied customers who have made this their favourite pick.',
        tr: 'Herkesin konustugu sezonun olmazsa olmaz urunu. Modern estetigi gunluk pratiklikle birlestiriyor. Bu urunu favori secimi yapan binlerce memnun musteriye katilin.',
        de: 'Das Must-have-Produkt der Saison, ueber das alle sprechen. Verbindet moderne Aesthetik mit alltaeglicher Praktikabilitaet. Schliessen Sie sich Tausenden zufriedener Kunden an, die dieses Produkt zu ihrem Favoriten gemacht haben.',
        fr: 'L\'article incontournable de la saison dont tout le monde parle. Alliant esthetique moderne et praticite au quotidien. Rejoignez des milliers de clients satisfaits qui en ont fait leur choix favori.',
        es: 'El articulo imprescindible de la temporada del que todos hablan. Combina estetica moderna con practicidad diaria. Unase a miles de clientes satisfechos que lo han convertido en su eleccion favorita.',
      },
      slug: 'trend-urun',
      price: 320,
      sku: 'GEN-003',
      stock: 150,
      images: [
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
      ],
      categorySlug: 'populer',
      status: 'active',
    },
    {
      name: {
        en: 'Limited Edition',
        tr: 'Sinirli Uretim',
        de: 'Limitierte Auflage',
        fr: 'Edition limitee',
        es: 'Edicion limitada',
      },
      description: {
        en: 'An exclusive limited-edition piece available while stocks last. Only a select number have been produced, making this a true collector\'s item. Do not miss your chance to own something truly rare.',
        tr: 'Stoklar tukenmeden edinilebilecek ozel sinirli uretim bir parca. Yalnizca sinirli sayida uretilmistir, bu da onu gercek bir koleksiyoner parcasi yapmaktadir. Gercekten nadir bir seye sahip olma sansinizi kacirmayin.',
        de: 'Ein exklusives Stueck in limitierter Auflage, erhaeltlich solange der Vorrat reicht. Nur eine begrenzte Anzahl wurde produziert, was es zu einem echten Sammlerstueck macht. Verpassen Sie nicht Ihre Chance, etwas wirklich Seltenes zu besitzen.',
        fr: 'Une piece exclusive en edition limitee disponible dans la limite des stocks. Seul un nombre restreint a ete produit, en faisant un veritable objet de collection. Ne manquez pas votre chance de posseder quelque chose de vraiment rare.',
        es: 'Una pieza exclusiva de edicion limitada disponible hasta agotar existencias. Solo se ha producido un numero selecto, lo que la convierte en un verdadero articulo de coleccion. No pierda su oportunidad de poseer algo realmente raro.',
      },
      slug: 'sinirli-uretim',
      price: 890,
      sku: 'GEN-004',
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=600&fit=crop',
      ],
      categorySlug: 'ozel-koleksiyon',
      status: 'active',
    },
    {
      name: {
        en: 'Best Seller',
        tr: 'Populer Satin Alma',
        de: 'Bestseller',
        fr: 'Meilleure vente',
        es: 'Mas vendido',
      },
      description: {
        en: 'Our number one best-selling product loved by customers worldwide. Offering exceptional quality at an unbeatable price point. This proven favourite continues to earn five-star reviews from delighted buyers.',
        tr: 'Dunya genelinde musteriler tarafindan sevilen bir numarali en cok satan urunumuz. Rakipsiz bir fiyat noktasinda olaganustu kalite sunuyor. Bu kanitlanmis favori, memnun alicilardan bes yildizli yorumlar almaya devam ediyor.',
        de: 'Unser meistverkauftes Produkt Nummer eins, das von Kunden weltweit geliebt wird. Bietet aussergewoehnliche Qualitaet zu einem unschlagbaren Preis. Dieser bewaehrte Favorit erhaelt weiterhin Fuenf-Sterne-Bewertungen von begeisterten Kaeufern.',
        fr: 'Notre produit numero un le plus vendu, adore par les clients du monde entier. Offrant une qualite exceptionnelle a un prix imbattable. Ce favori eprouve continue de recevoir des avis cinq etoiles de la part d\'acheteurs ravis.',
        es: 'Nuestro producto mas vendido numero uno, amado por clientes de todo el mundo. Ofrece calidad excepcional a un precio inigualable. Este favorito comprobado sigue obteniendo resenas de cinco estrellas de compradores encantados.',
      },
      slug: 'populer-satin-alma',
      price: 280,
      sku: 'GEN-005',
      stock: 200,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
      ],
      categorySlug: 'populer',
      status: 'active',
    },
    {
      name: {
        en: 'New Season',
        tr: 'Yeni Sezon',
        de: 'Neue Saison',
        fr: 'Nouvelle saison',
        es: 'Nueva temporada',
      },
      description: {
        en: 'Fresh from our latest collection, this new-season arrival embodies contemporary style and quality craftsmanship. Designed to complement the latest trends while remaining timeless. Be the first to experience our newest offering.',
        tr: 'En son koleksiyonumuzdan taze gelen bu yeni sezon urunu, cagdas tarzi ve kaliteli isciliga sahiptir. En son trendleri tamamlarken zamansiz kalmak icin tasarlanmistir. En yeni teklifimizi ilk deneyimleyen siz olun.',
        de: 'Frisch aus unserer neuesten Kollektion verkoerpert dieser Neuzugang der Saison zeitgenoessischen Stil und hochwertige Handwerkskunst. Entworfen, um die neuesten Trends zu ergaenzen und gleichzeitig zeitlos zu bleiben. Seien Sie der Erste, der unser neuestes Angebot erlebt.',
        fr: 'Tout droit sorti de notre derniere collection, cette nouveaute de saison incarne le style contemporain et un savoir-faire de qualite. Concu pour completer les dernieres tendances tout en restant intemporel. Soyez le premier a decouvrir notre toute derniere offre.',
        es: 'Directamente de nuestra ultima coleccion, esta novedad de temporada encarna el estilo contemporaneo y la artesania de calidad. Disenado para complementar las ultimas tendencias mientras permanece atemporal. Sea el primero en experimentar nuestra oferta mas reciente.',
      },
      slug: 'yeni-sezon',
      price: 550,
      sku: 'GEN-006',
      stock: 120,
      images: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=600&fit=crop',
      ],
      categorySlug: 'yeni-gelenler',
      status: 'active',
    },
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
          {
            id: 'seed_genel_home_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Discover Our Collection',
                tr: 'Koleksiyonumuzu Kesfedin',
                de: 'Entdecken Sie unsere Kollektion',
                fr: 'Decouvrez notre collection',
                es: 'Descubra nuestra coleccion',
              },
              subtitle: {
                en: 'Handpicked products for every taste and occasion',
                tr: 'Her zevke ve vesileye ozenle secilmis urunler',
                de: 'Handverlesene Produkte fuer jeden Geschmack und Anlass',
                fr: 'Des produits selectionnes pour tous les gouts et occasions',
                es: 'Productos seleccionados para todos los gustos y ocasiones',
              },
              buttonText: {
                en: 'Shop Now',
                tr: 'Alisverise Basla',
                de: 'Jetzt einkaufen',
                fr: 'Acheter maintenant',
                es: 'Comprar ahora',
              },
              buttonLink: '/pages/shop',
            },
            style: {
              backgroundColor: '#1a1a2e',
              textColor: '#ffffff',
              padding: '4rem 2rem',
            },
          },
          {
            id: 'seed_genel_home_spacer1',
            type: 'spacer',
            props: { height: '3rem' },
          },
          {
            id: 'seed_genel_home_products',
            type: 'product-showcase',
            props: {
              title: {
                en: 'Featured Products',
                tr: 'One Cikan Urunler',
                de: 'Ausgewaehlte Produkte',
                fr: 'Produits en vedette',
                es: 'Productos destacados',
              },
              limit: 8,
              columns: 4,
            },
          },
          {
            id: 'seed_genel_home_spacer2',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_genel_home_categories',
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
            id: 'seed_genel_home_spacer3',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_genel_home_banner',
            type: 'banner',
            props: {
              message: {
                en: 'Free shipping on orders over $100 — Limited time offer!',
                tr: '100$ uzeri siparislerde ucretsiz kargo — Sinirli sureli firsat!',
                de: 'Kostenloser Versand bei Bestellungen ueber 100$ — Zeitlich begrenztes Angebot!',
                fr: 'Livraison gratuite pour les commandes de plus de 100$ — Offre limitee!',
                es: 'Envio gratuito en pedidos superiores a 100$ — Oferta por tiempo limitado!',
              },
            },
          },
          {
            id: 'seed_genel_home_spacer4',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_genel_home_newsletter',
            type: 'newsletter',
            props: {
              title: {
                en: 'Stay in the Loop',
                tr: 'Haberdar Olun',
                de: 'Bleiben Sie informiert',
                fr: 'Restez informe',
                es: 'Mantengase informado',
              },
              description: {
                en: 'Subscribe to receive exclusive deals and new arrival updates.',
                tr: 'Ozel firsatlar ve yeni urun guncellemeleri icin abone olun.',
                de: 'Abonnieren Sie fuer exklusive Angebote und Neuheiten-Updates.',
                fr: 'Abonnez-vous pour recevoir des offres exclusives et des nouveautes.',
                es: 'Suscribase para recibir ofertas exclusivas y novedades.',
              },
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
        tr: 'Hakkimizda',
        de: 'Uber uns',
        fr: 'A propos',
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
                tr: 'Hakkimizda',
                de: 'Uber uns',
                fr: 'A propos de nous',
                es: 'Sobre nosotros',
              },
              subtitle: {
                en: 'Our story, our mission, our passion',
                tr: 'Hikayemiz, misyonumuz, tutkumuz',
                de: 'Unsere Geschichte, unsere Mission, unsere Leidenschaft',
                fr: 'Notre histoire, notre mission, notre passion',
                es: 'Nuestra historia, nuestra mision, nuestra pasion',
              },
            },
            style: {
              backgroundColor: '#2d3436',
              textColor: '#ffffff',
              padding: '3rem 2rem',
            },
          },
          {
            id: 'seed_genel_about_story',
            type: 'text',
            props: {
              tag: 'div',
              content: {
                en: '<h2>Our Story</h2><p>Founded with a simple belief that everyone deserves access to quality products at fair prices, our store has grown from a small passion project into a thriving online destination. We carefully curate every item in our catalogue, working directly with manufacturers and artisans to bring you the very best.</p><p>Our team is dedicated to providing an exceptional shopping experience from start to finish. We believe in transparency, quality, and building lasting relationships with our customers. Every product we offer has been tested and approved by our team before it reaches your doorstep.</p>',
                tr: '<h2>Hikayemiz</h2><p>Herkesin uygun fiyatlarla kaliteli urunlere erisimi hak ettigi inanciyyla kurulan magazamiz, kucuk bir tutku projesinden gelisen bir online alisveris destinasyonuna donusmustur. Katalogumuzdaki her urunu ozenle seciyoruz, size en iyisini sunmak icin ureticiler ve zanaatkarlarla dogrudan calisiyoruz.</p><p>Ekibimiz, basindan sonuna kadar olaganustu bir alisveris deneyimi sunmaya adamistir. Seffafliga, kaliteye ve musterilerimizle kalici iliskiler kurmaya inaniyoruz. Sundugumuz her urun, kapiniza ulasmadan once ekibimiz tarafindan test edilmis ve onaylanmistir.</p>',
                de: '<h2>Unsere Geschichte</h2><p>Gegruendet mit der einfachen Ueberzeugung, dass jeder Zugang zu Qualitaetsprodukten zu fairen Preisen verdient, hat sich unser Shop von einem kleinen Leidenschaftsprojekt zu einem florierenden Online-Ziel entwickelt. Wir kuratieren sorgfaeltig jeden Artikel in unserem Katalog und arbeiten direkt mit Herstellern und Handwerkern zusammen, um Ihnen das Beste zu bieten.</p><p>Unser Team ist bestrebt, von Anfang bis Ende ein aussergewoehnliches Einkaufserlebnis zu bieten. Wir glauben an Transparenz, Qualitaet und den Aufbau dauerhafter Beziehungen zu unseren Kunden.</p>',
                fr: '<h2>Notre histoire</h2><p>Fondee avec la conviction simple que chacun merite l\'acces a des produits de qualite a des prix justes, notre boutique est passee d\'un petit projet passionnel a une destination en ligne florissante. Nous selectionnons soigneusement chaque article de notre catalogue, en travaillant directement avec les fabricants et artisans pour vous offrir le meilleur.</p><p>Notre equipe se consacre a fournir une experience d\'achat exceptionnelle du debut a la fin. Nous croyons en la transparence, la qualite et la construction de relations durables avec nos clients.</p>',
                es: '<h2>Nuestra historia</h2><p>Fundada con la simple creencia de que todos merecen acceso a productos de calidad a precios justos, nuestra tienda ha crecido de un pequeno proyecto apasionado a un destino en linea prospero. Seleccionamos cuidadosamente cada articulo de nuestro catalogo, trabajando directamente con fabricantes y artesanos para ofrecerle lo mejor.</p><p>Nuestro equipo esta dedicado a proporcionar una experiencia de compra excepcional de principio a fin. Creemos en la transparencia, la calidad y la construccion de relaciones duraderas con nuestros clientes.</p>',
              },
            },
            style: {
              padding: '2rem 1rem',
              maxWidth: '800px',
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Learn about our story, mission, and commitment to quality products and customer satisfaction.',
        tr: 'Hikayemizi, misyonumuzu ve kaliteli urunlere olan bagliligimizi ogrenin.',
        de: 'Erfahren Sie mehr ueber unsere Geschichte, Mission und unser Engagement fuer Qualitaetsprodukte.',
        fr: 'Decouvrez notre histoire, notre mission et notre engagement envers la qualite.',
        es: 'Conozca nuestra historia, mision y compromiso con productos de calidad.',
      },
    },

    // ---- CONTACT ----
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
            id: 'seed_genel_contact_hero',
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
                en: 'We would love to hear from you',
                tr: 'Sizden haber almaktan mutluluk duyariz',
                de: 'Wir freuen uns von Ihnen zu hoeren',
                fr: 'Nous serions ravis de vous entendre',
                es: 'Nos encantaria saber de usted',
              },
            },
            style: {
              backgroundColor: '#2d3436',
              textColor: '#ffffff',
              padding: '3rem 2rem',
            },
          },
          {
            id: 'seed_genel_contact_columns',
            type: 'columns',
            props: { columns: 2, gap: '2rem' },
            children: [
              {
                id: 'seed_genel_contact_info',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h3>Get in Touch</h3><p><strong>Email:</strong> info@example.com</p><p><strong>Phone:</strong> +1 (555) 000-0000</p><p><strong>Address:</strong> 123 Commerce Street, Suite 100, New York, NY 10001</p>',
                    tr: '<h3>Iletisim Bilgileri</h3><p><strong>E-posta:</strong> info@example.com</p><p><strong>Telefon:</strong> +1 (555) 000-0000</p><p><strong>Adres:</strong> 123 Ticaret Sokagi, Suite 100, New York, NY 10001</p>',
                    de: '<h3>Kontaktinformationen</h3><p><strong>E-Mail:</strong> info@example.com</p><p><strong>Telefon:</strong> +1 (555) 000-0000</p><p><strong>Adresse:</strong> 123 Commerce Street, Suite 100, New York, NY 10001</p>',
                    fr: '<h3>Coordonnees</h3><p><strong>E-mail:</strong> info@example.com</p><p><strong>Telephone:</strong> +1 (555) 000-0000</p><p><strong>Adresse:</strong> 123 Commerce Street, Suite 100, New York, NY 10001</p>',
                    es: '<h3>Informacion de contacto</h3><p><strong>Correo:</strong> info@example.com</p><p><strong>Telefono:</strong> +1 (555) 000-0000</p><p><strong>Direccion:</strong> 123 Commerce Street, Suite 100, New York, NY 10001</p>',
                  },
                },
              },
              {
                id: 'seed_genel_contact_hours',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h3>Business Hours</h3><p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p><p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p><p><strong>Sunday:</strong> Closed</p><p>We typically respond to inquiries within 24 hours during business days.</p>',
                    tr: '<h3>Calisma Saatleri</h3><p><strong>Pazartesi - Cuma:</strong> 09:00 - 18:00</p><p><strong>Cumartesi:</strong> 10:00 - 16:00</p><p><strong>Pazar:</strong> Kapali</p><p>Is gunlerinde sorulariniza genellikle 24 saat icinde yanit veriyoruz.</p>',
                    de: '<h3>Geschaeftszeiten</h3><p><strong>Montag - Freitag:</strong> 9:00 - 18:00 Uhr</p><p><strong>Samstag:</strong> 10:00 - 16:00 Uhr</p><p><strong>Sonntag:</strong> Geschlossen</p><p>Wir antworten in der Regel innerhalb von 24 Stunden an Werktagen.</p>',
                    fr: '<h3>Heures d\'ouverture</h3><p><strong>Lundi - Vendredi:</strong> 9h00 - 18h00</p><p><strong>Samedi:</strong> 10h00 - 16h00</p><p><strong>Dimanche:</strong> Ferme</p><p>Nous repondons generalement aux demandes sous 24 heures les jours ouvrables.</p>',
                    es: '<h3>Horario comercial</h3><p><strong>Lunes - Viernes:</strong> 9:00 - 18:00</p><p><strong>Sabado:</strong> 10:00 - 16:00</p><p><strong>Domingo:</strong> Cerrado</p><p>Normalmente respondemos a las consultas en un plazo de 24 horas durante los dias laborables.</p>',
                  },
                },
              },
            ],
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Get in touch with us. Find our contact information, business hours, and address.',
        tr: 'Bizimle iletisime gecin. Iletisim bilgilerimizi, calisma saatlerimizi ve adresimizi bulun.',
        de: 'Nehmen Sie Kontakt mit uns auf. Finden Sie unsere Kontaktdaten, Geschaeftszeiten und Adresse.',
        fr: 'Contactez-nous. Trouvez nos coordonnees, horaires et adresse.',
        es: 'Pongase en contacto con nosotros. Encuentre nuestra informacion de contacto, horarios y direccion.',
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
};
