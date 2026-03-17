import { getTranslations } from 'next-intl/server';

interface SpecsTableProps {
  specs: Record<string, string>;
}

export async function SpecsTable({ specs }: SpecsTableProps) {
  const t = await getTranslations('storefront.themes.teknoloji');

  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <div className="mt-6">
      <h3
        className="text-lg font-semibold text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('specifications')}
      </h3>
      <div className="mt-3 overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <tbody>
            {entries.map(([key, value], i) => (
              <tr key={key} className={i % 2 === 0 ? 'bg-[var(--color-muted)]' : 'bg-[var(--color-background)]'}>
                <td className="px-4 py-2.5 font-medium text-[var(--color-secondary)]">{key}</td>
                <td className="px-4 py-2.5 text-[var(--color-foreground)]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
