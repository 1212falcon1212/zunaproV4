import type { SectorSeedData } from './types';
import type { PageContent, Block } from '@zunapro/types';

// ---------------------------------------------------------------------------
// Gida (Food & Grocery) Sector Seed Data
// ---------------------------------------------------------------------------

const homeBlocks: Block[] = [
  {
    id: 'seed_gida_home_hero',
    type: 'hero',
    props: {
      title: {
        en: 'Natural and Fresh Flavors',
        tr: 'Dogal ve Taze Lezzetler',
        de: 'Natuerliche und frische Aromen',
        fr: 'Saveurs naturelles et fraiches',
        es: 'Sabores naturales y frescos',
      },
      subtitle: {
        en: 'Discover our handpicked selection of organic products, gourmet snacks, and artisan beverages.',
        tr: 'Ozenle secilmis organik urunler, gurme atistirmaliklar ve zanaat icecekler koleksiyonumuzu kesfedin.',
        de: 'Entdecken Sie unsere handverlesene Auswahl an Bio-Produkten, Gourmet-Snacks und handwerklichen Getraenken.',
        fr: 'Decouvrez notre selection de produits biologiques, snacks gourmets et boissons artisanales.',
        es: 'Descubre nuestra seleccion de productos organicos, snacks gourmet y bebidas artesanales.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1600&h=600&fit=crop',
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
    id: 'seed_gida_home_spacer1',
    type: 'spacer',
    props: { height: '3rem' },
  },
  {
    id: 'seed_gida_home_products',
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
    id: 'seed_gida_home_spacer2',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_gida_home_categories',
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
    id: 'seed_gida_home_spacer3',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_gida_home_banner',
    type: 'banner',
    props: {
      title: {
        en: 'Farm to Table Freshness',
        tr: 'Ciftlikten Sofraniza Tazelik',
        de: 'Frische vom Bauernhof auf den Tisch',
        fr: 'Fraicheur de la ferme a la table',
        es: 'Frescura de la granja a la mesa',
      },
      description: {
        en: 'We source our products directly from local farmers and trusted producers to guarantee the highest quality and freshness.',
        tr: 'En yuksek kalite ve tazeligi garanti etmek icin urunlerimizi dogrudan yerel ciftcilerden ve guvenilir ureticilerden temin ediyoruz.',
        de: 'Wir beziehen unsere Produkte direkt von lokalen Bauern und vertrauenswuerdigen Erzeugern, um hoechste Qualitaet und Frische zu garantieren.',
        fr: 'Nous approvisionnons nos produits directement aupres d\'agriculteurs locaux et de producteurs de confiance pour garantir la plus haute qualite et fraicheur.',
        es: 'Obtenemos nuestros productos directamente de agricultores locales y productores de confianza para garantizar la mas alta calidad y frescura.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop',
      ctaText: {
        en: 'Learn More',
        tr: 'Daha Fazla',
        de: 'Mehr erfahren',
        fr: 'En savoir plus',
        es: 'Saber mas',
      },
      ctaLink: '/pages/about',
    },
  },
  {
    id: 'seed_gida_home_spacer4',
    type: 'spacer',
    props: { height: '2rem' },
  },
  {
    id: 'seed_gida_home_newsletter',
    type: 'newsletter',
    props: {
      title: {
        en: 'Stay Fresh with Us',
        tr: 'Bizimle Taze Kalin',
        de: 'Bleiben Sie frisch mit uns',
        fr: 'Restez frais avec nous',
        es: 'Mantente fresco con nosotros',
      },
      description: {
        en: 'Subscribe for new product alerts, seasonal recipes, and exclusive discounts.',
        tr: 'Yeni urun bildirimleri, mevsimlik tarifler ve ozel indirimler icin abone olun.',
        de: 'Abonnieren Sie fuer neue Produktbenachrichtigungen, saisonale Rezepte und exklusive Rabatte.',
        fr: 'Abonnez-vous pour recevoir des alertes de nouveaux produits, des recettes de saison et des remises exclusives.',
        es: 'Suscribete para alertas de nuevos productos, recetas de temporada y descuentos exclusivos.',
      },
    },
  },
];

const shopBlocks: Block[] = [
  {
    id: 'seed_gida_shop_hero',
    type: 'hero',
    props: {
      title: {
        en: 'Our Products',
        tr: 'Urunlerimiz',
        de: 'Unsere Produkte',
        fr: 'Nos produits',
        es: 'Nuestros productos',
      },
      subtitle: {
        en: 'Browse our curated selection of natural, organic, and gourmet foods.',
        tr: 'Dogal, organik ve gurme gida secimimize goz atin.',
        de: 'Durchsuchen Sie unsere kuratierte Auswahl an natuerlichen, biologischen und Gourmet-Lebensmitteln.',
        fr: 'Parcourez notre selection de produits naturels, biologiques et gourmets.',
        es: 'Explora nuestra seleccion de alimentos naturales, organicos y gourmet.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_gida_shop_listing',
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
    id: 'seed_gida_categories_hero',
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
        en: 'Explore our food categories to find exactly what you are looking for.',
        tr: 'Tam olarak aradiginizi bulmak icin gida kategorilerimizi kesfedin.',
        de: 'Erkunden Sie unsere Lebensmittelkategorien, um genau das zu finden, was Sie suchen.',
        fr: 'Explorez nos categories alimentaires pour trouver exactement ce que vous cherchez.',
        es: 'Explora nuestras categorias de alimentos para encontrar exactamente lo que buscas.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_gida_categories_listing',
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
    id: 'seed_gida_products_hero',
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
        en: 'Explore our complete range of natural and gourmet food products.',
        tr: 'Dogal ve gurme gida urunlerimizin tamamini kesfedin.',
        de: 'Entdecken Sie unser komplettes Sortiment an natuerlichen und Gourmet-Lebensmitteln.',
        fr: 'Explorez notre gamme complete de produits alimentaires naturels et gourmets.',
        es: 'Explora nuestra gama completa de productos alimentarios naturales y gourmet.',
      },
      size: 'small',
    },
  },
  {
    id: 'seed_gida_products_listing',
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
    id: 'seed_gida_about_hero',
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
        en: 'Bringing you the finest natural flavors from trusted sources around the world.',
        tr: 'Dunyanin dort bir yanindan guvenilir kaynaklardan en iyi dogal lezzetleri size ulastiriyoruz.',
        de: 'Wir bringen Ihnen die feinsten natuerlichen Aromen aus vertrauenswuerdigen Quellen weltweit.',
        fr: 'Nous vous apportons les meilleures saveurs naturelles de sources fiables du monde entier.',
        es: 'Te traemos los mejores sabores naturales de fuentes confiables de todo el mundo.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600&h=600&fit=crop',
    },
  },
  {
    id: 'seed_gida_about_text',
    type: 'text',
    props: {
      tag: 'div',
      content: {
        en:
          '<h2>Our Story</h2>' +
          '<p>We started with a simple belief: everyone deserves access to wholesome, natural food. Our journey began at local farmers\' markets, connecting small-scale producers with customers who care about what they eat. Today, we bring that same commitment to quality through our online store.</p>' +
          '<p>Every product in our catalogue is hand-selected by our team of food specialists. We visit farms, taste-test batches, and verify certifications to ensure that what reaches your table meets the highest standards of freshness, flavour, and sustainability.</p>' +
          '<p>We work closely with organic farms, artisan roasters, and traditional spice merchants to offer you a diverse range of products that celebrate culinary traditions from around the globe. Our cold-chain logistics ensure that perishable items arrive at your doorstep in optimal condition.</p>',
        tr:
          '<h2>Hikayemiz</h2>' +
          '<p>Basit bir inancla basladik: herkes saglikli, dogal gidaya erisimi hak eder. Yolculugumuz yerel ciftci pazarlarinda basladi, kucuk olcekli ureticileri ne yediklerini onemseyenlerle bulusturarak. Bugun, ayni kalite taahhudunu online magazamiz araciligiyla sunuyoruz.</p>' +
          '<p>Katalogumuzdaki her urun, gida uzmanlarimiz ekibi tarafindan ozenle secilmistir. Ciftlikleri ziyaret ediyor, partileri tadarak test ediyor ve sofraniza ulasin her seyin tazelik, lezzet ve surdurulebilirlik konusunda en yuksek standartlari karsilamasini saglamak icin sertifikalari dogruluyoruz.</p>' +
          '<p>Dunyanin dort bir yanindaki mutfak geleneklerini kutlayan cesitli urun yelpazesi sunmak icin organik ciftlikler, zanaat kavuruculari ve geleneksel baharat tuccarlariylayla yakin calisiyoruz. Soguk zincir lojistigimiz, bozulabilir urunlerin kapiuza optimal kosullarda ulasmasini saglar.</p>',
        de:
          '<h2>Unsere Geschichte</h2>' +
          '<p>Wir begannen mit einem einfachen Glauben: Jeder verdient Zugang zu gesunden, natuerlichen Lebensmitteln. Unsere Reise begann auf lokalen Bauernmaerkten, wo wir Kleinproduzenten mit Kunden zusammenbrachten, denen wichtig ist, was sie essen. Heute bringen wir dasselbe Engagement fuer Qualitaet ueber unseren Online-Shop.</p>' +
          '<p>Jedes Produkt in unserem Katalog wird von unserem Team von Lebensmittelspezialisten handverlesen. Wir besuchen Bauernhoefe, testen Chargen und ueberpruefen Zertifizierungen, um sicherzustellen, dass alles, was Ihren Tisch erreicht, den hoechsten Standards fuer Frische, Geschmack und Nachhaltigkeit entspricht.</p>' +
          '<p>Wir arbeiten eng mit Bio-Bauernhoefen, handwerklichen Roestern und traditionellen Gewuerzhaendlern zusammen, um Ihnen eine vielfaeltige Produktpalette anzubieten, die kulinarische Traditionen aus aller Welt feiert. Unsere Kuehlkettenlogistik stellt sicher, dass verderbliche Waren in optimalem Zustand bei Ihnen ankommen.</p>',
        fr:
          '<h2>Notre histoire</h2>' +
          '<p>Nous avons commence avec une conviction simple : tout le monde merite d\'avoir acces a une alimentation saine et naturelle. Notre voyage a commence sur les marches de producteurs locaux, en connectant les petits producteurs avec des clients soucieux de ce qu\'ils mangent. Aujourd\'hui, nous apportons ce meme engagement de qualite a travers notre boutique en ligne.</p>' +
          '<p>Chaque produit de notre catalogue est selectionne a la main par notre equipe de specialistes alimentaires. Nous visitons les fermes, testons les lots et verifions les certifications pour nous assurer que ce qui arrive sur votre table repond aux normes les plus elevees de fraicheur, de saveur et de durabilite.</p>' +
          '<p>Nous travaillons en etroite collaboration avec des fermes biologiques, des torrefacteurs artisanaux et des marchands d\'epices traditionnels pour vous offrir une gamme diversifiee de produits qui celebrent les traditions culinaires du monde entier. Notre logistique de chaine du froid garantit que les articles perissables arrivent a votre porte dans des conditions optimales.</p>',
        es:
          '<h2>Nuestra historia</h2>' +
          '<p>Comenzamos con una creencia simple: todos merecen acceso a alimentos saludables y naturales. Nuestro viaje comenzo en mercados de agricultores locales, conectando a pequenos productores con clientes que se preocupan por lo que comen. Hoy, llevamos ese mismo compromiso con la calidad a traves de nuestra tienda en linea.</p>' +
          '<p>Cada producto en nuestro catalogo es seleccionado a mano por nuestro equipo de especialistas en alimentos. Visitamos granjas, probamos lotes y verificamos certificaciones para asegurar que lo que llega a tu mesa cumple con los mas altos estandares de frescura, sabor y sostenibilidad.</p>' +
          '<p>Trabajamos estrechamente con granjas organicas, tostadores artesanales y comerciantes de especias tradicionales para ofrecerte una amplia gama de productos que celebran las tradiciones culinarias de todo el mundo. Nuestra logistica de cadena de frio asegura que los articulos perecederos lleguen a tu puerta en condiciones optimas.</p>',
      },
    },
  },
];

const contactBlocks: Block[] = [
  {
    id: 'seed_gida_contact_hero',
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
        en: 'Have a question about our products or your order? We are here to help.',
        tr: 'Urunlerimiz veya siparisibiz hakkinda bir sorunuz mu var? Yardimci olmak icin buradayiz.',
        de: 'Haben Sie eine Frage zu unseren Produkten oder Ihrer Bestellung? Wir sind hier, um zu helfen.',
        fr: 'Vous avez une question sur nos produits ou votre commande? Nous sommes la pour vous aider.',
        es: 'Tienes alguna pregunta sobre nuestros productos o tu pedido? Estamos aqui para ayudarte.',
      },
    },
  },
  {
    id: 'seed_gida_contact_columns',
    type: 'columns',
    props: { columns: 2, gap: '2rem' },
    children: [
      {
        id: 'seed_gida_contact_info',
        type: 'text',
        props: {
          tag: 'div',
          content: {
            en:
              '<h3>Get in Touch</h3>' +
              '<p><strong>Email:</strong> info@example.com</p>' +
              '<p><strong>Phone:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Address:</strong> 45 Market Street, Unit 200, San Francisco, CA 94105</p>',
            tr:
              '<h3>Bize Ulasin</h3>' +
              '<p><strong>E-posta:</strong> info@example.com</p>' +
              '<p><strong>Telefon:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adres:</strong> 45 Market Street, Unit 200, San Francisco, CA 94105</p>',
            de:
              '<h3>Kontaktieren Sie uns</h3>' +
              '<p><strong>E-Mail:</strong> info@example.com</p>' +
              '<p><strong>Telefon:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adresse:</strong> 45 Market Street, Unit 200, San Francisco, CA 94105</p>',
            fr:
              '<h3>Nous contacter</h3>' +
              '<p><strong>E-mail:</strong> info@example.com</p>' +
              '<p><strong>Telephone:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Adresse:</strong> 45 Market Street, Unit 200, San Francisco, CA 94105</p>',
            es:
              '<h3>Contactenos</h3>' +
              '<p><strong>Correo:</strong> info@example.com</p>' +
              '<p><strong>Telefono:</strong> +1 (555) 000-0000</p>' +
              '<p><strong>Direccion:</strong> 45 Market Street, Unit 200, San Francisco, CA 94105</p>',
          },
        },
      },
      {
        id: 'seed_gida_contact_hours',
        type: 'text',
        props: {
          tag: 'div',
          content: {
            en:
              '<h3>Business Hours</h3>' +
              '<p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>' +
              '<p><strong>Saturday:</strong> 9:00 AM - 3:00 PM</p>' +
              '<p><strong>Sunday:</strong> Closed</p>',
            tr:
              '<h3>Calisma Saatleri</h3>' +
              '<p><strong>Pazartesi - Cuma:</strong> 08:00 - 18:00</p>' +
              '<p><strong>Cumartesi:</strong> 09:00 - 15:00</p>' +
              '<p><strong>Pazar:</strong> Kapali</p>',
            de:
              '<h3>Geschaeftszeiten</h3>' +
              '<p><strong>Montag - Freitag:</strong> 8:00 - 18:00 Uhr</p>' +
              '<p><strong>Samstag:</strong> 9:00 - 15:00 Uhr</p>' +
              '<p><strong>Sonntag:</strong> Geschlossen</p>',
            fr:
              '<h3>Heures d\'ouverture</h3>' +
              '<p><strong>Lundi - Vendredi:</strong> 8h00 - 18h00</p>' +
              '<p><strong>Samedi:</strong> 9h00 - 15h00</p>' +
              '<p><strong>Dimanche:</strong> Ferme</p>',
            es:
              '<h3>Horario comercial</h3>' +
              '<p><strong>Lunes - Viernes:</strong> 8:00 - 18:00</p>' +
              '<p><strong>Sabado:</strong> 9:00 - 15:00</p>' +
              '<p><strong>Domingo:</strong> Cerrado</p>',
          },
        },
      },
    ],
  },
];

