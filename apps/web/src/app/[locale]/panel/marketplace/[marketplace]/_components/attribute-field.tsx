'use client';

import { memo, useState } from 'react';
import { Input } from '@zunapro/ui';

interface AttributeValue {
  id: number;
  name: string;
}

interface AttributeFieldProps {
  name: string;
  required: boolean;
  allowCustom: boolean;
  values: AttributeValue[];
  value: string;
  valueId?: string;
  onChange: (value: string, valueId?: string) => void;
}

export const AttributeField = memo(function AttributeField({
  name,
  required,
  allowCustom,
  values,
  value,
  onChange,
}: AttributeFieldProps) {
  const [customMode, setCustomMode] = useState(false);

  // Mode 1: Has enum values
  if (values.length > 0 && !customMode) {
    const listId = `attr-${name.replace(/\s/g, '-')}-${values.length}`;

    // Large lists (50+): use input + datalist for performance
    if (values.length > 50) {
      return (
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-600">
            {name} {required && <span className="text-rose-500">*</span>}
          </label>
          <input
            list={listId}
            value={value}
            onChange={(e) => {
              const sel = values.find((v) => v.name === e.target.value);
              onChange(e.target.value, sel ? String(sel.id) : undefined);
            }}
            placeholder="Yazarak arayın..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          />
          <datalist id={listId}>
            {values.map((v, i) => (
              <option key={`${v.id}-${i}`} value={v.name} />
            ))}
          </datalist>
        </div>
      );
    }

    // Small lists: native select
    return (
      <div>
        <label className="mb-1 block text-[10px] font-medium text-slate-600">
          {name} {required && <span className="text-rose-500">*</span>}
        </label>
        <select
          value={value}
          onChange={(e) => {
            if (e.target.value === '__custom__') {
              setCustomMode(true);
              onChange('');
              return;
            }
            const sel = values.find((v) => v.name === e.target.value);
            onChange(e.target.value, sel ? String(sel.id) : undefined);
          }}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
        >
          <option value="">Seciniz...</option>
          {values.map((v, i) => (
            <option key={`${v.id}-${i}`} value={v.name}>
              {v.name}
            </option>
          ))}
          {allowCustom && <option value="__custom__">Ozel deger gir...</option>}
        </select>
      </div>
    );
  }

  // Mode 2: Custom text input (allowCustom or selected custom from select)
  if (allowCustom || customMode) {
    return (
      <div>
        <label className="mb-1 block text-[10px] font-medium text-slate-600">
          {name} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex gap-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`${name} girin...`}
            className="h-9 text-sm"
          />
          {values.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setCustomMode(false);
                onChange('');
              }}
              className="shrink-0 rounded-lg border border-slate-200 px-2 text-[10px] text-slate-500 hover:bg-slate-50"
            >
              Listeden
            </button>
          )}
        </div>
      </div>
    );
  }

  // Mode 3: No values, no custom allowed
  return (
    <div>
      <label className="mb-1 block text-[10px] font-medium text-slate-600">
        {name} {required && <span className="text-rose-500">*</span>}
      </label>
      <p className="flex h-9 items-center text-xs italic text-slate-400">
        Deger listesi yok
      </p>
    </div>
  );
});
