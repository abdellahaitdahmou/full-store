import { updateProduct } from '../../actions'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ImageUploadPreview from '../../ImageUploadPreview'
import AIAutoCategorizeButton from '../../AIAutoCategorizeButton'

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) {
        notFound()
    }

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
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-navy">تعديل المنتج</h1>
                        <p className="text-gray-500 mt-1">تحديث تفاصيل المنتج وصوره.</p>
                    </div>
                </div>
            </div>

            <form action={async (formData) => {
                'use server'
                await updateProduct(formData)
            }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <input type="hidden" name="id" value={product.id} />
                <input
                    type="hidden"
                    name="existingImages"
                    value={JSON.stringify(product.images || [])}
                />

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
                                defaultValue={product.title}
                                required
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-right text-navy font-medium"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-navy mb-2">
                                الوصف <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                defaultValue={product.description}
                                required
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-right text-navy resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h2 className="text-lg font-serif font-bold text-navy border-b border-gray-50 pb-4">صور المنتج</h2>
                        <ImageUploadPreview existingImages={product.images || []} />
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
                                    defaultValue={product.price}
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-right text-navy font-bold text-lg"
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
                                defaultValue={product.category}
                                required
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-right text-navy"
                            />
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-serif font-bold text-navy border-b border-gray-50 pb-4 mb-6">الحفظ</h2>
                        <button
                            type="submit"
                            className="w-full bg-navy text-white px-6 py-4 rounded-xl hover:bg-navy/90 hover:shadow-lg hover:shadow-navy/20 transition-all font-bold text-base flex justify-center items-center gap-2 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                            <span>تحديث المنتج</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
