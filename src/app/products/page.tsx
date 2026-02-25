import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Search, SlidersHorizontal, Star } from 'lucide-react'

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
        <div className="bg-cream min-h-screen py-12">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-navy">كتالوج المنتجات</h1>
                        <p className="text-gray-500 text-lg max-w-xl">
                            اكتشف مجموعتنا المختارة بعناية. توصيل مجاني سريع لجميع المدن المغربية.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-navy/60 font-medium bg-white px-5 py-2.5 rounded-full border border-gold/10 shadow-sm self-start md:self-auto">
                        <span className="text-gold font-bold">{products?.length || 0}</span>
                        <span>منتج متوفر حالياً</span>
                    </div>
                </div>

                {/* Modern Filter & Sort Bar */}
                <div className="sticky top-20 z-40 bg-cream/80 backdrop-blur-xl py-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex flex-col gap-4">
                        {/* Category Pills - Scrollable */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                            <Link
                                href={`/products${sort ? `?sort=${sort}` : ''}`}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${!category ? 'bg-navy text-white border-navy ring-4 ring-navy/10' : 'bg-white text-navy border-gold/10 hover:border-gold shadow-sm'}`}
                            >
                                الكل
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/products?category=${encodeURIComponent(cat)}${sort ? `&sort=${sort}` : ''}`}
                                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${category === cat ? 'bg-navy text-white border-navy ring-4 ring-navy/10' : 'bg-white text-navy border-gold/10 hover:border-gold shadow-sm'}`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>

                        {/* Search Feedback & Sorting Selection */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {search && (
                                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gold/20 shadow-sm w-full sm:w-auto">
                                    <Search size={16} className="text-gold" />
                                    <span className="text-sm text-gray-600">
                                        البحث عن: <span className="font-bold text-navy">"{search}"</span>
                                    </span>
                                    <Link href="/products" className="text-xs text-gold hover:underline font-bold mr-2 pr-2 border-r border-gold/20">
                                        مسح
                                    </Link>
                                </div>
                            )}

                            <div className="flex items-center gap-4 w-full sm:w-auto ml-auto">
                                <div className="flex items-center gap-2 text-sm font-bold text-navy whitespace-nowrap">
                                    <SlidersHorizontal size={18} className="text-gold" />
                                    <span>ترتيب:</span>
                                </div>
                                <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-gold/10 shadow-sm w-full overflow-hidden">
                                    {[
                                        { id: 'newest', label: 'الأحدث' },
                                        { id: 'price_asc', label: 'السعر الأدنى' },
                                        { id: 'price_desc', label: 'السعر الأعلى' }
                                    ].map((s) => (
                                        <Link
                                            key={s.id}
                                            href={`/products?${category ? `category=${category}&` : ''}sort=${s.id}`}
                                            className={`px-4 py-1.5 rounded-full text-[11px] md:text-sm font-bold transition-all whitespace-nowrap flex-1 text-center ${((!sort && s.id === 'newest') || sort === s.id) ? 'bg-gold text-white' : 'text-gray-500 hover:text-navy hover:bg-gold/5'}`}
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                            {products?.map((product) => (
                                <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col h-full">
                                    <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gold/10 hover:border-gold/30 flex flex-col h-full ring-1 ring-black/5">
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
                    )}
                </div>

            </div>
        </div>
    )
}
