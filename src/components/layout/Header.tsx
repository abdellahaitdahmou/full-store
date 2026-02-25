'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const pathname = usePathname()
    const router = useRouter()

    // Do not render the customer header on admin routes
    if (pathname.startsWith('/admin')) {
        return null
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
            setIsMobileMenuOpen(false)
            setSearchQuery('')
        }
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="flex items-center justify-between gap-4">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group z-50">
                            <div className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform duration-300 shadow-lg">
                                <span className="text-gold">لـ</span>جـ
                            </div>
                            <span className={`font-serif font-bold text-2xl tracking-tight hidden sm:block ${isScrolled ? 'text-navy' : 'text-navy'}`}>
                                لحظة جولد
                            </span>
                        </Link>

                        {/* Desktop Search */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
                            <form onSubmit={handleSearch} className="w-full relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ابحث عن منتج..."
                                    className="w-full bg-light-gray hover:bg-white focus:bg-white text-navy px-5 py-3 rounded-full outline-none border border-transparent focus:border-gold/30 focus:ring-4 focus:ring-gold/10 transition-all shadow-sm group-hover:shadow-md pr-12"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            </form>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/" className="font-medium text-navy hover:text-gold transition-colors relative after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gold after:transition-all">
                                الرئيسية
                            </Link>
                            <Link href="/products" className="font-medium text-navy hover:text-gold transition-colors relative after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gold after:transition-all">
                                المنتجات
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-navy z-50 bg-white/50 backdrop-blur-md rounded-full shadow-sm border border-gray-100"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                <div className="pt-24 px-6 flex flex-col gap-8 flex-1">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث عن منتج..."
                            className="w-full bg-light-gray text-navy px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-gold transition-all text-lg border pr-12"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
                    </form>

                    <nav className="flex flex-col gap-6 text-2xl font-semibold">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="border-b pb-4 hover:text-gold transition-colors flex justify-between items-center"
                        >
                            الرئيسية <span className="text-gold text-lg mr-2 rotate-180">→</span>
                        </Link>
                        <Link
                            href="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="border-b pb-4 hover:text-gold transition-colors flex justify-between items-center"
                        >
                            المنتجات <span className="text-gold text-lg mr-2 rotate-180">→</span>
                        </Link>
                    </nav>

                    <div className="mt-auto pb-10">
                        <div className="bg-light-gray p-6 rounded-2xl border border-gray-100 text-center">
                            <ShoppingBag className="mx-auto text-gold mb-3 w-8 h-8" />
                            <h3 className="font-bold text-lg mb-1">الدفع عند التوصيل</h3>
                            <p className="text-gray-500 text-sm">ادفع نقداً عندما تستلم طلبك عند باب منزلك.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
