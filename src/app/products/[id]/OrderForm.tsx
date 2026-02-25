'use client'

import { useState } from 'react'
import { submitOrder } from './actions'

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
        formData.append('product_id', productId)

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
                <label htmlFor="full_name" className="block text-sm font-semibold text-navy mb-1">
                    الاسم الكامل *
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    placeholder="مثال: ياسين بنعلي"
                    className="w-full px-4 py-3 border border-gold/30 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all shadow-sm bg-white"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-1">
                    رقم الهاتف *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    dir="ltr"
                    // pattern="(06|07)[0-9]{8}"
                    placeholder="مثال: 0612345678"
                    className="w-full px-4 py-3 border border-gold/30 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all shadow-sm bg-white text-right"
                />
                <p className="text-xs text-gray-500 mt-1">سنتصل بك على هذا الرقم.</p>
            </div>

            <div>
                <label htmlFor="city" className="block text-sm font-semibold text-navy mb-1">
                    المدينة *
                </label>
                <div className="relative">
                    <select
                        id="city"
                        name="city"
                        required
                        className="w-full px-4 py-3 border border-gold/30 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all shadow-sm bg-white appearance-none"
                    >
                        <option value="">اختر مدينتك</option>
                        {MOROCCAN_CITIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gold text-white py-4 px-6 rounded-xl font-bold font-serif text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-gold/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
            >
                {loading ? (
                    <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    "تأكيد الطلب (الدفع عند الاستلام)"
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
