import { createClient } from '@/lib/supabase/server'
import { Search, Filter, Clock, CheckCircle, Package, Image as ImageIcon, XCircle } from 'lucide-react'
import Image from 'next/image'
import OrderStatusSelect from './OrderStatusSelect'

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

    const getProductImageUrl = (products: any) => {
        if (!products || !products.images || !Array.isArray(products.images) || products.images.length === 0) return null
        const img = products.images[0]
        if (img.startsWith('http')) return img
        return supabase.storage.from('products').getPublicUrl(img).data.publicUrl
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-navy">الطلبات</h1>
                    <p className="text-gray-500 mt-1">إدارة طلبات العملاء وتحديث حالات التوصيل.</p>
                </div>
            </div>

            {/* Advanced Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100/50 self-start sm:self-auto overflow-x-auto hide-scrollbar">
                    <a
                        href="/admin/orders"
                        className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all ${!filterStatus ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy hover:bg-gray-100/50'
                            }`}
                    >
                        الكل
                    </a>
                    <a
                        href="/admin/orders?status=Pending"
                        className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${filterStatus === 'Pending' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500 hover:text-amber-700 hover:bg-amber-50/50'
                            }`}
                    >
                        <Clock size={16} className={filterStatus === 'Pending' ? 'text-amber-500' : ''} />
                        قيد الانتظار
                    </a>
                    <a
                        href="/admin/orders?status=Confirmed"
                        className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${filterStatus === 'Confirmed' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-blue-700 hover:bg-blue-50/50'
                            }`}
                    >
                        <CheckCircle size={16} className={filterStatus === 'Confirmed' ? 'text-blue-500' : ''} />
                        مؤكد
                    </a>
                    <a
                        href="/admin/orders?status=Delivered"
                        className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${filterStatus === 'Delivered' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-green-700 hover:bg-green-50/50'
                            }`}
                    >
                        <Package size={16} className={filterStatus === 'Delivered' ? 'text-green-500' : ''} />
                        تم التوصيل
                    </a>
                    <a
                        href="/admin/orders?status=Cancelled"
                        className={`px-4 py-2 text-sm rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${filterStatus === 'Cancelled' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-red-700 hover:bg-red-50/50'
                            }`}
                    >
                        <XCircle size={16} className={filterStatus === 'Cancelled' ? 'text-red-500' : ''} />
                        ملغى
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-full sm:w-64 focus-within:ring-2 focus-within:ring-gold/30">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="ابحث برقم الطلب..."
                            className="bg-transparent border-none outline-none text-sm w-full text-navy placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
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
                            {orders?.map((order) => (
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
                                                {getProductImageUrl(order.products) ? (
                                                    <Image
                                                        // @ts-ignore
                                                        src={getProductImageUrl(order.products)!}
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
                            {!orders?.length && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        لا توجد طلبات تطابق معايير البحث.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
