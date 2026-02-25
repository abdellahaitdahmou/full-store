import { createClient } from '@/lib/supabase/server'
import { Search, Filter, Clock, CheckCircle, Package, Image as ImageIcon, XCircle } from 'lucide-react'
import Image from 'next/image'
import OrderStatusSelect from './OrderStatusSelect'

import MobileOrderCard from './MobileOrderCard'

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>
}) {
    const { status: filterStatus } = await searchParams
    const supabase = await createClient()

    let query = supabase
        .from('orders')
        .select('*, products(title, price, images)')
        .order('created_at', { ascending: false })

    if (filterStatus) {
        query = query.eq('status', filterStatus)
    }

    const { data: orders } = await query

    const getProductImageUrl = (products: any) => {
        if (!products || !products.images || !Array.isArray(products.images) || products.images.length === 0) return null
        const img = products.images[0]
        if (img.startsWith('http')) return img
        return supabase.storage.from('products').getPublicUrl(img).data.publicUrl
    }

    // Pre-calculate image URLs to avoid passing functions to client components
    const processedOrders = orders?.map(order => ({
        ...order,
        productImageUrl: getProductImageUrl(order.products)
    }))

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-500/10'
            case 'Confirmed':
                return 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm shadow-blue-500/10'
            case 'Delivered':
                return 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-500/10'
            case 'Cancelled':
                return 'bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-500/10'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 shadow-sm'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-navy">الطلبات</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">إدارة طلبات العملاء وتحديث حالات التوصيل.</p>
                </div>
            </div>

            {/* Advanced Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100/50 self-start md:self-auto overflow-x-auto hide-scrollbar w-full md:w-auto">
                    <a
                        href="/admin/orders"
                        className={`px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg font-bold whitespace-nowrap transition-all ${!filterStatus ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy hover:bg-gray-100/50'
                            }`}
                    >
                        الكل
                    </a>
                    {[
                        { val: 'Pending', label: 'قيد الانتظار', icon: Clock, color: 'amber' },
                        { val: 'Confirmed', label: 'مؤكد', icon: CheckCircle, color: 'blue' },
                        { val: 'Delivered', label: 'تم التوصيل', icon: Package, color: 'green' },
                        { val: 'Cancelled', label: 'ملغى', icon: XCircle, color: 'red' },
                    ].map((s) => {
                        const Icon = s.icon
                        const isActive = filterStatus === s.val
                        return (
                            <a
                                key={s.val}
                                href={`/admin/orders?status=${s.val}`}
                                className={`px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${isActive
                                    ? `bg-white text-${s.color}-700 shadow-sm`
                                    : `text-gray-500 hover:text-${s.color}-700 hover:bg-${s.color}-50/50`
                                    }`}
                            >
                                <Icon size={14} className={isActive ? `text-${s.color}-500` : ''} />
                                {s.label}
                            </a>
                        )
                    })}
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 md:py-2 rounded-xl border border-gray-100 w-full md:w-64 focus-within:ring-2 focus-within:ring-gold/30">
                    <Search size={16} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="ابحث برقم الطلب..."
                        className="bg-transparent border-none outline-none text-sm w-full text-navy placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto hide-scrollbar">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-right rounded-tr-2xl">رقم الطلب / التاريخ</th>
                                <th className="px-6 py-4 font-semibold">الزبون</th>
                                <th className="px-6 py-4 font-semibold">المنتج</th>
                                <th className="px-6 py-4 font-semibold">الحالة الحالية</th>
                                <th className="px-6 py-4 font-semibold text-left rounded-tl-2xl">تحديث الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {processedOrders?.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-serif font-bold text-navy truncate w-32" title={order.id}>
                                            #{order.id.split('-')[0]}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(order.created_at).toLocaleDateString('ar-MA', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-navy">{order.full_name}</div>
                                        <div className="text-gray-500 text-xs mt-0.5" dir="ltr">{order.phone}</div>
                                        <div className="text-xs text-gray-400 mt-0.5 bg-gray-100 inline-block px-2 py-0.5 rounded">{order.city}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 justify-end">
                                            <div className="text-right">
                                                <div className="font-medium text-navy text-sm">
                                                    {/* @ts-ignore */}
                                                    {order.products?.title || 'منتج غير معروف'}
                                                </div>
                                                <div className="font-bold text-navy mt-1">
                                                    {/* @ts-ignore */}
                                                    {order.products?.price?.toFixed(2) || '0.00'} <span className="text-gray-400 font-normal text-xs">درهم</span>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                {/* @ts-ignore */}
                                                {order.productImageUrl ? (
                                                    <Image
                                                        // @ts-ignore
                                                        src={order.productImageUrl}
                                                        alt="Product"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon size={20} className="text-gray-300" />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-[120px]">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-current ml-1.5 opacity-70"></span>
                                            {order.status === 'Pending' ? 'قيد الانتظار' : order.status === 'Confirmed' ? 'مؤكد' : order.status === 'Delivered' ? 'تم التوصيل' : order.status === 'Cancelled' ? 'ملغى' : order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <OrderStatusSelect
                                            orderId={order.id}
                                            currentStatus={order.status}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4 pb-12">
                {processedOrders?.map((order) => (
                    <MobileOrderCard
                        key={order.id}
                        order={order}
                    />
                ))}
            </div>

            {/* Empty State */}
            {!processedOrders?.length && (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-gray-500">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium text-navy mb-1 text-center">لا توجد طلبات تطابق معايير البحث.</p>
                </div>
            )}
        </div>
    )
}
