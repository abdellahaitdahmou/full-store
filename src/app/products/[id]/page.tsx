import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ShieldCheck, Truck, RefreshCcw, Package, Star } from 'lucide-react'
import OrderForm from './OrderForm'
import Link from 'next/link'
import AddToCartButton from '@/components/products/AddToCartButton'
import ProductGallery from '@/components/products/ProductGallery'

export default async function ProductDetailPage({
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

    // Fetch suggested products from the same category
    const { data: suggestedProducts } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4)

    return (
        <div className="bg-[#FFFBF7] min-h-screen py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="bg-white rounded-[40px] border-2 border-gray-50 shadow-sm overflow-hidden flex flex-col lg:flex-row ring-1 ring-black/5">

                    {/* Interactive Image Gallery */}
                    <ProductGallery
                        images={product.images || []}
                        title={product.title}
                        category={product.category}
                    />

                    {/* Product Details & Form */}
                    <div className="lg:w-1/2 p-6 md:p-12 flex flex-col">
                        <div className="flex items-center gap-2 mb-6 text-[#FF6600]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" />
                            ))}
                            <span className="text-sm font-black text-gray-400 mr-2">(250+ مراجعة)</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-navy mb-4 leading-tight tracking-tight uppercase">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl md:text-5xl font-black text-[#FF6600]">
                                {product.price} <span className="text-xl">د.م</span>
                            </span>
                            <div className="bg-green-50 text-green-600 text-xs font-black px-3 py-1.5 rounded-xl border border-green-100 uppercase">
                                متوفر في المخزون
                            </div>
                        </div>

                        <div className="prose prose-gray mb-10 text-right">
                            <p className="text-gray-500 font-medium leading-relaxed whitespace-pre-line text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Trust Badges Simplified */}
                        <div className="grid grid-cols-3 gap-4 mb-10 py-8 border-y-2 border-gray-50">
                            {[
                                { icon: ShieldCheck, label: "الدفع عند الاستلام" },
                                { icon: Truck, label: "توصيل سريع" },
                                { icon: RefreshCcw, label: "إرجاع مجاني" }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6600] border border-orange-100 shadow-sm">
                                        <badge.icon size={24} />
                                    </div>
                                    <span className="font-black text-[10px] md:text-xs text-navy uppercase">{badge.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <AddToCartButton
                                product={{
                                    id: product.id,
                                    title: product.title,
                                    price: product.price,
                                    image: product.images?.[0]
                                }}
                                className="flex-1 bg-navy text-white px-8 py-5 rounded-2xl font-black text-xl hover:bg-navy/90 shadow-xl"
                            />
                        </div>

                        {/* 1-Step COD Form Section */}
                        <div className="bg-[#FFFBF7] p-8 rounded-[32px] border-2 border-[#FF6600]/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6600]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                            <h2 className="text-2xl font-black mb-2 flex items-center gap-3 text-navy uppercase relative z-10">
                                <span className="w-10 h-10 rounded-2xl bg-[#FF6600] text-white flex items-center justify-center shadow-lg">✓</span>
                                اطلب الآن
                            </h2>
                            <p className="text-sm font-bold text-gray-400 mb-8 relative z-10">
                                متبقي <span className="text-[#FF6600]">12 قطعة</span> فقط في العرض!
                            </p>

                            <div className="relative z-10">
                                <OrderForm productId={product.id} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Suggested Products Section */}
                {suggestedProducts && suggestedProducts.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-serif font-bold text-navy">منتجات مشابهة</h2>
                            <Link href="/products" className="text-gold font-bold hover:underline text-sm flex items-center gap-1">
                                عرض الكل
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {suggestedProducts.map((item) => (
                                <Link href={`/products/${item.id}`} key={item.id} className="group flex flex-col h-full transform hover:-translate-y-2 transition-all duration-300">
                                    <div className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-gray-50 hover:border-[#FF6600]/20 flex flex-col h-full relative">
                                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                                            {item.images?.[0] ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    لا توجد صورة
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <div className="bg-white/90 backdrop-blur-md text-navy text-[8px] font-black px-2.5 py-1 rounded-lg border border-gray-100 uppercase">
                                                    {item.category}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="text-sm md:text-base font-bold text-navy mb-2 line-clamp-1 group-hover:text-[#FF6600] transition-colors uppercase">{item.title}</h3>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-lg font-black text-[#FF6600]">{item.price} د.م</span>
                                                <span className="w-8 h-8 rounded-xl bg-gray-50 text-navy flex items-center justify-center border border-gray-100 group-hover:bg-[#FF6600] group-hover:text-white transition-all">
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
