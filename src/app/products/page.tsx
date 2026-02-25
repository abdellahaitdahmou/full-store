import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Search, SlidersHorizontal, Star } from 'lucide-react'
import AddToCartButton from '@/components/products/AddToCartButton'

export const revalidate = 0

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { search, category, sort } = await searchParams as { search?: string, category?: string, sort?: string }
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
        query = query.order('created_at', { ascending: false })
    }

    const { data: products } = await query

    // Get unique categories
    const { data: categoriesData } = await supabase.from('products').select('category')
    const categories = Array.from(new Set(categoriesData?.map(c => c.category) || []))

    return (
        <div className="bg-[#FFFBF7] min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                    <div className="text-right md:text-right">
                        <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-3 text-navy drop-shadow-sm uppercase">كل الفئات</h1>
                        <p className="text-gray-500 font-medium max-w-xl">
                            اكتشف أقوى العروض والمنتجات الحصرية بأسعار تنافسية.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-white font-bold bg-[#FF6600] px-6 py-3 rounded-2xl shadow-lg self-start md:self-auto transform hover:scale-105 transition-transform cursor-default">
                        <span className="text-2xl">{products?.length || 0}</span>
                        <span className="text-sm">منتج متوفر</span>
                    </div>
                </div>

                {/* Modern Filter & Sort Bar */}
                <div className="sticky-filter-bar sticky top-16 z-40 bg-[#FFFBF7]/80 backdrop-blur-xl py-4 mb-10 -mx-4 px-4 md:mx-0 md:px-0 transition-opacity duration-300">
                    <div className="flex flex-col gap-6">
                        {/* Category Pills - Scrollable */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
                            <Link
                                href={`/products${sort ? `?sort=${sort}` : ''}`}
                                className={`whitespace-nowrap px-8 py-3 rounded-2xl text-sm font-black transition-all border-2 ${!category ? 'bg-navy text-white border-navy shadow-lg scale-105' : 'bg-white text-navy border-gray-100 hover:border-[#FF6600]/30 shadow-sm'}`}
                            >
                                الكل
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/products?category=${encodeURIComponent(cat)}${sort ? `&sort=${sort}` : ''}`}
                                    className={`whitespace-nowrap px-8 py-3 rounded-2xl text-sm font-black transition-all border-2 ${category === cat ? 'bg-navy text-white border-navy shadow-lg scale-105' : 'bg-white text-navy border-gray-100 hover:border-[#FF6600]/30 shadow-sm'}`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>

                        {/* Search Feedback & Sorting Selection */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {search && (
                                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border-2 border-orange-100 shadow-md w-full sm:w-auto">
                                    <Search size={18} className="text-[#FF6600]" />
                                    <span className="text-sm font-bold text-gray-600">
                                        البحث عن: <span className="text-navy">"{search}"</span>
                                    </span>
                                    <Link href="/products" className="text-xs text-[#FF6600] hover:underline font-black mr-2 pr-2 border-r border-orange-100">
                                        إغلاق
                                    </Link>
                                </div>
                            )}

                            <div className="flex items-center gap-4 w-full sm:w-auto ml-auto bg-white p-2 rounded-2xl border-2 border-gray-50 shadow-sm">
                                <div className="flex items-center gap-2 text-xs font-black text-navy uppercase ml-2">
                                    <SlidersHorizontal size={16} className="text-[#FF6600]" />
                                    <span>ترتيب</span>
                                </div>
                                <div className="flex items-center gap-1 w-full overflow-hidden">
                                    {[
                                        { id: 'newest', label: 'الأحدث' },
                                        { id: 'price_asc', label: 'الأقل سعراً' },
                                        { id: 'price_desc', label: 'الأعلى سعراً' }
                                    ].map((s) => (
                                        <Link
                                            key={s.id}
                                            href={`/products?${category ? `category=${category}&` : ''}sort=${s.id}`}
                                            className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all whitespace-nowrap flex-1 text-center ${((!sort && s.id === 'newest') || sort === s.id) ? 'bg-[#FF6600] text-white shadow-md' : 'text-gray-400 hover:text-navy hover:bg-gray-100'}`}
                                        >
                                            {s.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="w-full">
                    {(!products || products.length === 0) ? (
                        <div className="bg-white rounded-[40px] border border-gold/10 p-12 md:p-24 text-center shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-gold/10 transition-colors duration-1000"></div>
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/10">
                                    <Search className="w-12 h-12 text-gold animate-pulse" />
                                </div>
                                <h2 className="text-3xl font-serif font-bold mb-4 text-navy">عذراً، لم نجد نتائج!</h2>
                                <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                                    لم نتمكن من العثور على أي منتج يطابق معاييرك الحالية. جرب البحث باسم آخر أو استكشاف الأقسام الأخرى.
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex bg-navy text-white px-10 py-4 rounded-full font-bold hover:bg-gold transition-all duration-300 shadow-lg shadow-navy/20 hover:shadow-gold/40 active:scale-95"
                                >
                                    العودة للمتجر بالكامل
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {products?.map((product) => (
                                <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col h-full transform hover:-translate-y-2 transition-all duration-300">
                                    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-2 border-gray-50 hover:border-[#FF6600]/20 flex flex-col h-full relative">
                                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex-shrink-0">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    لا توجد صورة
                                                </div>
                                            )}

                                            {/* Labels */}
                                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                                <div className="bg-[#FF6600] text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-wider">
                                                    NEW
                                                </div>
                                                <div className="bg-white/90 backdrop-blur-md text-navy text-[10px] font-black px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 uppercase tracking-wider">
                                                    {product.category}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 md:p-6 flex flex-col flex-1">
                                            <h3 className="font-bold text-base md:text-lg mb-2 text-navy group-hover:text-[#FF6600] transition-colors line-clamp-1 leading-tight">
                                                {product.title}
                                            </h3>

                                            <div className="flex items-center gap-1 mb-4 text-[#FF6600]/40">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < 5 ? "currentColor" : "none"} className="md:w-3 md:h-3" />
                                                ))}
                                                <span className="text-[10px] text-gray-400 mr-1 font-bold">(120+)</span>
                                            </div>

                                            <div className="flex flex-row items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                                <div className="flex flex-col">
                                                    <span className="text-xl md:text-2xl font-black text-[#FF6600]">
                                                        {product.price} <span className="text-xs font-bold text-navy">د.م</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <AddToCartButton
                                                        product={{
                                                            id: product.id,
                                                            title: product.title,
                                                            price: product.price,
                                                            image: product.images?.[0]
                                                        }}
                                                        showLabel={false}
                                                        className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-orange-50 text-[#FF6600] border border-orange-100 shadow-sm hover:bg-[#FF6600] hover:text-white"
                                                    />
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-navy group-hover:bg-[#FF6600] group-hover:text-white transition-all duration-300 border border-gray-100 group-hover:border-[#FF6600] shadow-sm">
                                                        <ArrowRight size={18} className="rotate-180" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
