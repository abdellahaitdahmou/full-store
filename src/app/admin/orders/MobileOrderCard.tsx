'use client'

import { Clock, Phone, MapPin, Package, ChevronRight } from 'lucide-react'
import OrderStatusSelect from './OrderStatusSelect'
import Image from 'next/image'

interface MobileOrderCardProps {
    order: any
}

export default function MobileOrderCard({ order }: MobileOrderCardProps) {
    const statusText = order.status === 'Pending' ? 'قيد الانتظار' : order.status === 'Confirmed' ? 'مؤكد' : order.status === 'Delivered' ? 'تم التوصيل' : order.status === 'Cancelled' ? 'ملغى' : order.status

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'Confirmed':
                return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'Delivered':
                return 'bg-green-50 text-green-700 border-green-200'
            case 'Cancelled':
                return 'bg-red-50 text-red-700 border-red-200'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.99] transition-all">
            {/* Header: ID & Status */}
            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy">#{order.id.split('-')[0]}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(order.created_at).toLocaleDateString('ar-MA', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                    {statusText}
                </span>
            </div>

            {/* Content: Customer & Product */}
            <div className="p-4 space-y-4">
                {/* Customer Info */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-navy text-sm">{order.full_name}</h3>
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500" dir="ltr">
                                <Phone size={12} className="text-gray-400" />
                                {order.phone}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <MapPin size={12} className="text-gray-400" />
                                {order.city}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Summary */}
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0">
                        {order.productImageUrl ? (
                            <Image
                                src={order.productImageUrl}
                                alt="Product"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Package size={20} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-navy truncate">
                            {order.products?.title || 'منتج غير معروف'}
                        </p>
                        <p className="text-xs font-bold text-gold mt-0.5">
                            {order.products?.price?.toFixed(2) || '0.00'} <span className="text-[10px] font-normal text-gray-400">درهم</span>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-3">
                    <div className="flex-1">
                        <OrderStatusSelect
                            orderId={order.id}
                            currentStatus={order.status}
                        />
                    </div>
                    <button className="p-2.5 bg-navy text-white rounded-xl shadow-sm active:bg-navy/90">
                        <Phone size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
