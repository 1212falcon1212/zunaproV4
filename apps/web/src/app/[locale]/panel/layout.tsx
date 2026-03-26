'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { isAuthenticated, getUserFromToken, clearTokens } from '@/lib/auth';
import { cn } from '@zunapro/ui';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Image,
  Palette,
  Store,
  Globe,
  Receipt,
  ChevronDown,
  ChevronLeft,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Lock,
  BarChart3,
  Handshake,
  Plane,
  Landmark,
  FileText,
  ArrowLeftRight,
  DollarSign,
  Ship,
  FileCheck,
  Layers,
  AlignJustify,
  Newspaper,
  Sun,
  LayoutGrid,
  Settings,
  LifeBuoy,
} from 'lucide-react';

interface ModuleConfig {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
  items: {
    href: string;
    labelKey: string;
    icon: React.ReactNode;
  }[];
}

const MODULE_CONFIGS: ModuleConfig[] = [
  {
    id: 'ecommerce',
    labelKey: 'modules.ecommerce',
    icon: <Store className="h-5 w-5" />,
    items: [
      { href: '/panel/ecommerce', labelKey: 'sidebar.dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { href: '/panel/products', labelKey: 'sidebar.products', icon: <Package className="h-4 w-4" /> },
      { href: '/panel/categories', labelKey: 'sidebar.categories', icon: <FolderTree className="h-4 w-4" /> },
      { href: '/panel/orders', labelKey: 'sidebar.orders', icon: <ShoppingCart className="h-4 w-4" /> },
      { href: '/panel/customers', labelKey: 'sidebar.customers', icon: <Users className="h-4 w-4" /> },
      { href: '/panel/media', labelKey: 'sidebar.media', icon: <Image className="h-4 w-4" /> },
      { href: '/panel/themes', labelKey: 'sidebar.themes', icon: <Palette className="h-4 w-4" /> },
      { href: '/panel/pages', labelKey: 'sidebar.pages', icon: <FileText className="h-4 w-4" /> },
      { href: '/panel/menus', labelKey: 'sidebar.menus', icon: <AlignJustify className="h-4 w-4" /> },
      { href: '/panel/blog', labelKey: 'sidebar.blog', icon: <Newspaper className="h-4 w-4" /> },
      { href: '/panel/site-settings', labelKey: 'sidebar.siteSettings', icon: <Globe className="h-4 w-4" /> },
    ],
  },
  {
    id: 'marketplace',
    labelKey: 'modules.marketplace',
    icon: <Handshake className="h-5 w-5" />,
    items: [
      { href: '/panel/marketplace', labelKey: 'sidebar.dashboard', icon: <BarChart3 className="h-4 w-4" /> },
      { href: '/panel/marketplace/integrations', labelKey: 'sidebar.myMarketplaces', icon: <Layers className="h-4 w-4" /> },
      { href: '/panel/marketplace/matching', labelKey: 'sidebar.productMatching', icon: <ArrowLeftRight className="h-4 w-4" /> },
    ],
  },
  {
    id: 'export',
    labelKey: 'modules.export',
    icon: <Plane className="h-5 w-5" />,
    items: [
      { href: '/panel/export', labelKey: 'sidebar.dashboard', icon: <BarChart3 className="h-4 w-4" /> },
      { href: '/panel/export/peppol', labelKey: 'sidebar.peppol', icon: <FileCheck className="h-4 w-4" /> },
      { href: '/panel/export/currency', labelKey: 'sidebar.currencyManagement', icon: <DollarSign className="h-4 w-4" /> },
      { href: '/panel/export/shipping', labelKey: 'sidebar.internationalShipping', icon: <Ship className="h-4 w-4" /> },
    ],
  },
  {
    id: 'finance',
    labelKey: 'modules.finance',
    icon: <Landmark className="h-5 w-5" />,
    items: [
      { href: '/panel/finance', labelKey: 'sidebar.dashboard', icon: <BarChart3 className="h-4 w-4" /> },
      { href: '/panel/finance/invoices', labelKey: 'sidebar.einvoice', icon: <Receipt className="h-4 w-4" /> },
      { href: '/panel/finance/income-expense', labelKey: 'sidebar.incomeExpense', icon: <ArrowLeftRight className="h-4 w-4" /> },
      { href: '/panel/finance/reports', labelKey: 'sidebar.accountingReports', icon: <FileText className="h-4 w-4" /> },
    ],
  },
];

const LOCALE_FLAGS: Record<string, string> = {
  tr: '🇹🇷', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸',
};
const LOCALE_NAMES: Record<string, string> = {
  tr: 'Türkiye', en: 'United Kingdom', de: 'Deutschland', fr: 'France', es: 'España',
};

export default function PanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('panel');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getUserFromToken>>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const { locale } = use(params);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/auth/login`);
      return;
    }
    setUser(getUserFromToken());
  }, [router, locale]);

  const handleLogout = () => {
    clearTokens();
    router.push(`/${locale}/auth/login`);
  };

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  // Auto-expand active module only if not on main dashboard
  useEffect(() => {
    if (!pathname) return;
    // Don't auto-expand on main dashboard
    if (pathname === `/${locale}/panel`) return;
    for (const mod of MODULE_CONFIGS) {
      const hasActive = mod.items.some((item) => pathname?.startsWith(`/${locale}${item.href}`));
      if (hasActive && !expandedModules.includes(mod.id)) {
        setExpandedModules((prev) => [...prev, mod.id]);
      }
    }
  }, [pathname, locale]);

  const navLinkClass = (href: string) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150',
      pathname === href || pathname?.startsWith(href + '/')
        ? 'bg-violet-100 font-semibold text-violet-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
    );

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <span className="text-sm text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  const flag = LOCALE_FLAGS[locale] || '🌐';
  const localeName = LOCALE_NAMES[locale] || locale.toUpperCase();
  const userInitial = (user.role?.[0] || 'U').toUpperCase();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 lg:static',
          sidebarCollapsed ? 'w-[72px]' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="relative flex h-16 items-center justify-center px-5 border-b border-slate-100">
          {!sidebarCollapsed && (
            <Link href={`/${locale}/panel`} className="flex w-full items-center justify-center">
              <img
                src="https://www.zunapro.com/web/img/zunapro-kucuk-logo.webp"
                alt="ZunaPro"
                className="h-8 w-auto object-contain"
              />
            </Link>
          )}
          {sidebarCollapsed && (
            <img
              src="https://www.zunapro.com/web/img/zunapro-kucuk-logo.webp"
              alt="ZunaPro"
              className="mx-auto h-7 w-auto object-contain"
            />
          )}
          <button onClick={() => setSidebarOpen(false)} className="absolute right-4 rounded-lg p-1 text-slate-400 hover:text-slate-700 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Country selector */}
        {!sidebarCollapsed && (
          <div className="px-3 pt-3 pb-1">
            <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                <span>{flag}</span>
                <span className="font-medium">{localeName}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin space-y-0.5">
          {!sidebarCollapsed ? (
            <>
              {/* Main dashboard */}
              <Link
                href={`/${locale}/panel`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  pathname === `/${locale}/panel`
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>{t('sidebar.controlPanel')}</span>
              </Link>

              {/* Module sections */}
              {MODULE_CONFIGS.map((mod) => {
                const isLocked = mod.id !== 'ecommerce';
                const isExpanded = expandedModules.includes(mod.id);
                const isModuleActive = mod.items.some((item) => {
                  const fullHref = `/${locale}${item.href}`;
                  return pathname === fullHref || pathname?.startsWith(fullHref + '/');
                });
                return (
                  <div key={mod.id} className="mt-1">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-150',
                        isModuleActive
                          ? 'bg-slate-100 font-semibold text-slate-800'
                          : 'font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {mod.icon}
                        <span>{t(mod.labelKey)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isLocked && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                        <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                        {mod.items.map((item) => {
                          const fullHref = `/${locale}${item.href}`;
                          const isItemActive = pathname === fullHref || pathname?.startsWith(fullHref + '/');
                          return (
                            <Link
                              key={item.href}
                              href={fullHref}
                              onClick={() => setSidebarOpen(false)}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150',
                                isItemActive
                                  ? 'bg-gradient-to-r from-violet-500 to-indigo-400 font-semibold text-white shadow-sm'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                              )}
                            >
                              <span
                                className={cn(
                                  'h-2.5 w-2.5 rounded-full border',
                                  isItemActive ? 'border-white/90 bg-white/90' : 'border-slate-400',
                                )}
                              />
                              <span>{t(item.labelKey)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Link
                href={`/${locale}/panel`}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                  pathname === `/${locale}/panel` ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                )}
                title={t('sidebar.controlPanel')}
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
              <div className="my-1 w-6 border-t border-slate-200" />
              {MODULE_CONFIGS.map((mod) => {
                const isLocked = mod.id !== 'ecommerce';
                return (
                  <button
                    key={mod.id}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                      isLocked ? 'cursor-not-allowed text-slate-500' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                    )}
                    title={t(mod.labelKey)}
                  >
                    {mod.icon}
                  </button>
                );
              })}
            </div>
          )}
        </nav>

        {/* Bottom: settings + collapse + user */}
        <div className="border-t border-slate-200 p-3">
          {!sidebarCollapsed ? (
            <>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>{t('sidebar.collapse')}</span>
              </button>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800 capitalize">{user.role}</p>
                  <p className="truncate text-xs text-slate-400">{user.tenantId?.slice(0, 12)}...</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                {userInitial}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('header.search')}
                className="w-48 bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400 lg:w-64"
              />
              <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:inline-block">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100">
              <Sun className="h-4.5 w-4.5" />
            </button>

            {/* Apps grid */}
            <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100">
              <LayoutGrid className="h-4.5 w-4.5" />
            </button>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            {/* User avatar */}
            <div className="mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white cursor-pointer">
              {userInitial}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              title={t('logout')}
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
