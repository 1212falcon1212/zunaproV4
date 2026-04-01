'use client';

import { useState } from 'react';
import { Button, Input } from '@zunapro/ui';
import { Plus, X } from 'lucide-react';

interface ProductAttributeData {
  name: string;
  value: string;
}

interface AttributeEditorProps {
  attributes: ProductAttributeData[];
  onChange: (attributes: ProductAttributeData[]) => void;
}

export function AttributeEditor({ attributes, onChange }: AttributeEditorProps) {
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  const addAttribute = () => {
    if (!newName.trim() || !newValue.trim()) return;
    if (attributes.some(a => a.name === newName.trim())) {
      onChange(attributes.map(a => a.name === newName.trim() ? { ...a, value: newValue.trim() } : a));
    } else {
      onChange([...attributes, { name: newName.trim(), value: newValue.trim() }]);
    }
    setNewName('');
    setNewValue('');
  };

  const removeAttribute = (name: string) => {
    onChange(attributes.filter(a => a.name !== name));
  };

  return (
    <div className="space-y-3">
      {attributes.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Özellik</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Değer</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {attributes.map((attr) => (
                <tr key={attr.name}>
                  <td className="px-3 py-2 font-medium text-slate-700">{attr.name}</td>
                  <td className="px-3 py-2 text-slate-600">{attr.value}</td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => removeAttribute(attr.name)} className="text-slate-400 hover:text-rose-500">
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Özellik adı" className="flex-1 h-8 text-xs" />
        <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Değer" className="flex-1 h-8 text-xs" />
        <Button type="button" variant="outline" size="sm" onClick={addAttribute} className="shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" /> Ekle
        </Button>
      </div>
    </div>
  );
}
