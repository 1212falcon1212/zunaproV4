import type { SeedPage, SeedSetting, SeedCustomer, SeedOrder } from './types';
import type { PageContent } from '@zunapro/types';

// ---------------------------------------------------------------------------
// Common Pages — Privacy Policy & Terms of Service
// ---------------------------------------------------------------------------

export const commonPages: SeedPage[] = [
  {
    slug: 'privacy',
    title: {
      en: 'Privacy Policy',
      tr: 'Gizlilik Politikasi',
      de: 'Datenschutzrichtlinie',
      fr: 'Politique de confidentialite',
      es: 'Politica de privacidad',
    },
    content: {
      version: 1,
      blocks: [
        {
          id: 'seed_common_privacy_text',
          type: 'text',
          props: {
            tag: 'div',
            content: {
              en:
                '<p>We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard information when you visit our online store or make a purchase. By using our services, you consent to the practices described in this document.</p>' +
                '<p>We collect personal information such as your name, email address, shipping address, and payment details when you create an account or place an order. Additionally, we use cookies and similar tracking technologies to analyse browsing behaviour, improve our website performance, and deliver personalised content. You may adjust your cookie preferences at any time through your browser settings, though disabling cookies may limit certain features of our platform.</p>' +
                '<p>Your data is stored securely using industry-standard encryption and is never sold to third parties. We may share information with trusted service providers solely for the purpose of order fulfilment, payment processing, and analytics. You have the right to access, correct, or delete your personal data at any time by contacting our support team. We retain your information only as long as necessary to provide our services and comply with legal obligations.</p>',
              tr:
                '<p>Gizliliginize deger veriyor ve kisisel verilerinizi korumaya kararliyiz. Bu Gizlilik Politikasi, online magazamizi ziyaret ettiginizde veya alisveris yaptiginizda bilgilerinizi nasil topladigimizi, kullandigimizi ve korudugumuzu aciklamaktadir. Hizmetlerimizi kullanarak, bu belgede tanimlanan uygulamalari kabul etmis olursunuz.</p>' +
                '<p>Hesap olustururken veya siparis verirken adiniz, e-posta adresiniz, teslimat adresiniz ve odeme bilgileriniz gibi kisisel veriler topluyoruz. Ayrica, tarama davranisini analiz etmek, web sitesi performansimizi iyilestirmek ve kisisellestirilmis icerik sunmak icin cerezler ve benzer izleme teknolojileri kullaniyoruz. Cerez tercihlerinizi tarayici ayarlarinizdan istediginiz zaman degistirebilirsiniz; ancak cerezlerin devre disi birakilmasi platformumuzun bazi ozelliklerini sinirlandirabiiir.</p>' +
                '<p>Verileriniz endustri standardi sifreleme kullanilarak guvenli bir sekilde saklanir ve ucuncu taraflara asla satilmaz. Bilgilerinizi yalnizca siparis karsilama, odeme isleme ve analitik amaciyla guvenilir hizmet saglayicilariyla paylasabiliriz. Kisisel verilerinize erisme, duzeltme veya silme hakkiniz vardir; destek ekibimizle iletisime gecerek bu hakkinizi kullanabilirsiniz. Bilgilerinizi yalnizca hizmetlerimizi sunmak ve yasal yukumluluklere uymak icin gerekli oldugu surece saklariz.</p>',
              de:
                '<p>Wir legen grossen Wert auf Ihre Privatsphaere und verpflichten uns, Ihre personenbezogenen Daten zu schuetzen. Diese Datenschutzrichtlinie erlaeutert, wie wir Informationen erfassen, verwenden und schuetzen, wenn Sie unseren Online-Shop besuchen oder einen Kauf taetigen. Durch die Nutzung unserer Dienste stimmen Sie den in diesem Dokument beschriebenen Praktiken zu.</p>' +
                '<p>Wir erfassen personenbezogene Daten wie Ihren Namen, Ihre E-Mail-Adresse, Lieferadresse und Zahlungsinformationen, wenn Sie ein Konto erstellen oder eine Bestellung aufgeben. Darueber hinaus verwenden wir Cookies und aehnliche Tracking-Technologien, um das Browsing-Verhalten zu analysieren, die Leistung unserer Website zu verbessern und personalisierte Inhalte bereitzustellen. Sie koennen Ihre Cookie-Einstellungen jederzeit ueber Ihre Browsereinstellungen anpassen, wobei die Deaktivierung von Cookies bestimmte Funktionen unserer Plattform einschraenken kann.</p>' +
                '<p>Ihre Daten werden mit branchueblicher Verschluesselung sicher gespeichert und niemals an Dritte verkauft. Wir geben Informationen moeglicherweise an vertrauenswuerdige Dienstleister weiter, ausschliesslich zum Zweck der Bestellabwicklung, Zahlungsverarbeitung und Analyse. Sie haben jederzeit das Recht, auf Ihre personenbezogenen Daten zuzugreifen, diese zu berichtigen oder zu loeschen, indem Sie unser Support-Team kontaktieren. Wir bewahren Ihre Informationen nur so lange auf, wie es fuer die Erbringung unserer Dienste und die Einhaltung gesetzlicher Verpflichtungen erforderlich ist.</p>',
              fr:
                '<p>Nous accordons une grande importance a votre vie privee et nous engageons a proteger vos donnees personnelles. Cette Politique de confidentialite explique comment nous collectons, utilisons et protegeons les informations lorsque vous visitez notre boutique en ligne ou effectuez un achat. En utilisant nos services, vous consentez aux pratiques decrites dans ce document.</p>' +
                '<p>Nous collectons des informations personnelles telles que votre nom, adresse e-mail, adresse de livraison et informations de paiement lorsque vous creez un compte ou passez une commande. De plus, nous utilisons des cookies et des technologies de suivi similaires pour analyser le comportement de navigation, ameliorer les performances de notre site Web et fournir du contenu personnalise. Vous pouvez ajuster vos preferences en matiere de cookies a tout moment via les parametres de votre navigateur, bien que la desactivation des cookies puisse limiter certaines fonctionnalites de notre plateforme.</p>' +
                '<p>Vos donnees sont stockees en toute securite a l\'aide d\'un chiffrement conforme aux normes de l\'industrie et ne sont jamais vendues a des tiers. Nous pouvons partager des informations avec des prestataires de services de confiance uniquement dans le but de l\'execution des commandes, du traitement des paiements et de l\'analyse. Vous avez le droit d\'acceder, de corriger ou de supprimer vos donnees personnelles a tout moment en contactant notre equipe d\'assistance. Nous conservons vos informations uniquement aussi longtemps que necessaire pour fournir nos services et respecter les obligations legales.</p>',
              es:
                '<p>Valoramos su privacidad y nos comprometemos a proteger sus datos personales. Esta Politica de privacidad explica como recopilamos, utilizamos y protegemos la informacion cuando visita nuestra tienda en linea o realiza una compra. Al utilizar nuestros servicios, usted acepta las practicas descritas en este documento.</p>' +
                '<p>Recopilamos informacion personal como su nombre, direccion de correo electronico, direccion de envio y datos de pago cuando crea una cuenta o realiza un pedido. Ademas, utilizamos cookies y tecnologias de seguimiento similares para analizar el comportamiento de navegacion, mejorar el rendimiento de nuestro sitio web y ofrecer contenido personalizado. Puede ajustar sus preferencias de cookies en cualquier momento a traves de la configuracion de su navegador, aunque deshabilitar las cookies puede limitar ciertas funciones de nuestra plataforma.</p>' +
                '<p>Sus datos se almacenan de forma segura utilizando cifrado estandar de la industria y nunca se venden a terceros. Podemos compartir informacion con proveedores de servicios de confianza unicamente con el proposito de cumplimiento de pedidos, procesamiento de pagos y analisis. Usted tiene derecho a acceder, corregir o eliminar sus datos personales en cualquier momento poniendose en contacto con nuestro equipo de soporte. Conservamos su informacion solo durante el tiempo necesario para proporcionar nuestros servicios y cumplir con las obligaciones legales.</p>',
            },
          },
        },
      ],
    },
    isPublished: true,
    seoMeta: {
      en: 'Privacy Policy — Learn how we collect, use, and protect your personal data.',
      tr: 'Gizlilik Politikasi — Kisisel verilerinizi nasil topladigimizi, kullandigimizi ve korudugumuzu ogrenin.',
      de: 'Datenschutzrichtlinie — Erfahren Sie, wie wir Ihre personenbezogenen Daten erfassen, verwenden und schuetzen.',
      fr: 'Politique de confidentialite — Decouvrez comment nous collectons, utilisons et protegeons vos donnees personnelles.',
      es: 'Politica de privacidad — Conozca como recopilamos, usamos y protegemos sus datos personales.',
    },
  },
  {
    slug: 'terms',
    title: {
      en: 'Terms of Service',
      tr: 'Kullanim Kosullari',
      de: 'Nutzungsbedingungen',
      fr: 'Conditions d\'utilisation',
      es: 'Terminos de servicio',
    },
    content: {
      version: 1,
      blocks: [
        {
          id: 'seed_common_terms_text',
          type: 'text',
          props: {
            tag: 'div',
            content: {
              en:
                '<p>Welcome to our platform. By accessing or using our online store, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services. We reserve the right to update or modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.</p>' +
                '<p>You agree to use our platform only for lawful purposes. You may not use our services to engage in fraudulent activities, violate intellectual property rights, or distribute harmful content. When creating an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</p>' +
                '<p>Our liability is limited to the maximum extent permitted by applicable law. We do not guarantee uninterrupted or error-free service and shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our platform. Either party may terminate this agreement at any time. Upon termination, your right to access the platform ceases immediately, though provisions regarding liability, intellectual property, and dispute resolution shall survive.</p>',
              tr:
                '<p>Platformumuza hosgeldiniz. Online magazamiza eristiginizde veya kullandiginizda, bu Kullanim Kosullarina bagli olmayi kabul etmis olursunuz. Bu kosullarin herhangi bir bolumunu kabul etmiyorsaniz, hizmetlerimizi kullanmamalisiniz. Bu kosullari herhangi bir zamanda guncelleme veya degistirme hakkimizi sakli tutariz ve platformu kullanmaya devam etmeniz, yapilan degisiklikleri kabul ettiginiz anlamina gelir.</p>' +
                '<p>Platformumuzu yalnizca yasal amaclarla kullanmayi kabul edersiniz. Hizmetlerimizi dolandiricilik faaliyetlerinde bulunmak, fikri mulkiyet haklarini ihlal etmek veya zararli icerik dagitmak icin kullanamazsiniz. Hesap olustururken, kimlik bilgilerinizin gizliligini korumaktan ve hesabiniz altinda gerceklesen tum faaliyetlerden siz sorumlusunuz. Bu kosullari ihlal eden hesaplari onceden bildirimde bulunmaksizin askiya alma veya sonlandirma hakkimizi sakli tutariz.</p>' +
                '<p>Sorumlulugumuz, yururlukteki yasalarin izin verdigi azami olcude sinirlidir. Kesintisiz veya hatasiz hizmet garanti etmiyoruz ve platformumuzun kullanimindan kaynaklanan dolayli, arizi veya sonuc olarak ortaya cikan zararlardan sorumlu tutulamayiz. Taraflardan herhangi biri bu sozlesmeyi istediginiz zaman feshedebilir. Fesih uzerine, platforma erisim hakkiniz derhal sona erer; ancak sorumluluk, fikri mulkiyet ve uyusmazlik cozumune iliskin hukumler yururlukte kalmaya devam eder.</p>',
              de:
                '<p>Willkommen auf unserer Plattform. Durch den Zugriff auf oder die Nutzung unseres Online-Shops erklaeren Sie sich mit diesen Nutzungsbedingungen einverstanden. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, duerfen Sie unsere Dienste nicht nutzen. Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu aktualisieren oder zu aendern, und Ihre fortgesetzte Nutzung der Plattform stellt die Annahme etwaiger Aenderungen dar.</p>' +
                '<p>Sie erklaeren sich damit einverstanden, unsere Plattform nur fuer rechtmaessige Zwecke zu nutzen. Sie duerfen unsere Dienste nicht nutzen, um betruegerische Aktivitaeten durchzufuehren, geistige Eigentumsrechte zu verletzen oder schaedliche Inhalte zu verbreiten. Bei der Erstellung eines Kontos sind Sie dafuer verantwortlich, die Vertraulichkeit Ihrer Zugangsdaten zu wahren und fuer alle Aktivitaeten, die unter Ihrem Konto stattfinden. Wir behalten uns das Recht vor, Konten, die gegen diese Bedingungen verstossen, ohne vorherige Ankuendigung zu sperren oder zu kuendigen.</p>' +
                '<p>Unsere Haftung ist im gesetzlich zulaessigen Umfang beschraenkt. Wir garantieren keinen ununterbrochenen oder fehlerfreien Service und haften nicht fuer indirekte, zufaellige oder Folgeschaeden, die sich aus der Nutzung unserer Plattform ergeben. Jede Partei kann diese Vereinbarung jederzeit kuendigen. Mit der Kuendigung erlischt Ihr Recht auf Zugang zur Plattform sofort, wobei Bestimmungen zu Haftung, geistigem Eigentum und Streitbeilegung fortbestehen.</p>',
              fr:
                '<p>Bienvenue sur notre plateforme. En accedant ou en utilisant notre boutique en ligne, vous acceptez d\'etre lie par les presentes Conditions d\'utilisation. Si vous n\'acceptez pas une partie de ces conditions, vous ne devez pas utiliser nos services. Nous nous reservons le droit de mettre a jour ou de modifier ces conditions a tout moment, et votre utilisation continue de la plateforme constitue l\'acceptation de toute modification.</p>' +
                '<p>Vous acceptez d\'utiliser notre plateforme uniquement a des fins licites. Vous ne pouvez pas utiliser nos services pour vous livrer a des activites frauduleuses, violer des droits de propriete intellectuelle ou distribuer du contenu nuisible. Lors de la creation d\'un compte, vous etes responsable du maintien de la confidentialite de vos identifiants et de toutes les activites qui se produisent sous votre compte. Nous nous reservons le droit de suspendre ou de resilier les comptes qui violent ces conditions sans preavis.</p>' +
                '<p>Notre responsabilite est limitee dans toute la mesure permise par la loi applicable. Nous ne garantissons pas un service ininterrompu ou sans erreur et ne serons pas tenus responsables des dommages indirects, accessoires ou consecutifs decoulant de l\'utilisation de notre plateforme. L\'une ou l\'autre des parties peut resilier cet accord a tout moment. A la resiliation, votre droit d\'acces a la plateforme cesse immediatement, bien que les dispositions relatives a la responsabilite, a la propriete intellectuelle et au reglement des differends restent en vigueur.</p>',
              es:
                '<p>Bienvenido a nuestra plataforma. Al acceder o utilizar nuestra tienda en linea, usted acepta estar sujeto a estos Terminos de servicio. Si no esta de acuerdo con alguna parte de estos terminos, no debe utilizar nuestros servicios. Nos reservamos el derecho de actualizar o modificar estos terminos en cualquier momento, y su uso continuado de la plataforma constituye la aceptacion de cualquier cambio.</p>' +
                '<p>Usted acepta utilizar nuestra plataforma unicamente con fines legales. No puede utilizar nuestros servicios para participar en actividades fraudulentas, violar derechos de propiedad intelectual o distribuir contenido danino. Al crear una cuenta, usted es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades que ocurran bajo su cuenta. Nos reservamos el derecho de suspender o cancelar cuentas que violen estos terminos sin previo aviso.</p>' +
                '<p>Nuestra responsabilidad se limita al maximo permitido por la ley aplicable. No garantizamos un servicio ininterrumpido o libre de errores y no seremos responsables de ningun dano indirecto, incidental o consecuente que surja del uso de nuestra plataforma. Cualquiera de las partes puede rescindir este acuerdo en cualquier momento. Tras la rescision, su derecho de acceso a la plataforma cesa inmediatamente, aunque las disposiciones relativas a responsabilidad, propiedad intelectual y resolucion de disputas seguiran vigentes.</p>',
            },
          },
        },
      ],
    },
    isPublished: true,
    seoMeta: {
      en: 'Terms of Service — Read our terms and conditions for using the platform.',
      tr: 'Kullanim Kosullari — Platformu kullanmak icin kosullarimizi okuyun.',
      de: 'Nutzungsbedingungen — Lesen Sie unsere Bedingungen fuer die Nutzung der Plattform.',
      fr: 'Conditions d\'utilisation — Lisez nos conditions d\'utilisation de la plateforme.',
      es: 'Terminos de servicio — Lea nuestros terminos y condiciones para usar la plataforma.',
    },
  },
];

