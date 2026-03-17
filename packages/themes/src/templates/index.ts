import type { PageContent } from '@zunapro/types';

export interface PageTemplate {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  thumbnail?: string;
  content: PageContent;
}

const blank: PageTemplate = {
  id: 'blank',
  name: { en: 'Blank Page', tr: 'Bos Sayfa', de: 'Leere Seite', fr: 'Page Vierge', es: 'Pagina en Blanco' },
  description: { en: 'Start from scratch', tr: 'Sifirdan baslat', de: 'Von vorne beginnen', fr: 'Commencer de zero', es: 'Empezar desde cero' },
  content: { version: 1, blocks: [] },
};

const landing: PageTemplate = {
  id: 'landing',
  name: { en: 'Landing Page', tr: 'Tanitim Sayfasi', de: 'Landing Page', fr: 'Page de destination', es: 'Pagina de aterrizaje' },
  description: { en: 'Hero, features, and CTA', tr: 'Hero, ozellikler ve CTA', de: 'Hero, Features und CTA', fr: 'Hero, fonctionnalites et CTA', es: 'Hero, caracteristicas y CTA' },
  content: {
    version: 1,
    blocks: [
      {
        id: 'tmpl_hero_1',
        type: 'hero',
        props: {
          title: { en: 'Welcome to Our Store', tr: 'Magazamiza Hosgeldiniz', de: 'Willkommen in unserem Shop', fr: 'Bienvenue dans notre boutique', es: 'Bienvenido a nuestra tienda' },
          subtitle: { en: 'Discover amazing products at great prices', tr: 'Harika urunleri uygun fiyatlarla kesfedin', de: 'Entdecken Sie erstaunliche Produkte zu tollen Preisen', fr: 'Decouvrez des produits incroyables a des prix attractifs', es: 'Descubre productos increibles a excelentes precios' },
          buttonText: { en: 'Shop Now', tr: 'Alisverise Basla', de: 'Jetzt einkaufen', fr: 'Acheter maintenant', es: 'Comprar ahora' },
          buttonLink: '/products',
        },
      },
      { id: 'tmpl_spacer_1', type: 'spacer', props: { height: '3rem' } },
      {
        id: 'tmpl_products_1',
        type: 'product-showcase',
        props: {
          title: { en: 'Featured Products', tr: 'One Cikan Urunler', de: 'Empfohlene Produkte', fr: 'Produits en vedette', es: 'Productos destacados' },
          limit: 8,
          columns: 4,
        },
      },
      { id: 'tmpl_spacer_2', type: 'spacer', props: { height: '2rem' } },
      {
        id: 'tmpl_categories_1',
        type: 'category-showcase',
        props: {
          title: { en: 'Shop by Category', tr: 'Kategorilere Goz At', de: 'Nach Kategorie einkaufen', fr: 'Acheter par categorie', es: 'Comprar por categoria' },
          limit: 4,
          columns: 4,
        },
      },
      { id: 'tmpl_spacer_3', type: 'spacer', props: { height: '2rem' } },
      {
        id: 'tmpl_banner_1',
        type: 'banner',
        props: {
          title: { en: 'Free Shipping on Orders Over $50', tr: '50$ Ustu Siparislerde Ucretsiz Kargo', de: 'Kostenloser Versand ab 50$', fr: 'Livraison gratuite a partir de 50$', es: 'Envio gratis en pedidos superiores a 50$' },
          subtitle: { en: 'Limited time offer', tr: 'Sinirli sureli teklif', de: 'Zeitlich begrenztes Angebot', fr: 'Offre limitee', es: 'Oferta por tiempo limitado' },
          buttonText: { en: 'Learn More', tr: 'Detaylari Gor', de: 'Mehr erfahren', fr: 'En savoir plus', es: 'Mas informacion' },
          buttonLink: '/pages/shipping',
        },
      },
    ],
  },
};

