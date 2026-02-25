import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Search, SlidersHorizontal, Star } from 'lucide-react'

export const revalidate = 0

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { search, category, sort } = await searchParams
    const supabase = await createClient()

    let query = supabase.from('products').select('*')

    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    if (category) {
        query = query.eq('category', category)
    }

    if (sort === 'price_asc') {
        query = query.order('price', { ascending: true })
    } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false })
    } else {
        // Default: Newest
        query = query.order('created_at', { ascending: false })
    }

    const { data: products } = await query

    // Get unique categories
    const { data: categoriesData } = await supabase.from('products').select('category')
    const categories = Array.from(new Set(categoriesData?.map(c => c.category) || []))

    return (
        <div className="bg-cream min-h-screen py-12">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">

                {/* Header & Search */}
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold tracking-tight mb-4 text-navy">منتجاتنا</h1>
                    <p className="text-gray-500 text-lg max-w-2xl">
                        اختر ما يناسبك من الكتالوج الخاص بنا، توصيل مجاني والدفع عند الاستلام!
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar / Filters */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-8">
                        {/* Mobile Filter Toggle Button (Informational only for simplicity) */}
                        <div className="md:hidden flex items-center gap-2 font-bold text-lg mb-4">
                            <SlidersHorizontal size={20} />
                            تصفية
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gold/10 shadow-sm">
                            <h3 className="font-serif font-bold text-xl mb-4 text-navy border-b border-light-gray pb-2">الأقسام</h3>
                            <div className="space-y-3">
                                <a
                                    href={`/products${sort ? `?sort=${sort}` : ''}`}
                                    className={`block py-1 transition-colors ${!category ? 'text-gold font-bold' : 'text-gray-500 hover:text-navy'}`}
                                >
                                    جميع المنتجات
                                </a>
                                {categories.map((cat) => (
                                    <a
                                        key={cat}
                                        href={`/products?category=${encodeURIComponent(cat)}${sort ? `&sort=${sort}` : ''}`}
                                        className={`block py-1 transition-colors ${category === cat ? 'text-gold font-bold' : 'text-gray-500 hover:text-navy'}`}
                                    >
                                        {cat}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gold/10 shadow-sm">
                            <h3 className="font-serif font-bold text-xl mb-4 text-navy border-b border-light-gray pb-2">ترتيب حسب</h3>
                            <div className="space-y-3">
                                <a
                                    href={`/products?${category ? `category=${category}&` : ''}sort=newest`}
                                    className={`block py-1 transition-colors ${(!sort || sort === 'newest') ? 'text-gold font-bold' : 'text-gray-500 hover:text-navy'}`}
                                >
                                    الأحدث
                                </a>
                                <a
                                    href={`/products?${category ? `category=${category}&` : ''}sort=price_asc`}
                                    className={`block py-1 transition-colors ${sort === 'price_asc' ? 'text-gold font-bold' : 'text-gray-500 hover:text-navy'}`}
                                >
                                    السعر: من الأقل للأعلى
                                </a>
                                <a
                                    href={`/products?${category ? `category=${category}&` : ''}sort=price_desc`}
                                    className={`block py-1 transition-colors ${sort === 'price_desc' ? 'text-gold font-bold' : 'text-gray-500 hover:text-navy'}`}
                                >
                                    السعر: من الأعلى للأقل
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">

                        {search && (
                            <div className="mb-6 p-4 bg-white rounded-xl border border-gold/10 flex items-center justify-between">
                                <span className="text-gray-600">
                                    نتائج البحث عن: <span className="font-bold text-navy">"{search}"</span>
                                </span>
                                <a href="/products" className="text-sm text-gray-400 hover:text-navy underline">
                                    مسح
                                </a>
                            </div>
                        )}

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                            {products?.map((product) => (
                                <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col h-full">
                                    <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gold/10 hover:border-gold/30 flex flex-col h-full ring-1 ring-black/5">
                                        <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    لا توجد صورة
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-navy/80 backdrop-blur-md text-[8px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-sm text-gold border border-gold/20">
                                                {product.category}
                                            </div>
                                        </div>

                                        <div className="p-3 md:p-6 flex flex-col flex-1">
                                            <h3 className="font-serif font-bold text-sm md:text-xl mb-1 md:mb-3 text-navy group-hover:text-gold transition-colors line-clamp-2 leading-tight">
                                                {product.title}
                                            </h3>
                                            <div className="flex items-center gap-0.5 md:gap-1 mb-2 md:mb-5 text-gold shrink-0">
                                                <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                                                <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                                                <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                                                <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                                                <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                                                <span className="text-[9px] md:text-xs text-gray-400 mr-1">(أكثر من 50)</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-sm md:text-2xl text-navy">
                                                        {product.price} <span className="text-[10px] md:text-sm font-bold">د.م</span>
                                                    </span>
                                                </div>
                                                <div className="w-7 h-7 md:w-11 md:h-11 rounded-full bg-gold/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300 border border-gold/10">
                                                    <ArrowRight size={14} className="rotate-180 md:w-5 md:h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {(!products || products.length === 0) && (
                            <div className="bg-white rounded-3xl border border-gold/20 p-16 text-center shadow-sm">
                                <Search className="mx-auto w-16 h-16 text-gold/50 mb-6" />
                                <h2 className="text-2xl font-serif font-bold mb-2 text-navy">لم نجد شيئاً!</h2>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    لم نتمكن من العثور على أي منتج يطابق معاييرك. حاول البحث باسم آخر أو تغيير القسم.
                                </p>
                                <a
                                    href="/products"
                                    className="inline-block bg-gold text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-colors"
                                >
                                    عرض جميع المنتجات
                                </a>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
