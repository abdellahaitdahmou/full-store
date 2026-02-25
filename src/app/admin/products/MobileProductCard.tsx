'use client'

import { Package, MoreVertical, Edit2, Trash2, Calendar } from 'lucide-react'
import ProductActions from './ProductActions'

interface MobileProductCardProps {
    product: {
        id: string
        title: string
        price: number
        category: string
        images: string[] | null
        created_at: string
    }
    onDelete: () => Promise<void>
}

export default function MobileProductCard({ product, onDelete }: MobileProductCardProps) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group active:scale-[0.98] transition-all">
            <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Package size={24} className="text-gray-300" />
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif font-bold text-navy text-sm line-clamp-2 leading-tight">
                                {product.title}
                            </h3>
                            <ProductActions
                                productId={product.id}
                                title={product.title}
                                onDelete={onDelete}
                            />
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md border border-gray-200">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(product.created_at).toLocaleDateString('ar-MA', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-lg font-black text-gold">
                            {product.price.toFixed(2)} <span className="text-xs font-normal text-gray-400">د.م</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
