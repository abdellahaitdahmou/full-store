'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFFBF7] py-20 px-4">
                <div className="max-w-md mx-auto bg-white rounded-[40px] p-12 text-center border-2 border-gray-50 shadow-xl">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                        <ShoppingBag size={48} className="text-gray-300" />
                    </div>
                    <h2 className="text-3xl font-black text-navy mb-4">سلتك فارغة</h2>
                    <p className="text-gray-500 mb-10 font-bold">
                        يبدو أنك لم تضف أي منتج بعد. استكشف منتجاتنا الرائعة وابدأ التسوق!
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-[#FF6600] text-white px-10 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-lg"
                    >
                        استكشف المنتجات
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-navy flex items-center gap-4">
                        سلة التسوق
                        <span className="text-lg bg-[#FF6600] text-white px-3 py-1 rounded-xl shadow-lg">{cartCount}</span>
                    </h1>
                    <Link href="/products" className="text-navy font-bold hover:text-[#FF6600] transition-colors flex items-center gap-2 group">
                        <span className="group-hover:translate-x-1 transition-transform rotate-180">
                            <ArrowLeft size={20} />
                        </span>
                        متابعة التسوق
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl p-6 border-2 border-gray-50 shadow-sm flex items-center gap-6 group hover:border-[#FF6600]/10 transition-all">
                                <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ShoppingBag size={24} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-lg text-navy mb-1 truncate">{item.title}</h3>
                                    <p className="text-[#FF6600] font-black text-xl mb-4">{item.price} د.م</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-navy hover:text-[#FF6600] transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-black text-navy">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-navy hover:text-[#FF6600] transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[40px] p-8 border-2 border-gray-50 shadow-xl sticky top-24">
                            <h2 className="text-2xl font-black text-navy mb-8 border-b-2 border-gray-50 pb-4">ملخص الطلب</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center font-bold text-gray-500">
                                    <span>عدد المنتجات</span>
                                    <span>{cartCount}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-gray-500">
                                    <span>التوصيل</span>
                                    <span className="text-green-500 uppercase">مجاني</span>
                                </div>
                                <div className="border-t-2 border-gray-50 pt-4 mt-4 flex justify-between items-center">
                                    <span className="font-black text-navy text-xl">المجموع</span>
                                    <span className="font-black text-[#FF6600] text-3xl">{cartTotal} د.م</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-[#FF6600] text-white py-5 px-6 rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
                            >
                                إتمام الطلب
                                <ArrowRight size={20} />
                            </Link>

                            <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#FF6600] text-white rounded-xl flex items-center justify-center shadow-lg">✓</span>
                                <span className="text-xs font-black text-navy">الدفع عند الاستلام متاح لجميع المدن</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
