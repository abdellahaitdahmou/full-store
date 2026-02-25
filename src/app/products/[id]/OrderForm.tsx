'use client'

import { useState } from 'react'
import { submitOrder } from '@/app/checkout/actions'

// List of Moroccan cities
const MOROCCAN_CITIES = [
    'الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'طنجة', 'أكادير', 'مكناس',
    'وجدة', 'القنيطرة', 'تطوان', 'آسفي', 'المحمدية', 'خريبكة', 'الجديدة',
    'بني ملال', 'الناظور', 'تازة', 'سطات', 'العيون', 'الداخلة', 'أخرى'
];

export default function OrderForm({ productId }: { productId: string }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        // Pass single product for the 1-step checkout
        formData.append('products', JSON.stringify([{
            id: productId,
            quantity: 1,
            // Price and Title are fetched on server if needed, or we can pass placeholders
            title: 'Product',
            price: 0
        }]))

        try {
            // Server action
            const res = await submitOrder(formData)

            if (res?.error) {
                setError(res.error)
                setLoading(false)
            } else if (res?.success) {
                // Perform redirect client-side to avoid NEXT_REDIRECT boundary collisions
                window.location.href = '/checkout/success'
            }
        } catch (err: any) {
            console.error(err)
            setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="full_name" className="block text-xs font-black text-navy mb-2 uppercase tracking-tight">
                    الاسم الكامل *
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    placeholder="مثال: أحمد محمد"
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#FF6600]/10 focus:border-[#FF6600] outline-none transition-all shadow-sm bg-white font-bold"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-xs font-black text-navy mb-2 uppercase tracking-tight">
                    رقم الهاتف *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    dir="ltr"
                    placeholder="06XXXXXXXX"
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#FF6600]/10 focus:border-[#FF6600] outline-none transition-all shadow-sm bg-white text-right font-bold"
                />
            </div>

            <div>
                <label htmlFor="city" className="block text-xs font-black text-navy mb-2 uppercase tracking-tight">
                    المدينة *
                </label>
                <div className="relative">
                    <select
                        id="city"
                        name="city"
                        required
                        className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#FF6600]/10 focus:border-[#FF6600] outline-none transition-all shadow-sm bg-white appearance-none font-bold"
                    >
                        <option value="">اختر مدينتك</option>
                        {MOROCCAN_CITIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-5 text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#FF6600] text-white py-5 px-6 rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-xl shadow-orange-200 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3 uppercase tracking-wider"
            >
                {loading ? (
                    <span className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <>
                        تأكيد الطلب الآن
                        <span className="text-white/50">|</span>
                        الدفع عند الاستلام
                    </>
                )}
            </button>

            {/* Sticky Mobile Button Helper */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t z-50">
                <button
                    type="button"
                    onClick={() => {
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: 'smooth'
                        });
                    }}
                    className="w-full bg-gold text-white py-4 rounded-xl font-bold font-serif text-lg shadow-lg flex items-center justify-center gap-2"
                >
                    اطلب الآن
                </button>
            </div>
        </form>
    )
}
