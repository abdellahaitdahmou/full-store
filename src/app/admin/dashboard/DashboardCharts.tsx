'use client'

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface ChartDataPoint {
    date: string
    revenue: number
    orders: number
}

interface DashboardChartsProps {
    data: ChartDataPoint[]
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-400">لا توجد بيانات كافية لعرض الرسم البياني.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gold/10 shadow-sm col-span-1 lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base md:text-lg font-serif font-bold text-navy">نظرة عامة على الإيرادات</h3>
                    <p className="text-xs md:text-sm text-gray-500">الإيرادات والطلبات خلال الـ 7 أيام الماضية</p>
                </div>
            </div>

            <div className="h-[250px] md:h-[350px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 11 }}
                            dy={10}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 10 }}
                            tickFormatter={(value) => `${value}`}
                            dx={0}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0F172A',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#FDFCF8',
                                fontSize: '10px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ color: '#D4AF37' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#D4AF37"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            name="الإيرادات"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
