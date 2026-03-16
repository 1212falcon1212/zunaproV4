import type { SectorSeedData } from './types';
import type { PageContent, Block } from '@zunapro/types';

// ---------------------------------------------------------------------------
// Kozmetik (Cosmetics) Sector Seed Data
// ---------------------------------------------------------------------------

const homeBlocks: Block[] = [
  {
    id: 'seed_kozmetik_home_hero',
    type: 'hero',
    props: {
      title: {
        en: 'Add Value to Your Beauty',
        tr: 'Guzelliginize Deger Katin',
        de: 'Verleihen Sie Ihrer Schoenheit Wert',
        fr: 'Ajoutez de la valeur a votre beaute',
        es: 'Anade valor a tu belleza',
      },
      subtitle: {
        en: 'Discover premium skincare, makeup, and fragrance collections curated for you.',
        tr: 'Sizin icin secilmis premium cilt bakimi, makyaj ve parfum koleksiyonlarini kesfedin.',
        de: 'Entdecken Sie Premium-Hautpflege-, Make-up- und Duft-Kollektionen, die fuer Sie kuratiert wurden.',
        fr: 'Decouvrez des collections premium de soins, maquillage et parfums selectionnees pour vous.',
        es: 'Descubre colecciones premium de cuidado de la piel, maquillaje y fragancias seleccionadas para ti.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&h=600&fit=crop',
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
    id: 'seed_kozmetik_home_spacer1',
    type: 'spacer',
    props: { height: '3rem' },
  },
  {
    id: 'seed_kozmetik_home_products',
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
    id: 'seed_kozmetik_home_spacer2',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_kozmetik_home_categories',
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
    id: 'seed_kozmetik_home_spacer3',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_kozmetik_home_banner',
    type: 'banner',
    props: {
      title: {
        en: 'New Season Collection',
        tr: 'Yeni Sezon Koleksiyonu',
        de: 'Neue Saisonkollektion',
        fr: 'Nouvelle collection de saison',
        es: 'Nueva coleccion de temporada',
      },
      description: {
        en: 'Explore the latest trends in beauty and skincare with our exclusive new arrivals.',
        tr: 'Ozel yeni urunlerimizle guzellik ve cilt bakimindaki son trendleri kesfedin.',
        de: 'Entdecken Sie die neuesten Trends in Schoenheit und Hautpflege mit unseren exklusiven Neuheiten.',
        fr: 'Explorez les dernieres tendances en beaute et soins avec nos nouveautes exclusives.',
        es: 'Explora las ultimas tendencias en belleza y cuidado de la piel con nuestras novedades exclusivas.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop',
      ctaText: {
        en: 'Discover',
        tr: 'Kesfet',
        de: 'Entdecken',
        fr: 'Decouvrir',
        es: 'Descubrir',
      },
      ctaLink: '/pages/shop',
    },
  },
  {
    id: 'seed_kozmetik_home_spacer4',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_kozmetik_home_newsletter',
    type: 'newsletter',
    props: {
      title: {
        en: 'Join Our Beauty Circle',
        tr: 'Guzellik Dunyamiza Katilin',
        de: 'Treten Sie unserem Beauty-Kreis bei',
        fr: 'Rejoignez notre cercle beaute',
        es: 'Unete a nuestro circulo de belleza',
      },
      description: {
        en: 'Get exclusive offers, beauty tips, and early access to new products.',
        tr: 'Ozel firsatlar, guzellik ipuclari ve yeni urunlere erken erisim elde edin.',
        de: 'Erhalten Sie exklusive Angebote, Beauty-Tipps und fruehen Zugang zu neuen Produkten.',
        fr: 'Recevez des offres exclusives, des conseils beaute et un acces anticipe aux nouveaux produits.',
        es: 'Recibe ofertas exclusivas, consejos de belleza y acceso anticipado a nuevos productos.',
      },
    },
  },
];

const shopBlocks: Block[] = [
  {
    id: 'seed_kozmetik_shop_hero',
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
        en: 'Browse our full range of beauty and skincare products.',
        tr: 'Guzellik ve cilt bakim urunlerimizin tam yelpazesine goz atin.',
        de: 'Durchsuchen Sie unser gesamtes Sortiment an Schoenheits- und Hautpflegeprodukten.',
        fr: 'Parcourez notre gamme complete de produits de beaute et de soins.',
        es: 'Explora nuestra gama completa de productos de belleza y cuidado de la piel.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_kozmetik_shop_listing',
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
    id: 'seed_kozmetik_categories_hero',
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
        en: 'Find the perfect products for your beauty routine.',
        tr: 'Guzellik rutininiz icin mukemmel urunleri bulun.',
        de: 'Finden Sie die perfekten Produkte fuer Ihre Schoenheitsroutine.',
        fr: 'Trouvez les produits parfaits pour votre routine beaute.',
        es: 'Encuentra los productos perfectos para tu rutina de belleza.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_kozmetik_categories_listing',
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
    id: 'seed_kozmetik_products_hero',
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
        en: 'Explore our complete beauty collection.',
        tr: 'Tum guzellik koleksiyonumuzu kesfedin.',
        de: 'Entdecken Sie unsere komplette Schoenheitskollektion.',
        fr: 'Explorez notre collection beaute complete.',
        es: 'Explora nuestra coleccion completa de belleza.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_kozmetik_products_listing',
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
    id: 'seed_kozmetik_about_hero',
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
        en: 'Our passion for beauty drives everything we do.',
        tr: 'Guzellige olan tutkumuz yaptigimiz her seyin itici gucudur.',
        de: 'Unsere Leidenschaft fuer Schoenheit treibt alles an, was wir tun.',
        fr: 'Notre passion pour la beaute guide tout ce que nous faisons.',
        es: 'Nuestra pasion por la belleza impulsa todo lo que hacemos.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&h=600&fit=crop',
    },
  },
  {
    id: 'seed_kozmetik_about_text',
    type: 'text',
    props: {
      tag: 'div',
      content: {
        en:
          '<h2>Our Story</h2>' +
          '<p>We believe that beauty should be accessible, ethical, and empowering. Founded with a commitment to quality ingredients and sustainable practices, our brand brings together the best of science and nature to create products that truly make a difference.</p>' +
          '<p>Our team of experts carefully selects each product, ensuring that every item meets our high standards for efficacy, safety, and environmental responsibility. From skincare serums to luxury fragrances, we are dedicated to helping you feel confident and radiant every day.</p>' +
          '<p>We work directly with trusted laboratories and artisan perfumers around the world, sourcing ingredients that are cruelty-free and dermatologically tested. Your satisfaction and well-being are at the heart of everything we do.</p>',
        tr:
          '<h2>Hikayemiz</h2>' +
          '<p>Guzelligin erisilebilir, etik ve guclendiricici olmasi gerektigine inaniyoruz. Kaliteli iceriklere ve surdurulebilir uygulamalara olan bagliligimizla kurulan markamiz, gercekten fark yaratan urunler yaratmak icin bilim ve doganin en iyisini bir araya getiriyor.</p>' +
          '<p>Uzman ekibimiz her urunu ozenle secerek, her urunun etkinlik, guvenlik ve cevre sorumlulugu konusundaki yuksek standartlarimizi karsilamasini saglar. Cilt bakim serumlarindan luks parfumlere kadar, her gun kendinizi guvende ve isiltili hissetmenize yardimci olmaya adanmisizdir.</p>' +
          '<p>Dunyanin dort bir yanindan guvenilir laboratuvarlar ve zanaat parfumculeriyle dogrudan calisarak, zulme maruz kalmamis ve dermatolojik olarak test edilmis icerikler temin ediyoruz. Memnuniyetiniz ve sagliginiz yaptigimiz her seyin merkezindedir.</p>',
        de:
          '<h2>Unsere Geschichte</h2>' +
          '<p>Wir glauben, dass Schoenheit zugaenglich, ethisch und staerkend sein sollte. Gegruendet mit einem Engagement fuer hochwertige Inhaltsstoffe und nachhaltige Praktiken, vereint unsere Marke das Beste aus Wissenschaft und Natur, um Produkte zu schaffen, die wirklich einen Unterschied machen.</p>' +
          '<p>Unser Expertenteam waehlt jedes Produkt sorgfaeltig aus und stellt sicher, dass jeder Artikel unseren hohen Standards fuer Wirksamkeit, Sicherheit und Umweltverantwortung entspricht. Von Hautpflegeseren bis hin zu Luxusdueften widmen wir uns der Aufgabe, Ihnen zu helfen, sich jeden Tag selbstbewusst und strahlend zu fuehlen.</p>' +
          '<p>Wir arbeiten direkt mit vertrauenswuerdigen Laboren und Parfumeuren weltweit zusammen und beziehen Inhaltsstoffe, die tierversuchsfrei und dermatologisch getestet sind. Ihre Zufriedenheit und Ihr Wohlbefinden stehen im Mittelpunkt unseres Handelns.</p>',
        fr:
          '<h2>Notre histoire</h2>' +
          '<p>Nous croyons que la beaute doit etre accessible, ethique et stimulante. Fondee avec un engagement envers des ingredients de qualite et des pratiques durables, notre marque reunit le meilleur de la science et de la nature pour creer des produits qui font vraiment la difference.</p>' +
          '<p>Notre equipe d\'experts selectionne soigneusement chaque produit, en veillant a ce que chaque article reponde a nos normes elevees d\'efficacite, de securite et de responsabilite environnementale. Des serums de soins aux parfums de luxe, nous nous engageons a vous aider a vous sentir confiant et radieux chaque jour.</p>' +
          '<p>Nous travaillons directement avec des laboratoires de confiance et des parfumeurs artisanaux du monde entier, en nous approvisionnant en ingredients non testes sur les animaux et dermatologiquement testes. Votre satisfaction et votre bien-etre sont au coeur de tout ce que nous faisons.</p>',
        es:
          '<h2>Nuestra historia</h2>' +
          '<p>Creemos que la belleza debe ser accesible, etica y empoderadora. Fundada con un compromiso con ingredientes de calidad y practicas sostenibles, nuestra marca reune lo mejor de la ciencia y la naturaleza para crear productos que realmente marcan la diferencia.</p>' +
          '<p>Nuestro equipo de expertos selecciona cuidadosamente cada producto, asegurando que cada articulo cumpla con nuestros altos estandares de eficacia, seguridad y responsabilidad ambiental. Desde serums para el cuidado de la piel hasta fragancias de lujo, estamos dedicados a ayudarte a sentirte seguro y radiante cada dia.</p>' +
          '<p>Trabajamos directamente con laboratorios de confianza y perfumistas artesanales de todo el mundo, obteniendo ingredientes libres de crueldad y dermatologicamente probados. Tu satisfaccion y bienestar estan en el corazon de todo lo que hacemos.</p>',
      },
    },
  },
];

const contactBlocks: Block[] = [
  {
    id: 'seed_kozmetik_contact_hero',
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
        en: 'We would love to hear from you. Reach out with any questions or feedback.',
        tr: 'Sizden haber almak isteriz. Sorulariniz veya geri bildirimleriniz icin bize ulasin.',
        de: 'Wir freuen uns, von Ihnen zu hoeren. Kontaktieren Sie uns bei Fragen oder Feedback.',
        fr: 'Nous serions ravis de vous entendre. Contactez-nous pour toute question ou commentaire.',
        es: 'Nos encantaria saber de ti. Comunicate con cualquier pregunta o comentario.',
      },
    },
  },
  {
    id: 'seed_kozmetik_contact_columns',
    type: 'columns',
    props: { columns: 2, gap: '2rem' },
    children: [
      {
        id: 'seed_kozmetik_contact_info',
        type: 'text',
        props: {
          tag: 'div',
          content: {
            en:
              '<h3>Get in Touch</h3>' +
              '<p><strong>Email:</strong> info@example.com</p>' +
              '<p><strong>Phone:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Address:</strong> 123 Beauty Avenue, Suite 100, New York, NY 10001</p>',
            tr:
              '<h3>Bize Ulasin</h3>' +
              '<p><strong>E-posta:</strong> info@example.com</p>' +
              '<p><strong>Telefon:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adres:</strong> 123 Beauty Avenue, Suite 100, New York, NY 10001</p>',
            de:
              '<h3>Kontaktieren Sie uns</h3>' +
              '<p><strong>E-Mail:</strong> info@example.com</p>' +
              '<p><strong>Telefon:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adresse:</strong> 123 Beauty Avenue, Suite 100, New York, NY 10001</p>',
            fr:
              '<h3>Nous contacter</h3>' +
              '<p><strong>E-mail:</strong> info@example.com</p>' +
              '<p><strong>Telephone:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adresse:</strong> 123 Beauty Avenue, Suite 100, New York, NY 10001</p>',
            es:
              '<h3>Contactenos</h3>' +
              '<p><strong>Correo:</strong> info@example.com</p>' +
              '<p><strong>Telefono:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Direccion:</strong> 123 Beauty Avenue, Suite 100, New York, NY 10001</p>',
          },
        },
      },
      {
        id: 'seed_kozmetik_contact_hours',
        type: 'text',
        props: {
          tag: 'div',
          content: {
            en:
              '<h3>Business Hours</h3>' +
              '<p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>' +
              '<p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>' +
              '<p><strong>Sunday:</strong> Closed</p>',
            tr:
              '<h3>Calisma Saatleri</h3>' +
              '<p><strong>Pazartesi - Cuma:</strong> 09:00 - 18:00</p>' +
              '<p><strong>Cumartesi:</strong> 10:00 - 16:00</p>' +
              '<p><strong>Pazar:</strong> Kapali</p>',
            de:
              '<h3>Geschaeftszeiten</h3>' +
              '<p><strong>Montag - Freitag:</strong> 9:00 - 18:00 Uhr</p>' +
              '<p><strong>Samstag:</strong> 10:00 - 16:00 Uhr</p>' +
              '<p><strong>Sonntag:</strong> Geschlossen</p>',
            fr:
              '<h3>Heures d\'ouverture</h3>' +
              '<p><strong>Lundi - Vendredi:</strong> 9h00 - 18h00</p>' +
              '<p><strong>Samedi:</strong> 10h00 - 16h00</p>' +
              '<p><strong>Dimanche:</strong> Ferme</p>',
            es:
              '<h3>Horario comercial</h3>' +
              '<p><strong>Lunes - Viernes:</strong> 9:00 - 18:00</p>' +
              '<p><strong>Sabado:</strong> 10:00 - 16:00</p>' +
              '<p><strong>Domingo:</strong> Cerrado</p>',
          },
        },
      },
    ],
  },
];

