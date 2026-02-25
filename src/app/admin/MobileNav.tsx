'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Calculator, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileNav({ onMenuClick }: { onMenuClick: () => void }) {
    const pathname = usePathname()

    const navItems = [
        { href: '/admin/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
        { href: '/admin/products', label: 'المنتجات', icon: Package },
        { href: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
        { href: '/admin/calculator', label: 'الأرباح', icon: Calculator },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px]",
                                isActive ? "text-gold" : "text-gray-400"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-lg transition-all",
                                isActive && "bg-gold/10"
                            )}>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </Link>
                    )
                })}

                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-navy transition-all min-w-[64px]"
                >
                    <div className="p-1">
                        <Menu size={20} />
                    </div>
                    <span className="text-[10px] font-bold">المزيد</span>
                </button>
            </div>
        </div>
    )
}
