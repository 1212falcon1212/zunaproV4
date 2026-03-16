import type { SeedPage, SeedSetting } from './types';
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
// Common Settings
// ---------------------------------------------------------------------------

export const commonSettings: SeedSetting[] = [
  { key: 'contact_email', value: 'info@example.com', group: 'contact' },
  { key: 'contact_phone', value: '+1 (555) 000-0000', group: 'contact' },
];
