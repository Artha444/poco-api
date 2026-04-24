"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut, BarChart3, History, Users } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/reports", label: "Financial Reports", icon: BarChart3 },
    { href: "/admin/history", label: "Purchase History", icon: History },
    { href: "/admin/accounts", label: "Manage Accounts", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-[#0B0E14] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/50 border-r border-white/10 flex flex-col backdrop-blur-md z-20">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">POCO ADMIN</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                <link.icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => logoutAction()}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Decorative background */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
