'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Settings, BarChart3, Calculator, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar({ signOutAction }: { signOutAction: () => Promise<void> }) {
    const pathname = usePathname()

    const navItems = [
        { href: '/admin/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
        { href: '/admin/products', label: 'المنتجات', icon: Package },
        { href: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
        { href: '/admin/calculator', label: 'المحاكاة والأرباح', icon: Calculator },
        { href: '/', label: 'عرض المتجر', icon: ExternalLink, external: true },
        { href: '#', label: 'التقارير', icon: BarChart3 }, // Placeholder
        { href: '#', label: 'الإعدادات', icon: Settings }, // Placeholder
    ]

    return (
        <aside className="w-72 bg-navy text-white flex-col hidden md:flex border-l border-gold/10 relative z-20 shadow-2xl">
            {/* Logo Area */}
            <div className="p-8 flex items-center justify-center border-b border-white/5">
                <h2 className="text-3xl font-serif font-black tracking-wider flex items-center gap-2">
                    <span className="text-white">كويك</span>
                    <span className="text-gold">دروب</span>
                </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto hide-scrollbar">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 px-4 font-sans">
                    القائمة الرئيسية
                </div>
                {navItems.map((item) => {
                    // Check if current path starts with item href (for nested active states)
                    const isActive = pathname.startsWith(item.href) && item.href !== '#'
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden",
                                isActive
                                    ? "text-gold bg-gold/10"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gold rounded-l-full" />
                            )}
                            <Icon size={22} className={cn("transition-colors", isActive ? "text-gold" : "text-white/40 group-hover:text-white/70")} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Area & Logout */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold font-serif">
                        م
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">المدير العام</p>
                        <p className="text-xs text-white/50">admin@lahdagold.com</p>
                    </div>
                </div>
                <form action={signOutAction}>
                    <button className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 text-white/60 transition-colors font-medium group">
                        <LogOut size={22} className="text-white/40 group-hover:text-red-400 transition-colors" />
                        تسجيل الخروج
                    </button>
                </form>
            </div>
        </aside>
    )
}
