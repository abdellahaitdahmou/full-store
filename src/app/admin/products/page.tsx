import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Search, Filter, Package } from 'lucide-react'
import { deleteProduct } from './actions'
import ProductActions from './ProductActions'

import MobileProductCard from './MobileProductCard'

export default async function ProductsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-navy">المنتجات</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">إدارة الكتالوج الخاص بك، إضافة وتعديل وحذف المنتجات.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center justify-center gap-2 bg-navy text-white px-5 py-3 md:py-2.5 rounded-xl hover:bg-navy/90 hover:shadow-lg transition-all text-sm font-medium"
                >
                    <Plus size={18} />
                    إضافة منتج
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 md:py-2 rounded-xl border border-gray-100 flex-1 md:max-w-md focus-within:ring-2 focus-within:ring-gold/30">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="ابحث عن المنتجات..."
                        className="bg-transparent border-none outline-none text-sm w-full text-navy placeholder:text-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy hover:bg-gray-50 transition-colors whitespace-nowrap">
                        <Filter size={16} />
                        تصفية
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>
                    <span className="text-xs text-gray-400 whitespace-nowrap px-2">
                        {products?.length || 0} منتجات
                    </span>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-right rounded-tr-2xl">المنتج</th>
                            <th className="px-6 py-4 font-semibold">القسم</th>
                            <th className="px-6 py-4 font-semibold">تاريخ الإضافة</th>
                            <th className="px-6 py-4 font-semibold">السعر</th>
                            <th className="px-6 py-4 font-semibold text-left rounded-tl-2xl">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products?.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {product.images?.[0] ? (
                                            <div className="relative w-12 h-12 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm flex-shrink-0">
                                                <Package size={20} />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-serif font-bold text-navy text-base">{product.title}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">#{product.id.substring(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(product.created_at).toLocaleDateString('ar-MA', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 font-bold text-navy">
                                    {product.price.toFixed(2)} د.م
                                </td>
                                <td className="px-6 py-4 text-left">
                                    <ProductActions
                                        productId={product.id}
                                        title={product.title}
                                        onDelete={async () => {
                                            'use server'
                                            await deleteProduct(product.id)
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {products?.map((product) => (
                    <MobileProductCard
                        key={product.id}
                        product={product}
                        onDelete={async () => {
                            'use server'
                            await deleteProduct(product.id)
                        }}
                    />
                ))}
            </div>

            {/* Empty State */}
            {!products?.length && (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-gray-400">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium text-navy mb-1">لا توجد منتجات</p>
                    <p className="text-sm">انقر على "إضافة منتج" للبدء في بناء الكتالوج.</p>
                </div>
            )}
        </div>
    )
}
