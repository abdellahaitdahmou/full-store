import { createClient } from '@/lib/supabase/server'
import { Package, ShoppingCart, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import DashboardCharts from './DashboardCharts'

export default async function DashboardOverview() {
    const supabase = await createClient()

    // Fetch quick stats
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    const { data: orders, count: orderCount } = await supabase
        .from('orders')
        .select('status, created_at, product_id, products(price)', { count: 'exact' })

    // Calculate some basic metrics
    const pendingOrders = orders?.filter((o) => o.status === 'Pending').length || 0
    const deliveredOrders = orders?.filter((o) => o.status === 'Delivered').length || 0

    // Calculate total revenue from delivered orders
    const revenue = orders
        ?.filter((o) => o.status === 'Delivered')
        .reduce((acc, order) => {
            // @ts-ignore
            return acc + (order.products?.price || 0)
        }, 0) || 0

    // Generate Chart Data (Last 7 Days)
    const chartData = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0] // YYYY-MM-DD

        let dailyRevenue = 0
        let dailyOrders = 0

        orders?.forEach(order => {
            if (order.created_at.startsWith(dateStr) && order.status === 'Delivered') {
                dailyOrders++
                // @ts-ignore
                dailyRevenue += (order.products?.price || 0)
            }
        })

        // Format date to be short (e.g. "Oct 12")
        const formattedDate = d.toLocaleDateString('ar-MA', { month: 'short', day: 'numeric' })

        chartData.push({
            date: formattedDate,
            revenue: dailyRevenue,
            orders: dailyOrders
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-navy">نظرة عامة</h1>
                    <p className="text-gray-500 mt-1">مرحباً بعودتك! إليك ما يحدث في متجرك اليوم.</p>
                </div>
            </div>

            {/* Top Cards Level */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue Card */}
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                    <div className="flex flex-row items-center justify-between pb-4 relative z-10">
                        <h3 className="tracking-tight text-sm font-bold text-gray-500 uppercase">إجمالي الإيرادات</h3>
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-gold" />
                        </div>
                    </div>
                    <div className="text-3xl font-serif font-bold text-navy relative z-10">
                        {revenue.toFixed(2)} <span className="text-lg font-sans text-gray-400">درهم</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs relative z-10">
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md font-bold">+12%</span>
                        <span className="text-gray-400">من الشهر الماضي</span>
                    </div>
                </div>

                {/* Delivered Orders Card */}
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between pb-4 relative z-10">
                        <h3 className="tracking-tight text-sm font-bold text-gray-500 uppercase">طلبات مكتملة</h3>
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-serif font-bold text-navy relative z-10">{deliveredOrders || 0}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs relative z-10">
                        <span className="text-gray-400">طوال الوقت</span>
                    </div>
                </div>

                {/* Pending Orders Card */}
                <div className="p-6 bg-white rounded-2xl border border-amber-500/20 shadow-sm shadow-amber-500/5 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-full h-1 bg-amber-500"></div>
                    <div className="flex flex-row items-center justify-between pb-4 relative z-10">
                        <h3 className="tracking-tight text-sm font-bold text-amber-600 uppercase">قيد الانتظار</h3>
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-serif font-bold text-navy relative z-10">{pendingOrders}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs relative z-10">
                        <span className="text-amber-600 font-medium">تتطلب الإنتباه ⚠️</span>
                    </div>
                </div>

                {/* Products Card */}
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex flex-row items-center justify-between pb-4 relative z-10">
                        <h3 className="tracking-tight text-sm font-bold text-gray-500 uppercase">منتجات نشطة</h3>
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-serif font-bold text-navy relative z-10">{productCount || 0}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs relative z-10">
                        <span className="text-gray-400">في الكتالوج</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-4">
                <DashboardCharts data={chartData} />

                {/* Recent Activity Small Panel */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm col-span-1 flex flex-col">
                    <h3 className="text-lg font-serif font-bold text-navy mb-1">النشاط الأخير</h3>
                    <p className="text-xs text-gray-500 mb-6">أحدث الإجراءات في المتجر</p>

                    <div className="flex-1 space-y-4">
                        {orders?.slice(0, 4).map((order) => (
                            <div key={order.product_id + Math.random()} className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-gold flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-navy">
                                        طلب جديد <span className="text-gray-400 text-xs">#{order.product_id?.substring(0, 4) || '1023'}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {/* @ts-ignore */}
                                        {order.products?.price ? `${order.products.price.toFixed(2)} درهم` : 'تمت الإضافة'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <p className="text-sm text-gray-400">لا يوجد نشاط حديث.</p>
                        )}
                    </div>
                    <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-navy hover:bg-gray-50 transition-colors">
                        عرض الكل
                    </button>
                </div>
            </div>
        </div>
    )
}
