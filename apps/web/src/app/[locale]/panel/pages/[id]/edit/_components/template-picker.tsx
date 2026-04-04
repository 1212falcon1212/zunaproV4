'use client';

import { Button } from '@zunapro/ui';
import { X, FileText, Layout, MessageSquare, Phone, HelpCircle } from 'lucide-react';
import { PAGE_TEMPLATES } from '@zunapro/themes/templates';
import type { PageContent } from '@zunapro/types';

interface TemplatePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (content: PageContent) => void;
  locale: string;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  blank: <FileText className="h-8 w-8" />,
  landing: <Layout className="h-8 w-8" />,
  about: <MessageSquare className="h-8 w-8" />,
  contact: <Phone className="h-8 w-8" />,
  faq: <HelpCircle className="h-8 w-8" />,
};

export function TemplatePicker({
  open,
  onClose,
  onSelect,
  locale,
}: TemplatePickerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Choose a Template</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
          {PAGE_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                onSelect(template.content);
                onClose();
              }}
              className="flex flex-col items-center gap-3 rounded-lg border-2 border-slate-200 p-6 text-center transition-all hover:border-violet-400 hover:bg-violet-50"
            >
              <div className="text-slate-400">
                {TEMPLATE_ICONS[template.id] || <FileText className="h-8 w-8" />}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {template.name[locale] ?? template.name.en}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {template.description[locale] ?? template.description.en}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