const faqBlocks: Block[] = [
  {
    id: 'seed_kozmetik_faq_hero',
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
        en: 'Find answers to common questions about our products and services.',
        tr: 'Urunlerimiz ve hizmetlerimiz hakkinda sik sorulan sorularin yanitlarini bulun.',
        de: 'Finden Sie Antworten auf haeufige Fragen zu unseren Produkten und Dienstleistungen.',
        fr: 'Trouvez des reponses aux questions courantes sur nos produits et services.',
        es: 'Encuentra respuestas a las preguntas mas comunes sobre nuestros productos y servicios.',
      },
    },
  },
  {
    id: 'seed_kozmetik_faq_accordion',
    type: 'accordion',
    props: {
      items: [
        {
          title: {
            en: 'What ingredients are used in your products?',
            tr: 'Urunlerinizde hangi icerikler kullaniliyor?',
            de: 'Welche Inhaltsstoffe werden in Ihren Produkten verwendet?',
            fr: 'Quels ingredients sont utilises dans vos produits?',
            es: 'Que ingredientes se utilizan en sus productos?',
          },
          content: {
            en: 'All our products are formulated with high-quality, dermatologically tested ingredients. We prioritize natural and organic components wherever possible and avoid parabens, sulfates, and artificial fragrances. Full ingredient lists are available on each product page.',
            tr: 'Tum urunlerimiz yuksek kaliteli, dermatolojik olarak test edilmis iceriklerle formule edilmistir. Mumkun olan her yerde dogal ve organik bilesenlere oncelik veriyor, paraben, sulfat ve yapay kokulardan kaciniyoruz. Tam icerik listeleri her urun sayfasinda mevcuttur.',
            de: 'Alle unsere Produkte werden mit hochwertigen, dermatologisch getesteten Inhaltsstoffen formuliert. Wir bevorzugen natuerliche und biologische Komponenten und verzichten auf Parabene, Sulfate und kuenstliche Duftstoffe. Vollstaendige Inhaltsstofflisten finden Sie auf jeder Produktseite.',
            fr: 'Tous nos produits sont formules avec des ingredients de haute qualite, testes dermatologiquement. Nous privilegions les composants naturels et biologiques autant que possible et evitons les parabenes, sulfates et parfums artificiels. Les listes completes d\'ingredients sont disponibles sur chaque page produit.',
            es: 'Todos nuestros productos estan formulados con ingredientes de alta calidad, probados dermatologicamente. Priorizamos los componentes naturales y organicos siempre que sea posible y evitamos parabenos, sulfatos y fragancias artificiales. Las listas completas de ingredientes estan disponibles en cada pagina de producto.',
          },
        },
        {
          title: {
            en: 'How do I choose the right product for my skin type?',
            tr: 'Cilt tipime uygun urunu nasil secerim?',
            de: 'Wie waehle ich das richtige Produkt fuer meinen Hauttyp?',
            fr: 'Comment choisir le bon produit pour mon type de peau?',
            es: 'Como elijo el producto adecuado para mi tipo de piel?',
          },
          content: {
            en: 'Each product page includes detailed information about which skin types it is best suited for. We recommend checking the description for recommendations. If you are unsure, our customer service team can help you find the perfect match for your specific needs.',
            tr: 'Her urun sayfasi, hangi cilt tiplerine en uygun oldugu hakkinda ayrintili bilgi icerir. Oneriler icin aciklamayi kontrol etmenizi oneririz. Emin degilseniz, musteri hizmetleri ekibimiz ozel ihtiyaclariniz icin mukemmel eslesmeyi bulmaniza yardimci olabilir.',
            de: 'Jede Produktseite enthaelt detaillierte Informationen darueber, fuer welche Hauttypen das Produkt am besten geeignet ist. Wir empfehlen, die Beschreibung auf Empfehlungen zu pruefen. Wenn Sie unsicher sind, kann Ihnen unser Kundenservice helfen, das perfekte Produkt fuer Ihre spezifischen Beduerfnisse zu finden.',
            fr: 'Chaque page produit comprend des informations detaillees sur les types de peau auxquels il convient le mieux. Nous vous recommandons de consulter la description pour des recommandations. Si vous n\'etes pas sur, notre equipe de service client peut vous aider a trouver le produit parfait pour vos besoins specifiques.',
            es: 'Cada pagina de producto incluye informacion detallada sobre para que tipos de piel es mas adecuado. Recomendamos consultar la descripcion para obtener recomendaciones. Si no esta seguro, nuestro equipo de servicio al cliente puede ayudarle a encontrar el producto perfecto para sus necesidades especificas.',
          },
        },
        {
          title: {
            en: 'What is your return and exchange policy?',
            tr: 'Iade ve degisim politikaniz nedir?',
            de: 'Was ist Ihre Rueckgabe- und Umtauschrichtlinie?',
            fr: 'Quelle est votre politique de retour et d\'echange?',
            es: 'Cual es su politica de devolucion e intercambio?',
          },
          content: {
            en: 'We accept returns of unopened products within 30 days of purchase. If you have had an adverse reaction to a product, please contact us immediately and we will arrange a full refund or exchange. Opened products can be returned within 14 days if they caused an allergic reaction, provided you include a brief description of the issue.',
            tr: 'Satin alma tarihinden itibaren 30 gun icinde acilmamis urunlerin iadesini kabul ediyoruz. Bir urune karsi olumsuz bir reaksiyon yasadiysaniz, lutfen hemen bizimle iletisime gecin; tam iade veya degisim duzenleyecegiz. Acilmis urunler, alerjik reaksiyona neden olduklari takdirde, sorunun kisa bir aciklamasini eklemeniz sartiyla 14 gun icinde iade edilebilir.',
            de: 'Wir akzeptieren Rueckgaben ungeoeffneter Produkte innerhalb von 30 Tagen nach dem Kauf. Wenn Sie eine unerwuenschte Reaktion auf ein Produkt hatten, kontaktieren Sie uns bitte sofort und wir werden eine vollstaendige Rueckerstattung oder einen Umtausch veranlassen. Geoeffnete Produkte koennen innerhalb von 14 Tagen zurueckgegeben werden, wenn sie eine allergische Reaktion verursacht haben, sofern Sie eine kurze Beschreibung des Problems beifuegen.',
            fr: 'Nous acceptons les retours de produits non ouverts dans les 30 jours suivant l\'achat. Si vous avez eu une reaction indesirable a un produit, veuillez nous contacter immediatement et nous organiserons un remboursement complet ou un echange. Les produits ouverts peuvent etre retournes dans les 14 jours s\'ils ont provoque une reaction allergique, a condition d\'inclure une breve description du probleme.',
            es: 'Aceptamos devoluciones de productos sin abrir dentro de los 30 dias posteriores a la compra. Si ha tenido una reaccion adversa a un producto, contactenos de inmediato y organizaremos un reembolso completo o un intercambio. Los productos abiertos se pueden devolver dentro de los 14 dias si causaron una reaccion alergica, siempre que incluya una breve descripcion del problema.',
          },
        },
        {
          title: {
            en: 'How should I store my cosmetic products?',
            tr: 'Kozmetik urunlerimi nasil saklamaliyim?',
            de: 'Wie sollte ich meine Kosmetikprodukte aufbewahren?',
            fr: 'Comment dois-je conserver mes produits cosmetiques?',
            es: 'Como debo almacenar mis productos cosmeticos?',
          },
          content: {
            en: 'Most of our products should be stored in a cool, dry place away from direct sunlight. Serums and creams with active ingredients like vitamin C or retinol are best kept in a dark, temperature-controlled environment. Always check the product label for specific storage instructions and expiry dates.',
            tr: 'Urunlerimizin cogu serin, kuru ve dogrudan gunes isinlarindan uzak bir yerde saklanmalidir. C vitamini veya retinol gibi aktif iceriklere sahip serumlar ve kremler karanlik, sicaklik kontrolllu bir ortamda saklanmalidir. Belirli saklama talimatlari ve son kullanma tarihleri icin her zaman urun etiketini kontrol edin.',
            de: 'Die meisten unserer Produkte sollten an einem kuehlen, trockenen Ort fern von direkter Sonneneinstrahlung aufbewahrt werden. Seren und Cremes mit aktiven Inhaltsstoffen wie Vitamin C oder Retinol werden am besten in einer dunklen, temperaturkontrollierten Umgebung aufbewahrt. Ueberpruefen Sie immer das Produktetikett fuer spezifische Lagerungsanweisungen und Verfallsdaten.',
            fr: 'La plupart de nos produits doivent etre conserves dans un endroit frais et sec, a l\'abri de la lumiere directe du soleil. Les serums et cremes contenant des ingredients actifs comme la vitamine C ou le retinol sont mieux conserves dans un environnement sombre et a temperature controlee. Verifiez toujours l\'etiquette du produit pour les instructions de stockage specifiques et les dates de peremption.',
            es: 'La mayoria de nuestros productos deben almacenarse en un lugar fresco y seco, alejados de la luz solar directa. Los serums y cremas con ingredientes activos como vitamina C o retinol se conservan mejor en un ambiente oscuro y con temperatura controlada. Siempre consulte la etiqueta del producto para obtener instrucciones especificas de almacenamiento y fechas de vencimiento.',
          },
        },
        {
          title: {
            en: 'Are your products authentic and certified?',
            tr: 'Urunleriniz orijinal ve sertifikali mi?',
            de: 'Sind Ihre Produkte authentisch und zertifiziert?',
            fr: 'Vos produits sont-ils authentiques et certifies?',
            es: 'Son sus productos autenticos y certificados?',
          },
          content: {
            en: 'Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors. We hold certifications for cruelty-free and organic standards where applicable. Each product comes with a unique batch number that you can verify on our website for full transparency.',
            tr: 'Evet, tum urunlerimiz %100 orijinaldir ve dogrudan yetkili uretici ve distributolerden temin edilmektedir. Uygulanabilir oldugu yerlerde zulme maruz kalmamis ve organik standartlari icin sertifikalarimiz vardir. Her urun, tam seffaflik icin web sitemizde dogrulayabileceginiz benzersiz bir parti numarasiyla birlikte gelir.',
            de: 'Ja, alle unsere Produkte sind 100% authentisch und stammen direkt von autorisierten Herstellern und Haendlern. Wir verfuegen ueber Zertifizierungen fuer tierversuchsfreie und biologische Standards, wo zutreffend. Jedes Produkt wird mit einer einzigartigen Chargennummer geliefert, die Sie auf unserer Website zur vollstaendigen Transparenz ueberpruefen koennen.',
            fr: 'Oui, tous nos produits sont 100% authentiques et proviennent directement de fabricants et distributeurs autorises. Nous detenons des certifications pour les normes sans cruaute et biologiques le cas echeant. Chaque produit est accompagne d\'un numero de lot unique que vous pouvez verifier sur notre site Web pour une transparence totale.',
            es: 'Si, todos nuestros productos son 100% autenticos y provienen directamente de fabricantes y distribuidores autorizados. Contamos con certificaciones de estandares libres de crueldad y organicos cuando corresponde. Cada producto viene con un numero de lote unico que puede verificar en nuestro sitio web para total transparencia.',
          },
        },
      ],
    },
  },
];

