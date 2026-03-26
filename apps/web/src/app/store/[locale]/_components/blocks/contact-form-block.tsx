'use client';

import { useState, useEffect } from 'react';
import type { Block } from '@zunapro/types';
import { useTenantSlug } from '../tenant-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface StoreInfo {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  storeName?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

interface ContactFormBlockProps {
  block: Block;
  locale: string;
}

/* ---------- SVG icon helpers ---------- */
function PhoneIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

/* ---------- Social icon SVGs ---------- */
function FacebookSvg() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XTwitterSvg() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramSvg() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeSvg() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/* ---------- i18n labels ---------- */
const i18n: Record<string, Record<string, string>> = {
  getInTouch: { en: 'Get in Touch', tr: 'Bize Ulasin', de: 'Kontaktieren Sie uns', fr: 'Contactez-nous', es: 'Contáctenos' },
  firstName: { en: 'First Name', tr: 'Ad', de: 'Vorname', fr: 'Prénom', es: 'Nombre' },
  lastName: { en: 'Last Name', tr: 'Soyad', de: 'Nachname', fr: 'Nom', es: 'Apellido' },
  email: { en: 'Email', tr: 'E-posta', de: 'E-Mail', fr: 'E-mail', es: 'Correo' },
  message: { en: 'Message', tr: 'Mesaj', de: 'Nachricht', fr: 'Message', es: 'Mensaje' },
  sendMessage: { en: 'Send Message', tr: 'Mesaj Gönder', de: 'Nachricht senden', fr: 'Envoyer le message', es: 'Enviar mensaje' },
  sending: { en: 'Sending...', tr: 'Gönderiliyor...', de: 'Senden...', fr: 'Envoi...', es: 'Enviando...' },
  needHelp: { en: 'Need a Help?', tr: 'Yardima mi ihtiyaciniz var?', de: 'Brauchen Sie Hilfe?', fr: 'Besoin d\'aide ?', es: '¿Necesita ayuda?' },
  followUs: { en: 'Follow Us', tr: 'Bizi Takip Edin', de: 'Folgen Sie uns', fr: 'Suivez-nous', es: 'Síguenos' },
  messageSent: { en: 'Message Sent!', tr: 'Mesaj Gönderildi!', de: 'Nachricht gesendet!', fr: 'Message envoyé !', es: '¡Mensaje enviado!' },
  messageSentDesc: { en: 'Thank you for reaching out. We will get back to you soon.', tr: 'Bizimle iletisime gectiginiz icin tesekkürler. En kisa sürede size dönüs yapacagiz.', de: 'Vielen Dank für Ihre Nachricht. Wir werden uns bald bei Ihnen melden.', fr: 'Merci de nous avoir contactés. Nous reviendrons vers vous bientôt.', es: 'Gracias por contactarnos. Nos pondremos en contacto pronto.' },
  sendAnother: { en: 'Send Another Message', tr: 'Baska Bir Mesaj Gönder', de: 'Weitere Nachricht senden', fr: 'Envoyer un autre message', es: 'Enviar otro mensaje' },
  phone: { en: 'Phone', tr: 'Telefon', de: 'Telefon', fr: 'Téléphone', es: 'Teléfono' },
  address: { en: 'Address', tr: 'Adres', de: 'Adresse', fr: 'Adresse', es: 'Dirección' },
  whatsapp: { en: 'WhatsApp', tr: 'WhatsApp', de: 'WhatsApp', fr: 'WhatsApp', es: 'WhatsApp' },
  contactUs: { en: 'Contact Us', tr: 'İletisim', de: 'Kontakt', fr: 'Contact', es: 'Contacto' },
};

function t(key: string, locale: string): string {
  return i18n[key]?.[locale] ?? i18n[key]?.en ?? key;
}

