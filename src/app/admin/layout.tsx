import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from './Sidebar'
import { Search } from 'lucide-react'
import OrderNotificationListener from './OrderNotificationListener'
import NotificationBell from './NotificationBell'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const signOut = async () => {
        'use server'
        const supabaseAction = await createClient()
        await supabaseAction.auth.signOut()
        redirect('/admin/login')
    }

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
            {/* Global Order Real-time Listener */}
            <OrderNotificationListener />

            {/* Sidebar Component */}
            <Sidebar signOutAction={signOut} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Navbar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2.5 rounded-xl w-96 border border-gray-100 focus-within:ring-2 focus-within:ring-gold/30 focus-within:border-gold transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="ابحث عن المنتجات، الطلبات..."
                            className="bg-transparent border-none outline-none text-sm w-full text-navy placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationBell />

                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-navy group-hover:text-gold transition-colors">المدير العام</p>
                                <p className="text-xs text-gray-500">مسؤول النظام</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-bold font-serif shadow-sm border-2 border-transparent group-hover:border-gold transition-colors">
                                م
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
