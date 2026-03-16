import type { SectorSeedData } from './types';
import type { PageContent, Block } from '@zunapro/types';

// ---------------------------------------------------------------------------
// Ev & Yasam (Home & Living) Sector Seed Data
// ---------------------------------------------------------------------------

const homeBlocks: Block[] = [
  {
    id: 'seed_ev-yasam_home_hero',
    type: 'hero',
    props: {
      title: {
        en: 'Inspiring Designs for Your Home',
        tr: 'Eviniz Icin Ilham Veren Tasarimlar',
        de: 'Inspirierende Designs fuer Ihr Zuhause',
        fr: 'Des designs inspirants pour votre maison',
        es: 'Disenos inspiradores para tu hogar',
      },
      subtitle: {
        en: 'Transform your living spaces with our curated collection of home decor, kitchenware, and lighting.',
        tr: 'Ozenle secilmis ev dekorasyonu, mutfak gerecleri ve aydinlatma koleksiyonumuzla yasam alanlarinizi donusturun.',
        de: 'Verwandeln Sie Ihre Wohnraeume mit unserer kuratierten Kollektion von Wohndekor, Kuechenwaren und Beleuchtung.',
        fr: 'Transformez vos espaces de vie avec notre collection de decoration, ustensiles de cuisine et eclairage.',
        es: 'Transforma tus espacios con nuestra coleccion de decoracion del hogar, utensilios de cocina e iluminacion.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&h=600&fit=crop',
      ctaText: {
        en: 'Shop Now',
        tr: 'Alisverise Basla',
        de: 'Jetzt einkaufen',
        fr: 'Acheter maintenant',
        es: 'Comprar ahora',
      },
      ctaLink: '/pages/shop',
    },
  },
  {
    id: 'seed_ev-yasam_home_spacer1',
    type: 'spacer',
    props: { height: '3rem' },
  },
  {
    id: 'seed_ev-yasam_home_products',
    type: 'product-showcase',
    props: {
      title: {
        en: 'Best Sellers',
        tr: 'Cok Satanlar',
        de: 'Bestseller',
        fr: 'Meilleures ventes',
        es: 'Los mas vendidos',
      },
      limit: 8,
      columns: 4,
    },
  },
  {
    id: 'seed_ev-yasam_home_spacer2',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_ev-yasam_home_categories',
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
    id: 'seed_ev-yasam_home_spacer3',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_ev-yasam_home_banner',
    type: 'banner',
    props: {
      title: {
        en: 'New Arrivals for Every Room',
        tr: 'Her Oda Icin Yeni Gelenler',
        de: 'Neuheiten fuer jeden Raum',
        fr: 'Nouveautes pour chaque piece',
        es: 'Novedades para cada habitacion',
      },
      description: {
        en: 'Refresh your home with our latest collection of modern and timeless pieces designed for comfort and style.',
        tr: 'Konfor ve stil icin tasarlanmis modern ve zamansiz parcalardan olusan en son koleksiyonumuzla evinizi yenileyin.',
        de: 'Erfrischen Sie Ihr Zuhause mit unserer neuesten Kollektion moderner und zeitloser Stuecke, die fuer Komfort und Stil entworfen wurden.',
        fr: 'Rafraichissez votre maison avec notre derniere collection de pieces modernes et intemporelles concues pour le confort et le style.',
        es: 'Renueva tu hogar con nuestra ultima coleccion de piezas modernas y atemporales disenadas para la comodidad y el estilo.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop',
      ctaText: {
        en: 'View Collection',
        tr: 'Koleksiyonu Goruntule',
        de: 'Kollektion ansehen',
        fr: 'Voir la collection',
        es: 'Ver coleccion',
      },
      ctaLink: '/pages/shop',
    },
  },
  {
    id: 'seed_ev-yasam_home_spacer4',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_ev-yasam_home_newsletter',
    type: 'newsletter',
    props: {
      title: {
        en: 'Get Inspired',
        tr: 'Ilham Alin',
        de: 'Lassen Sie sich inspirieren',
        fr: 'Inspirez-vous',
        es: 'Inspirate',
      },
      description: {
        en: 'Subscribe for home decor tips, new product launches, and exclusive member discounts.',
        tr: 'Ev dekorasyonu ipuclari, yeni urun lansmanlar ve ozel uye indirimleri icin abone olun.',
        de: 'Abonnieren Sie fuer Wohndekor-Tipps, neue Produkteinfuehrungen und exklusive Mitgliederrabatte.',
        fr: 'Abonnez-vous pour des conseils de decoration, les lancements de nouveaux produits et des remises exclusives aux membres.',
        es: 'Suscribete para consejos de decoracion, lanzamientos de nuevos productos y descuentos exclusivos para miembros.',
      },
    },
  },
];

const shopBlocks: Block[] = [
  {
    id: 'seed_ev-yasam_shop_hero',
    type: 'hero',
    props: {
      title: {
        en: 'Our Collection',
        tr: 'Koleksiyonumuz',
        de: 'Unsere Kollektion',
        fr: 'Notre collection',
        es: 'Nuestra coleccion',
      },
      subtitle: {
        en: 'Browse our full range of home and living products for every room.',
        tr: 'Her oda icin ev ve yasam urunlerimizin tam yelpazesine goz atin.',
        de: 'Durchsuchen Sie unser gesamtes Sortiment an Wohn- und Lebensprodukten fuer jeden Raum.',
        fr: 'Parcourez notre gamme complete de produits maison et vie pour chaque piece.',
        es: 'Explora nuestra gama completa de productos para el hogar para cada habitacion.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_ev-yasam_shop_listing',
    type: 'product-listing',
    props: {
      showFilters: true,
      showSearch: true,
      productsPerPage: 12,
      columns: 4,
    },
  },
];

const categoriesBlocks: Block[] = [
  {
    id: 'seed_ev-yasam_categories_hero',
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
        en: 'Explore our home and living categories to find what you need.',
        tr: 'Ihtiyaciniz olani bulmak icin ev ve yasam kategorilerimizi kesfedin.',
        de: 'Erkunden Sie unsere Wohn- und Lebenskategorien, um zu finden, was Sie brauchen.',
        fr: 'Explorez nos categories maison et vie pour trouver ce dont vous avez besoin.',
        es: 'Explora nuestras categorias de hogar y vida para encontrar lo que necesitas.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_ev-yasam_categories_listing',
    type: 'category-listing',
    props: {
      columns: 4,
      showProductCount: true,
      layout: 'grid',
    },
  },
];

const productsBlocks: Block[] = [
  {
    id: 'seed_ev-yasam_products_hero',
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
        en: 'Explore our complete range of home decor, kitchenware, and lighting.',
        tr: 'Ev dekorasyonu, mutfak gerecleri ve aydinlatma urunlerimizin tamamini kesfedin.',
        de: 'Entdecken Sie unser komplettes Sortiment an Wohndekor, Kuechenwaren und Beleuchtung.',
        fr: 'Explorez notre gamme complete de decoration, ustensiles de cuisine et eclairage.',
        es: 'Explora nuestra gama completa de decoracion del hogar, utensilios de cocina e iluminacion.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_ev-yasam_products_listing',
    type: 'product-listing',
    props: {
      showFilters: false,
      showSearch: true,
      productsPerPage: 24,
      columns: 4,
    },
  },
];

const aboutBlocks: Block[] = [
  {
    id: 'seed_ev-yasam_about_hero',
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
        en: 'Crafting beautiful living spaces since day one.',
        tr: 'Ilk gunden beri guzel yasam alanlari yaratiyoruz.',
        de: 'Seit dem ersten Tag schoene Wohnraeume gestalten.',
        fr: 'Creer de beaux espaces de vie depuis le premier jour.',
        es: 'Creando hermosos espacios de vida desde el primer dia.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=600&fit=crop',
    },
  },
  {
    id: 'seed_ev-yasam_about_text',
    type: 'text',
    props: {
      tag: 'div',
      content: {
        en:
          '<h2>Our Story</h2>' +
          '<p>We founded our company with a simple mission: to make beautiful, functional home products accessible to everyone. We believe that your surroundings have a profound impact on how you feel, and we are committed to helping you create spaces that bring joy and comfort.</p>' +
          '<p>Our buyers travel the world to discover unique artisan craftsmanship and contemporary design. Each piece in our collection is chosen for its quality, aesthetic appeal, and ability to transform a room. We partner with skilled craftspeople and responsible manufacturers who share our passion for excellence.</p>' +
          '<p>Sustainability is at the core of our business. We prioritize eco-friendly materials, ethical sourcing, and minimal packaging. From recycled ceramics to responsibly harvested wood, every decision we make reflects our commitment to the planet and future generations.</p>',
        tr:
          '<h2>Hikayemiz</h2>' +
          '<p>Sirketimizi basit bir misyonla kurduk: guzel, islevsel ev urunlerini herkes icin erisilebilir kilmak. Cevrenizin nasil hissettiginiz uzerinde derin bir etkisi olduguna inaniyoruz ve keyif ve konfor getiren mekanlar yaratmaniza yardimci olmaya karariliyiz.</p>' +
          '<p>Alicilarimiz benzersiz zanaat isciligini ve cagdas tasarimi kesfetmek icin dunyanin dort bir yanini geziyorlar. Koleksiyonumuzdaki her parca, kalitesi, estetik cekiciligi ve bir odayi donusturme yeteneginden dolayi secilmistir. Mukemmellik tutkumuzu paylasan yetenekli zanaat ustalar ve sorumlu ureticicilerle is birligiyapiyoruz.</p>' +
          '<p>Surdurulebilirlik isimizin merkezindedir. Cevre dostu malzemelere, etik tedarike ve minimum ambalaja oncelik veriyoruz. Geri donusturulmus seramiklerden sorumlu bir sekilde hasat edilen ahsaba kadar, aldigimiz her karar gezegene ve gelecek nesillere olan bagliligimizi yansitir.</p>',
        de:
          '<h2>Unsere Geschichte</h2>' +
          '<p>Wir haben unser Unternehmen mit einer einfachen Mission gegruendet: schoene, funktionale Wohnprodukte fuer jeden zugaenglich zu machen. Wir glauben, dass Ihre Umgebung einen tiefgreifenden Einfluss darauf hat, wie Sie sich fuehlen, und wir engagieren uns dafuer, Ihnen zu helfen, Raeume zu schaffen, die Freude und Komfort bringen.</p>' +
          '<p>Unsere Einkaufer reisen um die Welt, um einzigartige handwerkliche Kunst und zeitgenoessisches Design zu entdecken. Jedes Stueck in unserer Kollektion wird aufgrund seiner Qualitaet, aesthetischen Anziehungskraft und Faehigkeit, einen Raum zu verwandeln, ausgewaehlt. Wir arbeiten mit erfahrenen Handwerkern und verantwortungsvollen Herstellern zusammen, die unsere Leidenschaft fuer Exzellenz teilen.</p>' +
          '<p>Nachhaltigkeit steht im Mittelpunkt unseres Geschaefts. Wir bevorzugen umweltfreundliche Materialien, ethische Beschaffung und minimale Verpackung. Von recycelter Keramik bis hin zu verantwortungsvoll geerntetem Holz spiegelt jede unserer Entscheidungen unser Engagement fuer den Planeten und zukuenftige Generationen wider.</p>',
        fr:
          '<h2>Notre histoire</h2>' +
          '<p>Nous avons fonde notre entreprise avec une mission simple : rendre les produits pour la maison beaux et fonctionnels accessibles a tous. Nous croyons que votre environnement a un impact profond sur la facon dont vous vous sentez, et nous nous engageons a vous aider a creer des espaces qui apportent joie et confort.</p>' +
          '<p>Nos acheteurs parcourent le monde pour decouvrir un artisanat unique et un design contemporain. Chaque piece de notre collection est choisie pour sa qualite, son attrait esthetique et sa capacite a transformer une piece. Nous travaillons avec des artisans qualifies et des fabricants responsables qui partagent notre passion pour l\'excellence.</p>' +
          '<p>La durabilite est au coeur de notre activite. Nous privilegions les materiaux ecologiques, l\'approvisionnement ethique et un emballage minimal. Des ceramiques recyclees au bois recolte de maniere responsable, chaque decision que nous prenons reflete notre engagement envers la planete et les generations futures.</p>',
        es:
          '<h2>Nuestra historia</h2>' +
          '<p>Fundamos nuestra empresa con una mision simple: hacer que los productos para el hogar hermosos y funcionales sean accesibles para todos. Creemos que tu entorno tiene un profundo impacto en como te sientes, y estamos comprometidos a ayudarte a crear espacios que brinden alegria y comodidad.</p>' +
          '<p>Nuestros compradores viajan por el mundo para descubrir artesania unica y diseno contemporaneo. Cada pieza de nuestra coleccion es elegida por su calidad, atractivo estetico y capacidad para transformar una habitacion. Nos asociamos con artesanos calificados y fabricantes responsables que comparten nuestra pasion por la excelencia.</p>' +
          '<p>La sostenibilidad esta en el centro de nuestro negocio. Priorizamos materiales ecologicos, abastecimiento etico y embalaje minimo. Desde ceramicas recicladas hasta madera cosechada responsablemente, cada decision que tomamos refleja nuestro compromiso con el planeta y las generaciones futuras.</p>',
      },
    },
  },
];

const contactBlocks: Block[] = [
  {
    id: 'seed_ev-yasam_contact_hero',
    type: 'hero',
    props: {
      title: {
        en: 'Contact Us',
        tr: 'Iletisim',
        de: 'Kontakt',
        fr: 'Contactez-nous',
        es: 'Contacto',
      },
      subtitle: {
        en: 'Questions about a product or your order? Our team is here to help.',
        tr: 'Bir urun veya siparisibiz hakkinda sorulariniz mi var? Ekibimiz yardimci olmak icin burada.',
        de: 'Fragen zu einem Produkt oder Ihrer Bestellung? Unser Team ist hier, um zu helfen.',
        fr: 'Des questions sur un produit ou votre commande? Notre equipe est la pour vous aider.',
        es: 'Preguntas sobre un producto o tu pedido? Nuestro equipo esta aqui para ayudarte.',
      },
    },
  },
  {
    id: 'seed_ev-yasam_contact_columns',
    type: 'columns',
    props: { columns: 2, gap: '2rem' },
    children: [
      {
        id: 'seed_ev-yasam_contact_info',
        type: 'text',
        props: {
          tag: 'div',
          content: {
            en:
              '<h3>Get in Touch</h3>' +
              '<p><strong>Email:</strong> info@example.com</p>' +
              '<p><strong>Phone:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Address:</strong> 78 Design Boulevard, Floor 3, Chicago, IL 60601</p>',
            tr:
              '<h3>Bize Ulasin</h3>' +
              '<p><strong>E-posta:</strong> info@example.com</p>' +
              '<p><strong>Telefon:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adres:</strong> 78 Design Boulevard, Floor 3, Chicago, IL 60601</p>',
            de:
              '<h3>Kontaktieren Sie uns</h3>' +
              '<p><strong>E-Mail:</strong> info@example.com</p>' +
              '<p><strong>Telefon:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adresse:</strong> 78 Design Boulevard, Floor 3, Chicago, IL 60601</p>',
            fr:
              '<h3>Nous contacter</h3>' +
              '<p><strong>E-mail:</strong> info@example.com</p>' +
              '<p><strong>Telephone:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adresse:</strong> 78 Design Boulevard, Floor 3, Chicago, IL 60601</p>',
            es:
              '<h3>Contactenos</h3>' +
              '<p><strong>Correo:</strong> info@example.com</p>' +
              '<p><strong>Telefono:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Direccion:</strong> 78 Design Boulevard, Floor 3, Chicago, IL 60601</p>',
          },
        },
      },
      {
        id: 'seed_ev-yasam_contact_hours',
        type: 'text',
        props: {
          tag: 'div',
          content: {
            en:
              '<h3>Business Hours</h3>' +
              '<p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>' +
              '<p><strong>Saturday:</strong> 10:00 AM - 5:00 PM</p>' +
              '<p><strong>Sunday:</strong> Closed</p>',
            tr:
              '<h3>Calisma Saatleri</h3>' +
              '<p><strong>Pazartesi - Cuma:</strong> 09:00 - 18:00</p>' +
              '<p><strong>Cumartesi:</strong> 10:00 - 17:00</p>' +
              '<p><strong>Pazar:</strong> Kapali</p>',
            de:
              '<h3>Geschaeftszeiten</h3>' +
              '<p><strong>Montag - Freitag:</strong> 9:00 - 18:00 Uhr</p>' +
              '<p><strong>Samstag:</strong> 10:00 - 17:00 Uhr</p>' +
              '<p><strong>Sonntag:</strong> Geschlossen</p>',
            fr:
              '<h3>Heures d\'ouverture</h3>' +
              '<p><strong>Lundi - Vendredi:</strong> 9h00 - 18h00</p>' +
              '<p><strong>Samedi:</strong> 10h00 - 17h00</p>' +
              '<p><strong>Dimanche:</strong> Ferme</p>',
            es:
              '<h3>Horario comercial</h3>' +
              '<p><strong>Lunes - Viernes:</strong> 9:00 - 18:00</p>' +
              '<p><strong>Sabado:</strong> 10:00 - 17:00</p>' +
              '<p><strong>Domingo:</strong> Cerrado</p>',
          },
        },
      },
    ],
  },
];

const faqBlocks: Block[] = [
  {
    id: 'seed_ev-yasam_faq_hero',
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
        en: 'Find answers to common questions about our home products, delivery, and services.',
        tr: 'Ev urunlerimiz, teslimat ve hizmetlerimiz hakkinda sik sorulan sorularin yanitlarini bulun.',
        de: 'Finden Sie Antworten auf haeufige Fragen zu unseren Wohnprodukten, Lieferung und Dienstleistungen.',
        fr: 'Trouvez des reponses aux questions courantes sur nos produits maison, la livraison et nos services.',
        es: 'Encuentra respuestas a preguntas comunes sobre nuestros productos para el hogar, entrega y servicios.',
      },
    },
  },
  {
    id: 'seed_ev-yasam_faq_accordion',
    type: 'accordion',
    props: {
      items: [
        {
          title: {
            en: 'How are large items delivered?',
            tr: 'Buyuk urunler nasil teslim edilir?',
            de: 'Wie werden grosse Artikel geliefert?',
            fr: 'Comment les articles volumineux sont-ils livres?',
            es: 'Como se entregan los articulos grandes?',
          },
          content: {
            en: 'Large items such as chandeliers and furniture pieces are delivered via our specialist logistics partner. Delivery typically takes 5-7 business days and includes white-glove service for items over a certain weight threshold. You will receive tracking information and a delivery time window once your order ships.',
            tr: 'Avizeler ve mobilya parcalari gibi buyuk urunler, uzman lojistik ortaginiz araciligiyla teslim edilir. Teslimat genellikle 5-7 is gunu surer ve belirli bir agirlik esiginin uzerindeki urunler icin beyaz eldiven hizmeti icerir. Siparisibiz kargolandiktan sonra takip bilgileri ve teslimat zaman araligi alacaksiniz.',
            de: 'Grosse Artikel wie Kronleuchter und Moebelstuecke werden ueber unseren spezialisierten Logistikpartner geliefert. Die Lieferung dauert in der Regel 5-7 Werktage und beinhaltet einen White-Glove-Service fuer Artikel ueber einem bestimmten Gewichtsschwellenwert. Sie erhalten Tracking-Informationen und ein Lieferzeitfenster, sobald Ihre Bestellung versandt wird.',
            fr: 'Les articles volumineux tels que les lustres et les meubles sont livres par notre partenaire logistique specialise. La livraison prend generalement 5 a 7 jours ouvrables et comprend un service gants blancs pour les articles depassant un certain seuil de poids. Vous recevrez des informations de suivi et un creneau de livraison une fois votre commande expediee.',
            es: 'Los articulos grandes como lamparas de arana y piezas de mobiliario se entregan a traves de nuestro socio logistico especializado. La entrega normalmente toma de 5 a 7 dias habiles e incluye servicio de guante blanco para articulos que superen cierto umbral de peso. Recibira informacion de seguimiento y una ventana de tiempo de entrega una vez que se envie su pedido.',
          },
        },
        {
          title: {
            en: 'Are product dimensions listed on the product page?',
            tr: 'Urun boyutlari urun sayfasinda listeleniyor mu?',
            de: 'Sind die Produktabmessungen auf der Produktseite aufgefuehrt?',
            fr: 'Les dimensions du produit sont-elles indiquees sur la page du produit?',
            es: 'Las dimensiones del producto estan listadas en la pagina del producto?',
          },
          content: {
            en: 'Yes, every product page includes detailed dimensions (height, width, depth, and weight) along with high-resolution images from multiple angles. We recommend measuring your space before ordering to ensure a perfect fit. If you need additional measurements, our support team is happy to assist.',
            tr: 'Evet, her urun sayfasi birden fazla acidan yuksek cozunurluklu gorsellerle birlikte ayrintili boyutlari (yukseklik, genislik, derinlik ve agirlik) icerir. Mukemmel bir uyum saglamak icin siparis vermeden once mekaninizi olcmenizi oneririz. Ek olculere ihtiyaciniz varsa, destek ekibimiz yardimci olmaktan mutluluk duyar.',
            de: 'Ja, jede Produktseite enthaelt detaillierte Abmessungen (Hoehe, Breite, Tiefe und Gewicht) sowie hochaufloesende Bilder aus mehreren Winkeln. Wir empfehlen, Ihren Raum vor der Bestellung zu vermessen, um eine perfekte Passform zu gewaehrleisten. Wenn Sie zusaetzliche Masse benoetigen, hilft Ihnen unser Support-Team gerne weiter.',
            fr: 'Oui, chaque page produit comprend des dimensions detaillees (hauteur, largeur, profondeur et poids) ainsi que des images haute resolution sous plusieurs angles. Nous vous recommandons de mesurer votre espace avant de commander pour assurer un ajustement parfait. Si vous avez besoin de mesures supplementaires, notre equipe d\'assistance est la pour vous aider.',
            es: 'Si, cada pagina de producto incluye dimensiones detalladas (alto, ancho, profundidad y peso) junto con imagenes de alta resolucion desde multiples angulos. Recomendamos medir tu espacio antes de realizar el pedido para asegurar un ajuste perfecto. Si necesitas medidas adicionales, nuestro equipo de soporte estara encantado de ayudarte.',
          },
        },
        {
          title: {
            en: 'Do your products require assembly?',
            tr: 'Urunleriniz montaj gerektiriyor mu?',
            de: 'Muessen Ihre Produkte zusammengebaut werden?',
            fr: 'Vos produits necessitent-ils un assemblage?',
            es: 'Sus productos requieren ensamblaje?',
          },
          content: {
            en: 'Some larger items such as shelving units and chandeliers may require minimal assembly. Each product that needs assembly comes with clear, illustrated instructions and all necessary hardware. For lighting fixtures, we recommend professional installation by a qualified electrician. Assembly requirements are clearly noted on the product page.',
            tr: 'Raf uniteleri ve avizeler gibi bazi buyuk urunler minimum duzeyde montaj gerektirebilir. Montaj gerektiren her urun, acik, resimli talimatlar ve gerekli tum donanimi ile birlikte gelir. Aydinlatma armatuleri icin, nitelikli bir elektrikci tarafindan profesyonel kurulum onermekteyiz. Montaj gereksinimleri urun sayfasinda acikca belirtilmistir.',
            de: 'Einige groessere Artikel wie Regale und Kronleuchter erfordern moeglicherweise einen minimalen Zusammenbau. Jedes Produkt, das montiert werden muss, wird mit klaren, bebilderten Anleitungen und allen erforderlichen Beschlaegen geliefert. Fuer Beleuchtungskoerper empfehlen wir die professionelle Installation durch einen qualifizierten Elektriker. Montageanforderungen sind auf der Produktseite deutlich angegeben.',
            fr: 'Certains articles plus grands comme les etageres et les lustres peuvent necessiter un assemblage minimal. Chaque produit necessitant un assemblage est fourni avec des instructions claires et illustrees ainsi que toute la quincaillerie necessaire. Pour les luminaires, nous recommandons une installation professionnelle par un electricien qualifie. Les exigences d\'assemblage sont clairement indiquees sur la page du produit.',
            es: 'Algunos articulos mas grandes como estanterias y lamparas de arana pueden requerir un ensamblaje minimo. Cada producto que necesita ensamblaje viene con instrucciones claras e ilustradas y todo el hardware necesario. Para accesorios de iluminacion, recomendamos la instalacion profesional por un electricista calificado. Los requisitos de ensamblaje estan claramente indicados en la pagina del producto.',
          },
        },
        {
          title: {
            en: 'How should I care for ceramic and decorative items?',
            tr: 'Seramik ve dekoratif urunlerin bakimi nasil yapilmalidir?',
            de: 'Wie sollte ich Keramik- und Dekorationsartikel pflegen?',
            fr: 'Comment entretenir les articles en ceramique et decoratifs?',
            es: 'Como debo cuidar los articulos de ceramica y decorativos?',
          },
          content: {
            en: 'Ceramic items should be hand-washed with mild soap and warm water. Avoid abrasive cleaners and sudden temperature changes that could cause cracking. Decorative pillows and textiles can usually be spot-cleaned or machine-washed on a gentle cycle; check the care label for specific instructions. Wooden items benefit from occasional oiling with food-safe mineral oil.',
            tr: 'Seramik urunler hafif sabun ve ilik suyla elde yikanmalidir. Catlamaya neden olabilecek asindirici temizleyiciler ve ani sicaklik degisikliklerinden kacinin. Dekoratif yastiklar ve tekstiller genellikle noktasal temizlenebilir veya hassas dovrimde makinede yikanabilir; belirli talimatlar icin bakim etiketini kontrol edin. Ahsap urunler, zaman zaman gida guvenli mineral yagile yaglanmandan fayda gorur.',
            de: 'Keramikartikel sollten mit milder Seife und warmem Wasser von Hand gewaschen werden. Vermeiden Sie Scheuermittel und ploetzliche Temperaturwechsel, die zu Rissen fuehren koennten. Dekokissen und Textilien koennen in der Regel punktuell gereinigt oder im Schonwaschgang gewaschen werden; ueberpruefen Sie das Pflegeetikett fuer spezifische Anweisungen. Holzartikel profitieren von gelegentlichem Oelen mit lebensmittelechtem Mineraloel.',
            fr: 'Les articles en ceramique doivent etre laves a la main avec un savon doux et de l\'eau tiede. Evitez les nettoyants abrasifs et les changements brusques de temperature qui pourraient provoquer des fissures. Les coussins decoratifs et les textiles peuvent generalement etre nettoyes localement ou laves en machine en cycle delicat; consultez l\'etiquette d\'entretien pour les instructions specifiques. Les articles en bois beneficient d\'un huilage occasionnel avec de l\'huile minerale alimentaire.',
            es: 'Los articulos de ceramica deben lavarse a mano con jabon suave y agua tibia. Evite limpiadores abrasivos y cambios bruscos de temperatura que podrian causar grietas. Los cojines decorativos y textiles generalmente se pueden limpiar con un pano humedo o lavar a maquina en ciclo delicado; consulte la etiqueta de cuidado para instrucciones especificas. Los articulos de madera se benefician de un aceitado ocasional con aceite mineral apto para alimentos.',
          },
        },
        {
          title: {
            en: 'What is your return policy for home products?',
            tr: 'Ev urunleri icin iade politikaniz nedir?',
            de: 'Was ist Ihre Rueckgaberichtlinie fuer Wohnprodukte?',
            fr: 'Quelle est votre politique de retour pour les produits maison?',
            es: 'Cual es su politica de devolucion para productos del hogar?',
          },
          content: {
            en: 'We accept returns within 30 days of delivery for items in their original, unused condition with all packaging intact. For large or fragile items, please contact us before returning so we can arrange secure pickup. Refunds are processed within 5-7 business days after we receive and inspect the returned item. Custom or made-to-order products are not eligible for return unless they arrive damaged.',
            tr: 'Tum ambalaji bozulmamis, orijinal ve kullanilmamis durumda olan urunler icin teslimattan itibaren 30 gun icinde iade kabul ediyoruz. Buyuk veya kirilgan urunler icin, guvenli teslim alma ayarlayabilmemiz adina iade etmeden once lutfen bizimle iletisime gecin. Iade edilen urunu aldiktan ve inceledikten sonra 5-7 is gunu icinde geri odeme islenir. Ozel veya siparise ozel urunler, hasarli gelmedikciade icin uygun degildir.',
            de: 'Wir akzeptieren Rueckgaben innerhalb von 30 Tagen nach Lieferung fuer Artikel in ihrem urspruenglichen, unbenutzten Zustand mit intakter Verpackung. Fuer grosse oder zerbrechliche Artikel kontaktieren Sie uns bitte vor der Ruecksendung, damit wir eine sichere Abholung arrangieren koennen. Rueckerstattungen werden innerhalb von 5-7 Werktagen nach Erhalt und Pruefung des zurueckgesendeten Artikels bearbeitet. Sonderanfertigungen oder nach Mass gefertigte Produkte koennen nicht zurueckgegeben werden, es sei denn, sie kommen beschaedigt an.',
            fr: 'Nous acceptons les retours dans les 30 jours suivant la livraison pour les articles dans leur etat d\'origine, non utilises et avec tout l\'emballage intact. Pour les articles volumineux ou fragiles, veuillez nous contacter avant le retour afin que nous puissions organiser un enlevement securise. Les remboursements sont traites dans les 5 a 7 jours ouvrables apres reception et inspection de l\'article retourne. Les produits personnalises ou fabriques sur commande ne sont pas eligibles au retour sauf s\'ils arrivent endommages.',
            es: 'Aceptamos devoluciones dentro de los 30 dias posteriores a la entrega para articulos en su condicion original, sin usar y con todo el embalaje intacto. Para articulos grandes o fragiles, contactenos antes de devolver para que podamos organizar una recogida segura. Los reembolsos se procesan dentro de 5-7 dias habiles despues de recibir e inspeccionar el articulo devuelto. Los productos personalizados o hechos por encargo no son elegibles para devolucion a menos que lleguen danados.',
          },
        },
      ],
    },
  },
];

export const evYasamSeedData: SectorSeedData = {
  categories: [
    {
      name: {
        en: 'Decoration',
        tr: 'Dekorasyon',
        de: 'Dekoration',
        fr: 'Decoration',
        es: 'Decoracion',
      },
      slug: 'dekorasyon',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      sortOrder: 1,
    },
    {
      name: {
        en: 'Kitchen Supplies',
        tr: 'Mutfak Gerecleri',
        de: 'Kuechenutensilien',
        fr: 'Ustensiles de cuisine',
        es: 'Utensilios de cocina',
      },
      slug: 'mutfak-gerecleri',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      sortOrder: 2,
    },
    {
      name: {
        en: 'Bathroom',
        tr: 'Banyo',
        de: 'Badezimmer',
        fr: 'Salle de bain',
        es: 'Bano',
      },
      slug: 'banyo',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      sortOrder: 3,
    },
    {
      name: {
        en: 'Garden',
        tr: 'Bahce',
        de: 'Garten',
        fr: 'Jardin',
        es: 'Jardin',
      },
      slug: 'bahce',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      sortOrder: 4,
    },
    {
      name: {
        en: 'Lighting',
        tr: 'Aydinlatma',
        de: 'Beleuchtung',
        fr: 'Eclairage',
        es: 'Iluminacion',
      },
      slug: 'aydinlatma',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=600&fit=crop',
      sortOrder: 5,
    },
  ],

  products: [
    {
      name: {
        en: 'Decorative Vase',
        tr: 'Dekoratif Vazo',
        de: 'Dekorative Vase',
        fr: 'Vase decoratif',
        es: 'Jarrn decorativo',
      },
      description: {
        en: 'A handcrafted ceramic vase with a matte finish and organic, asymmetric form. Standing 35 cm tall, it makes a striking centrepiece on any console or dining table. Each piece is unique due to the artisan glazing process.',
        tr: 'Mat yuzey ve organik, asimetrik forma sahip el yapimi seramik vazo. 35 cm yuksekligindeki vazo, herhangi bir konsol veya yemek masasinda dikkat cekici bir merkez parcasi olur. Zanaat surleme islemi nedeniyle her parca benzersizdir.',
        de: 'Eine handgefertigte Keramikvase mit matter Oberflaeche und organischer, asymmetrischer Form. Mit 35 cm Hoehe ist sie ein auffaelliges Mittelstueck auf jeder Konsole oder jedem Esstisch. Jedes Stueck ist aufgrund des handwerklichen Glasurprozesses einzigartig.',
        fr: 'Un vase en ceramique artisanal avec une finition mate et une forme organique asymetrique. D\'une hauteur de 35 cm, il constitue une piece maitresse saisissante sur toute console ou table a manger. Chaque piece est unique grace au processus de glacure artisanale.',
        es: 'Un jarron de ceramica hecho a mano con acabado mate y forma organica asimetrica. Con 35 cm de altura, es una pieza central impresionante en cualquier consola o mesa de comedor. Cada pieza es unica debido al proceso de esmaltado artesanal.',
      },
      slug: 'dekoratif-vazo',
      price: 450,
      sku: 'EV-001',
      stock: 50,
      images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&h=600&fit=crop'],
      categorySlug: 'dekorasyon',
      status: 'active',
    },
    {
      name: {
        en: 'Ceramic Plate Set',
        tr: 'Seramik Tabak Seti',
        de: 'Keramikteller-Set',
        fr: 'Service d\'assiettes en ceramique',
        es: 'Set de platos de ceramica',
      },
      description: {
        en: 'A 12-piece stoneware plate set in a warm, speckled glaze. Includes four dinner plates, four side plates, and four bowls. Microwave and dishwasher safe, these plates combine everyday practicality with artisan charm.',
        tr: 'Sicak, benekli surle 12 parcalik tas tabak seti. Dort yemek tabagi, dort yan tabak ve dort kase icerir. Mikrodalga ve bulasik makinesine uygun bu tabaklar, gunluk pratikligi zanaat cazibesiyle birlestiriyor.',
        de: 'Ein 12-teiliges Steingut-Tellerset in einer warmen, gesprenkelten Glasur. Enthaelt vier Essteller, vier Beilagenteller und vier Schalen. Mikrowellen- und spuelmaschinenfest, diese Teller vereinen Alltagstauglichkeit mit handwerklichem Charme.',
        fr: 'Un service de 12 pieces en gres avec un glacage chaud et mouchete. Comprend quatre assiettes plates, quatre assiettes a dessert et quatre bols. Compatible micro-ondes et lave-vaisselle, ces assiettes allient praticite quotidienne et charme artisanal.',
        es: 'Un juego de 12 piezas de platos de gres con un esmalte calido y moteado. Incluye cuatro platos llanos, cuatro platos de postre y cuatro cuencos. Aptos para microondas y lavavajillas, estos platos combinan la practicidad diaria con el encanto artesanal.',
      },
      slug: 'seramik-tabak-seti',
      price: 680,
      sku: 'EV-002',
      stock: 40,
      images: ['https://images.unsplash.com/photo-1603199506016-5f36e6d72d31?w=800&h=600&fit=crop'],
      categorySlug: 'mutfak-gerecleri',
      status: 'active',
    },
    {
      name: {
        en: 'Bathroom Accessory Set',
        tr: 'Banyo Aksesuar Seti',
        de: 'Badezimmer-Zubehoeerset',
        fr: 'Ensemble d\'accessoires de salle de bain',
        es: 'Set de accesorios de bano',
      },
      description: {
        en: 'A five-piece bathroom set in brushed brass finish, including a soap dispenser, toothbrush holder, tumbler, soap dish, and tissue box cover. The minimalist design pairs beautifully with both modern and classic bathroom styles.',
        tr: 'Sabunluk, dis fircasi tutucu, bardak, sabunluk ve mendil kutusu kapagini iceren fircalanmis pirinc yuzlu bes parcalik banyo seti. Minimalist tasarim hem modern hem de klasik banyo stilleriyle guzel bir sekilde uyum saglar.',
        de: 'Ein fuenfteiliges Badezimmer-Set in gebuersteter Messingoptik, bestehend aus Seifenspender, Zahnbuerstenhalter, Becher, Seifenschale und Taschentuchbox-Abdeckung. Das minimalistische Design passt wunderbar zu modernen und klassischen Badezimmerstilen.',
        fr: 'Un ensemble de cinq pieces pour salle de bain en finition laiton brosse, comprenant un distributeur de savon, un porte-brosse a dents, un gobelet, un porte-savon et un couvercle de boite a mouchoirs. Le design minimaliste s\'harmonise parfaitement avec les styles de salle de bain modernes et classiques.',
        es: 'Un juego de cinco piezas para bano con acabado de laton cepillado, que incluye dispensador de jabon, portacepillos de dientes, vaso, jabonera y cubierta de caja de panuelos. El diseno minimalista combina perfectamente con estilos de bano modernos y clasicos.',
      },
      slug: 'banyo-aksesuar-seti',
      price: 520,
      sku: 'EV-003',
      stock: 35,
      images: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop'],
      categorySlug: 'banyo',
      status: 'active',
    },
    {
      name: {
        en: 'Garden Lighting',
        tr: 'Bahce Aydinlatma',
        de: 'Gartenbeleuchtung',
        fr: 'Eclairage de jardin',
        es: 'Iluminacion de jardin',
      },
      description: {
        en: 'A set of six solar-powered LED garden path lights in a sleek stainless steel design. Automatically illuminates at dusk and lasts up to 10 hours on a full charge. Weather-resistant construction rated IP65 for year-round outdoor use.',
        tr: 'Sik paslanmaz celik tasarimda alti adet gunes enerjili LED bahce yol isiginden olusan set. Alacakaranlikta otomatik olarak yanar ve tam sarjla 10 saate kadar dayanir. Yil boyunca dis mekan kullanimi icin IP65 dereceli hava kosullarina dayanikli yapi.',
        de: 'Ein Set aus sechs solarbetriebenen LED-Gartenwegeleuchten im schlanken Edelstahldesign. Schaltet sich bei Einbruch der Dunkelheit automatisch ein und leuchtet bei voller Ladung bis zu 10 Stunden. Wetterfeste Konstruktion mit IP65-Schutzklasse fuer den ganzjaehrigen Ausseneinsatz.',
        fr: 'Un ensemble de six lampes de jardin solaires LED en acier inoxydable au design elegant. S\'allume automatiquement au crepuscule et dure jusqu\'a 10 heures sur une charge complete. Construction resistante aux intemperies classee IP65 pour une utilisation exterieure toute l\'annee.',
        es: 'Un conjunto de seis luces LED solares para caminos de jardin en un elegante diseno de acero inoxidable. Se ilumina automaticamente al anochecer y dura hasta 10 horas con carga completa. Construccion resistente a la intemperie con clasificacion IP65 para uso exterior durante todo el ano.',
      },
      slug: 'bahce-aydinlatma',
      price: 890,
      sku: 'EV-004',
      stock: 30,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'],
      categorySlug: 'bahce',
      status: 'active',
    },
    {
      name: {
        en: 'Modern Chandelier',
        tr: 'Modern Avize',
        de: 'Moderner Kronleuchter',
        fr: 'Lustre moderne',
        es: 'Lampara de arana moderna',
      },
      description: {
        en: 'A striking contemporary chandelier with a matte black metal frame and eight frosted glass globe shades. Adjustable drop height from 60 to 120 cm to suit various ceiling heights. Compatible with dimmable LED bulbs for versatile ambient lighting.',
        tr: 'Mat siyah metal cerceve ve sekiz buzlu cam kure abajuruyla dikkat cekici cagdas avize. Farkli tavan yuksekliklerine uyum saglamak icin 60 ila 120 cm arasinda ayarlanabilir sarkma yuksekligi. Cok yonlu ortam aydinlatmasi icin kisilebilir LED ampullerle uyumludur.',
        de: 'Ein auffaelliger zeitgenoessischer Kronleuchter mit mattschwarzem Metallrahmen und acht Milchglas-Kugelschirmen. Hoehenverstellbare Abhaengung von 60 bis 120 cm, passend fuer verschiedene Deckenhoehen. Kompatibel mit dimmbaren LED-Leuchtmitteln fuer vielseitige Ambientebeleuchtung.',
        fr: 'Un lustre contemporain saisissant avec un cadre en metal noir mat et huit globes en verre depoli. Hauteur de suspension reglable de 60 a 120 cm pour s\'adapter aux differentes hauteurs de plafond. Compatible avec des ampoules LED dimmables pour un eclairage d\'ambiance polyvalent.',
        es: 'Una impresionante lampara de arana contemporanea con marco de metal negro mate y ocho pantallas de globo de vidrio esmerilado. Altura de caida ajustable de 60 a 120 cm para adaptarse a diferentes alturas de techo. Compatible con bombillas LED regulables para una iluminacion ambiental versatil.',
      },
      slug: 'modern-avize',
      price: 2200,
      sku: 'EV-005',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop'],
      categorySlug: 'aydinlatma',
      status: 'active',
    },
    {
      name: {
        en: 'Decorative Pillow Set',
        tr: 'Dekoratif Yastik Seti',
        de: 'Dekokissen-Set',
        fr: 'Ensemble de coussins decoratifs',
        es: 'Set de cojines decorativos',
      },
      description: {
        en: 'A set of four premium cotton-linen blend throw pillows in complementary earth tones. Features a mix of textured weave and embroidered patterns, each with a hidden zipper and removable insert. Machine washable covers in a gentle cycle.',
        tr: 'Birbirini tamamlayan toprak tonlarinda dort adet premium pamuk-keten karisimi dekoratif yastik seti. Teksturlu dokuma ve islemeli desenlerin karisimini sunar, her biri gizli fermuar ve cikarilabilir ic yastik ile birlikte gelir. Kiliflar hassas dovrimde makine yikanabilir.',
        de: 'Ein Set aus vier Premium-Dekokissen aus Baumwoll-Leinen-Mischung in komplementaeren Erdtoenen. Bietet eine Mischung aus strukturiertem Gewebe und bestickten Mustern, jedes mit verstecktem Reissverschluss und herausnehmbarer Einlage. Maschinenwaschbare Bezuege im Schonwaschgang.',
        fr: 'Un ensemble de quatre coussins decoratifs premium en melange coton-lin dans des tons terre complementaires. Presente un melange de tissage texture et de motifs brodes, chacun avec une fermeture eclair cachee et un insert amovible. Housses lavables en machine en cycle delicat.',
        es: 'Un juego de cuatro cojines decorativos premium de mezcla de algodon y lino en tonos tierra complementarios. Presenta una mezcla de tejido texturizado y patrones bordados, cada uno con cremallera oculta e inserto extraible. Fundas lavables a maquina en ciclo delicado.',
      },
      slug: 'dekoratif-yastik-seti',
      price: 350,
      sku: 'EV-006',
      stock: 60,
      images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=600&fit=crop'],
      categorySlug: 'dekorasyon',
      status: 'active',
    },
  ],

  pages: [
    {
      slug: 'home',
      title: {
        en: 'Home',
        tr: 'Ana Sayfa',
        de: 'Startseite',
        fr: 'Accueil',
        es: 'Inicio',
      },
      content: { version: 1, blocks: homeBlocks },
      isPublished: true,
      seoMeta: {
        en: 'Home decor, kitchenware, lighting and garden products. Inspiring designs for your home.',
        tr: 'Ev dekorasyonu, mutfak gerecleri, aydinlatma ve bahce urunleri. Eviniz icin ilham veren tasarimlar.',
        de: 'Wohndekor, Kuechenwaren, Beleuchtung und Gartenprodukte. Inspirierende Designs fuer Ihr Zuhause.',
        fr: 'Decoration, ustensiles de cuisine, eclairage et produits de jardin. Des designs inspirants pour votre maison.',
        es: 'Decoracion del hogar, utensilios de cocina, iluminacion y productos de jardin. Disenos inspiradores para tu hogar.',
      },
    },
    {
      slug: 'shop',
      title: {
        en: 'Shop',
        tr: 'Magaza',
        de: 'Shop',
        fr: 'Boutique',
        es: 'Tienda',
      },
      content: { version: 1, blocks: shopBlocks },
      isPublished: true,
      seoMeta: {
        en: 'Browse our full range of home and living products.',
        tr: 'Ev ve yasam urunlerimizin tam yelpazesine goz atin.',
        de: 'Durchsuchen Sie unser gesamtes Sortiment an Wohn- und Lebensprodukten.',
        fr: 'Parcourez notre gamme complete de produits maison et vie.',
        es: 'Explora nuestra gama completa de productos para el hogar.',
      },
    },
    {
      slug: 'categories',
      title: {
        en: 'Categories',
        tr: 'Kategoriler',
        de: 'Kategorien',
        fr: 'Categories',
        es: 'Categorias',
      },
      content: { version: 1, blocks: categoriesBlocks },
      isPublished: true,
      seoMeta: {
        en: 'Browse home categories — decoration, kitchen, bathroom, garden and lighting.',
        tr: 'Ev kategorilerine goz atin — dekorasyon, mutfak, banyo, bahce ve aydinlatma.',
        de: 'Durchsuchen Sie Wohnkategorien — Dekoration, Kueche, Badezimmer, Garten und Beleuchtung.',
        fr: 'Parcourez les categories maison — decoration, cuisine, salle de bain, jardin et eclairage.',
        es: 'Explora las categorias del hogar — decoracion, cocina, bano, jardin e iluminacion.',
      },
    },
    {
      slug: 'products',
      title: {
        en: 'All Products',
        tr: 'Tum Urunler',
        de: 'Alle Produkte',
        fr: 'Tous les produits',
        es: 'Todos los productos',
      },
      content: { version: 1, blocks: productsBlocks },
      isPublished: true,
      seoMeta: {
        en: 'Explore our complete collection of home and living products.',
        tr: 'Ev ve yasam urunleri koleksiyonumuzun tamamini kesfedin.',
        de: 'Entdecken Sie unsere komplette Kollektion an Wohn- und Lebensprodukten.',
        fr: 'Explorez notre collection complete de produits maison et vie.',
        es: 'Explora nuestra coleccion completa de productos para el hogar.',
      },
    },
    {
      slug: 'about',
      title: {
        en: 'About Us',
        tr: 'Hakkimizda',
        de: 'Uber uns',
        fr: 'A propos',
        es: 'Sobre nosotros',
      },
      content: { version: 1, blocks: aboutBlocks },
      isPublished: true,
      seoMeta: {
        en: 'Learn about our mission to bring beautiful, sustainable home products to everyone.',
        tr: 'Guzel, surdurulebilir ev urunlerini herkese ulastirma misyonumuz hakkinda bilgi edinin.',
        de: 'Erfahren Sie mehr ueber unsere Mission, schoene, nachhaltige Wohnprodukte fuer jeden zugaenglich zu machen.',
        fr: 'Decouvrez notre mission d\'apporter des produits maison beaux et durables a tous.',
        es: 'Conozca nuestra mision de llevar productos para el hogar hermosos y sostenibles a todos.',
      },
    },
    {
      slug: 'contact',
      title: {
        en: 'Contact',
        tr: 'Iletisim',
        de: 'Kontakt',
        fr: 'Contact',
        es: 'Contacto',
      },
      content: { version: 1, blocks: contactBlocks },
      isPublished: true,
      seoMeta: {
        en: 'Get in touch with us for questions about home products or your order.',
        tr: 'Ev urunleri veya siparisibiz hakkinda sorulariniz icin bizimle iletisime gecin.',
        de: 'Nehmen Sie Kontakt mit uns auf fuer Fragen zu Wohnprodukten oder Ihrer Bestellung.',
        fr: 'Contactez-nous pour toute question sur les produits maison ou votre commande.',
        es: 'Pongase en contacto con nosotros para preguntas sobre productos del hogar o su pedido.',
      },
    },
    {
      slug: 'faq',
      title: {
        en: 'FAQ',
        tr: 'SSS',
        de: 'FAQ',
        fr: 'FAQ',
        es: 'Preguntas frecuentes',
      },
      content: { version: 1, blocks: faqBlocks },
      isPublished: true,
      seoMeta: {
        en: 'Frequently asked questions about our home products, delivery, assembly, and returns.',
        tr: 'Ev urunlerimiz, teslimat, montaj ve iade hakkinda sikca sorulan sorular.',
        de: 'Haeufig gestellte Fragen zu unseren Wohnprodukten, Lieferung, Montage und Rueckgabe.',
        fr: 'Questions frequemment posees sur nos produits maison, la livraison, l\'assemblage et les retours.',
        es: 'Preguntas frecuentes sobre nuestros productos del hogar, entrega, ensamblaje y devoluciones.',
      },
    },
  ],

  header: { version: 1, blocks: [] },
  footer: { version: 1, blocks: [] },

  settings: [
    { key: 'sector', value: 'ev-yasam', group: 'general' },
    { key: 'store_name', value: { en: 'Home & Living Store', tr: 'Ev & Yasam Magazasi', de: 'Wohn- & Lebensladen', fr: 'Boutique Maison & Vie', es: 'Tienda Hogar & Vida' }, group: 'general' },
    { key: 'primary_color', value: '#8B7355', group: 'appearance' },
    { key: 'secondary_color', value: '#F5F1EB', group: 'appearance' },
    { key: 'currency', value: 'TRY', group: 'regional' },
    { key: 'locale', value: 'tr', group: 'regional' },
  ],
};
