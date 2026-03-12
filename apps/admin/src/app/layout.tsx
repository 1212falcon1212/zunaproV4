import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ZunaPro Admin",
  description: "ZunaPro Super Admin Panel",
};

function Sidebar() {
  const links = [
    { href: "/", label: "Dashboard", icon: "□" },
    { href: "/tenants", label: "Tenants", icon: "◇" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="text-xl font-bold">
          ZunaPro <span className="text-sm font-normal text-muted-foreground">Admin</span>
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Sidebar />
        <main className="ml-64 min-h-screen bg-background p-8">{children}</main>
      </body>
    </html>
  );
}
