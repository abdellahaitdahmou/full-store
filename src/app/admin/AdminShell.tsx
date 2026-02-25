'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import MobileDrawer from './MobileDrawer'
import NotificationBell from './NotificationBell'
import { Search, Menu, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface AdminShellProps {
    children: React.ReactNode
    signOutAction: () => Promise<void>
}

export default function AdminShell({ children, signOutAction }: AdminShellProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
            {/* Sidebar Component (Desktop) */}
            <Sidebar signOutAction={signOutAction} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Navbar */}
                <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile Logo / Menu Toggle */}
                        <div className="md:hidden flex items-center gap-2">
                            <h2 className="text-xl font-serif font-black tracking-tight flex items-center gap-1">
                                <span className="text-navy">لحظة</span>
                                <span className="text-gold">جولد</span>
                            </h2>
                        </div>

                        {/* Search (Hidden on small mobile) */}
                        <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-3 md:px-4 py-2 rounded-xl w-48 md:w-80 border border-gray-100 focus-within:ring-2 focus-within:ring-gold/30 focus-within:border-gold transition-all">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="ابحث..."
                                className="bg-transparent border-none outline-none text-xs md:text-sm w-full text-navy placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gold/10 text-gold hover:bg-gold/20 rounded-xl transition-all font-bold text-[10px] md:text-xs group whitespace-nowrap"
                        >
                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            <span className="hidden xs:inline">عرض المتجر</span>
                        </Link>

                        <div className="w-px h-6 bg-gray-200 ml-1"></div>

                        <NotificationBell />

                        <div className="w-px h-6 md:h-8 bg-gray-200 hidden xs:block"></div>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-navy group-hover:text-gold transition-colors">المدير العام</p>
                                <p className="text-xs text-gray-500">مسؤول النظام</p>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-navy text-gold flex items-center justify-center font-bold font-serif shadow-sm border-2 border-transparent group-hover:border-gold transition-colors text-sm md:text-base">
                                م
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar pb-24 md:pb-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Components */}
            <MobileNav onMenuClick={() => setIsDrawerOpen(true)} />
            <MobileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                signOutAction={signOutAction}
            />
        </div>
    )
}
