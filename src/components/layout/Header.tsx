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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-4">

                        {/* Logo - Left */}
                        <div className="flex items-center justify-start">
                            <Link href="/" className="flex items-center gap-2 group z-50">
                                <div className="w-9 h-9 bg-[#FF6600] text-white rounded-lg flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-[#FF6600]/10 shrink-0">
                                    Q
                                </div>
                                <span className="font-sans font-black text-xl md:text-2xl tracking-tighter text-navy flex items-center">
                                    QUICK <span className="text-[#FF6600] ml-1">DROP</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation - Center */}
                        <nav className="hidden md:flex items-center justify-center gap-10">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Shop', path: '/products' },
                                { name: 'Categories', path: '/products' },
                                { name: 'Track Order', path: '/checkout' }
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`font-bold text-sm uppercase tracking-widest transition-colors ${pathname === link.path ? 'text-[#FF6600]' : 'text-navy hover:text-[#FF6600]'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions - Right */}
                        <div className="flex items-center justify-end gap-3 md:gap-6 z-50">
                            <button className="p-2 text-navy hover:text-[#FF6600] transition-colors hidden sm:block">
                                <Search size={22} strokeWidth={2.5} />
                            </button>
                            <Link href="/checkout" className="p-2 text-navy hover:text-[#FF6600] transition-colors relative">
                                <ShoppingBag size={22} strokeWidth={2.5} />
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF6600] text-white text-[9px] flex items-center justify-center rounded-full font-bold">0</span>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-navy hover:text-[#FF6600] transition-all active:scale-95"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
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
