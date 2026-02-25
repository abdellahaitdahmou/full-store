'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Instagram, Facebook, Phone } from 'lucide-react'

export default function Footer() {
    const pathname = usePathname()

    if (pathname.startsWith('/admin')) {
        return null
    }

    return (
        <footer className="bg-navy text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-white text-navy rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform duration-300">
                                <span className="text-gold">لـ</span>جـ
                            </div>
                            <span className="font-serif font-bold text-3xl tracking-tight text-white">لحظة جولد</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                            أفضل المنتجات في المغرب مع سهولة الدفع عند الاستلام. الدفع عند التوصيل!
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-xl mb-6 text-gold">روابط سريعة</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li>
                                <Link href="/" className="hover:text-white hover:pr-2 transition-all block">الرئيسية</Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-white hover:pr-2 transition-all block">منتجاتنا</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-xl mb-6 text-gold">اتصل بنا</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-gold" />
                                <span dir="ltr">+212 600 000 000</span>
                            </li>
                            <li className="text-sm border border-gold/20 p-4 rounded-xl mt-4 bg-white/5">
                                <span className="block text-white font-medium mb-1">دعم واتساب 24/7</span>
                                أرسل لنا رسالة في أي وقت للاستفسار!
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} المتجر. جميع الحقوق محفوظة.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-white cursor-pointer transition-colors">سياسة الإرجاع</span>
                        <span className="hover:text-white cursor-pointer transition-colors">الشروط والأحكام</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
