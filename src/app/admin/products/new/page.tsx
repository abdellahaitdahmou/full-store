import { addProduct } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ImageUploadPreview from '../ImageUploadPreview'
import AIAutoCategorizeButton from '../AIAutoCategorizeButton'
import AIImport from '@/components/products/AIImport'

export default function NewProductPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-500 hover:text-navy rotate-180" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-navy">إضافة منتج جديد</h1>
                        <p className="text-gray-500 mt-1">قم بملء تفاصيل المنتج لإضافته إلى كتالوج المتجر.</p>
                    </div>
                </div>
            </div>

            <AIImport />

            <form action={async (formData) => {
                'use server'
                await addProduct(formData)
            }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h2 className="text-lg font-serif font-bold text-navy border-b border-gray-50 pb-4">المعلومات الأساسية</h2>

                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-navy mb-2">
                                عنوان المنتج <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-right text-navy font-medium"
                                placeholder="مثال: ساعة فاخرة"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-navy mb-2">
                                الوصف <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-right text-navy resize-none"
                                placeholder="اكتب تفاصيل المنتج ومميزاته هنا..."
                            ></textarea>
                            <p className="mt-2 text-xs text-gray-400">وصف جذاب وشامل يساعد على زيادة المبيعات.</p>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h2 className="text-lg font-serif font-bold text-navy border-b border-gray-50 pb-4">صور المنتج</h2>
                        <ImageUploadPreview />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Pricing & Category Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h2 className="text-lg font-serif font-bold text-navy border-b border-gray-50 pb-4">التسعير والتصنيف</h2>

                        <div>
                            <label htmlFor="price" className="block text-sm font-bold text-navy mb-2">
                                السعر <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-right text-navy font-bold text-lg"
                                    placeholder="0.00"
                                    dir="ltr"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                    MAD
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="category" className="block text-sm font-bold text-navy">
                                    القسم <span className="text-red-500">*</span>
                                </label>
                                <AIAutoCategorizeButton
                                    titleId="title"
                                    descriptionId="description"
                                    categoryId="category"
                                />
                            </div>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                required
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-right text-navy"
                                placeholder="مثال: إلكترونيات"
                            />
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-serif font-bold text-navy border-b border-gray-50 pb-4 mb-6">النشر</h2>
                        <button
                            type="submit"
                            className="w-full bg-navy text-white px-6 py-4 rounded-xl hover:bg-navy/90 hover:shadow-lg hover:shadow-navy/20 transition-all font-bold text-base flex justify-center items-center gap-2 group"
                        >
                            <span>حفظ المنتج ونشره</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold group-hover:translate-x-1 transition-transform rotate-180"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