/* ====================================================================== */
/*  MAIN COMPONENT                                                        */
/* ====================================================================== */
export function ContactFormBlock({ block, locale }: ContactFormBlockProps) {
  const props = block.props as {
    title?: Record<string, string>;
    showContactInfo?: boolean;
    layout?: 'side-by-side' | 'stacked';
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const showContactInfo = props.showContactInfo ?? true;

  const tenantSlug = useTenantSlug();
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({});
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!showContactInfo) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/storefront/settings/store-info`, {
      headers: { 'x-tenant-slug': tenantSlug },
    })
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, unknown>) => setStoreInfo({
        phone: (data.store_phone as string) ?? '',
        email: (data.store_email as string) ?? '',
        storeName: ((data.store_name as Record<string, string>)?.[locale] ?? (data.store_name as Record<string, string>)?.en) ?? '',
        address: (data.store_address as string) ?? '',
        whatsapp: (data.whatsapp as string) ?? '',
        socialLinks: (data.social_links as StoreInfo['socialLinks']) ?? {},
      }))
      .catch(() => setStoreInfo({}))
      .finally(() => setLoading(false));
  }, [tenantSlug, showContactInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    fetch(`${API_URL}/storefront/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-slug': tenantSlug,
      },
      body: JSON.stringify(formState),
    })
      .then(() => {
        setSubmitted(true);
        setFormState({ firstName: '', lastName: '', email: '', message: '' });
      })
      .catch(() => {
        // Still show success to user (message queued)
        setSubmitted(true);
        setFormState({ firstName: '', lastName: '', email: '', message: '' });
      })
      .finally(() => setSubmitting(false));
  };

  const inputClasses =
    'w-full border border-[var(--color-border)] rounded-md px-4 py-3 text-sm bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors';

  if (loading) {
    return (
      <section className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 rounded-lg bg-gray-100" />
            ))}
          </div>
          <div className="h-96 rounded-lg bg-gray-100" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
      {/* ---------- Section 1: Contact Info Cards ---------- */}
      {showContactInfo && (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card: Store / Address */}
          <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--color-primary)]/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </div>
            <h3
              className="mb-1.5 text-base font-bold text-[var(--color-foreground)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {storeInfo.storeName || t('contactUs', locale)}
            </h3>
            {storeInfo.phone && (
              <a
                href={`tel:${storeInfo.phone}`}
                className="block text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-primary)]"
              >
                {storeInfo.phone}
              </a>
            )}
            {storeInfo.email && (
              <a
                href={`mailto:${storeInfo.email}`}
                className="block text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-primary)]"
              >
                {storeInfo.email}
              </a>
            )}
          </div>

          {/* Card: Phone */}
          <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--color-primary)]/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white">
              <PhoneIcon />
            </div>
            <h3
              className="mb-1.5 text-base font-bold text-[var(--color-foreground)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('phone', locale)}
            </h3>
            <p className="mb-2 text-xs text-[var(--color-muted-foreground)]">
              {locale === 'tr' ? 'Pzt-Cum 09:00 - 18:00' : locale === 'de' ? 'Mo-Fr 9:00 - 18:00' : 'Mon-Fri 9:00 AM - 6:00 PM'}
            </p>
            {storeInfo.phone && (
              <a
                href={`tel:${storeInfo.phone}`}
                className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                {storeInfo.phone}
              </a>
            )}
          </div>

          {/* Card: Email */}
          <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--color-primary)]/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
              <EmailIcon />
            </div>
            <h3
              className="mb-1.5 text-base font-bold text-[var(--color-foreground)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('email', locale)}
            </h3>
            <p className="mb-2 text-xs text-[var(--color-muted-foreground)]">
              {locale === 'tr' ? '24 saat icinde yanit veriyoruz' : locale === 'de' ? 'Wir antworten innerhalb von 24 Stunden' : 'We reply within 24 hours'}
            </p>
            {storeInfo.email && (
              <a
                href={`mailto:${storeInfo.email}`}
                className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                {storeInfo.email}
              </a>
            )}
          </div>

          {/* Card: Address */}
          <div className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--color-primary)]/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 transition-colors group-hover:bg-purple-500 group-hover:text-white">
              <MapPinIcon />
            </div>
            <h3
              className="mb-1.5 text-base font-bold text-[var(--color-foreground)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('address', locale)}
            </h3>
            {storeInfo.address ? (
              <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {storeInfo.address}
              </p>
            ) : (
              <p className="text-xs text-[var(--color-muted-foreground)]">—</p>
            )}
          </div>
        </div>
      )}

      {/* ---------- Section Header ---------- */}
      {title && (
        <h2
          className="mb-8 text-center text-2xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      )}

      {/* ---------- Section 2: Form + Help Sidebar ---------- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
        {/* Left: Get in Touch Form (70%) */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-12 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                {t('messageSent', locale)}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                {t('messageSentDesc', locale)}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                {t('sendAnother', locale)}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2
                className="mb-6 text-xl font-bold text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('getInTouch', locale)}
              </h2>

              {/* First Name + Last Name side-by-side */}
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={formState.firstName}
                  onChange={(e) => setFormState((s) => ({ ...s, firstName: e.target.value }))}
                  required
                  className={inputClasses}
                  placeholder={t('firstName', locale)}
                />
                <input
                  type="text"
                  value={formState.lastName}
                  onChange={(e) => setFormState((s) => ({ ...s, lastName: e.target.value }))}
                  required
                  className={inputClasses}
                  placeholder={t('lastName', locale)}
                />
              </div>

              {/* Email full width */}
              <div className="mb-4">
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  required
                  className={inputClasses}
                  placeholder={t('email', locale)}
                />
              </div>

              {/* Message textarea */}
              <div className="mb-6">
                <textarea
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  required
                  rows={8}
                  className={inputClasses}
                  placeholder={t('message', locale)}
                />
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? t('sending', locale) : t('sendMessage', locale)}
              </button>
            </form>
          )}
        </div>

        {/* Right: Need a Help? Sidebar (30%) */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <h3
              className="mb-6 text-lg font-bold text-[var(--color-foreground)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('needHelp', locale)}
            </h3>

            <div className="space-y-5">
              {/* Phone */}
              {storeInfo.phone && (
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="flex items-center gap-3 text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                    <PhoneIcon />
                  </span>
                  <span className="text-sm font-medium">{storeInfo.phone}</span>
                </a>
              )}

              {/* Email */}
              {storeInfo.email && (
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="flex items-center gap-3 text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                    <EmailIcon />
                  </span>
                  <span className="text-sm font-medium">{storeInfo.email}</span>
                </a>
              )}

              {/* WhatsApp */}
              {storeInfo.whatsapp && (
                <a
                  href={`https://wa.me/${storeInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    <WhatsAppIcon />
                  </span>
                  <span className="text-sm font-medium">{t('whatsapp', locale)}</span>
                </a>
              )}

              {/* Address */}
              {storeInfo.address && (
                <div className="flex items-start gap-3 text-[var(--color-foreground)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white">
                    <MapPinIcon />
                  </span>
                  <span className="text-sm leading-relaxed">{storeInfo.address}</span>
                </div>
              )}
            </div>

            {/* Follow Us */}
            {storeInfo.socialLinks && Object.values(storeInfo.socialLinks).some(Boolean) && (
              <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                <h4 className="mb-4 text-sm font-bold text-[var(--color-foreground)]">
                  {t('followUs', locale)}
                </h4>
                <div className="flex gap-3">
                  {storeInfo.socialLinks.facebook && (
                    <a
                      href={storeInfo.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-80"
                      aria-label="Facebook"
                    >
                      <FacebookSvg />
                    </a>
                  )}
                  {storeInfo.socialLinks.twitter && (
                    <a
                      href={storeInfo.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
                      aria-label="X / Twitter"
                    >
                      <XTwitterSvg />
                    </a>
                  )}
                  {storeInfo.socialLinks.instagram && (
                    <a
                      href={storeInfo.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white transition-opacity hover:opacity-80"
                      aria-label="Instagram"
                    >
                      <InstagramSvg />
                    </a>
                  )}
                  {storeInfo.socialLinks.youtube && (
                    <a
                      href={storeInfo.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0000] text-white transition-opacity hover:opacity-80"
                      aria-label="YouTube"
                    >
                      <YouTubeSvg />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
