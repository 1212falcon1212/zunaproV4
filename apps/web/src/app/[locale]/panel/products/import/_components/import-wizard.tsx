'use client';

import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';

type Step = 'upload' | 'mapping' | 'preview';

interface ParsedData {
  headers: string[];
  rows: string[][];
}

interface ColumnMapping {
  name: string;
  price: string;
  sku: string;
  stock: string;
  status: string;
  description: string;
  compareAtPrice: string;
  categoryId: string;
  slug: string;
}

const PRODUCT_FIELDS: (keyof ColumnMapping)[] = [
  'name',
  'price',
  'sku',
  'stock',
  'status',
  'description',
  'compareAtPrice',
  'categoryId',
  'slug',
];

const FIELD_ALIASES: Record<string, keyof ColumnMapping> = {
  product_name: 'name',
  productname: 'name',
  title: 'name',
  product: 'name',
  ad: 'name',
  urun_adi: 'name',
  fiyat: 'price',
  preis: 'price',
  prix: 'price',
  precio: 'price',
  compare_at_price: 'compareAtPrice',
  compareatprice: 'compareAtPrice',
  compare_price: 'compareAtPrice',
  stok: 'stock',
  bestand: 'stock',
  quantity: 'stock',
  miktar: 'stock',
  durum: 'status',
  aciklama: 'description',
  beschreibung: 'description',
  kategori: 'categoryId',
  category: 'categoryId',
  category_id: 'categoryId',
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }

  result.push(current.trim());
  return result;
}

function parseCSV(text: string): ParsedData {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).map((line) => parseCSVLine(line));

  return { headers, rows };
}

function autoDetectMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    name: '',
    price: '',
    sku: '',
    stock: '',
    status: '',
    description: '',
    compareAtPrice: '',
    categoryId: '',
    slug: '',
  };

  for (const header of headers) {
    const normalized = header.toLowerCase().replace(/[\s_-]/g, '');

    for (const field of PRODUCT_FIELDS) {
      if (normalized === field.toLowerCase()) {
        mapping[field] = header;
        break;
      }
    }

    if (!Object.values(mapping).includes(header)) {
      const alias = FIELD_ALIASES[normalized] ?? FIELD_ALIASES[header.toLowerCase()];
      if (alias && !mapping[alias]) {
        mapping[alias] = header;
      }
    }
  }

  return mapping;
}

interface ImportResult {
  imported: number;
  failed: number;
  errors?: string[];
}

export function ImportWizard({ locale }: { locale: string }) {
  const t = useTranslations('panel.products.import');

  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({
    name: '',
    price: '',
    sku: '',
    stock: '',
    status: '',
    description: '',
    compareAtPrice: '',
    categoryId: '',
    slug: '',
  });
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setError('');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        setError('Failed to read file');
        return;
      }

      const data = parseCSV(text);
      if (data.headers.length === 0) {
        setError('No data found in file');
        return;
      }

      setParsedData(data);
      const detectedMapping = autoDetectMapping(data.headers);
      setMapping(detectedMapping);
      setStep('mapping');
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      setError('Excel files (.xlsx/.xls) are not supported without external libraries. Please convert to CSV first.');
      return;
    }

    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  const handleMappingChange = useCallback(
    (field: keyof ColumnMapping, value: string) => {
      setMapping((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const buildProducts = useCallback(() => {
    if (!parsedData) return [];

    return parsedData.rows.map((row) => {
      const headerIndex = (header: string) =>
        parsedData.headers.indexOf(header);

      const getValue = (field: keyof ColumnMapping): string => {
        const csvCol = mapping[field];
        if (!csvCol) return '';
        const idx = headerIndex(csvCol);
        return idx >= 0 ? (row[idx] ?? '') : '';
      };

      const nameValue = getValue('name');
      const slugValue =
        getValue('slug') ||
        nameValue
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      const priceStr = getValue('price').replace(',', '.');
      const compareStr = getValue('compareAtPrice').replace(',', '.');
      const stockStr = getValue('stock');

      return {
        name: { [locale]: nameValue } as Record<string, string>,
        slug: slugValue,
        description: getValue('description')
          ? ({ [locale]: getValue('description') } as Record<string, string>)
          : undefined,
        price: priceStr ? parseFloat(priceStr) : 0,
        compareAtPrice: compareStr ? parseFloat(compareStr) : undefined,
        sku: getValue('sku') || undefined,
        stock: stockStr ? parseInt(stockStr, 10) : 0,
        status: getValue('status') || 'draft',
        categoryId: getValue('categoryId') || undefined,
        images: [],
      };
    });
  }, [parsedData, mapping, locale]);

  const handleImport = useCallback(async () => {
    setImporting(true);
    setError('');
    setResult(null);

    try {
      const products = buildProducts();
      if (products.length === 0) {
        setError('No products to import');
        setImporting(false);
        return;
      }

      const response = await panelApi.post<ImportResult>(
        '/products/bulk-import',
        products,
      );

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setImporting(false);
    }
  }, [buildProducts, t]);

  const stepNumber = step === 'upload' ? 1 : step === 'mapping' ? 2 : 3;

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {t('step', { current: stepNumber, total: 3 })}
      </div>

      {/* Step 1: File Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('uploadFile')}
            </h2>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <svg
              className="mb-4 h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm font-medium text-gray-700">{t('dragDrop')}</p>
            <p className="mt-1 text-xs text-gray-500">
              {t('acceptedFormats')}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Column Mapping */}
      {step === 'mapping' && parsedData && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('columnMapping')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {fileName} &mdash; {t('rows', { count: parsedData.rows.length })}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    {t('mapTo')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    {t('csvColumn')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRODUCT_FIELDS.map((field) => (
                  <tr key={field} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {field}
                      {(field === 'name' || field === 'price') && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={mapping[field]}
                        onChange={(e) =>
                          handleMappingChange(field, e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">{t('skip')}</option>
                        {parsedData.headers.map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview first 3 rows */}
          {parsedData.rows.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                {t('preview')}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {parsedData.headers.map((header) => (
                        <th
                          key={header}
                          className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.rows.slice(0, 3).map((row, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="whitespace-nowrap px-4 py-2 text-gray-600"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setStep('upload');
                setParsedData(null);
                setFileName('');
              }}
            >
              {t('back')}
            </Button>
            <Button
              onClick={() => setStep('preview')}
              disabled={!mapping.name || !mapping.price}
            >
              {t('preview')}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Import */}
      {step === 'preview' && parsedData && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('preview')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {t('rows', { count: parsedData.rows.length })}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {PRODUCT_FIELDS.filter((f) => mapping[f]).map((field) => (
                    <th
                      key={field}
                      className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-700"
                    >
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.rows.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {PRODUCT_FIELDS.filter((f) => mapping[f]).map((field) => {
                      const idx = parsedData.headers.indexOf(mapping[field]);
                      return (
                        <td
                          key={field}
                          className="whitespace-nowrap px-4 py-2 text-gray-600"
                        >
                          {idx >= 0 ? (row[idx] ?? '') : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {importing && (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-gray-600">{t('importing')}</span>
            </div>
          )}

          {result && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
              {t('success', { count: result.imported })}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('mapping')}>
              {t('back')}
            </Button>
            <Button onClick={handleImport} disabled={importing || !!result}>
              {importing ? t('importing') : t('importButton')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
