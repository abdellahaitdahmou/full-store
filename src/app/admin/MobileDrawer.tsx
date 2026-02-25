'use client'

import { X, LogOut, Settings, BarChart3, User, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileDrawerProps {
    isOpen: boolean
    onClose: () => void
    signOutAction: () => Promise<void>
}

export default function MobileDrawer({ isOpen, onClose, signOutAction }: MobileDrawerProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed top-0 bottom-0 right-0 w-[280px] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-navy text-white">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={20} className="text-gold" />
                        <span className="font-serif font-black tracking-wider text-xl">
                            لحظة <span className="text-gold">جولد</span>
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Profile */}
                <div className="p-6 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-navy text-gold flex items-center justify-center font-bold font-serif text-lg border-2 border-gold/20 shadow-sm">
                            م
                        </div>
                        <div>
                            <p className="font-bold text-navy truncate w-40">المدير العام</p>
                            <p className="text-xs text-gray-500">مسؤول النظام</p>
                        </div>
                    </div>
                </div>

                {/* Secondary Navigation */}
                <nav className="flex-1 p-6 space-y-4">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">إعدادات إضافية</div>

                    <button className="flex items-center gap-3 w-full p-2 text-navy hover:bg-gold/5 rounded-xl transition-colors font-medium text-sm text-right">
                        <BarChart3 size={18} className="text-gray-400" />
                        <span>تقارير المبيعات</span>
                    </button>

                    <button className="flex items-center gap-3 w-full p-2 text-navy hover:bg-gold/5 rounded-xl transition-colors font-medium text-sm text-right">
                        <Settings size={18} className="text-gray-400" />
                        <span>إعدادات المتجر</span>
                    </button>

                    <button className="flex items-center gap-3 w-full p-2 text-navy hover:bg-gold/5 rounded-xl transition-colors font-medium text-sm text-right">
                        <User size={18} className="text-gray-400" />
                        <span>الملف الشخصي</span>
                    </button>
                </nav>

                {/* Footer / Logout */}
                <div className="p-6 border-t border-gray-100">
                    <form action={signOutAction}>
                        <button className="flex items-center gap-3 w-full p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all font-bold text-sm justify-center group">
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            تسجيل الخروج
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
