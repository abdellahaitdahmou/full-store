import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ShieldCheck, Truck, RefreshCcw, Package } from 'lucide-react'
import OrderForm from './OrderForm'
import Link from 'next/link'

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
        <div className="bg-cream min-h-screen py-12">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="bg-white rounded-3xl border border-gold/10 shadow-sm overflow-hidden flex flex-col md:flex-row">

                    {/* Image Gallery */}
                    <div className="md:w-1/2 p-8 md:p-12 bg-light-gray border-r border-gold/10 relative flex flex-col justify-center items-center">
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full max-w-md h-auto object-contain drop-shadow-2xl rounded-2xl"
                            />
                        ) : (
                            <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                                لا توجد صورة متاحة
                            </div>
                        )}

                        {/* Thumbnails (If more than 1 image) */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-4 mt-8 overflow-x-auto w-full justify-center">
                                {product.images.map((img: string, i: number) => (
                                    <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-transparent hover:border-gold cursor-pointer transition-colors bg-white shadow-sm">
                                        <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details & Form */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-4 leading-tight tracking-tight">
                            {product.title}
                        </h1>

                        <div className="text-4xl font-black text-navy mb-6">
                            {product.price.toFixed(2)} <span className="text-2xl text-gold font-bold">درهم</span>
                        </div>

                        <div className="prose prose-gray mb-8">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 py-8 border-y border-gold/10">
                            <div className="flex flex-col items-center text-center gap-3 text-sm text-gray-600">
                                <ShieldCheck size={28} className="text-gold" />
                                <span className="font-serif font-bold text-navy">الدفع عند التوصيل</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-3 text-sm text-gray-600">
                                <Truck size={28} className="text-gold" />
                                <span className="font-serif font-bold text-navy">توصيل سريع</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-3 text-sm text-gray-600">
                                <RefreshCcw size={28} className="text-gold" />
                                <span className="font-serif font-bold text-navy">إرجاع سهل</span>
                            </div>
                        </div>

                        {/* 1-Step COD Form Section */}
                        <div className="bg-light-gray p-8 rounded-2xl border border-gold/20 shadow-inner">
                            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3 text-navy">
                                <span className="w-8 h-8 rounded-full bg-navy text-gold border border-gold flex items-center justify-center text-sm">✓</span>
                                اطلب هذا المنتج
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                املأ معلوماتك، وسنتصل بك لتأكيد طلبك.
                            </p>

                            <OrderForm productId={product.id} />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {suggestedProducts.map((item) => (
                                <Link href={`/products/${item.id}`} key={item.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col">
                                    <div className="relative aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">
                                        {item.images?.[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <Package size={48} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-navy shadow-sm">
                                            {item.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-lg font-serif font-bold text-navy mb-2 line-clamp-1 group-hover:text-gold transition-colors">{item.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xl font-bold text-navy">{item.price.toFixed(2)} د.م</span>
                                            <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </span>
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