const faqBlocks: Block[] = [
  {
    id: 'seed_gida_faq_hero',
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
        en: 'Find answers to common questions about our food products, delivery, and policies.',
        tr: 'Gida urunlerimiz, teslimat ve politikalarimiz hakkinda sik sorulan sorularin yanitlarini bulun.',
        de: 'Finden Sie Antworten auf haeufige Fragen zu unseren Lebensmitteln, Lieferung und Richtlinien.',
        fr: 'Trouvez des reponses aux questions courantes sur nos produits alimentaires, la livraison et nos politiques.',
        es: 'Encuentra respuestas a preguntas comunes sobre nuestros productos alimentarios, entrega y politicas.',
      },
    },
  },
  {
    id: 'seed_gida_faq_accordion',
    type: 'accordion',
    props: {
      items: [
        {
          title: {
            en: 'How do you ensure product freshness during delivery?',
            tr: 'Teslimat sirasinda urun tazeligi nasil saglanir?',
            de: 'Wie stellen Sie die Produktfrische waehrend der Lieferung sicher?',
            fr: 'Comment assurez-vous la fraicheur des produits pendant la livraison?',
            es: 'Como garantizan la frescura del producto durante la entrega?',
          },
          content: {
            en: 'We use insulated packaging and cold-chain logistics for all perishable items. Orders are dispatched within 24 hours of being placed and delivered within 2-3 business days. Temperature-sensitive products include ice packs and thermal liners to maintain freshness throughout transit.',
            tr: 'Tum bozulabilir urunler icin yalitimli ambalaj ve soguk zincir lojistigi kullaniyoruz. Siparisler verildikten sonra 24 saat icinde gonderilir ve 2-3 is gunu icinde teslim edilir. Sicakliga duyarli urunler, tasinma boyunca tazeligi korumak icin buz paketleri ve termal astarlar icerir.',
            de: 'Wir verwenden isolierte Verpackungen und Kuehlkettenlogistik fuer alle verderblichen Artikel. Bestellungen werden innerhalb von 24 Stunden nach Aufgabe versandt und innerhalb von 2-3 Werktagen geliefert. Temperaturempfindliche Produkte enthalten Kuehlelemente und Thermofolien, um die Frische waehrend des Transports zu erhalten.',
            fr: 'Nous utilisons des emballages isoles et une logistique de chaine du froid pour tous les articles perissables. Les commandes sont expediees dans les 24 heures suivant la commande et livrees sous 2 a 3 jours ouvrables. Les produits sensibles a la temperature comprennent des packs de glace et des doublures thermiques pour maintenir la fraicheur pendant le transit.',
            es: 'Utilizamos embalaje aislado y logistica de cadena de frio para todos los articulos perecederos. Los pedidos se envian dentro de las 24 horas posteriores a la realizacion y se entregan en 2-3 dias habiles. Los productos sensibles a la temperatura incluyen paquetes de hielo y revestimientos termicos para mantener la frescura durante el transito.',
          },
        },
        {
          title: {
            en: 'Do you offer same-day or express delivery?',
            tr: 'Ayni gun veya ekspres teslimat sunuyor musunuz?',
            de: 'Bieten Sie Lieferung am selben Tag oder Expresslieferung an?',
            fr: 'Proposez-vous la livraison le jour meme ou express?',
            es: 'Ofrecen entrega el mismo dia o express?',
          },
          content: {
            en: 'Yes, we offer same-day delivery for orders placed before 12:00 PM in select metropolitan areas. Express delivery (next business day) is available nationwide. Delivery fees vary based on order size and location; orders over a certain threshold qualify for free standard shipping.',
            tr: 'Evet, belirli buyuksehir bolgelerde saat 12:00\'den once verilen siparisler icin ayni gun teslimat sunuyoruz. Ekspres teslimat (sonraki is gunu) ulke capinda mevcuttur. Teslimat ucretleri siparis boyutuna ve konuma gore degisir; belirli bir esigi asan siparisler ucretsiz standart kargodan yararlanir.',
            de: 'Ja, wir bieten Lieferung am selben Tag fuer Bestellungen an, die vor 12:00 Uhr in ausgewaehlten Metropolregionen aufgegeben werden. Expresslieferung (naechster Werktag) ist landesweit verfuegbar. Liefergebuehren variieren je nach Bestellgroesse und Standort; Bestellungen ueber einem bestimmten Schwellenwert qualifizieren sich fuer kostenlosen Standardversand.',
            fr: 'Oui, nous proposons la livraison le jour meme pour les commandes passees avant 12h00 dans certaines zones metropolitaines. La livraison express (jour ouvrable suivant) est disponible dans tout le pays. Les frais de livraison varient en fonction de la taille de la commande et de la localisation; les commandes depassant un certain seuil beneficient de la livraison standard gratuite.',
            es: 'Si, ofrecemos entrega el mismo dia para pedidos realizados antes de las 12:00 PM en areas metropolitanas seleccionadas. La entrega express (siguiente dia habil) esta disponible a nivel nacional. Las tarifas de envio varian segun el tamano del pedido y la ubicacion; los pedidos que superan cierto umbral califican para envio estandar gratuito.',
          },
        },
        {
          title: {
            en: 'Do your products contain allergens?',
            tr: 'Urunleriniz alerjen iceriyor mu?',
            de: 'Enthalten Ihre Produkte Allergene?',
            fr: 'Vos produits contiennent-ils des allergenes?',
            es: 'Sus productos contienen alergenos?',
          },
          content: {
            en: 'All allergen information is clearly listed on each product page. Common allergens such as nuts, gluten, dairy, soy, and eggs are highlighted in the ingredients section. If you have a severe allergy, please contact us before ordering so we can advise on safe product choices.',
            tr: 'Tum alerjen bilgileri her urun sayfasinda acikca listelenmektedir. Findik, gluten, sut urunleri, soya ve yumurta gibi yaygin alerjenler icerik bolumunde vurgulanmaktadir. Ciddi bir alerjiniz varsa, guvenli urun secenekleri konusunda sizi bilgilendirebilmemiz icin siparis vermeden once lutfen bizimle iletisime gecin.',
            de: 'Alle Allergeninformationen sind auf jeder Produktseite deutlich aufgefuehrt. Haeufige Allergene wie Nuesse, Gluten, Milchprodukte, Soja und Eier sind im Zutatenbereich hervorgehoben. Wenn Sie eine schwere Allergie haben, kontaktieren Sie uns bitte vor der Bestellung, damit wir Sie zu sicheren Produkten beraten koennen.',
            fr: 'Toutes les informations sur les allergenes sont clairement indiquees sur chaque page produit. Les allergenes courants tels que les noix, le gluten, les produits laitiers, le soja et les oeufs sont mis en evidence dans la section des ingredients. Si vous avez une allergie severe, veuillez nous contacter avant de commander afin que nous puissions vous conseiller sur les choix de produits surs.',
            es: 'Toda la informacion sobre alergenos esta claramente listada en cada pagina de producto. Los alergenos comunes como frutos secos, gluten, lacteos, soja y huevos estan destacados en la seccion de ingredientes. Si tiene una alergia grave, contactenos antes de realizar su pedido para que podamos asesorarle sobre opciones de productos seguros.',
          },
        },
        {
          title: {
            en: 'How should I store the products after receiving them?',
            tr: 'Urunleri aldiktan sonra nasil saklamaliyim?',
            de: 'Wie sollte ich die Produkte nach dem Erhalt aufbewahren?',
            fr: 'Comment dois-je conserver les produits apres les avoir recus?',
            es: 'Como debo almacenar los productos despues de recibirlos?',
          },
          content: {
            en: 'Each product label includes specific storage recommendations. In general, honey and dried goods should be stored in a cool, dry cupboard. Coffee and tea should be kept in airtight containers away from light. Olive oil is best stored in a dark, cool place. Always check the best-before date and consume within the recommended timeframe.',
            tr: 'Her urun etiketi belirli saklama onerileri icerir. Genel olarak, bal ve kuru gidalar serin, kuru bir dolapta saklanmalidir. Kahve ve cay, isiktan uzak hava gecirmez kaplarda saklanmalidir. Zeytinyagi karanlik, serin bir yerde saklanmalidir. Her zaman son tuketim tarihini kontrol edin ve onerilen sure icinde tuketin.',
            de: 'Jedes Produktetikett enthaelt spezifische Lagerungsempfehlungen. Im Allgemeinen sollten Honig und Trockenprodukte in einem kuehlen, trockenen Schrank aufbewahrt werden. Kaffee und Tee sollten in luftdichten Behaeltern fern von Licht aufbewahrt werden. Olivenoel wird am besten an einem dunklen, kuehlen Ort aufbewahrt. Ueberpruefen Sie immer das Mindesthaltbarkeitsdatum und verbrauchen Sie innerhalb des empfohlenen Zeitraums.',
            fr: 'Chaque etiquette de produit comprend des recommandations de stockage specifiques. En general, le miel et les produits secs doivent etre conserves dans un placard frais et sec. Le cafe et le the doivent etre conserves dans des recipients hermetiques a l\'abri de la lumiere. L\'huile d\'olive est idealement conservee dans un endroit sombre et frais. Verifiez toujours la date de peremption et consommez dans le delai recommande.',
            es: 'Cada etiqueta de producto incluye recomendaciones especificas de almacenamiento. En general, la miel y los productos secos deben almacenarse en un armario fresco y seco. El cafe y el te deben guardarse en recipientes hermeticos alejados de la luz. El aceite de oliva se conserva mejor en un lugar oscuro y fresco. Siempre verifique la fecha de consumo preferente y consuma dentro del plazo recomendado.',
          },
        },
        {
          title: {
            en: 'Are your organic products certified?',
            tr: 'Organik urunleriniz sertifikali mi?',
            de: 'Sind Ihre Bio-Produkte zertifiziert?',
            fr: 'Vos produits biologiques sont-ils certifies?',
            es: 'Estan certificados sus productos organicos?',
          },
          content: {
            en: 'Yes, all products labelled as organic hold valid certifications from recognised bodies such as USDA Organic, EU Organic, or equivalent national standards. Certification details, including the certifying body and certificate number, are displayed on the product page and printed on the packaging.',
            tr: 'Evet, organik olarak etiketlenen tum urunler USDA Organic, EU Organic veya esdeger ulusal standartlar gibi taninmis kuruluslardan gecerli sertifikalara sahiptir. Sertifikalandirma kurulasu ve sertifika numarasi dahil sertifika ayrintilari, urun sayfasinda goruntulenir ve ambalaj uzerine basilir.',
            de: 'Ja, alle als biologisch gekennzeichneten Produkte verfuegen ueber gueltige Zertifizierungen von anerkannten Stellen wie USDA Organic, EU Organic oder gleichwertigen nationalen Standards. Zertifizierungsdetails, einschliesslich der zertifizierenden Stelle und Zertifikatsnummer, werden auf der Produktseite angezeigt und auf der Verpackung gedruckt.',
            fr: 'Oui, tous les produits etiquetes comme biologiques detiennent des certifications valides d\'organismes reconnus tels que USDA Organic, EU Organic ou des normes nationales equivalentes. Les details de certification, y compris l\'organisme certificateur et le numero de certificat, sont affiches sur la page du produit et imprimes sur l\'emballage.',
            es: 'Si, todos los productos etiquetados como organicos cuentan con certificaciones validas de organismos reconocidos como USDA Organic, EU Organic o estandares nacionales equivalentes. Los detalles de certificacion, incluido el organismo certificador y el numero de certificado, se muestran en la pagina del producto y se imprimen en el empaque.',
          },
        },
      ],
    },
  },
];