const about: PageTemplate = {
  id: 'about',
  name: { en: 'About Us', tr: 'Hakkimizda', de: 'Uber uns', fr: 'A propos', es: 'Sobre nosotros' },
  description: { en: 'Company introduction page', tr: 'Sirket tanitim sayfasi', de: 'Firmenvorstellungsseite', fr: 'Page de presentation', es: 'Pagina de presentacion' },
  content: {
    version: 1,
    blocks: [
      {
        id: 'tmpl_about_hero',
        type: 'hero',
        props: {
          title: { en: 'About Our Company', tr: 'Sirketimiz Hakkinda', de: 'Uber unser Unternehmen', fr: 'A propos de notre entreprise', es: 'Sobre nuestra empresa' },
          subtitle: { en: 'Our story, mission, and values', tr: 'Hikayemiz, misyonumuz ve degerlerimiz', de: 'Unsere Geschichte, Mission und Werte', fr: 'Notre histoire, mission et valeurs', es: 'Nuestra historia, mision y valores' },
        },
      },
      { id: 'tmpl_about_spacer', type: 'spacer', props: { height: '3rem' } },
      {
        id: 'tmpl_about_text',
        type: 'text',
        props: {
          content: { en: '<p>We are a passionate team dedicated to bringing you the best products. Our journey started with a simple mission: to make quality accessible to everyone.</p>', tr: '<p>Size en iyi urunleri sunmaya adanmis tutkulu bir ekibiz. Yolculugumuz basit bir misyonla basladi: kaliteyi herkes icin erisilebilir kilmak.</p>' },
          tag: 'p',
        },
        style: { maxWidth: '800px', margin: '0 auto' },
      },
      { id: 'tmpl_about_spacer2', type: 'spacer', props: { height: '2rem' } },
      {
        id: 'tmpl_about_cols',
        type: 'columns',
        props: { columns: 3, gap: '2rem' },
        children: [
          {
            id: 'tmpl_about_col1',
            type: 'container',
            props: {},
            children: [
              { id: 'tmpl_about_v1', type: 'text', props: { content: { en: '<strong>Quality</strong><br/>We source only the finest materials and products.', tr: '<strong>Kalite</strong><br/>Sadece en kaliteli malzeme ve urunleri seciyoruz.' }, tag: 'p' } },
            ],
          },
          {
            id: 'tmpl_about_col2',
            type: 'container',
            props: {},
            children: [
              { id: 'tmpl_about_v2', type: 'text', props: { content: { en: '<strong>Service</strong><br/>Customer satisfaction is our top priority.', tr: '<strong>Hizmet</strong><br/>Musteri memnuniyeti en oncelikli hedefimizdir.' }, tag: 'p' } },
            ],
          },
          {
            id: 'tmpl_about_col3',
            type: 'container',
            props: {},
            children: [
              { id: 'tmpl_about_v3', type: 'text', props: { content: { en: '<strong>Innovation</strong><br/>We constantly evolve to serve you better.', tr: '<strong>Inovasyon</strong><br/>Size daha iyi hizmet vermek icin surekli gelisiyoruz.' }, tag: 'p' } },
            ],
          },
        ],
      },
    ],
  },
};

