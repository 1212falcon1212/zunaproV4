import { useTranslations } from 'next-intl';

export default function WizardPage() {
  const t = useTranslations('wizard');

  const steps = [
    'package',
    'storeInfo',
    'domain',
    'visual',
    'payment',
    'setup',
  ] as const;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <ol className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-3 rounded-lg border px-6 py-4 text-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              {index + 1}
            </span>
            <span>{t(`steps.${step}`)}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