// ---------------------------------------------------------------------------
// Default Header
// ---------------------------------------------------------------------------

export const defaultHeader: PageContent = {
  version: 1,
  blocks: [
    {
      id: 'seed_header_logo',
      type: 'logo',
      props: {
        siteName: {
          en: 'Store',
          tr: 'Magaza',
          de: 'Shop',
          fr: 'Boutique',
          es: 'Tienda',
        },
        logoUrl: '',
      },
    },
    {
      id: 'seed_header_nav',
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
            label: { en: 'Categories', tr: 'Kategoriler', de: 'Kategorien', fr: 'Categories', es: 'Categorias' },
            link: '/pages/categories',
          },
          {
            label: { en: 'About', tr: 'Hakkimizda', de: 'Uber uns', fr: 'A propos', es: 'Sobre nosotros' },
            link: '/pages/about',
          },
          {
            label: { en: 'Contact', tr: 'Iletisim', de: 'Kontakt', fr: 'Contact', es: 'Contacto' },
            link: '/pages/contact',
          },
        ],
      },
    },
    {
      id: 'seed_header_search',
      type: 'search-bar',
      props: {
        placeholder: {
          en: 'Search products...',
          tr: 'Urun ara...',
          de: 'Produkte suchen...',
          fr: 'Rechercher...',
          es: 'Buscar productos...',
        },
      },
    },
    {
      id: 'seed_header_cart',
      type: 'cart-icon',
      props: {
        showCount: true,
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Default Footer
// ---------------------------------------------------------------------------

export const defaultFooter: PageContent = {
  version: 1,
  blocks: [
    {
      id: 'seed_footer_columns',
      type: 'columns',
      props: { columns: 3, gap: '2rem' },
      children: [
        {
          id: 'seed_footer_col1',
          type: 'container',
          props: {},
          children: [
            {
              id: 'seed_footer_col1_links',
              type: 'text',
              props: {
                tag: 'div',
                content: {
                  en:
                    '<h4>Quick Links</h4>' +
                    '<ul><li><a href="/">Home</a></li><li><a href="/pages/shop">Shop</a></li><li><a href="/pages/categories">Categories</a></li><li><a href="/pages/about">About</a></li></ul>',
                  tr:
                    '<h4>Hizli Baglantilar</h4>' +
                    '<ul><li><a href="/">Ana Sayfa</a></li><li><a href="/pages/shop">Magaza</a></li><li><a href="/pages/categories">Kategoriler</a></li><li><a href="/pages/about">Hakkimizda</a></li></ul>',
                  de:
                    '<h4>Schnellzugriff</h4>' +
                    '<ul><li><a href="/">Startseite</a></li><li><a href="/pages/shop">Shop</a></li><li><a href="/pages/categories">Kategorien</a></li><li><a href="/pages/about">Uber uns</a></li></ul>',
                  fr:
                    '<h4>Liens rapides</h4>' +
                    '<ul><li><a href="/">Accueil</a></li><li><a href="/pages/shop">Boutique</a></li><li><a href="/pages/categories">Categories</a></li><li><a href="/pages/about">A propos</a></li></ul>',
                  es:
                    '<h4>Enlaces rapidos</h4>' +
                    '<ul><li><a href="/">Inicio</a></li><li><a href="/pages/shop">Tienda</a></li><li><a href="/pages/categories">Categorias</a></li><li><a href="/pages/about">Sobre nosotros</a></li></ul>',
                },
              },
            },
          ],
        },
        {
          id: 'seed_footer_col2',
          type: 'container',
          props: {},
          children: [
            {
              id: 'seed_footer_col2_links',
              type: 'text',
              props: {
                tag: 'div',
                content: {
                  en:
                    '<h4>Customer Service</h4>' +
                    '<ul><li><a href="/pages/faq">FAQ</a></li><li><a href="/pages/contact">Contact</a></li><li><a href="/pages/privacy">Privacy Policy</a></li><li><a href="/pages/terms">Terms of Service</a></li></ul>',
                  tr:
                    '<h4>Musteri Hizmetleri</h4>' +
                    '<ul><li><a href="/pages/faq">SSS</a></li><li><a href="/pages/contact">Iletisim</a></li><li><a href="/pages/privacy">Gizlilik Politikasi</a></li><li><a href="/pages/terms">Kullanim Kosullari</a></li></ul>',
                  de:
                    '<h4>Kundenservice</h4>' +
                    '<ul><li><a href="/pages/faq">FAQ</a></li><li><a href="/pages/contact">Kontakt</a></li><li><a href="/pages/privacy">Datenschutzrichtlinie</a></li><li><a href="/pages/terms">Nutzungsbedingungen</a></li></ul>',
                  fr:
                    '<h4>Service client</h4>' +
                    '<ul><li><a href="/pages/faq">FAQ</a></li><li><a href="/pages/contact">Contact</a></li><li><a href="/pages/privacy">Politique de confidentialite</a></li><li><a href="/pages/terms">Conditions d\'utilisation</a></li></ul>',
                  es:
                    '<h4>Servicio al cliente</h4>' +
                    '<ul><li><a href="/pages/faq">Preguntas frecuentes</a></li><li><a href="/pages/contact">Contacto</a></li><li><a href="/pages/privacy">Politica de privacidad</a></li><li><a href="/pages/terms">Terminos de servicio</a></li></ul>',
                },
              },
            },
          ],
        },
        {
          id: 'seed_footer_col3',
          type: 'container',
          props: {},
          children: [
            {
              id: 'seed_footer_col3_contact',
              type: 'text',
              props: {
                tag: 'div',
                content: {
                  en:
                    '<h4>Contact Us</h4>' +
                    '<p>Email: info@example.com</p>' +
                    '<p>Phone: +1 (555) 000-0000</p>',
                  tr:
                    '<h4>Bize Ulasin</h4>' +
                    '<p>E-posta: info@example.com</p>' +
                    '<p>Telefon: +1 (555) 000-0000</p>',
                  de:
                    '<h4>Kontakt</h4>' +
                    '<p>E-Mail: info@example.com</p>' +
                    '<p>Telefon: +1 (555) 000-0000</p>',
                  fr:
                    '<h4>Nous contacter</h4>' +
                    '<p>E-mail: info@example.com</p>' +
                    '<p>Telephone: +1 (555) 000-0000</p>',
                  es:
                    '<h4>Contactenos</h4>' +
                    '<p>Correo: info@example.com</p>' +
                    '<p>Telefono: +1 (555) 000-0000</p>',
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: 'seed_footer_social',
      type: 'social-links',
      props: {
        links: [
          { platform: 'instagram', url: '#' },
          { platform: 'facebook', url: '#' },
          { platform: 'twitter', url: '#' },
        ],
      },
    },
    {
      id: 'seed_footer_newsletter',
      type: 'newsletter',
      props: {
        title: {
          en: 'Stay Updated',
          tr: 'Guncel Kalin',
          de: 'Bleiben Sie auf dem Laufenden',
          fr: 'Restez informe',
          es: 'Mantengase actualizado',
        },
        description: {
          en: 'Subscribe to our newsletter',
          tr: 'Bultenimize abone olun',
          de: 'Abonnieren Sie unseren Newsletter',
          fr: 'Abonnez-vous',
          es: 'Suscribase',
        },
      },
    },
    {
      id: 'seed_footer_copyright',
      type: 'text',
      props: {
        tag: 'p',
        content: {
          en: '\u00a9 2026 Store. All rights reserved.',
          tr: '\u00a9 2026 Magaza. Tum haklari saklidir.',
          de: '\u00a9 2026 Shop. Alle Rechte vorbehalten.',
          fr: '\u00a9 2026 Boutique. Tous droits reserves.',
          es: '\u00a9 2026 Tienda. Todos los derechos reservados.',
        },
      },
      style: {
        textAlign: 'center',
        padding: '1rem 0',
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Additional Common Pages — Shop, About, Contact, FAQ, Categories
// ---------------------------------------------------------------------------

export const additionalCommonPages: SeedPage[] = [
  {
    slug: 'shop',
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
          id: 'seed_shop_heading',
          type: 'text',
          props: {
            tag: 'h1',
            content: {
              en: 'All Products',
              tr: 'Tum Urunler',
              de: 'Alle Produkte',
              fr: 'Tous les produits',
              es: 'Todos los productos',
            },
          },
          style: { textAlign: 'center', padding: '2rem 0 1rem' },
        },
        {
          id: 'seed_shop_listing',
          type: 'product-listing',
          props: { limit: 24, columns: 4 },
        },
      ],
    },
    isPublished: true,
    seoMeta: {
      en: 'Shop all products — Browse our complete collection.',
      tr: 'Tum urunlere gozatin — Koleksiyonumuzu kesfedin.',
      de: 'Alle Produkte kaufen — Durchsuchen Sie unsere Kollektion.',
      fr: 'Acheter tous les produits — Parcourez notre collection.',
      es: 'Comprar todos los productos — Explore nuestra coleccion.',
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
    content: {
      version: 1,
      blocks: [
        {
          id: 'seed_about_heading',
          type: 'text',
          props: {
            tag: 'h1',
            content: {
              en: 'About Us',
              tr: 'Hakkimizda',
              de: 'Uber uns',
              fr: 'A propos de nous',
              es: 'Sobre nosotros',
            },
          },
          style: { textAlign: 'center', padding: '2rem 0 1rem' },
        },
        {
          id: 'seed_about_text',
          type: 'text',
          props: {
            tag: 'div',
            content: {
              en: '<p>We are a passionate team dedicated to bringing you the best products at competitive prices. Our mission is to make online shopping simple, enjoyable, and reliable. With a curated selection of quality items and outstanding customer service, we strive to exceed your expectations with every purchase.</p><p>Founded with the belief that everyone deserves access to great products, we work directly with trusted suppliers to ensure authenticity and quality. Whether you are shopping for yourself or looking for the perfect gift, we are here to help you find exactly what you need.</p>',
              tr: '<p>Sizlere en iyi urunleri rekabetci fiyatlarla sunmaya kendini adayan tutkulu bir ekibiz. Misyonumuz online alisverisi basit, keyifli ve guvenilir kilmaktir. Ozenle secilmis kaliteli urunler ve ustun musteri hizmetiyle, her alisverisinizde beklentilerinizi asmaya calismaktayiz.</p><p>Herkesin kaliteli urunlere erismesi gerektigi inanciya kurulan sirketimiz, orijinallik ve kaliteyi garantilemek icin guvenilir tedarikcilerle dogrudan calismaktadir. Kendiniz icin alisveris yapin veya mukemmel bir hediye arayin, ihtiyaciniz olani bulmaniz icin buradayiz.</p>',
              de: '<p>Wir sind ein leidenschaftliches Team, das sich darauf spezialisiert hat, Ihnen die besten Produkte zu wettbewerbsfaehigen Preisen anzubieten. Unsere Mission ist es, Online-Shopping einfach, angenehm und zuverlaessig zu gestalten. Mit einer kuratierten Auswahl an Qualitaetsprodukten und hervorragendem Kundenservice streben wir danach, Ihre Erwartungen bei jedem Einkauf zu uebertreffen.</p><p>Gegruendet mit der Ueberzeugung, dass jeder Zugang zu grossartigen Produkten verdient, arbeiten wir direkt mit vertrauenswuerdigen Lieferanten zusammen, um Authentizitaet und Qualitaet zu gewaehrleisten.</p>',
              fr: '<p>Nous sommes une equipe passionnee dediee a vous offrir les meilleurs produits a des prix competitifs. Notre mission est de rendre le shopping en ligne simple, agreable et fiable. Avec une selection soignee d\'articles de qualite et un service client exceptionnel, nous nous efforcons de depasser vos attentes a chaque achat.</p><p>Fondes avec la conviction que chacun merite l\'acces a d\'excellents produits, nous travaillons directement avec des fournisseurs de confiance pour garantir l\'authenticite et la qualite.</p>',
              es: '<p>Somos un equipo apasionado dedicado a ofrecerle los mejores productos a precios competitivos. Nuestra mision es hacer que las compras en linea sean simples, agradables y confiables. Con una seleccion cuidadosa de articulos de calidad y un servicio al cliente excepcional, nos esforzamos por superar sus expectativas con cada compra.</p><p>Fundados con la creencia de que todos merecen acceso a excelentes productos, trabajamos directamente con proveedores de confianza para garantizar autenticidad y calidad.</p>',
            },
          },
        },
      ],
    },
    isPublished: true,
    seoMeta: {
      en: 'About Us — Learn about our story, mission, and values.',
      tr: 'Hakkimizda — Hikayemizi, misyonumuzu ve degerlerimizi ogrenin.',
      de: 'Uber uns — Erfahren Sie mehr uber unsere Geschichte und Werte.',
      fr: 'A propos — Decouvrez notre histoire, mission et valeurs.',
      es: 'Sobre nosotros — Conozca nuestra historia, mision y valores.',
    },
  },
  {
    slug: 'contact',
    title: {
      en: 'Contact Us',
      tr: 'Iletisim',
      de: 'Kontakt',
      fr: 'Contact',
      es: 'Contacto',
    },
    content: {
      version: 1,
      blocks: [
        {
          id: 'seed_contact_heading',
          type: 'text',
          props: {
            tag: 'h1',
            content: {
              en: 'Contact Us',
              tr: 'Bize Ulasin',
              de: 'Kontaktieren Sie uns',
              fr: 'Contactez-nous',
              es: 'Contactenos',
            },
          },
          style: { textAlign: 'center', padding: '2rem 0 1rem' },
        },
        {
          id: 'seed_contact_text',
          type: 'text',
          props: {
            tag: 'div',
            content: {
              en: '<p>We would love to hear from you! Whether you have a question about our products, need help with an order, or just want to say hello, our team is here for you.</p><p><strong>Email:</strong> info@example.com</p><p><strong>Phone:</strong> +1 (555) 000-0000</p><p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p><p><strong>Address:</strong> 123 Commerce Street, Suite 100, New York, NY 10001</p>',
              tr: '<p>Sizden haber almak isteriz! Urunlerimiz hakkinda bir sorunuz varsa, siparislerinizle ilgili yardima ihtiyaciniz varsa veya sadece merhaba demek istiyorsaniz, ekibimiz sizin icin burada.</p><p><strong>E-posta:</strong> info@example.com</p><p><strong>Telefon:</strong> +1 (555) 000-0000</p><p><strong>Calisma Saatleri:</strong> Pazartesi - Cuma, 09:00 - 18:00</p><p><strong>Adres:</strong> 123 Ticaret Caddesi, No: 100, Istanbul, 34000</p>',
              de: '<p>Wir freuen uns von Ihnen zu hoeren! Ob Sie eine Frage zu unseren Produkten haben, Hilfe bei einer Bestellung benoetigen oder einfach Hallo sagen moechten — unser Team ist fuer Sie da.</p><p><strong>E-Mail:</strong> info@example.com</p><p><strong>Telefon:</strong> +1 (555) 000-0000</p><p><strong>Oeffnungszeiten:</strong> Montag - Freitag, 9:00 - 18:00 Uhr</p><p><strong>Adresse:</strong> Handelsstrasse 123, 10115 Berlin</p>',
              fr: '<p>Nous serions ravis d\'avoir de vos nouvelles ! Que vous ayez une question sur nos produits, besoin d\'aide avec une commande ou que vous vouliez simplement dire bonjour, notre equipe est la pour vous.</p><p><strong>Email :</strong> info@example.com</p><p><strong>Telephone :</strong> +1 (555) 000-0000</p><p><strong>Horaires :</strong> Lundi - Vendredi, 9h00 - 18h00</p><p><strong>Adresse :</strong> 123 Rue du Commerce, 75001 Paris</p>',
              es: '<p>Nos encantaria saber de usted. Ya sea que tenga una pregunta sobre nuestros productos, necesite ayuda con un pedido o simplemente quiera saludar, nuestro equipo esta aqui para usted.</p><p><strong>Correo:</strong> info@example.com</p><p><strong>Telefono:</strong> +1 (555) 000-0000</p><p><strong>Horario:</strong> Lunes - Viernes, 9:00 - 18:00</p><p><strong>Direccion:</strong> Calle Comercio 123, 28001 Madrid</p>',
            },
          },
        },
      ],
    },
    isPublished: true,
    seoMeta: {
      en: 'Contact Us — Get in touch with our team.',
      tr: 'Iletisim — Ekibimizle iletisime gecin.',
      de: 'Kontakt — Nehmen Sie Kontakt mit unserem Team auf.',
      fr: 'Contact — Contactez notre equipe.',
      es: 'Contacto — Pongase en contacto con nuestro equipo.',
    },
  },
  {
    slug: 'faq',
    title: {
      en: 'Frequently Asked Questions',
      tr: 'Sikca Sorulan Sorular',
      de: 'Haeufig gestellte Fragen',
      fr: 'Questions frequentes',
      es: 'Preguntas frecuentes',
    },
    content: {
      version: 1,
      blocks: [
        {
          id: 'seed_faq_heading',
          type: 'text',
          props: {
            tag: 'h1',
            content: {
              en: 'Frequently Asked Questions',
              tr: 'Sikca Sorulan Sorular',
              de: 'Haeufig gestellte Fragen',
              fr: 'Questions frequentes',
              es: 'Preguntas frecuentes',
            },
          },
          style: { textAlign: 'center', padding: '2rem 0 1rem' },
        },
        {
          id: 'seed_faq_accordion',
          type: 'accordion',
          props: {
            items: [
              {
                title: { en: 'How do I place an order?', tr: 'Nasil siparis verebilirim?', de: 'Wie gebe ich eine Bestellung auf?', fr: 'Comment passer une commande ?', es: 'Como hago un pedido?' },
                content: { en: 'Simply browse our products, add items to your cart, and proceed to checkout. You can pay with credit card, bank transfer, or other available methods.', tr: 'Urunlerimize gozatin, sepetinize ekleyin ve odeme sayfasina ilerleyin. Kredi karti, banka havalesi veya diger mevcut yontemlerle odeme yapabilirsiniz.', de: 'Durchsuchen Sie unsere Produkte, legen Sie Artikel in Ihren Warenkorb und gehen Sie zur Kasse. Sie koennen mit Kreditkarte, Bankueberweisung oder anderen verfuegbaren Methoden bezahlen.', fr: 'Parcourez nos produits, ajoutez des articles a votre panier et passez a la caisse. Vous pouvez payer par carte de credit, virement bancaire ou d\'autres methodes disponibles.', es: 'Simplemente explore nuestros productos, agregue articulos a su carrito y proceda al pago. Puede pagar con tarjeta de credito, transferencia bancaria u otros metodos disponibles.' },
              },
              {
                title: { en: 'What is your return policy?', tr: 'Iade politikaniz nedir?', de: 'Was ist Ihre Rueckgaberichtlinie?', fr: 'Quelle est votre politique de retour ?', es: 'Cual es su politica de devolucion?' },
                content: { en: 'We accept returns within 14 days of delivery. Items must be unused and in their original packaging. Contact our support team to initiate a return.', tr: '14 gun icinde iade kabul ediyoruz. Urunler kullanilmamis ve orijinal ambalajinda olmalidir. Iade baslatmak icin destek ekibimizle iletisime gecin.', de: 'Wir akzeptieren Ruecksendungen innerhalb von 14 Tagen nach Lieferung. Artikel muessen unbenutzt und in der Originalverpackung sein. Kontaktieren Sie unser Support-Team.', fr: 'Nous acceptons les retours dans les 14 jours suivant la livraison. Les articles doivent etre inutilises et dans leur emballage d\'origine. Contactez notre equipe d\'assistance.', es: 'Aceptamos devoluciones dentro de los 14 dias posteriores a la entrega. Los articulos deben estar sin usar y en su empaque original. Contacte a nuestro equipo de soporte.' },
              },
              {
                title: { en: 'How long does shipping take?', tr: 'Kargo ne kadar surer?', de: 'Wie lange dauert der Versand?', fr: 'Combien de temps prend la livraison ?', es: 'Cuanto tarda el envio?' },
                content: { en: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days. International orders may take 7-14 days depending on the destination.', tr: 'Standart kargo 3-5 is gunu surer. Hizli kargo 1-2 is gunu icin mevcuttur. Uluslararasi siparisler hedefe bagli olarak 7-14 gun surebilir.', de: 'Der Standardversand dauert 3-5 Werktage. Expressversand ist in 1-2 Werktagen verfuegbar. Internationale Bestellungen koennen je nach Zielort 7-14 Tage dauern.', fr: 'La livraison standard prend 3 a 5 jours ouvrables. La livraison express est disponible en 1 a 2 jours ouvrables. Les commandes internationales peuvent prendre 7 a 14 jours.', es: 'El envio estandar toma 3-5 dias habiles. El envio express esta disponible en 1-2 dias habiles. Los pedidos internacionales pueden tardar 7-14 dias segun el destino.' },
              },
              {
                title: { en: 'Do you offer international shipping?', tr: 'Uluslararasi kargo yapiyor musunuz?', de: 'Bieten Sie internationalen Versand an?', fr: 'Proposez-vous la livraison internationale ?', es: 'Ofrecen envio internacional?' },
                content: { en: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. You can see the exact cost at checkout.', tr: 'Evet, dunya genelinde cogu ulkeye kargo yapiyoruz. Kargo ucretleri ve teslimat sureleri hedefe gore degisir. Tam maliyeti odeme sayfasinda gorebilirsiniz.', de: 'Ja, wir versenden in die meisten Laender weltweit. Versandkosten und Lieferzeiten variieren je nach Zielort. Die genauen Kosten sehen Sie an der Kasse.', fr: 'Oui, nous expedions dans la plupart des pays du monde. Les frais de livraison et les delais varient selon la destination. Vous pouvez voir le cout exact lors du paiement.', es: 'Si, realizamos envios a la mayoria de los paises del mundo. Los costos de envio y los tiempos de entrega varian segun el destino. Puede ver el costo exacto al pagar.' },
              },
              {
                title: { en: 'How can I track my order?', tr: 'Siparisimi nasil takip edebilirim?', de: 'Wie kann ich meine Bestellung verfolgen?', fr: 'Comment suivre ma commande ?', es: 'Como puedo rastrear mi pedido?' },
                content: { en: 'Once your order is shipped, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.', tr: 'Siparisiz kargoya verildiginde, e-posta ile bir takip numarasi alacaksiniz. Bu numarayi web sitemizde veya kargo sirketinin web sitesinde kullanabilirsiniz.', de: 'Sobald Ihre Bestellung versandt wurde, erhalten Sie eine Sendungsverfolgungsnummer per E-Mail. Mit dieser Nummer koennen Sie Ihr Paket auf unserer Website oder der Website des Spediteurs verfolgen.', fr: 'Une fois votre commande expediee, vous recevrez un numero de suivi par email. Vous pouvez utiliser ce numero pour suivre votre colis sur notre site ou sur le site du transporteur.', es: 'Una vez que se envie su pedido, recibira un numero de seguimiento por correo electronico. Puede usar este numero para rastrear su paquete en nuestro sitio web o en el sitio del transportista.' },
              },
            ],
          },
        },
      ],
    },
    isPublished: true,
    seoMeta: {
      en: 'FAQ — Answers to frequently asked questions about our store.',
      tr: 'SSS — Magazamiz hakkinda sikca sorulan sorularin cevaplari.',
      de: 'FAQ — Antworten auf haeufig gestellte Fragen zu unserem Shop.',
      fr: 'FAQ — Reponses aux questions frequentes sur notre boutique.',
      es: 'FAQ — Respuestas a preguntas frecuentes sobre nuestra tienda.',
    },
  },
  {
    slug: 'categories',
    title: {
      en: 'All Categories',
      tr: 'Tum Kategoriler',
      de: 'Alle Kategorien',
      fr: 'Toutes les categories',
      es: 'Todas las categorias',
    },
    content: {
      version: 1,
      blocks: [
        {
          id: 'seed_categories_heading',
          type: 'text',
          props: {
            tag: 'h1',
            content: {
              en: 'All Categories',
              tr: 'Tum Kategoriler',
              de: 'Alle Kategorien',
              fr: 'Toutes les categories',
              es: 'Todas las categorias',
            },
          },
          style: { textAlign: 'center', padding: '2rem 0 1rem' },
        },
        {
          id: 'seed_categories_listing',
          type: 'category-listing',
          props: { columns: 3 },
        },
      ],
    },
    isPublished: true,
    seoMeta: {
      en: 'Categories — Browse all product categories.',
      tr: 'Kategoriler — Tum urun kategorilerine gozatin.',
      de: 'Kategorien — Durchsuchen Sie alle Produktkategorien.',
      fr: 'Categories — Parcourez toutes les categories de produits.',
      es: 'Categorias — Explore todas las categorias de productos.',
    },
  },
];

// ---------------------------------------------------------------------------
// Common Customers
// ---------------------------------------------------------------------------

export const commonCustomers: SeedCustomer[] = [
  {
    email: 'sarah.johnson@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1-555-0101',
    locale: 'en',
    addresses: [{
      firstName: 'Sarah', lastName: 'Johnson',
      address1: '742 Evergreen Terrace', city: 'Springfield', postalCode: '62704', country: 'US', phone: '+1-555-0101',
    }],
  },
  {
    email: 'mehmet.yilmaz@example.com',
    firstName: 'Mehmet',
    lastName: 'Yilmaz',
    phone: '+90-532-555-0102',
    locale: 'tr',
    addresses: [{
      firstName: 'Mehmet', lastName: 'Yilmaz',
      address1: 'Istiklal Caddesi No: 45', city: 'Istanbul', postalCode: '34430', country: 'TR', phone: '+90-532-555-0102',
    }],
  },
  {
    email: 'anna.mueller@example.com',
    firstName: 'Anna',
    lastName: 'Mueller',
    phone: '+49-170-555-0103',
    locale: 'de',
    addresses: [{
      firstName: 'Anna', lastName: 'Mueller',
      address1: 'Friedrichstrasse 123', city: 'Berlin', postalCode: '10117', country: 'DE', phone: '+49-170-555-0103',
    }],
  },
  {
    email: 'marie.dubois@example.com',
    firstName: 'Marie',
    lastName: 'Dubois',
    phone: '+33-6-55-01-04',
    locale: 'fr',
    addresses: [{
      firstName: 'Marie', lastName: 'Dubois',
      address1: '15 Rue de Rivoli', city: 'Paris', postalCode: '75001', country: 'FR', phone: '+33-6-55-01-04',
    }],
  },
  {
    email: 'carlos.garcia@example.com',
    firstName: 'Carlos',
    lastName: 'Garcia',
    phone: '+34-655-010-105',
    locale: 'es',
    addresses: [{
      firstName: 'Carlos', lastName: 'Garcia',
      address1: 'Gran Via 28', city: 'Madrid', postalCode: '28013', country: 'ES', phone: '+34-655-010-105',
    }],
  },
];

// ---------------------------------------------------------------------------
// Common Orders — productSlugs left empty; seeder auto-assigns from available products
// ---------------------------------------------------------------------------

export const commonOrders: SeedOrder[] = [
  { status: 'pending', paymentStatus: 'pending', paymentMethod: 'credit_card', locale: 'en', currency: 'USD', customerIndex: 0, productSlugs: [], quantities: [] },
  { status: 'pending', paymentStatus: 'pending', paymentMethod: 'bank_transfer', locale: 'tr', currency: 'TRY', customerIndex: 1, productSlugs: [], quantities: [] },
  { status: 'confirmed', paymentStatus: 'paid', paymentMethod: 'credit_card', locale: 'de', currency: 'EUR', customerIndex: 2, productSlugs: [], quantities: [] },
  { status: 'confirmed', paymentStatus: 'paid', paymentMethod: 'credit_card', locale: 'fr', currency: 'EUR', customerIndex: 3, productSlugs: [], quantities: [] },
  { status: 'processing', paymentStatus: 'paid', paymentMethod: 'credit_card', locale: 'es', currency: 'EUR', customerIndex: 4, productSlugs: [], quantities: [] },
  { status: 'shipped', paymentStatus: 'paid', paymentMethod: 'credit_card', locale: 'en', currency: 'USD', customerIndex: 0, productSlugs: [], quantities: [] },
  { status: 'shipped', paymentStatus: 'paid', paymentMethod: 'bank_transfer', locale: 'tr', currency: 'TRY', customerIndex: 1, productSlugs: [], quantities: [] },
  { status: 'delivered', paymentStatus: 'paid', paymentMethod: 'credit_card', locale: 'de', currency: 'EUR', customerIndex: 2, productSlugs: [], quantities: [] },
];

// ---------------------------------------------------------------------------
// Common Settings
// ---------------------------------------------------------------------------

export const commonSettings: SeedSetting[] = [
  { key: 'contact_email', value: 'info@example.com', group: 'contact' },
  { key: 'contact_phone', value: '+1 (555) 000-0000', group: 'contact' },
];