export const gidaSeedData: SectorSeedData = {
  categories: [
    {
      name: {
        en: 'Organic Products',
        tr: 'Organik Urunler',
        de: 'Bio-Produkte',
        fr: 'Produits biologiques',
        es: 'Productos organicos',
      },
      slug: 'organik',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
      sortOrder: 1,
    },
    {
      name: {
        en: 'Snacks',
        tr: 'Atistirmaliklar',
        de: 'Snacks',
        fr: 'Encas',
        es: 'Aperitivos',
      },
      slug: 'atistirmalik',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&h=600&fit=crop',
      sortOrder: 2,
    },
    {
      name: {
        en: 'Beverages',
        tr: 'Icecekler',
        de: 'Getraenke',
        fr: 'Boissons',
        es: 'Bebidas',
      },
      slug: 'icecek',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=600&fit=crop',
      sortOrder: 3,
    },
    {
      name: {
        en: 'Spices',
        tr: 'Baharatlar',
        de: 'Gewuerze',
        fr: 'Epices',
        es: 'Especias',
      },
      slug: 'baharat',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop',
      sortOrder: 4,
    },
  ],

  products: [
    {
      name: {
        en: 'Organic Honey',
        tr: 'Organik Bal',
        de: 'Bio-Honig',
        fr: 'Miel biologique',
        es: 'Miel organica',
      },
      description: {
        en: 'Pure, raw organic honey harvested from wildflower meadows in the highlands. Unprocessed and unfiltered to preserve all natural enzymes, vitamins, and antioxidants. A versatile superfood perfect for teas, baking, or enjoying straight from the jar.',
        tr: 'Yaylalardaki yabani cicek cayirlarindan hasat edilen saf, ham organik bal. Tum dogal enzimleri, vitaminleri ve antioksidanlari korumak icin islenmemis ve filtrelenmemistir. Caylar, firincilik veya dogrudan kavanozdan tadin icin mukemmel, cok yonlu bir super gida.',
        de: 'Reiner, roher Bio-Honig, geerntet von Wildblumenwiesen im Hochland. Unverarbeitet und ungefiltert, um alle natuerlichen Enzyme, Vitamine und Antioxidantien zu erhalten. Ein vielseitiges Superfood, perfekt fuer Tees, zum Backen oder pur aus dem Glas.',
        fr: 'Miel biologique pur et cru recolte dans les prairies de fleurs sauvages des hauts plateaux. Non transforme et non filtre pour preserver toutes les enzymes naturelles, vitamines et antioxydants. Un superaliment polyvalent parfait pour les thes, la patisserie ou a deguster directement du pot.',
        es: 'Miel organica pura y cruda cosechada de praderas de flores silvestres en las tierras altas. Sin procesar ni filtrar para preservar todas las enzimas naturales, vitaminas y antioxidantes. Un superalimento versatil perfecto para tes, reposteria o disfrutar directamente del frasco.',
      },
      slug: 'organik-bal',
      price: 180,
      sku: 'GID-001',
      stock: 120,
      images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=600&fit=crop'],
      categorySlug: 'organik',
      status: 'active',
    },
    {
      name: {
        en: 'Dried Fruit Set',
        tr: 'Kuru Meyve Seti',
        de: 'Trockenfruechteset',
        fr: 'Coffret de fruits secs',
        es: 'Set de frutas secas',
      },
      description: {
        en: 'A premium assortment of sun-dried apricots, figs, mulberries, and golden raisins. Naturally sweet with no added sugar or preservatives, making them a wholesome snack for the whole family. Packed in a reusable wooden gift box.',
        tr: 'Gunes kurutmasi kayisi, incir, dut ve altin uzumden olusan premium bir cesitlilik. Eklenmis seker veya koruyucu maddeler olmadan dogal olarak tatli, tum aile icin saglikli bir atistirmalik. Yeniden kullanilabilir ahsap hediye kutusunda paketlenmistir.',
        de: 'Ein Premium-Sortiment aus sonnengetrockneten Aprikosen, Feigen, Maulbeeren und goldenen Rosinen. Natuerlich suess ohne zugesetzten Zucker oder Konservierungsmittel und damit ein gesunder Snack fuer die ganze Familie. Verpackt in einer wiederverwendbaren Holzgeschenkbox.',
        fr: 'Un assortiment premium d\'abricots seches au soleil, figues, mures et raisins dores. Naturellement sucre sans sucre ajoute ni conservateurs, ce qui en fait un encas sain pour toute la famille. Emballe dans un coffret cadeau en bois reutilisable.',
        es: 'Un surtido premium de albaricoques secados al sol, higos, moras y pasas doradas. Naturalmente dulces sin azucar anadida ni conservantes, lo que los convierte en un snack saludable para toda la familia. Empacado en una caja de regalo de madera reutilizable.',
      },
      slug: 'kuru-meyve-seti',
      price: 250,
      sku: 'GID-002',
      stock: 90,
      images: ['https://images.unsplash.com/photo-1596591868231-05e882e67960?w=800&h=600&fit=crop'],
      categorySlug: 'atistirmalik',
      status: 'active',
    },
    {
      name: {
        en: 'Special Blend Coffee',
        tr: 'Ozel Harman Kahve',
        de: 'Spezialmischung Kaffee',
        fr: 'Cafe melange special',
        es: 'Cafe mezcla especial',
      },
      description: {
        en: 'A carefully crafted blend of single-origin Arabica beans from Ethiopia and Colombia. Medium roasted to bring out rich chocolate and berry notes with a smooth, balanced finish. Available as whole bean or freshly ground to your preference.',
        tr: 'Etiyopya ve Kolombiya\'dan tek mensei Arabica cekirdeklerinin ozenle hazirlanmis bir harmani. Zengin cikolata ve meyve notalari ile puruzsuz, dengeli bir bitis ortaya cikarmak icin orta derecede kavrulmustur. Tam cekirdek veya tercihinize gore taze cekilmis olarak mevcuttur.',
        de: 'Eine sorgfaeltig zusammengestellte Mischung aus Single-Origin-Arabica-Bohnen aus Aethiopien und Kolumbien. Mittlere Roestung, um reiche Schokoladen- und Beerennoten mit einem sanften, ausgewogenen Abgang hervorzubringen. Erhaeltlich als ganze Bohne oder frisch gemahlen nach Ihren Wuenschen.',
        fr: 'Un melange soigneusement elabore de grains Arabica d\'origine unique d\'Ethiopie et de Colombie. Torrefie moyen pour reveler de riches notes de chocolat et de baies avec une finale douce et equilibree. Disponible en grains entiers ou fraichement moulu selon vos preferences.',
        es: 'Una mezcla cuidadosamente elaborada de granos Arabica de origen unico de Etiopia y Colombia. Tostado medio para resaltar ricas notas de chocolate y bayas con un final suave y equilibrado. Disponible en grano entero o recien molido segun tu preferencia.',
      },
      slug: 'ozel-harman-kahve',
      price: 320,
      sku: 'GID-003',
      stock: 80,
      images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop'],
      categorySlug: 'icecek',
      status: 'active',
    },
    {
      name: {
        en: 'Spice Collection',
        tr: 'Baharat Koleksiyonu',
        de: 'Gewuerzkollektion',
        fr: 'Collection d\'epices',
        es: 'Coleccion de especias',
      },
      description: {
        en: 'An artisan collection of eight hand-selected spices including saffron, sumac, cumin, smoked paprika, turmeric, black pepper, cinnamon, and chilli flakes. Sourced directly from family farms in Turkey, India, and the Mediterranean. Presented in elegant glass jars.',
        tr: 'Safran, sumak, kimyon, tustulenmis biber, zerdecal, karabiber, tarcin ve pul biber dahil sekiz ozenle secilmis baharattan olusan zanaat koleksiyonu. Turkiye, Hindistan ve Akdeniz\'deki aile ciftliklerinden dogrudan temin edilmistir. Sik cam kavanozlarda sunulmustur.',
        de: 'Eine handwerkliche Kollektion von acht handverlesenen Gewuerzen: Safran, Sumach, Kreuzkuemmel, geraeuchertes Paprikapulver, Kurkuma, schwarzer Pfeffer, Zimt und Chiliflocken. Direkt von Familienbauernhoefen in der Tuerkei, Indien und dem Mittelmeerraum bezogen. In eleganten Glasgefaessen praesentiert.',
        fr: 'Une collection artisanale de huit epices selectionnees a la main : safran, sumac, cumin, paprika fume, curcuma, poivre noir, cannelle et flocons de piment. Directement approvisionnees aupres de fermes familiales en Turquie, en Inde et en Mediterranee. Presentees dans d\'elegants pots en verre.',
        es: 'Una coleccion artesanal de ocho especias seleccionadas a mano que incluyen azafran, zumaque, comino, pimenton ahumado, curcuma, pimienta negra, canela y hojuelas de chile. Obtenidas directamente de granjas familiares en Turquia, India y el Mediterraneo. Presentadas en elegantes frascos de vidrio.',
      },
      slug: 'baharat-koleksiyonu',
      price: 150,
      sku: 'GID-004',
      stock: 100,
      images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop'],
      categorySlug: 'baharat',
      status: 'active',
    },
    {
      name: {
        en: 'Organic Olive Oil',
        tr: 'Organik Zeytinyagi',
        de: 'Bio-Olivenoel',
        fr: 'Huile d\'olive biologique',
        es: 'Aceite de oliva organico',
      },
      description: {
        en: 'Cold-pressed extra virgin olive oil from century-old olive groves on the Aegean coast. Rich in polyphenols and antioxidants with a fruity, peppery flavour profile. Perfect for salad dressings, dipping, or finishing dishes. Certified organic and single-estate bottled.',
        tr: 'Ege kiyisindaki yuzyillik zeytin bahcelerinden soguk sikma sizma zeytinyagi. Meyvemsi, biberimsi aroma profili ile polifenoller ve antioksidanlar acisindan zengin. Salata soslari, daldirma veya yemeklerin son dokunusu icin mukemmel. Sertifikali organik ve tek cifttik siselemelsidir.',
        de: 'Kaltgepresstes natives Olivenoel extra aus jahrhundertealten Olivenhainen an der Aegaeischen Kueste. Reich an Polyphenolen und Antioxidantien mit einem fruchtigen, pfeffrigen Geschmacksprofil. Perfekt fuer Salatdressings, zum Dippen oder zum Verfeinern von Gerichten. Zertifiziert biologisch und von einem einzigen Gut abgefuellt.',
        fr: 'Huile d\'olive extra vierge pressee a froid provenant d\'oliveraies centenaires de la cote egeenne. Riche en polyphenols et antioxydants avec un profil aromatique fruite et poivre. Parfaite pour les vinaigrettes, en trempette ou pour finir les plats. Certifiee biologique et mise en bouteille sur un domaine unique.',
        es: 'Aceite de oliva virgen extra prensado en frio de olivares centenarios en la costa del Egeo. Rico en polifenoles y antioxidantes con un perfil de sabor afrutado y picante. Perfecto para adresos de ensalada, mojar o terminar platos. Certificado organico y embotellado en finca unica.',
      },
      slug: 'organik-zeytinyagi',
      price: 280,
      sku: 'GID-005',
      stock: 70,
      images: ['https://images.unsplash.com/photo-1474979266404-7f28db3f3937?w=800&h=600&fit=crop'],
      categorySlug: 'organik',
      status: 'active',
    },
    {
      name: {
        en: 'Premium Tea Set',
        tr: 'Premium Cay Seti',
        de: 'Premium-Teeset',
        fr: 'Coffret de the premium',
        es: 'Set de te premium',
      },
      description: {
        en: 'A luxurious tea gift set featuring five loose-leaf varieties: Earl Grey, Japanese Sencha, Rooibos, Chamomile, and Darjeeling First Flush. Each tea is individually packed in foil-lined pouches to preserve aroma and freshness. Includes a bamboo tea scoop.',
        tr: 'Earl Grey, Japon Sencha, Rooibos, Papatya ve Darjeeling First Flush olmak uzere bes yaprak cay cesidini iceren luks bir cay hediye seti. Her cay, aromayi ve tazeligi korumak icin folyo kaplamali posetlerde ayri ayri paketlenmistir. Bambu cay kasigi dahildir.',
        de: 'Ein luxurioeses Tee-Geschenkset mit fuenf Blatttee-Sorten: Earl Grey, Japanischer Sencha, Rooibos, Kamille und Darjeeling First Flush. Jeder Tee ist einzeln in folienbeschichteten Beuteln verpackt, um Aroma und Frische zu bewahren. Inklusive Bambus-Teeloefel.',
        fr: 'Un luxueux coffret cadeau de the comprenant cinq varietes de the en vrac : Earl Grey, Sencha japonais, Rooibos, Camomille et Darjeeling First Flush. Chaque the est individuellement emballe dans des sachets doubles en aluminium pour preserver l\'arome et la fraicheur. Comprend une cuillere a the en bambou.',
        es: 'Un lujoso set de regalo de te que incluye cinco variedades de hojas sueltas: Earl Grey, Sencha japones, Rooibos, Manzanilla y Darjeeling First Flush. Cada te esta empacado individualmente en bolsas forradas de aluminio para preservar el aroma y la frescura. Incluye una cuchara de te de bambu.',
      },
      slug: 'premium-cay-seti',
      price: 220,
      sku: 'GID-006',
      stock: 60,
      images: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop'],
      categorySlug: 'icecek',
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
        en: 'Natural and fresh food products. Organic goods, gourmet snacks, beverages and spices.',
        tr: 'Dogal ve taze gida urunleri. Organik urunler, gurme atistirmaliklar, icecekler ve baharatlar.',
        de: 'Natuerliche und frische Lebensmittel. Bio-Produkte, Gourmet-Snacks, Getraenke und Gewuerze.',
        fr: 'Produits alimentaires naturels et frais. Produits biologiques, snacks gourmets, boissons et epices.',
        es: 'Productos alimentarios naturales y frescos. Productos organicos, snacks gourmet, bebidas y especias.',
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
        en: 'Browse our curated selection of natural and gourmet food products.',
        tr: 'Dogal ve gurme gida urunleri secimimize goz atin.',
        de: 'Durchsuchen Sie unsere kuratierte Auswahl an natuerlichen und Gourmet-Lebensmitteln.',
        fr: 'Parcourez notre selection de produits alimentaires naturels et gourmets.',
        es: 'Explora nuestra seleccion de productos alimentarios naturales y gourmet.',
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
        en: 'Browse food categories — organic products, snacks, beverages and spices.',
        tr: 'Gida kategorilerine goz atin — organik urunler, atistirmaliklar, icecekler ve baharatlar.',
        de: 'Durchsuchen Sie Lebensmittelkategorien — Bio-Produkte, Snacks, Getraenke und Gewuerze.',
        fr: 'Parcourez les categories alimentaires — produits biologiques, encas, boissons et epices.',
        es: 'Explora las categorias de alimentos — productos organicos, aperitivos, bebidas y especias.',
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
        en: 'Explore our complete range of natural and gourmet food products.',
        tr: 'Dogal ve gurme gida urunlerinin tamamini kesfedin.',
        de: 'Entdecken Sie unser komplettes Sortiment an natuerlichen und Gourmet-Lebensmitteln.',
        fr: 'Explorez notre gamme complete de produits alimentaires naturels et gourmets.',
        es: 'Explora nuestra gama completa de productos alimentarios naturales y gourmet.',
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
        en: 'Learn about our commitment to natural, organic, and high-quality food products.',
        tr: 'Dogal, organik ve yuksek kaliteli gida urunlerine olan bagliligimiz hakkinda bilgi edinin.',
        de: 'Erfahren Sie mehr ueber unser Engagement fuer natuerliche, biologische und hochwertige Lebensmittel.',
        fr: 'Decouvrez notre engagement envers des produits alimentaires naturels, biologiques et de haute qualite.',
        es: 'Conozca nuestro compromiso con productos alimentarios naturales, organicos y de alta calidad.',
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
        en: 'Get in touch with us for questions about our food products or your order.',
        tr: 'Gida urunlerimiz veya siparisibiz hakkinda sorulariniz icin bizimle iletisime gecin.',
        de: 'Nehmen Sie Kontakt mit uns auf fuer Fragen zu unseren Lebensmitteln oder Ihrer Bestellung.',
        fr: 'Contactez-nous pour toute question sur nos produits alimentaires ou votre commande.',
        es: 'Pongase en contacto con nosotros para preguntas sobre nuestros productos alimentarios o su pedido.',
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
        en: 'Frequently asked questions about our food products, delivery, and organic certifications.',
        tr: 'Gida urunlerimiz, teslimat ve organik sertifikalar hakkinda sikca sorulan sorular.',
        de: 'Haeufig gestellte Fragen zu unseren Lebensmitteln, Lieferung und Bio-Zertifizierungen.',
        fr: 'Questions frequemment posees sur nos produits alimentaires, la livraison et les certifications biologiques.',
        es: 'Preguntas frecuentes sobre nuestros productos alimentarios, entrega y certificaciones organicas.',
      },
    },
  ],

  header: { version: 1, blocks: [] },
  footer: { version: 1, blocks: [] },

  settings: [
    { key: 'sector', value: 'gida', group: 'general' },
    { key: 'store_name', value: { en: 'Food Store', tr: 'Gida Magazasi', de: 'Lebensmittelladen', fr: 'Epicerie', es: 'Tienda de Alimentos' }, group: 'general' },
    { key: 'primary_color', value: '#4A7C59', group: 'appearance' },
    { key: 'secondary_color', value: '#F5F0E8', group: 'appearance' },
    { key: 'currency', value: 'TRY', group: 'regional' },
    { key: 'locale', value: 'tr', group: 'regional' },
  ],
};
