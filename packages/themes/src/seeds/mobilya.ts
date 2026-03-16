import type { SectorSeedData } from './types';
import type { PageContent, Block } from '@zunapro/types';

export const mobilyaSeedData: SectorSeedData = {
  categories: [
    {
      name: {
        en: 'Living Room Sets',
        tr: 'Salon Takimlari',
        de: 'Wohnzimmer-Sets',
        fr: 'Ensembles salon',
        es: 'Conjuntos de salon',
      },
      slug: 'salon-takimlari',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
      sortOrder: 1,
    },
    {
      name: {
        en: 'Bedroom',
        tr: 'Yatak Odasi',
        de: 'Schlafzimmer',
        fr: 'Chambre a coucher',
        es: 'Dormitorio',
      },
      slug: 'yatak-odasi',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
      sortOrder: 2,
    },
    {
      name: {
        en: 'Dining Room',
        tr: 'Yemek Odasi',
        de: 'Esszimmer',
        fr: 'Salle a manger',
        es: 'Comedor',
      },
      slug: 'yemek-odasi',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
      sortOrder: 3,
    },
    {
      name: {
        en: 'Home Office',
        tr: 'Calisma Odasi',
        de: 'Homeoffice',
        fr: 'Bureau a domicile',
        es: 'Oficina en casa',
      },
      slug: 'calisma-odasi',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop',
      sortOrder: 4,
    },
    {
      name: {
        en: 'Garden Furniture',
        tr: 'Bahce Mobilyasi',
        de: 'Gartenmoebel',
        fr: 'Mobilier de jardin',
        es: 'Muebles de jardin',
      },
      slug: 'bahce-mobilyasi',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
      sortOrder: 5,
    },
  ],

  products: [
    {
      name: {
        en: 'Modern Sofa Set',
        tr: 'Modern Koltuk Takimi',
        de: 'Modernes Sofa-Set',
        fr: 'Ensemble canape moderne',
        es: 'Juego de sofa moderno',
      },
      description: {
        en: 'A contemporary three-piece sofa set upholstered in premium fabric with solid hardwood frames. The set includes a three-seater sofa, a two-seater loveseat, and a matching armchair. Ergonomically designed cushions provide exceptional comfort for everyday use.',
        tr: 'Premium kumas kapli ve sert ahsap iskeletli cagdas uc parcali koltuk takimi. Set, uclu koltuk, ikili koltuk ve uyumlu bir berjerden olusmaktadir. Ergonomik tasarimli minderler gunluk kullanim icin olaganustu konfor saglar.',
        de: 'Ein zeitgenoessisches dreiteiliges Sofa-Set mit Premium-Stoffbezug und massivem Hartholzrahmen. Das Set umfasst ein Dreisitzer-Sofa, ein Zweisitzer-Loveseat und einen passenden Sessel. Ergonomisch gestaltete Kissen bieten aussergewoehnlichen Komfort fuer den taeglichen Gebrauch.',
        fr: 'Un ensemble canape contemporain de trois pieces, recouvert de tissu premium avec des cadres en bois dur massif. L\'ensemble comprend un canape trois places, un canape deux places et un fauteuil assorti. Les coussins ergonomiques offrent un confort exceptionnel au quotidien.',
        es: 'Un juego de sofa contemporaneo de tres piezas tapizado en tela premium con marcos de madera maciza. El juego incluye un sofa de tres plazas, un sofa de dos plazas y un sillon a juego. Los cojines disenados ergonomicamente brindan comodidad excepcional para el uso diario.',
      },
      slug: 'modern-koltuk-takimi',
      price: 12500,
      sku: 'MOB-001',
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop',
      ],
      categorySlug: 'salon-takimlari',
      status: 'active',
    },
    {
      name: {
        en: 'Dining Table Set',
        tr: 'Yemek Masasi Seti',
        de: 'Esstisch-Set',
        fr: 'Ensemble table a manger',
        es: 'Juego de mesa de comedor',
      },
      description: {
        en: 'An elegant dining table set crafted from solid oak wood with a natural walnut finish. Seats six comfortably with matching upholstered chairs. The table features a sturdy trestle base and a smooth, scratch-resistant surface perfect for family gatherings.',
        tr: 'Dogal ceviz cilali masif mese agacindan uretilmis sik bir yemek masasi seti. Uyumlu dosemeli sandalyelerle alti kisilik rahat oturma imkani sunar. Masa, saglam ayak yapisi ve cizilmeye dayanikli puruzsuz yuzeyiyle aile toplantilari icin idealdir.',
        de: 'Ein elegantes Esstisch-Set aus massivem Eichenholz mit natuerlicher Walnuss-Oberflaeche. Bietet Platz fuer sechs Personen mit passenden gepolsterten Stuehlen. Der Tisch verfuegt ueber ein robustes Bockgestell und eine glatte, kratzfeste Oberflaeche.',
        fr: 'Un elegant ensemble table a manger fabrique en chene massif avec une finition noyer naturelle. Accueille six personnes confortablement avec des chaises rembourrrees assorties. La table presente une base solide et une surface lisse resistante aux rayures, parfaite pour les reunions de famille.',
        es: 'Un elegante juego de mesa de comedor elaborado en madera maciza de roble con acabado nogal natural. Acomoda seis personas comodamente con sillas tapizadas a juego. La mesa cuenta con una base resistente y una superficie lisa y resistente a los aranaazos, perfecta para reuniones familiares.',
      },
      slug: 'yemek-masasi-seti',
      price: 8900,
      sku: 'MOB-002',
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop',
      ],
      categorySlug: 'yemek-odasi',
      status: 'active',
    },
    {
      name: {
        en: 'Bookshelf',
        tr: 'Kitaplik',
        de: 'Buecherregal',
        fr: 'Bibliotheque',
        es: 'Estanteria',
      },
      description: {
        en: 'A tall, five-shelf bookcase made from engineered wood with a modern matte finish. Features adjustable shelves to accommodate books, decorative objects, and storage boxes of various sizes. A versatile addition to any home office or living space.',
        tr: 'Modern mat cilali muhendislik ahsabindan yapilmis bes rafli yuksek kitaplik. Cesitli boyutlardaki kitaplari, dekoratif nesneleri ve saklama kutularini barindirmak icin ayarlanabilir raflara sahiptir. Herhangi bir calisma odasi veya yasam alanina cok yonlu bir ekleme.',
        de: 'Ein hohes Buecherregal mit fuenf Regalen aus Holzwerkstoff mit moderner matter Oberflaeche. Verfuegt ueber verstellbare Regalboeden fuer Buecher, Dekorationsobjekte und Aufbewahrungsboxen verschiedener Groessen. Eine vielseitige Ergaenzung fuer jedes Homeoffice oder Wohnzimmer.',
        fr: 'Une grande bibliotheque a cinq etageres en bois ingenierie avec une finition mate moderne. Comprend des etageres reglables pour accueillir des livres, des objets decoratifs et des boites de rangement de differentes tailles. Un ajout polyvalent pour tout bureau ou espace de vie.',
        es: 'Una estanteria alta de cinco estantes fabricada en madera de ingenieria con un acabado mate moderno. Cuenta con estantes ajustables para acomodar libros, objetos decorativos y cajas de almacenamiento de varios tamanos. Una adicion versatil para cualquier oficina en casa o espacio habitable.',
      },
      slug: 'kitaplik',
      price: 3200,
      sku: 'MOB-003',
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop',
      ],
      categorySlug: 'calisma-odasi',
      status: 'active',
    },
    {
      name: {
        en: 'Bed Headboard',
        tr: 'Yatak Basi',
        de: 'Bettkopfteil',
        fr: 'Tete de lit',
        es: 'Cabecero de cama',
      },
      description: {
        en: 'A luxurious upholstered headboard with deep button tufting and premium velvet fabric. Available in king and queen sizes with a solid plywood backing for long-lasting durability. Easily mounts to any standard bed frame and instantly elevates your bedroom decor.',
        tr: 'Derin dugme dikisi ve premium kadife kumasli luks dosemeli yatak basi. Uzun omurlu dayaniklilik icin masif kontrplak arka paneli ile cift ve tek kisilik yataklara uygun boyutlarda mevcuttur. Herhangi bir standart yatak cercevesine kolayca monte edilir ve yatak odasi dekorunuzu aninda yukseltir.',
        de: 'Ein luxurioeses gepolstertes Kopfteil mit tiefer Knopfheftung und Premium-Samtstoff. Erhaeltlich in King- und Queen-Groessen mit einer soliden Sperrholz-Rueckwand fuer langlebige Haltbarkeit. Laesst sich einfach an jedem Standard-Bettrahmen montieren.',
        fr: 'Une tete de lit rembourrree luxueuse avec un capitonnage profond et un tissu velours premium. Disponible en tailles king et queen avec un support en contreplaque massif pour une durabilite longue duree. Se monte facilement sur tout cadre de lit standard.',
        es: 'Un lujoso cabecero tapizado con capitone profundo y tela de terciopelo premium. Disponible en tamanos king y queen con respaldo de madera contrachapada solida para durabilidad a largo plazo. Se monta facilmente en cualquier marco de cama estandar.',
      },
      slug: 'yatak-basi',
      price: 2800,
      sku: 'MOB-004',
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
      ],
      categorySlug: 'yatak-odasi',
      status: 'active',
    },
    {
      name: {
        en: 'Coffee Table',
        tr: 'Sehpa',
        de: 'Couchtisch',
        fr: 'Table basse',
        es: 'Mesa de centro',
      },
      description: {
        en: 'A minimalist coffee table with a tempered glass top and brushed stainless steel legs. The open-shelf design beneath provides convenient space for magazines and remote controls. Its sleek profile complements both modern and transitional living room styles.',
        tr: 'Temperli cam ust tabla ve fircalanmis paslanmaz celik ayaklara sahip minimalist bir sehpa. Alt kisimda acik raf tasarimi dergiler ve kumandalar icin uygun alan saglar. Sik profili hem modern hem de gecis tarzi salon dekorlarina uyum saglar.',
        de: 'Ein minimalistischer Couchtisch mit gehaerteter Glasplatte und gebuersteten Edelstahlbeinen. Das offene Regaldesign darunter bietet praktischen Stauraum fuer Zeitschriften und Fernbedienungen. Sein schlankes Profil ergaenzt sowohl moderne als auch uebergangsmaessige Wohnzimmerstile.',
        fr: 'Une table basse minimaliste avec un plateau en verre trempe et des pieds en acier inoxydable brosse. Le design ouvert en dessous offre un espace pratique pour les magazines et les telecommandes. Son profil elegant complete aussi bien les styles de salon modernes que transitionnels.',
        es: 'Una mesa de centro minimalista con tapa de vidrio templado y patas de acero inoxidable cepillado. El diseno de estante abierto debajo proporciona espacio conveniente para revistas y controles remotos. Su perfil elegante complementa tanto estilos de sala modernos como de transicion.',
      },
      slug: 'sehpa',
      price: 1500,
      sku: 'MOB-005',
      stock: 80,
      images: [
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&h=600&fit=crop',
      ],
      categorySlug: 'salon-takimlari',
      status: 'active',
    },
    {
      name: {
        en: 'Garden Seating Set',
        tr: 'Bahce Oturma Grubu',
        de: 'Garten-Sitzgruppe',
        fr: 'Ensemble salon de jardin',
        es: 'Juego de asientos de jardin',
      },
      description: {
        en: 'A weather-resistant outdoor seating set made from hand-woven synthetic rattan with powder-coated aluminium frames. Includes a two-seater sofa, two armchairs, and a matching coffee table with tempered glass top. Thick, UV-resistant cushions ensure comfort throughout every season.',
        tr: 'Toz boyali aluminyum iskelet uzerine el orgusu sentetik rattandan uretilmis hava kosullarina dayanikli dis mekan oturma grubu. Iki kisilik kanepe, iki berjer ve temperli cam ustlu uyumlu sehpa icermektedir. Kalin, UV dayanikli minderler her mevsim boyunca konfor saglar.',
        de: 'Eine witterungsbestaendige Outdoor-Sitzgruppe aus handgeflochtenem Synthetik-Rattan mit pulverbeschichteten Aluminiumrahmen. Umfasst ein Zweisitzer-Sofa, zwei Sessel und einen passenden Couchtisch mit gehaerteter Glasplatte. Dicke, UV-bestaendige Kissen sorgen fuer Komfort zu jeder Jahreszeit.',
        fr: 'Un ensemble salon de jardin resistant aux intemperies en rotin synthetique tresse a la main avec des cadres en aluminium thermolaque. Comprend un canape deux places, deux fauteuils et une table basse assortie avec plateau en verre trempe. Des coussins epais resistants aux UV assurent le confort en toute saison.',
        es: 'Un juego de asientos de exterior resistente a la intemperie fabricado en ratan sintetico tejido a mano con marcos de aluminio con recubrimiento en polvo. Incluye un sofa de dos plazas, dos sillones y una mesa de centro a juego con tapa de vidrio templado. Cojines gruesos resistentes a los rayos UV garantizan comodidad durante todas las estaciones.',
      },
      slug: 'bahce-oturma-grubu',
      price: 6500,
      sku: 'MOB-006',
      stock: 35,
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595659805442-3e3e84afd498?w=800&h=600&fit=crop',
      ],
      categorySlug: 'bahce-mobilyasi',
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
            id: 'seed_mobilya_home_hero',
            type: 'hero',
            props: {
              title: {
                en: 'Redesign Your Home',
                tr: 'Evinizi Yeniden Tasarlayin',
                de: 'Gestalten Sie Ihr Zuhause neu',
                fr: 'Repensez votre interieur',
                es: 'Redisene su hogar',
              },
              subtitle: {
                en: 'Premium furniture crafted for comfort and style',
                tr: 'Konfor ve stil icin uretilmis premium mobilyalar',
                de: 'Premium-Moebel fuer Komfort und Stil gefertigt',
                fr: 'Mobilier premium concu pour le confort et le style',
                es: 'Muebles premium disenados para comodidad y estilo',
              },
              buttonText: {
                en: 'Explore Collection',
                tr: 'Koleksiyonu Kesfedin',
                de: 'Kollektion entdecken',
                fr: 'Explorer la collection',
                es: 'Explorar coleccion',
              },
              buttonLink: '/pages/shop',
            },
            style: {
              backgroundColor: '#2c3e50',
              textColor: '#ffffff',
              padding: '4rem 2rem',
            },
          },
          {
            id: 'seed_mobilya_home_spacer1',
            type: 'spacer',
            props: { height: '3rem' },
          },
          {
            id: 'seed_mobilya_home_products',
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
            id: 'seed_mobilya_home_spacer2',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_mobilya_home_categories',
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
            id: 'seed_mobilya_home_spacer3',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_mobilya_home_banner',
            type: 'banner',
            props: {
              message: {
                en: 'Free assembly on all orders over $500 — Transform your space today!',
                tr: '500$ uzeri tum siparislerde ucretsiz kurulum — Mekaninizi bugun donusturun!',
                de: 'Kostenlose Montage bei allen Bestellungen ueber 500$ — Verwandeln Sie Ihren Raum noch heute!',
                fr: 'Montage gratuit pour toutes les commandes de plus de 500$ — Transformez votre espace aujourd\'hui!',
                es: 'Montaje gratuito en todos los pedidos superiores a 500$ — Transforme su espacio hoy!',
              },
            },
          },
          {
            id: 'seed_mobilya_home_spacer4',
            type: 'spacer',
            props: { height: '2rem' },
          },
          {
            id: 'seed_mobilya_home_newsletter',
            type: 'newsletter',
            props: {
              title: {
                en: 'Design Inspiration Delivered',
                tr: 'Tasarim Ilhami Kapiinizda',
                de: 'Design-Inspiration geliefert',
                fr: 'Inspiration design livree',
                es: 'Inspiracion de diseno entregada',
              },
              description: {
                en: 'Subscribe for the latest furniture trends, exclusive deals, and interior design tips.',
                tr: 'En son mobilya trendleri, ozel firsatlar ve ic mekan tasarim ipuclari icin abone olun.',
                de: 'Abonnieren Sie die neuesten Moebel-Trends, exklusive Angebote und Einrichtungstipps.',
                fr: 'Abonnez-vous pour les dernieres tendances mobilier, offres exclusives et conseils de decoration.',
                es: 'Suscribase para las ultimas tendencias en muebles, ofertas exclusivas y consejos de diseno de interiores.',
              },
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Premium furniture for every room. Discover sofas, dining sets, bedroom furniture, and more.',
        tr: 'Her oda icin premium mobilyalar. Koltuk takimlari, yemek setleri, yatak odasi mobilyalari ve daha fazlasini kesfedin.',
        de: 'Premium-Moebel fuer jeden Raum. Entdecken Sie Sofas, Essgruppen, Schlafzimmermoebel und mehr.',
        fr: 'Mobilier premium pour chaque piece. Decouvrez canapes, ensembles repas, meubles de chambre et plus.',
        es: 'Muebles premium para cada habitacion. Descubra sofas, juegos de comedor, muebles de dormitorio y mas.',
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
            id: 'seed_mobilya_about_hero',
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
                en: 'Crafting quality furniture since day one',
                tr: 'Ilk gunumuzden beri kaliteli mobilya uretimi',
                de: 'Qualitaetsmoebel seit dem ersten Tag',
                fr: 'Des meubles de qualite depuis le premier jour',
                es: 'Fabricando muebles de calidad desde el primer dia',
              },
            },
            style: {
              backgroundColor: '#2c3e50',
              textColor: '#ffffff',
              padding: '3rem 2rem',
            },
          },
          {
            id: 'seed_mobilya_about_story',
            type: 'text',
            props: {
              tag: 'div',
              content: {
                en: '<h2>Our Story</h2><p>We started as a small family workshop with a passion for woodworking and a commitment to honest craftsmanship. Over the years we have grown into a full-service furniture brand, but our founding values remain unchanged: use the best materials, build to last, and treat every customer like family.</p><p>Every piece in our collection is designed in-house and built by skilled artisans who take pride in their work. We source sustainably harvested timber and partner with ethical textile suppliers to ensure that our furniture is as responsible as it is beautiful. From living room statement pieces to practical home-office essentials, we are here to help you create spaces you love.</p>',
                tr: '<h2>Hikayemiz</h2><p>Ahsap isciligi tutkusu ve durrust zanaat anlayisiyla kucuk bir aile atolyesi olarak basladik. Yillar icinde tam hizmet veren bir mobilya markasina donustuk, ancak kurucu degerlerimiz degismedi: en iyi malzemeleri kullanmak, dayanikli uretmek ve her musteriye aile gibi davranmak.</p><p>Koleksiyonumuzdaki her parca sirkette tasarlanir ve islerinden gurur duyan yetenekli ustalar tarafindan uretilir. Surdurulebilir sekilde hasat edilen keresteler tedarik ediyor ve etik tekstil tedarikciileriyle is birligi yapiyoruz. Salon dekorasyon parcalarindan pratik ev ofis esaslarina kadar, sevdiginiz mekanlar yaratmaniza yardimci olmak icin buradayiz.</p>',
                de: '<h2>Unsere Geschichte</h2><p>Wir begannen als kleine Familienwerkstatt mit einer Leidenschaft fuer Holzarbeiten und einem Engagement fuer ehrliches Handwerk. Im Laufe der Jahre sind wir zu einer Vollservice-Moebelmarke gewachsen, aber unsere Gruendungswerte bleiben unveraendert: die besten Materialien verwenden, langlebig bauen und jeden Kunden wie Familie behandeln.</p><p>Jedes Stueck in unserer Kollektion wird intern entworfen und von qualifizierten Handwerkern gebaut, die stolz auf ihre Arbeit sind. Wir beziehen nachhaltig geerntetes Holz und arbeiten mit ethischen Textillieferanten zusammen.</p>',
                fr: '<h2>Notre histoire</h2><p>Nous avons commence comme un petit atelier familial avec une passion pour le travail du bois et un engagement envers l\'artisanat honnete. Au fil des ans, nous sommes devenus une marque de mobilier complete, mais nos valeurs fondatrices restent inchangees : utiliser les meilleurs materiaux, construire pour durer et traiter chaque client comme un membre de la famille.</p><p>Chaque piece de notre collection est concue en interne et fabriquee par des artisans qualifies qui sont fiers de leur travail. Nous nous approvisionnons en bois recolte de maniere durable.</p>',
                es: '<h2>Nuestra historia</h2><p>Comenzamos como un pequeno taller familiar con pasion por la carpinteria y compromiso con la artesania honesta. A lo largo de los anos hemos crecido hasta convertirnos en una marca de muebles de servicio completo, pero nuestros valores fundacionales permanecen sin cambios: usar los mejores materiales, construir para durar y tratar a cada cliente como familia.</p><p>Cada pieza de nuestra coleccion esta disenada internamente y construida por artesanos calificados que se enorgullecen de su trabajo. Obtenemos madera cosechada de manera sostenible y nos asociamos con proveedores textiles eticos.</p>',
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
        en: 'Learn about our furniture craftsmanship, sustainable sourcing, and commitment to quality.',
        tr: 'Mobilya isciligimizi, surdurulebilir kaynak kullanimini ve kaliteye olan bagliligimizi ogrenin.',
        de: 'Erfahren Sie mehr ueber unsere Moebelhandwerkskunst, nachhaltige Beschaffung und unser Engagement fuer Qualitaet.',
        fr: 'Decouvrez notre savoir-faire en mobilier, notre approvisionnement durable et notre engagement qualite.',
        es: 'Conozca nuestra artesania en muebles, abastecimiento sostenible y compromiso con la calidad.',
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
            id: 'seed_mobilya_contact_hero',
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
                en: 'Our furniture experts are ready to help',
                tr: 'Mobilya uzmanlarimiz yardima hazir',
                de: 'Unsere Moebelexperten helfen Ihnen gerne',
                fr: 'Nos experts en mobilier sont prets a vous aider',
                es: 'Nuestros expertos en muebles estan listos para ayudar',
              },
            },
            style: {
              backgroundColor: '#2c3e50',
              textColor: '#ffffff',
              padding: '3rem 2rem',
            },
          },
          {
            id: 'seed_mobilya_contact_columns',
            type: 'columns',
            props: { columns: 2, gap: '2rem' },
            children: [
              {
                id: 'seed_mobilya_contact_info',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h3>Get in Touch</h3><p><strong>Email:</strong> info@example.com</p><p><strong>Phone:</strong> +1 (555) 000-0000</p><p><strong>Showroom:</strong> 456 Furniture Avenue, Suite 200, Los Angeles, CA 90015</p><p>Visit our showroom to see and feel our furniture in person. Our consultants can assist with room planning and custom orders.</p>',
                    tr: '<h3>Iletisim Bilgileri</h3><p><strong>E-posta:</strong> info@example.com</p><p><strong>Telefon:</strong> +1 (555) 000-0000</p><p><strong>Showroom:</strong> 456 Mobilya Caddesi, Suite 200, Los Angeles, CA 90015</p><p>Mobilyalarimizi yakindan gormek ve hissetmek icin showroomumuzu ziyaret edin. Daniismanlarimiz oda planlama ve ozel siparisler konusunda yardimci olabilir.</p>',
                    de: '<h3>Kontaktinformationen</h3><p><strong>E-Mail:</strong> info@example.com</p><p><strong>Telefon:</strong> +1 (555) 000-0000</p><p><strong>Showroom:</strong> 456 Furniture Avenue, Suite 200, Los Angeles, CA 90015</p><p>Besuchen Sie unseren Showroom, um unsere Moebel persoenlich zu sehen und zu fuehlen.</p>',
                    fr: '<h3>Coordonnees</h3><p><strong>E-mail:</strong> info@example.com</p><p><strong>Telephone:</strong> +1 (555) 000-0000</p><p><strong>Showroom:</strong> 456 Furniture Avenue, Suite 200, Los Angeles, CA 90015</p><p>Visitez notre showroom pour voir et toucher nos meubles en personne.</p>',
                    es: '<h3>Informacion de contacto</h3><p><strong>Correo:</strong> info@example.com</p><p><strong>Telefono:</strong> +1 (555) 000-0000</p><p><strong>Showroom:</strong> 456 Furniture Avenue, Suite 200, Los Angeles, CA 90015</p><p>Visite nuestro showroom para ver y sentir nuestros muebles en persona.</p>',
                  },
                },
              },
              {
                id: 'seed_mobilya_contact_hours',
                type: 'text',
                props: {
                  tag: 'div',
                  content: {
                    en: '<h3>Business Hours</h3><p><strong>Monday - Friday:</strong> 9:00 AM - 7:00 PM</p><p><strong>Saturday:</strong> 10:00 AM - 6:00 PM</p><p><strong>Sunday:</strong> 11:00 AM - 4:00 PM</p><p>Our showroom is open seven days a week so you can browse at your convenience.</p>',
                    tr: '<h3>Calisma Saatleri</h3><p><strong>Pazartesi - Cuma:</strong> 09:00 - 19:00</p><p><strong>Cumartesi:</strong> 10:00 - 18:00</p><p><strong>Pazar:</strong> 11:00 - 16:00</p><p>Showroomumuz haftanin yedi gunu aciktir, rahatiniza gore gezebilirsiniz.</p>',
                    de: '<h3>Geschaeftszeiten</h3><p><strong>Montag - Freitag:</strong> 9:00 - 19:00 Uhr</p><p><strong>Samstag:</strong> 10:00 - 18:00 Uhr</p><p><strong>Sonntag:</strong> 11:00 - 16:00 Uhr</p><p>Unser Showroom ist sieben Tage die Woche geoeffnet.</p>',
                    fr: '<h3>Heures d\'ouverture</h3><p><strong>Lundi - Vendredi:</strong> 9h00 - 19h00</p><p><strong>Samedi:</strong> 10h00 - 18h00</p><p><strong>Dimanche:</strong> 11h00 - 16h00</p><p>Notre showroom est ouvert sept jours sur sept.</p>',
                    es: '<h3>Horario comercial</h3><p><strong>Lunes - Viernes:</strong> 9:00 - 19:00</p><p><strong>Sabado:</strong> 10:00 - 18:00</p><p><strong>Domingo:</strong> 11:00 - 16:00</p><p>Nuestro showroom esta abierto los siete dias de la semana.</p>',
                  },
                },
              },
            ],
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Contact our furniture experts. Visit our showroom or reach out online for custom orders and room planning.',
        tr: 'Mobilya uzmanlarimizla iletisime gecin. Ozel siparisler ve oda planlama icin showroomumuzu ziyaret edin.',
        de: 'Kontaktieren Sie unsere Moebelexperten. Besuchen Sie unseren Showroom fuer Sonderanfertigungen und Raumplanung.',
        fr: 'Contactez nos experts en mobilier. Visitez notre showroom pour des commandes sur mesure et l\'amenagement.',
        es: 'Contacte a nuestros expertos en muebles. Visite nuestro showroom para pedidos personalizados y planificacion.',
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
            id: 'seed_mobilya_faq_hero',
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
              backgroundColor: '#2c3e50',
              textColor: '#ffffff',
              padding: '2rem 0',
            },
          },
          {
            id: 'seed_mobilya_faq_accordion',
            type: 'accordion',
            props: {
              items: [
                {
                  title: {
                    en: 'How does delivery and assembly work?',
                    tr: 'Teslimat ve kurulum nasil yapiliyor?',
                    de: 'Wie funktioniert Lieferung und Montage?',
                    fr: 'Comment fonctionne la livraison et le montage?',
                    es: 'Como funciona la entrega y el montaje?',
                  },
                  content: {
                    en: 'We offer white-glove delivery service that includes bringing the furniture into your room of choice and full assembly. Standard delivery takes 5-10 business days depending on your location. Express delivery is available for in-stock items for an additional fee. Our assembly team will also remove all packaging materials when they leave.',
                    tr: 'Mobilyanin sectiginiz odaya tasinmasini ve tam kurulumunu iceren ozel teslimat hizmeti sunuyoruz. Standart teslimat, konumunuza bagli olarak 5-10 is gunu surmektedir. Stokta bulunan urunler icin ek ucretle hizli teslimat mevcuttur. Kurulum ekibimiz ayrilirken tum ambalaj malzemelerini de kaldirir.',
                    de: 'Wir bieten einen White-Glove-Lieferservice an, der das Einbringen der Moebel in den Raum Ihrer Wahl und die vollstaendige Montage umfasst. Die Standardlieferung dauert je nach Standort 5-10 Werktage. Express-Lieferung ist fuer Lagerartikel gegen Aufpreis verfuegbar.',
                    fr: 'Nous offrons un service de livraison premium qui comprend l\'installation du meuble dans la piece de votre choix et le montage complet. La livraison standard prend 5 a 10 jours ouvrables selon votre localisation. La livraison express est disponible pour les articles en stock moyennant un supplement.',
                    es: 'Ofrecemos servicio de entrega premium que incluye llevar el mueble a la habitacion de su eleccion y montaje completo. La entrega estandar tarda de 5 a 10 dias habiles segun su ubicacion. La entrega express esta disponible para articulos en stock por un cargo adicional.',
                  },
                },
                {
                  title: {
                    en: 'What warranty do you provide?',
                    tr: 'Hangi garantiyi sunuyorsunuz?',
                    de: 'Welche Garantie bieten Sie?',
                    fr: 'Quelle garantie offrez-vous?',
                    es: 'Que garantia ofrecen?',
                  },
                  content: {
                    en: 'All our furniture comes with a 5-year structural warranty covering the frame, joints, and springs. Fabric and leather upholstery are covered for 2 years against manufacturing defects. Outdoor furniture has a 3-year warranty for frame integrity and a 1-year warranty for cushion fabric. Our warranty does not cover normal wear and tear or damage caused by misuse.',
                    tr: 'Tum mobilyalarimiz iskelet, birlesim yerleri ve yaylari kapsayan 5 yillik yapisal garanti ile gelir. Kumas ve deri dosemeler uretim hatalarina karsi 2 yil garantilidir. Dis mekan mobilyalari iskelet butunlugu icin 3 yil ve minder kumasi icin 1 yil garantiye sahiptir. Garantimiz normal asinma veya yanlis kullanimdan kaynaklanan hasarlari kapsamaz.',
                    de: 'Alle unsere Moebel werden mit einer 5-jaehrigen Strukturgarantie geliefert, die Rahmen, Verbindungen und Federn abdeckt. Stoff- und Lederpolster sind 2 Jahre lang gegen Herstellungsfehler abgedeckt. Outdoor-Moebel haben eine 3-jaehrige Garantie fuer die Rahmenintegritaet und eine 1-jaehrige Garantie fuer den Kissenstoff.',
                    fr: 'Tous nos meubles sont accompagnes d\'une garantie structurelle de 5 ans couvrant le cadre, les joints et les ressorts. Le revetement en tissu et en cuir est couvert pendant 2 ans contre les defauts de fabrication. Les meubles d\'exterieur ont une garantie de 3 ans pour l\'integrite du cadre et de 1 an pour le tissu des coussins.',
                    es: 'Todos nuestros muebles incluyen una garantia estructural de 5 anos que cubre el marco, las juntas y los resortes. La tapiceria de tela y cuero esta cubierta durante 2 anos contra defectos de fabricacion. Los muebles de exterior tienen una garantia de 3 anos para la integridad del marco y 1 ano para la tela de los cojines.',
                  },
                },
                {
                  title: {
                    en: 'What materials do you use?',
                    tr: 'Hangi malzemeleri kullaniyorsunuz?',
                    de: 'Welche Materialien verwenden Sie?',
                    fr: 'Quels materiaux utilisez-vous?',
                    es: 'Que materiales utilizan?',
                  },
                  content: {
                    en: 'We use sustainably sourced solid hardwoods including oak, walnut, and beech for our frames. Upholstery fabrics range from performance polyester blends to genuine top-grain leather. All foams are CertiPUR-US certified and free from harmful chemicals. Metal components are powder-coated stainless steel or brushed aluminium for lasting durability.',
                    tr: 'Iskeletlerimiz icin mese, ceviz ve kayin dahil surdurulebilir kaynaklardan elde edilen masif sert agaclar kullaniyoruz. Doseme kumaslari performans polyester karisimlarindan gercek ust tahil deriye kadar uzanir. Tum sungerler CertiPUR-US sertifikali olup zararli kimyasallar icermez. Metal bilesenler uzun omurlu dayaniklilik icin toz boyali paslanmaz celik veya fircalanmis aluminyumdur.',
                    de: 'Wir verwenden nachhaltig beschafftes massives Hartholz wie Eiche, Walnuss und Buche fuer unsere Rahmen. Polsterstoffe reichen von leistungsfaehigen Polyester-Mischungen bis hin zu echtem vollnarbigem Leder. Alle Schaumstoffe sind CertiPUR-US-zertifiziert und frei von Schadstoffen.',
                    fr: 'Nous utilisons des bois durs massifs d\'origine durable, dont le chene, le noyer et le hetre, pour nos cadres. Les tissus d\'ameublement vont des melanges polyester performants au cuir pleine fleur veritable. Toutes les mousses sont certifiees CertiPUR-US et exemptes de produits chimiques nocifs.',
                    es: 'Utilizamos maderas duras macizas de origen sostenible, incluyendo roble, nogal y haya para nuestros marcos. Las telas de tapiceria van desde mezclas de poliester de alto rendimiento hasta cuero genuino de grano superior. Todas las espumas estan certificadas CertiPUR-US y libres de quimicos daninos.',
                  },
                },
                {
                  title: {
                    en: 'How should I care for my furniture?',
                    tr: 'Mobilyalarima nasil bakim yapmaliyim?',
                    de: 'Wie pflege ich meine Moebel?',
                    fr: 'Comment entretenir mes meubles?',
                    es: 'Como debo cuidar mis muebles?',
                  },
                  content: {
                    en: 'For wood surfaces, dust regularly with a soft cloth and apply furniture polish every few months. Avoid placing hot items directly on the surface. For fabric upholstery, vacuum weekly and address spills immediately with a damp cloth. Leather pieces should be conditioned twice a year with a quality leather care product. Keep all furniture away from direct sunlight and heat sources to prevent fading and warping.',
                    tr: 'Ahsap yuzeyler icin duzeni olarak yumusak bir bezle toz alin ve birka ayda bir mobilya cilasi uygulayin. Sicak nesneleri dogrudan yuzey uzerine koymaktan kacinin. Kumas dosemeler icin haftada bir elektrik supurgesiyle temizleyin ve dokulmeleri hemen nemli bir bezle temizleyin. Deri parcalar yilda iki kez kaliteli bir deri bakim urunu ile bakimi yapilmalidir.',
                    de: 'Fuer Holzoberflaechen regelmaessig mit einem weichen Tuch abstauben und alle paar Monate Moebelpolitur auftragen. Vermeiden Sie es, heisse Gegenstaende direkt auf die Oberflaeche zu stellen. Fuer Stoffpolster woechentlich absaugen und Verschuettungen sofort mit einem feuchten Tuch behandeln.',
                    fr: 'Pour les surfaces en bois, depoussierer regulierement avec un chiffon doux et appliquer du cirage pour meubles tous les quelques mois. Evitez de placer des objets chauds directement sur la surface. Pour le tissu d\'ameublement, aspirez chaque semaine et traitez les eclaboussures immediatement avec un chiffon humide.',
                    es: 'Para superficies de madera, limpie el polvo regularmente con un pano suave y aplique cera para muebles cada pocos meses. Evite colocar objetos calientes directamente sobre la superficie. Para tapiceria de tela, aspire semanalmente y atienda los derrames inmediatamente con un pano humedo.',
                  },
                },
                {
                  title: {
                    en: 'Do you accept custom orders?',
                    tr: 'Ozel siparisler kabul ediyor musunuz?',
                    de: 'Nehmen Sie Sonderanfertigungen an?',
                    fr: 'Acceptez-vous les commandes sur mesure?',
                    es: 'Aceptan pedidos personalizados?',
                  },
                  content: {
                    en: 'Yes, we offer a full custom furniture service. You can choose from a wide range of woods, fabrics, and finishes to create a piece that is perfectly tailored to your space. Custom orders typically take 6-8 weeks to produce. A 30% deposit is required upfront with the balance due before delivery. Contact our design team to start your custom project.',
                    tr: 'Evet, tam kapsamli ozel mobilya hizmeti sunuyoruz. Mekaniniza mukemmel sekilde uyarlanmis bir parca olusturmak icin genis bir ahsap, kumas ve cila yelpazesinden secim yapabilirsiniz. Ozel siparisler genellikle 6-8 haftada uretilir. Pesnat olarak %30 depozito gereklidir, kalan miktar teslimat oncesi odenir. Ozel projenizi baslatmak icin tasarim ekibimizle iletisime gecin.',
                    de: 'Ja, wir bieten einen vollstaendigen Service fuer massgeschneiderte Moebel. Sie koennen aus einer breiten Palette von Hoelzern, Stoffen und Oberflaechen waehlen, um ein Stueck zu schaffen, das perfekt auf Ihren Raum zugeschnitten ist. Sonderanfertigungen dauern in der Regel 6-8 Wochen.',
                    fr: 'Oui, nous offrons un service complet de mobilier sur mesure. Vous pouvez choisir parmi une large gamme de bois, tissus et finitions pour creer une piece parfaitement adaptee a votre espace. Les commandes sur mesure prennent generalement 6 a 8 semaines de production.',
                    es: 'Si, ofrecemos un servicio completo de muebles personalizados. Puede elegir entre una amplia gama de maderas, telas y acabados para crear una pieza perfectamente adaptada a su espacio. Los pedidos personalizados generalmente tardan de 6 a 8 semanas en producirse.',
                  },
                },
              ],
            },
          },
        ],
      },
      isPublished: true,
      seoMeta: {
        en: 'Find answers about furniture delivery, assembly, warranty, materials, care, and custom orders.',
        tr: 'Mobilya teslimat, kurulum, garanti, malzeme, bakim ve ozel siparis hakkinda yanitlar bulun.',
        de: 'Finden Sie Antworten zu Moebellieferung, Montage, Garantie, Materialien, Pflege und Sonderanfertigungen.',
        fr: 'Trouvez des reponses sur la livraison, le montage, la garantie, les materiaux, l\'entretien et les commandes sur mesure.',
        es: 'Encuentre respuestas sobre entrega de muebles, montaje, garantia, materiales, cuidado y pedidos personalizados.',
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
            id: 'seed_mobilya_shop_hero',
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
            id: 'seed_mobilya_shop_listing',
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
        en: 'Browse our full furniture catalogue. Filter by room, style, material, and price.',
        tr: 'Tum mobilya katalogumuza goz atin. Oda, stil, malzeme ve fiyata gore filtreleyin.',
        de: 'Durchsuchen Sie unseren vollstaendigen Moebelkatalog. Filtern Sie nach Raum, Stil, Material und Preis.',
        fr: 'Parcourez notre catalogue complet de meubles. Filtrez par piece, style, materiau et prix.',
        es: 'Explore nuestro catalogo completo de muebles. Filtre por habitacion, estilo, material y precio.',
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
            id: 'seed_mobilya_categories_hero',
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
            id: 'seed_mobilya_categories_listing',
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
        en: 'Browse furniture categories. Living room, bedroom, dining room, home office, and garden furniture.',
        tr: 'Mobilya kategorilerine goz atin. Salon, yatak odasi, yemek odasi, calisma odasi ve bahce mobilyasi.',
        de: 'Durchsuchen Sie Moebelkategorien. Wohnzimmer, Schlafzimmer, Esszimmer, Homeoffice und Gartenmoebel.',
        fr: 'Parcourez les categories de meubles. Salon, chambre, salle a manger, bureau et jardin.',
        es: 'Explore categorias de muebles. Salon, dormitorio, comedor, oficina en casa y muebles de jardin.',
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
            id: 'seed_mobilya_products_hero',
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
            id: 'seed_mobilya_products_listing',
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
        en: 'Explore our complete furniture range. Search sofas, tables, beds, shelves, and outdoor furniture.',
        tr: 'Tum mobilya yelpazemizi kesfedin. Koltuklar, masalar, yataklar, raflar ve dis mekan mobilyalari arayin.',
        de: 'Entdecken Sie unser komplettes Moebelsortiment. Suchen Sie Sofas, Tische, Betten, Regale und Outdoor-Moebel.',
        fr: 'Explorez notre gamme complete de meubles. Recherchez canapes, tables, lits, etageres et mobilier d\'exterieur.',
        es: 'Explore nuestra gama completa de muebles. Busque sofas, mesas, camas, estantes y muebles de exterior.',
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
    { key: 'sector', value: 'mobilya', group: 'general' },
  ],
};