export const kozmetikSeedData: SectorSeedData = {
  categories: [
    {
      name: {
        en: 'Skincare',
        tr: 'Cilt Bakimi',
        de: 'Hautpflege',
        fr: 'Soins de la peau',
        es: 'Cuidado de la piel',
      },
      slug: 'cilt-bakimi',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
      sortOrder: 1,
    },
    {
      name: {
        en: 'Makeup',
        tr: 'Makyaj',
        de: 'Make-up',
        fr: 'Maquillage',
        es: 'Maquillaje',
      },
      slug: 'makyaj',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop',
      sortOrder: 2,
    },
    {
      name: {
        en: 'Hair Care',
        tr: 'Sac Bakimi',
        de: 'Haarpflege',
        fr: 'Soins capillaires',
        es: 'Cuidado del cabello',
      },
      slug: 'sac-bakimi',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&h=600&fit=crop',
      sortOrder: 3,
    },
    {
      name: {
        en: 'Perfume',
        tr: 'Parfum',
        de: 'Parfuem',
        fr: 'Parfum',
        es: 'Perfume',
      },
      slug: 'parfum',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop',
      sortOrder: 4,
    },
  ],

  products: [
    {
      name: {
        en: 'Moisturizing Cream',
        tr: 'Nemlendirici Krem',
        de: 'Feuchtigkeitscreme',
        fr: 'Creme hydratante',
        es: 'Crema hidratante',
      },
      description: {
        en: 'A rich daily moisturizer formulated with hyaluronic acid and vitamin E. Deeply hydrates and nourishes the skin, leaving it soft and supple throughout the day. Suitable for all skin types.',
        tr: 'Hyaluronik asit ve E vitamini ile formule edilmis zengin bir gunluk nemlendirici. Cildi derinlemesine nemlendirir ve besler, gun boyunca yumusak ve esnek birakir. Tum cilt tiplerine uygundur.',
        de: 'Eine reichhaltige taegliche Feuchtigkeitscreme mit Hyaluronsaeure und Vitamin E. Spendet der Haut tiefgehende Feuchtigkeit und naehrt sie, sodass sie den ganzen Tag ueber weich und geschmeidig bleibt. Fuer alle Hauttypen geeignet.',
        fr: 'Une creme hydratante quotidienne riche formulee avec de l\'acide hyaluronique et de la vitamine E. Hydrate et nourrit la peau en profondeur, la laissant douce et souple toute la journee. Convient a tous les types de peau.',
        es: 'Una rica crema hidratante diaria formulada con acido hialuronico y vitamina E. Hidrata y nutre profundamente la piel, dejandola suave y flexible durante todo el dia. Apta para todo tipo de piel.',
      },
      slug: 'nemlendirici-krem',
      price: 350,
      sku: 'KOZ-001',
      stock: 100,
      images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&h=600&fit=crop'],
      categorySlug: 'cilt-bakimi',
      status: 'active',
    },
    {
      name: {
        en: 'Foundation Set',
        tr: 'Fondoten Seti',
        de: 'Foundation-Set',
        fr: 'Kit fond de teint',
        es: 'Set de base de maquillaje',
      },
      description: {
        en: 'A complete foundation set with five shades for a flawless, natural finish. Lightweight formula that blends seamlessly and provides buildable coverage. Includes a precision sponge for perfect application.',
        tr: 'Kusursuz, dogal bir gorunum icin bes tonu iceren eksiksiz bir fondoten seti. Sorunsuzca karistirilan ve katmanlanabilir kapaticilik saglayan hafif formul. Mukemmel uygulama icin hassas bir sunger icerir.',
        de: 'Ein komplettes Foundation-Set mit fuenf Nuancen fuer ein makelloses, natuerliches Finish. Leichte Formel, die sich nahtlos verblenden laesst und aufbaubare Abdeckung bietet. Enthaelt einen Praezisionsschwamm fuer perfektes Auftragen.',
        fr: 'Un kit fond de teint complet avec cinq teintes pour un fini impeccable et naturel. Formule legere qui se melange facilement et offre une couvrance modulable. Comprend une eponge de precision pour une application parfaite.',
        es: 'Un set de base completo con cinco tonos para un acabado impecable y natural. Formula ligera que se difumina perfectamente y proporciona cobertura modulable. Incluye una esponja de precision para una aplicacion perfecta.',
      },
      slug: 'fondoten-seti',
      price: 580,
      sku: 'KOZ-002',
      stock: 80,
      images: ['https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?w=800&h=600&fit=crop'],
      categorySlug: 'makyaj',
      status: 'active',
    },
    {
      name: {
        en: 'Hair Care Set',
        tr: 'Sac Bakim Seti',
        de: 'Haarpflege-Set',
        fr: 'Kit de soins capillaires',
        es: 'Set de cuidado capilar',
      },
      description: {
        en: 'A professional hair care set including shampoo, conditioner, and repair mask. Enriched with argan oil and keratin to restore shine, strength, and vitality to damaged hair. Free from parabens and silicones.',
        tr: 'Sampuan, sac kremi ve onarim maskesi iceren profesyonel bir sac bakim seti. Yipranmis saclara parlakligi, gucu ve canlilik kazandirmak icin argan yagi ve keratin ile zenginlestirilmistir. Paraben ve silikon icermez.',
        de: 'Ein professionelles Haarpflege-Set mit Shampoo, Conditioner und Reparaturmaske. Angereichert mit Arganoel und Keratin, um geschaedigtem Haar Glanz, Staerke und Vitalitaet zurueckzugeben. Frei von Parabenen und Silikonen.',
        fr: 'Un kit professionnel de soins capillaires comprenant shampooing, apres-shampooing et masque reparateur. Enrichi en huile d\'argan et en keratine pour restaurer la brillance, la force et la vitalite des cheveux abimes. Sans parabenes ni silicones.',
        es: 'Un set profesional de cuidado capilar que incluye champu, acondicionador y mascarilla reparadora. Enriquecido con aceite de argan y queratina para restaurar el brillo, la fuerza y la vitalidad del cabello danado. Libre de parabenos y siliconas.',
      },
      slug: 'sac-bakim-seti',
      price: 420,
      sku: 'KOZ-003',
      stock: 60,
      images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&h=600&fit=crop'],
      categorySlug: 'sac-bakimi',
      status: 'active',
    },
    {
      name: {
        en: 'Luxury Perfume',
        tr: 'Luks Parfum',
        de: 'Luxusparfuem',
        fr: 'Parfum de luxe',
        es: 'Perfume de lujo',
      },
      description: {
        en: 'An exquisite eau de parfum with top notes of bergamot and jasmine, a heart of rose and iris, and a warm base of sandalwood and vanilla. Long-lasting fragrance that evolves beautifully throughout the day.',
        tr: 'Bergamot ve yasemin ust notalari, gul ve susen kalbi ve sandal agaci ile vanilya sicak tabanina sahip enfes bir eau de parfum. Gun boyunca guzel bir sekilde gelisen uzun sureli koku.',
        de: 'Ein exquisites Eau de Parfum mit Kopfnoten von Bergamotte und Jasmin, einem Herz aus Rose und Iris und einer warmen Basis aus Sandelholz und Vanille. Langanhaltender Duft, der sich im Laufe des Tages wunderschoen entwickelt.',
        fr: 'Un exquis eau de parfum avec des notes de tete de bergamote et de jasmin, un coeur de rose et d\'iris, et une base chaude de bois de santal et de vanille. Fragrance longue duree qui evolue magnifiquement tout au long de la journee.',
        es: 'Un exquisito eau de parfum con notas de cabeza de bergamota y jazmin, un corazon de rosa e iris, y una base calida de sandalo y vainilla. Fragancia duradera que evoluciona bellamente a lo largo del dia.',
      },
      slug: 'luks-parfum',
      price: 1200,
      sku: 'KOZ-004',
      stock: 40,
      images: ['https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=800&h=600&fit=crop'],
      categorySlug: 'parfum',
      status: 'active',
    },
    {
      name: {
        en: 'Anti-Aging Serum',
        tr: 'Anti-Aging Serum',
        de: 'Anti-Aging-Serum',
        fr: 'Serum anti-age',
        es: 'Serum antienvejecimiento',
      },
      description: {
        en: 'A powerful anti-aging serum with retinol, peptides, and niacinamide. Visibly reduces fine lines, wrinkles, and uneven skin tone within weeks of regular use. Lightweight, fast-absorbing formula suitable for day and night application.',
        tr: 'Retinol, peptitler ve niasinamid iceren guclu bir anti-aging serum. Duzenli kullanimda haftalar icinde ince cizgileri, kirisikliklari ve duzensiz cilt tonunu gorunur sekilde azaltir. Gun ve gece uygulamasi icin uygun hafif, hizli emilen formul.',
        de: 'Ein kraftvolles Anti-Aging-Serum mit Retinol, Peptiden und Niacinamid. Reduziert sichtbar feine Linien, Falten und ungleichmaessigen Hautton innerhalb weniger Wochen regelmaessiger Anwendung. Leichte, schnell einziehende Formel, geeignet fuer Tag- und Nachtanwendung.',
        fr: 'Un puissant serum anti-age au retinol, peptides et niacinamide. Reduit visiblement les ridules, les rides et le teint irregulier en quelques semaines d\'utilisation reguliere. Formule legere a absorption rapide adaptee a une application de jour comme de nuit.',
        es: 'Un poderoso serum antienvejecimiento con retinol, peptidos y niacinamida. Reduce visiblemente las lineas finas, arrugas y el tono desigual de la piel en semanas de uso regular. Formula ligera de rapida absorcion adecuada para aplicacion diurna y nocturna.',
      },
      slug: 'anti-aging-serum',
      price: 890,
      sku: 'KOZ-005',
      stock: 50,
      images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop'],
      categorySlug: 'cilt-bakimi',
      status: 'active',
    },
    {
      name: {
        en: 'Lipstick Collection',
        tr: 'Ruj Koleksiyonu',
        de: 'Lippenstift-Kollektion',
        fr: 'Collection de rouges a levres',
        es: 'Coleccion de labiales',
      },
      description: {
        en: 'A curated set of six richly pigmented lipsticks in versatile shades from nude to bold red. Creamy, long-wearing formula that hydrates lips while delivering intense colour payoff. Comes in an elegant gift box.',
        tr: 'Nude tonlardan cesur kirmiziya kadar cok yonlu tonlarda alti zengin pigmentli rujdan olusan ozenle secilmis bir set. Yogun renk verirken dudaklari nemlendiren kremsi, uzun sureli formul. Sik bir hediye kutusunda gelir.',
        de: 'Ein kuratiertes Set aus sechs reichhaltig pigmentierten Lippenstiften in vielseitigen Nuancen von Nude bis kraeftigem Rot. Cremige, langanhaltende Formel, die die Lippen mit Feuchtigkeit versorgt und gleichzeitig intensive Farbabgabe liefert. Kommt in einer eleganten Geschenkbox.',
        fr: 'Un ensemble soigne de six rouges a levres richement pigmentes dans des teintes polyvalentes allant du nude au rouge audacieux. Formule cremeuse et longue tenue qui hydrate les levres tout en offrant un rendu de couleur intense. Presente dans un elegant coffret cadeau.',
        es: 'Un set seleccionado de seis labiales ricamente pigmentados en tonos versatiles desde nude hasta rojo intenso. Formula cremosa de larga duracion que hidrata los labios mientras ofrece un color intenso. Viene en una elegante caja de regalo.',
      },
      slug: 'ruj-koleksiyonu',
      price: 280,
      sku: 'KOZ-006',
      stock: 70,
      images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=600&fit=crop'],
      categorySlug: 'makyaj',
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
        en: 'Premium cosmetics and beauty products. Skincare, makeup, hair care and perfumes.',
        tr: 'Premium kozmetik ve guzellik urunleri. Cilt bakimi, makyaj, sac bakimi ve parfumler.',
        de: 'Premium-Kosmetik und Schoenheitsprodukte. Hautpflege, Make-up, Haarpflege und Parfuems.',
        fr: 'Cosmetiques et produits de beaute premium. Soins de la peau, maquillage, soins capillaires et parfums.',
        es: 'Cosmeticos y productos de belleza premium. Cuidado de la piel, maquillaje, cuidado capilar y perfumes.',
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
        en: 'Browse our full range of beauty and skincare products.',
        tr: 'Guzellik ve cilt bakim urunlerimizin tam yelpazesine goz atin.',
        de: 'Durchsuchen Sie unser gesamtes Sortiment an Schoenheits- und Hautpflegeprodukten.',
        fr: 'Parcourez notre gamme complete de produits de beaute et de soins.',
        es: 'Explora nuestra gama completa de productos de belleza y cuidado de la piel.',
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
        en: 'Browse beauty product categories — skincare, makeup, hair care and perfumes.',
        tr: 'Guzellik urunu kategorilerine goz atin — cilt bakimi, makyaj, sac bakimi ve parfumler.',
        de: 'Durchsuchen Sie Schoenheitsprodukt-Kategorien — Hautpflege, Make-up, Haarpflege und Parfuems.',
        fr: 'Parcourez les categories de produits de beaute — soins, maquillage, capillaires et parfums.',
        es: 'Explora las categorias de productos de belleza — cuidado de la piel, maquillaje, capilar y perfumes.',
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
        en: 'Explore our complete collection of beauty and cosmetics products.',
        tr: 'Guzellik ve kozmetik urunlerinin tum koleksiyonumuzu kesfedin.',
        de: 'Entdecken Sie unsere komplette Kollektion an Schoenheits- und Kosmetikprodukten.',
        fr: 'Explorez notre collection complete de produits de beaute et cosmetiques.',
        es: 'Explora nuestra coleccion completa de productos de belleza y cosmeticos.',
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
        en: 'Learn about our mission, values, and commitment to quality beauty products.',
        tr: 'Misyonumuz, degerlerimiz ve kaliteli guzellik urunlerine bagliligimiz hakkinda bilgi edinin.',
        de: 'Erfahren Sie mehr ueber unsere Mission, Werte und unser Engagement fuer hochwertige Schoenheitsprodukte.',
        fr: 'Decouvrez notre mission, nos valeurs et notre engagement envers des produits de beaute de qualite.',
        es: 'Conozca nuestra mision, valores y compromiso con productos de belleza de calidad.',
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
        en: 'Get in touch with our team for questions, feedback, or support.',
        tr: 'Sorulariniz, geri bildirimleriniz veya destek icin ekibimizle iletisime gecin.',
        de: 'Nehmen Sie Kontakt mit unserem Team auf fuer Fragen, Feedback oder Unterstuetzung.',
        fr: 'Contactez notre equipe pour toute question, commentaire ou assistance.',
        es: 'Pongase en contacto con nuestro equipo para preguntas, comentarios o soporte.',
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
        en: 'Frequently asked questions about our cosmetic products, ingredients, and policies.',
        tr: 'Kozmetik urunlerimiz, icerikleri ve politikalarimiz hakkinda sikca sorulan sorular.',
        de: 'Haeufig gestellte Fragen zu unseren Kosmetikprodukten, Inhaltsstoffen und Richtlinien.',
        fr: 'Questions frequemment posees sur nos produits cosmetiques, ingredients et politiques.',
        es: 'Preguntas frecuentes sobre nuestros productos cosmeticos, ingredientes y politicas.',
      },
    },
  ],

  header: { version: 1, blocks: [] },
  footer: { version: 1, blocks: [] },

  settings: [
    { key: 'sector', value: 'kozmetik', group: 'general' },
    { key: 'store_name', value: { en: 'Beauty Store', tr: 'Guzellik Magazasi', de: 'Beauty-Shop', fr: 'Boutique Beaute', es: 'Tienda de Belleza' }, group: 'general' },
    { key: 'primary_color', value: '#D4A0A0', group: 'appearance' },
    { key: 'secondary_color', value: '#F5E6E0', group: 'appearance' },
    { key: 'currency', value: 'TRY', group: 'regional' },
    { key: 'locale', value: 'tr', group: 'regional' },
  ],
};
