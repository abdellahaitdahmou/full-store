'use client'

import { useCart } from '@/context/CartContext'
import { ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'

interface AddToCartButtonProps {
    product: {
        id: string
        title: string
        price: number
        image?: string
    }
    showLabel?: boolean
    className?: string
    quantity?: number
}

export default function AddToCartButton({ product, showLabel = true, className = '', quantity = 1 }: AddToCartButtonProps) {
    const { addToCart } = useCart()
    const [added, setAdded] = useState(false)

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product, quantity)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <button
            onClick={handleAdd}
            className={`flex items-center justify-center gap-2 transition-all active:scale-95 ${className}`}
        >
            {added ? (
                <>
                    <Check size={20} className="animate-in zoom-in duration-300" />
                    {showLabel && <span className="animate-in fade-in duration-300">تمت الإضافة</span>}
                </>
            ) : (
                <>
                    <ShoppingBag size={20} />
                    {showLabel && <span>أضف إلى السلة</span>}
                </>
            )}
        </button>
    )
}