const contact: PageTemplate = {
  id: 'contact',
  name: { en: 'Contact Us', tr: 'Iletisim', de: 'Kontakt', fr: 'Contactez-nous', es: 'Contactenos' },
  description: { en: 'Contact information and form', tr: 'Iletisim bilgileri ve formu', de: 'Kontaktinformationen', fr: 'Informations de contact', es: 'Informacion de contacto' },
  content: {
    version: 1,
    blocks: [
      {
        id: 'tmpl_contact_hero',
        type: 'hero',
        props: {
          title: { en: 'Get in Touch', tr: 'Bize Ulasin', de: 'Kontaktieren Sie uns', fr: 'Contactez-nous', es: 'Contactenos' },
          subtitle: { en: 'We\'d love to hear from you', tr: 'Sizden haber almak isteriz', de: 'Wir freuen uns von Ihnen zu horen', fr: 'Nous aimerions avoir de vos nouvelles', es: 'Nos encantaria saber de usted' },
        },
      },
      { id: 'tmpl_contact_spacer', type: 'spacer', props: { height: '3rem' } },
      {
        id: 'tmpl_contact_cols',
        type: 'columns',
        props: { columns: 2, gap: '3rem' },
        children: [
          {
            id: 'tmpl_contact_info',
            type: 'container',
            props: {},
            children: [
              { id: 'tmpl_contact_t1', type: 'text', props: { content: { en: '<h3>Contact Information</h3><p>Email: info@example.com<br/>Phone: +1 (555) 123-4567<br/>Address: 123 Main Street</p>', tr: '<h3>Iletisim Bilgileri</h3><p>E-posta: info@example.com<br/>Telefon: +90 (212) 123 45 67<br/>Adres: Ornek Caddesi No: 123</p>' }, tag: 'p' } },
            ],
          },
          {
            id: 'tmpl_contact_form',
            type: 'container',
            props: {},
            children: [
              { id: 'tmpl_contact_html', type: 'html', props: { html: { en: '<p>Please email us or call during business hours.</p><p><strong>Business Hours:</strong><br/>Mon-Fri: 9:00 AM - 6:00 PM<br/>Sat: 10:00 AM - 4:00 PM<br/>Sun: Closed</p>', tr: '<p>Lutfen bize e-posta gonderin veya mesai saatlerinde arayin.</p><p><strong>Calisma Saatleri:</strong><br/>Pzt-Cum: 09:00 - 18:00<br/>Cts: 10:00 - 16:00<br/>Paz: Kapali</p>' } } },
            ],
          },
        ],
      },
    ],
  },
};

const faq: PageTemplate = {
  id: 'faq',
  name: { en: 'FAQ', tr: 'SSS', de: 'FAQ', fr: 'FAQ', es: 'Preguntas frecuentes' },
  description: { en: 'Frequently asked questions', tr: 'Sik sorulan sorular', de: 'Haufig gestellte Fragen', fr: 'Foire aux questions', es: 'Preguntas frecuentes' },
  content: {
    version: 1,
    blocks: [
      {
        id: 'tmpl_faq_hero',
        type: 'hero',
        props: {
          title: { en: 'Frequently Asked Questions', tr: 'Sik Sorulan Sorular', de: 'Haufig gestellte Fragen', fr: 'Foire aux questions', es: 'Preguntas frecuentes' },
        },
      },
      { id: 'tmpl_faq_spacer', type: 'spacer', props: { height: '3rem' } },
      {
        id: 'tmpl_faq_accordion',
        type: 'accordion',
        props: {
          title: { en: 'Common Questions', tr: 'Genel Sorular' },
          items: [
            { title: { en: 'How do I track my order?', tr: 'Siparisimi nasil takip edebilirim?' }, content: { en: 'You can track your order from your account dashboard or using the tracking link sent to your email.', tr: 'Siparisini hesap panelinizden veya e-postaniza gonderilen takip linkinden takip edebilirsiniz.' } },
            { title: { en: 'What is your return policy?', tr: 'Iade politikaniz nedir?' }, content: { en: 'We offer a 30-day return policy for all unused items in their original packaging.', tr: 'Orijinal ambalajindaki tum kullanilmamis urunler icin 30 gunluk iade politikasi sunuyoruz.' } },
            { title: { en: 'How long does shipping take?', tr: 'Kargo ne kadar surede gelir?' }, content: { en: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.', tr: 'Standart kargo 3-5 is gunu surer. 1-2 gunluk teslimat icin hizli kargo secenegi mevcuttur.' } },
            { title: { en: 'Do you ship internationally?', tr: 'Yurt disina kargo yapiyor musunuz?' }, content: { en: 'Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days.', tr: 'Evet, dunya genelinde cogu ulkeye kargo yapiyoruz. Uluslararasi kargo genellikle 7-14 is gunu surer.' } },
          ],
          allowMultiple: true,
        },
        style: { maxWidth: '800px', margin: '0 auto' },
      },
    ],
  },
};

export const PAGE_TEMPLATES: PageTemplate[] = [blank, landing, about, contact, faq];

export function getTemplate(id: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.id === id);
}
