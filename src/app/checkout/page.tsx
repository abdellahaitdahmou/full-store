'use client'

import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { submitOrder } from '@/app/checkout/actions'
import { ShoppingBag, Truck, ShieldCheck, RefreshCcw, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const MOROCCAN_CITIES = [
    'الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'طنجة', 'أكادير', 'مكناس',
    'وجدة', 'القنيطرة', 'تطوان', 'آسفي', 'المحمدية', 'خريبكة', 'الجديدة',
    'بني ملال', 'الناظور', 'تازة', 'سطات', 'العيون', 'الداخلة', 'أخرى'
];

export default function CheckoutPage() {
    const { cart, cartTotal, cartCount, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFFBF7] py-20 px-4 flex flex-col items-center justify-center">
                <div className="text-center bg-white p-12 rounded-[40px] shadow-xl border-2 border-gray-50">
                    <h2 className="text-3xl font-black text-navy mb-6">سلتك فارغة</h2>
                    <Link href="/products" className="bg-[#FF6600] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg">
                        اذهب للتسوق
                    </Link>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        // Pass products as a JSON string
        formData.append('products', JSON.stringify(cart.map(item => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price
        }))))

        try {
            const res = await submitOrder(formData)
            if (res?.error) {
                setError(res.error)
                setLoading(false)
            } else if (res?.success) {
                clearCart()
                window.location.href = '/checkout/success'
            }
        } catch (err: any) {
            console.error(err)
            setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <h1 className="text-4xl md:text-5xl font-black text-navy mb-12">إتمام الطلب</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Shipping Form */}
                    <div className="bg-white rounded-[40px] p-8 md:p-12 border-2 border-gray-50 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6600]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                        <h2 className="text-2xl font-black text-navy mb-8 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-[#FF6600] text-white flex items-center justify-center shadow-lg">1</span>
                            معلومات الشحن
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 font-bold">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="full_name" className="block text-xs font-black text-navy mb-2 uppercase tracking-tight">الاسم الكامل *</label>
                                <input type="text" id="full_name" name="full_name" required placeholder="مثال: أحمد محمد" className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#FF6600]/10 focus:border-[#FF6600] outline-none transition-all bg-white font-bold" />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-xs font-black text-navy mb-2 uppercase tracking-tight">رقم الهاتف *</label>
                                <input type="tel" id="phone" name="phone" required dir="ltr" placeholder="06XXXXXXXX" className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#FF6600]/10 focus:border-[#FF6600] outline-none transition-all bg-white text-right font-bold" />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-xs font-black text-navy mb-2 uppercase tracking-tight">المدينة *</label>
                                <div className="relative">
                                    <select id="city" name="city" required className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#FF6600]/10 focus:border-[#FF6600] outline-none transition-all bg-white appearance-none font-bold">
                                        <option value="">اختر مدينتك</option>
                                        {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-5 text-gray-400">
                                        <ArrowRight size={18} className="rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 bg-[#FF6600] text-white py-6 px-6 rounded-2xl font-black text-2xl hover:opacity-90 transition-all shadow-2xl shadow-orange-100 disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        تأكيد الطلب الآن
                                        <span className="text-white/30">|</span>
                                        {cartTotal} د.م
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 grid grid-cols-3 gap-4 border-t-2 border-gray-50 pt-10">
                            {[
                                { icon: ShieldCheck, label: "دفع آمن" },
                                { icon: Truck, label: "توصيل سريع" },
                                { icon: RefreshCcw, label: "إرجاع سهل" }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center gap-2">
                                    <badge.icon size={20} className="text-[#FF6600]" />
                                    <span className="text-[10px] font-black text-navy uppercase">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1 border-2 border-navy/5 rounded-[40px] p-8 md:p-10 self-start">
                        <h2 className="text-2xl font-black text-navy mb-8 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-navy text-white flex items-center justify-center shadow-lg">2</span>
                            ملخص الطلب
                        </h2>

                        <div className="space-y-6 mb-10 overflow-auto max-h-[50vh] pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4 group">
                                    <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <ShoppingBag size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-navy truncate">{item.title}</h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-400 font-bold">الكمية: {item.quantity}</span>
                                            <span className="font-black text-[#FF6600]">{item.price * item.quantity} د.م</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t-2 border-gray-50 pt-8">
                            <div className="flex justify-between items-center text-gray-500 font-bold">
                                <span>المجموع الفرعي</span>
                                <span>{cartTotal} د.م</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 font-bold">
                                <span>التوصيل</span>
                                <span className="text-green-500 font-black">مجاني</span>
                            </div>
                            <div className="flex justify-between items-center text-navy font-black text-2xl pt-4">
                                <span>المجموع الإجمالي</span>
                                <span className="text-[#FF6600]">{cartTotal} د.م</span>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-navy text-white rounded-3xl shadow-xl flex items-center gap-4 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                            <ShoppingBag className="text-[#FF6600]" size={32} />
                            <div>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">طريقة الدفع</p>
                                <p className="font-black text-lg">الدفع عند الاستلام</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
