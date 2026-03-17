'use client';

import { use, useEffect, useState, useMemo } from 'react';
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
  Plus,
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

function SidebarModule({
  module,
  locale,
  pathname,
  isActive,
  isLocked,
  expanded,
  onToggle,
  onNavigate,
  t,
}: {
  module: ModuleConfig;
  locale: string;
  pathname: string;
  isActive: boolean;
  isLocked: boolean;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="mb-1">
      <button
        onClick={isLocked ? undefined : onToggle}
        className={cn(
          'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
          isLocked
            ? 'cursor-not-allowed text-indigo-400/40'
            : isActive
              ? 'bg-white/10 text-white shadow-lg shadow-indigo-500/10'
              : 'text-indigo-200 hover:bg-white/5 hover:text-white',
        )}
      >
        <div className="flex items-center gap-3">
          {module.icon}
          <span>{t(module.labelKey)}</span>
        </div>
        {isLocked ? (
          <Lock className="h-3.5 w-3.5 text-indigo-400/40" />
        ) : (
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
        )}
      </button>

      {expanded && !isLocked && (
        <div className="ml-3 mt-1 space-y-0.5 border-l border-indigo-700/50 pl-3">
          {module.items.map((item) => {
            const fullHref = `/${locale}${item.href}`;
            const isItemActive = pathname === fullHref || pathname?.startsWith(fullHref + '/');

            return (
              <Link
                key={item.href}
                href={fullHref}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all duration-150',
                  isItemActive
                    ? 'bg-gradient-to-r from-violet-500/20 to-blue-500/20 font-medium text-white'
                    : 'text-indigo-300 hover:bg-white/5 hover:text-white',
                )}
              >
                {item.icon}
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  const [expandedModules, setExpandedModules] = useState<string[]>(['ecommerce']);
  const { locale } = use(params);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/auth/login`);
      return;
    }
    setUser(getUserFromToken());
  }, [router, locale]);

  // Auto-expand module based on current path
  useEffect(() => {
    if (!pathname) return;
    for (const mod of MODULE_CONFIGS) {
      const hasActiveItem = mod.items.some((item) => {
        const fullHref = `/${locale}${item.href}`;
        return pathname?.startsWith(fullHref);
      });
      if (hasActiveItem && !expandedModules.includes(mod.id)) {
        setExpandedModules((prev) => [...prev, mod.id]);
      }
    }
  }, [pathname, locale]);

  // Map individual feature slugs to parent module categories
  const MODULE_SLUG_MAP: Record<string, string> = {
    products: 'ecommerce', orders: 'ecommerce', customers: 'ecommerce',
    'seo-basic': 'ecommerce', 'seo-advanced': 'ecommerce', settings: 'ecommerce',
    shipping: 'ecommerce', payments: 'ecommerce', 'variants-stock': 'ecommerce',
    coupons: 'ecommerce', 'bulk-import': 'ecommerce', 'email-marketing': 'ecommerce',
    'marketplace-trendyol': 'marketplace', 'marketplace-hepsiburada': 'marketplace',
    'marketplace-n11': 'marketplace', 'marketplace-amazon': 'marketplace',
    einvoice: 'finance', 'income-expense': 'finance', accounting: 'finance', reports: 'finance',
    'api-access': 'export', peppol: 'export',
  };

  const activeModules = useMemo(() => {
    const slugs = user?.activeModules || [];
    // If slugs already contain category IDs, use them; otherwise map from feature slugs
    const categories = new Set<string>();
    for (const slug of slugs) {
      if (['ecommerce', 'marketplace', 'export', 'finance'].includes(slug)) {
        categories.add(slug);
      } else if (MODULE_SLUG_MAP[slug]) {
        categories.add(MODULE_SLUG_MAP[slug]);
      }
    }
    return categories.size > 0 ? Array.from(categories) : ['ecommerce'];
  }, [user]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  const handleLogout = () => {
    clearTokens();
    router.push(`/${locale}/auth/login`);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <span className="text-sm text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

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
          'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:static',
          sidebarCollapsed ? 'w-[72px]' : 'w-72',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5">
          {!sidebarCollapsed && (
            <Link href={`/${locale}/panel`} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
                <span className="text-sm font-bold text-white">Z</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                ZunaPro
              </span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
              <span className="text-sm font-bold text-white">Z</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-indigo-300 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {!sidebarCollapsed ? (
            <div className="space-y-1">
              {/* Dashboard link — always visible at top */}
              <Link
                href={`/${locale}/panel`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  pathname === `/${locale}/panel`
                    ? 'bg-white/10 text-white shadow-lg shadow-indigo-500/10'
                    : 'text-indigo-200 hover:bg-white/5 hover:text-white',
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>{t('sidebar.controlPanel')}</span>
              </Link>

              <div className="my-2 border-t border-indigo-700/50" />

              {MODULE_CONFIGS.map((mod) => {
                const isLocked = !activeModules.includes(mod.id);
                const isActive = mod.items.some((item) => {
                  const fullHref = `/${locale}${item.href}`;
                  return pathname === fullHref || pathname?.startsWith(fullHref + '/');
                });

                return (
                  <SidebarModule
                    key={mod.id}
                    module={mod}
                    locale={locale}
                    pathname={pathname}
                    isActive={isActive}
                    isLocked={isLocked}
                    expanded={expandedModules.includes(mod.id)}
                    onToggle={() => toggleModule(mod.id)}
                    onNavigate={() => setSidebarOpen(false)}
                    t={t}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link
                href={`/${locale}/panel`}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                  pathname === `/${locale}/panel`
                    ? 'bg-white/10 text-white'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white',
                )}
                title={t('sidebar.controlPanel')}
              >
                <LayoutDashboard className="h-5 w-5" />
              </Link>
              <div className="my-1 w-6 border-t border-indigo-700/50" />
              {MODULE_CONFIGS.map((mod) => {
                const isLocked = !activeModules.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                      isLocked
                        ? 'cursor-not-allowed text-indigo-400/40'
                        : 'text-indigo-200 hover:bg-white/10 hover:text-white',
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

        {/* Collapse toggle + User info */}
        <div className="border-t border-indigo-700/50 p-3">
          {!sidebarCollapsed && (
            <>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="mb-3 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-indigo-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{t('sidebar.collapse')}</span>
              </button>
              <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                  {user.role?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white capitalize">
                    {user.role}
                  </p>
                  <p className="truncate text-xs text-indigo-300">
                    {user.tenantId?.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </>
          )}
          {sidebarCollapsed && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-300 hover:bg-white/10 hover:text-white"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                {user.role?.[0]?.toUpperCase() || 'U'}
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

          <div className="flex items-center gap-2">
            {/* Quick actions */}
            <button className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg hover:shadow-violet-500/30">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('header.quickActions')}</span>
            </button>

            {/* Notifications */}
            <button className="relative rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            {/* Language */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600">
              <Globe className="h-4 w-4" />
              <span className="uppercase">{locale}</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              title={t('logout')}
            >
              <LogOut className="h-5 w-5" />
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
