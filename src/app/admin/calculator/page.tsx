'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, DollarSign, PackageOpen, Truck, Megaphone, ShoppingBag, RotateCcw } from 'lucide-react'

export default function CalculatorPage() {
    // Core parameters (default values simulating a typical ecom order)
    const [sellingPrice, setSellingPrice] = useState<number>(199)
    const [cogs, setCogs] = useState<number>(50) // Cost of Goods Sold
    const [adSpend, setAdSpend] = useState<number>(30) // CPA (Cost Per Acquisition)
    const [shipping, setShipping] = useState<number>(40)
    const [fulfillment, setFulfillment] = useState<number>(15) // Call center + packaging

    // Performance metrics
    const [dailyVolume, setDailyVolume] = useState<number>(20)
    const [returnRate, setReturnRate] = useState<number>(25) // 25% delivery failure / return rate

    // ------------------------------------------------------------------------
    // CALCULATIONS
    // ------------------------------------------------------------------------

    // Delivery Math
    const successfulDeliveries = dailyVolume * (1 - (returnRate / 100))
    const failedDeliveries = dailyVolume * (returnRate / 100)

    // Gross Revenue
    const dailyRevenue = successfulDeliveries * sellingPrice

    // Daily Costs
    // Ad spend applies to ALL orders (successful or not, you paid for the conversion)
    const totalDailyAdSpend = dailyVolume * adSpend

    // COGS applies to ALL orders initially, but returned products restock (excluding damaged goods)
    // For simplicity, we assume 100% of returned goods are restockable, so COGS is only "lost" on successful deliveries.
    const totalDailyCogs = successfulDeliveries * cogs

    // Fulfillment (Call Center + Packaging) applies to ALL orders since it takes effort to pack and call them
    const totalDailyFulfillment = dailyVolume * fulfillment

    // Shipping Cost applies to ALL shipped orders. Returned orders often cost shipping both ways, 
    // but typically ecom platforms negotiate a flat "Return fee". We'll assume the shipping cost is paid regardless.
    const totalDailyShipping = dailyVolume * shipping

    // Net Profit
    const totalDailyCosts = totalDailyAdSpend + totalDailyCogs + totalDailyFulfillment + totalDailyShipping
    const dailyNetProfit = dailyRevenue - totalDailyCosts

    // Monthly Projections
    const monthlyRevenue = dailyRevenue * 30
    const monthlyProfit = dailyNetProfit * 30
    const monthlyCosts = totalDailyCosts * 30

    // Margins
    const netMargin = dailyRevenue > 0 ? (dailyNetProfit / dailyRevenue) * 100 : 0
    const roi = totalDailyCosts > 0 ? (dailyNetProfit / totalDailyCosts) * 100 : 0

    // Per Successful Order Profit
    const profitPerSuccessfulOrder = successfulDeliveries > 0 ? dailyNetProfit / successfulDeliveries : 0

    // Helper to format currency
    const formatDH = (val: number) => {
        return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(val).replace('MAD', 'درهم')
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-navy flex items-center gap-3">
                        <Calculator className="text-gold" />
                        المحاكاة والأرباح
                    </h1>
                    <p className="text-gray-500 mt-1">حاسبة التجارة الإلكترونية لمعرفة صافي الربح الحقيقي وحساب العائد على الاستثمار.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Inputs Column */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <ShoppingBag className="text-gray-400" size={20} />
                            معطيات المنتج (الطلب الواحد)
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                    <span>سعر البيع للزبون</span>
                                    <span className="text-navy">{sellingPrice} درهم</span>
                                </label>
                                <input
                                    type="range" min="0" max="1000" step="1"
                                    value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                    <span>تكلفة المنتج (رأس المال)</span>
                                    <span className="text-navy">{cogs} درهم</span>
                                </label>
                                <input
                                    type="range" min="0" max="500" step="1"
                                    value={cogs} onChange={(e) => setCogs(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <DollarSign className="text-gray-400" size={20} />
                            المصاريف والتسويق (الطلب الواحد)
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                    <span className="flex items-center gap-1.5"><Megaphone size={14} className="text-gray-500" /> تكلفة الإعلان للمبيعة (CPA)</span>
                                    <span className="text-navy">{adSpend} درهم</span>
                                </label>
                                <input
                                    type="range" min="0" max="200" step="1"
                                    value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                    <span className="flex items-center gap-1.5"><Truck size={14} className="text-gray-500" /> تكلفة التوصيل بالشحن</span>
                                    <span className="text-navy">{shipping} درهم</span>
                                </label>
                                <input
                                    type="range" min="0" max="100" step="1"
                                    value={shipping} onChange={(e) => setShipping(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                    <span className="flex items-center gap-1.5"><PackageOpen size={14} className="text-gray-500" /> تأكيد الطلب والتغليف</span>
                                    <span className="text-navy">{fulfillment} درهم</span>
                                </label>
                                <input
                                    type="range" min="0" max="50" step="1"
                                    value={fulfillment} onChange={(e) => setFulfillment(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500"></div>
                        <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <TrendingUp className="text-gray-400" size={20} />
                            توقعات المبيعات والمرتجعات
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                    <span>عدد المبيعات اليومية</span>
                                    <span className="font-bold text-navy">{dailyVolume} مبيعة</span>
                                </label>
                                <input
                                    type="range" min="1" max="200" step="1"
                                    value={dailyVolume} onChange={(e) => setDailyVolume(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                    <span className="flex items-center gap-1.5"><RotateCcw size={14} className="text-red-500" /> نسبة المرتجعات (Retour)</span>
                                    <span className="font-bold text-red-600">{returnRate}%</span>
                                </label>
                                <input
                                    type="range" min="0" max="100" step="1"
                                    value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))}
                                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Outputs Column */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Monthly Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-navy rounded-3xl p-6 text-white shadow-xl shadow-navy/20 relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                            <div className="relative z-10">
                                <p className="text-white/60 font-medium text-sm mb-1">الربح الصافي (شهرياً)</p>
                                <h3 className={`text-4xl font-black tracking-tight ${monthlyProfit >= 0 ? 'text-gold' : 'text-red-400'}`}>
                                    {formatDH(monthlyProfit)}
                                </h3>
                                <div className="mt-4 flex items-center gap-4 text-sm bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div>
                                        <p className="text-white/40 text-xs mb-0.5">الربح اليومي</p>
                                        <p className="font-bold">{formatDH(dailyNetProfit)}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-0.5">الربح لكل طلب ناجح</p>
                                        <p className="font-bold text-emerald-400">{formatDH(profitPerSuccessfulOrder)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                            <p className="text-gray-500 font-medium text-sm mb-1">المداخيل الإجمالية (شهرياً)</p>
                            <h3 className="text-3xl font-black tracking-tight text-navy mb-2">
                                {formatDH(monthlyRevenue)}
                            </h3>
                            <div className="space-y-2 mt-4">
                                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">العائد على الاستثمار (ROI)</span>
                                    <span className={`font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">هامش الربح (Net Margin)</span>
                                    <span className={`font-bold ${netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {netMargin.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">إجمالي المصاريف الشهرية</span>
                                    <span className="font-bold text-red-500">-{formatDH(monthlyCosts)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-navy mb-6">هيكلة التكاليف اليومية (بناءً على {dailyVolume} مبيعة)</h2>

                        <div className="space-y-6">
                            {/* Bar visualization */}
                            <div className="w-full h-8 bg-gray-100 rounded-full flex overflow-hidden">
                                {monthlyProfit > 0 && (
                                    <div
                                        style={{ width: `${(dailyNetProfit / dailyRevenue) * 100}%` }}
                                        className="bg-gold h-full"
                                        title="الربح"
                                    ></div>
                                )}
                                <div
                                    style={{ width: `${(totalDailyCogs / Math.max(dailyRevenue, totalDailyCosts)) * 100}%` }}
                                    className="bg-navy h-full opacity-80"
                                    title="تكلفة المنتج"
                                ></div>
                                <div
                                    style={{ width: `${(totalDailyAdSpend / Math.max(dailyRevenue, totalDailyCosts)) * 100}%` }}
                                    className="bg-blue-500 h-full opacity-80"
                                    title="الإعلانات"
                                ></div>
                                <div
                                    style={{ width: `${(totalDailyShipping / Math.max(dailyRevenue, totalDailyCosts)) * 100}%` }}
                                    className="bg-amber-500 h-full opacity-80"
                                    title="التوصيل"
                                ></div>
                                <div
                                    style={{ width: `${(totalDailyFulfillment / Math.max(dailyRevenue, totalDailyCosts)) * 100}%` }}
                                    className="bg-green-500 h-full opacity-80"
                                    title="التغليف"
                                ></div>
                            </div>

                            {/* Legend */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gold"></div>
                                        <span className="font-semibold text-gray-700">الربح الصافي</span>
                                    </div>
                                    <p className="font-bold text-navy text-sm mr-4">{formatDH(Math.max(0, dailyNetProfit))}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-navy opacity-80"></div>
                                        <span className="font-semibold text-gray-700">تكلفة المنتجات المحصلة</span>
                                    </div>
                                    <p className="font-bold text-navy text-sm mr-4">{formatDH(totalDailyCogs)}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-80"></div>
                                        <span className="font-semibold text-gray-700">الإعلانات (لجميع الطلبات)</span>
                                    </div>
                                    <p className="font-bold text-navy text-sm mr-4">{formatDH(totalDailyAdSpend)}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-80"></div>
                                        <span className="font-semibold text-gray-700">التوصيل (لجميع الطلبات)</span>
                                    </div>
                                    <p className="font-bold text-navy text-sm mr-4">{formatDH(totalDailyShipping)}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80"></div>
                                        <span className="font-semibold text-gray-700">التأكيد والتغليف</span>
                                    </div>
                                    <p className="font-bold text-navy text-sm mr-4">{formatDH(totalDailyFulfillment)}</p>
                                </div>

                                <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex flex-col justify-center items-center text-center">
                                    <div className="font-semibold text-red-600 mb-1">الطلبات الفاشلة</div>
                                    <p className="font-black text-red-500 text-lg">{Math.round(failedDeliveries)} <span className="text-xs font-normal">يومياً</span></p>
                                </div>
                            </div>

                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed mt-4">
                                <strong className="font-bold mr-1">ملاحظة محاسباتية:</strong> يقوم النظام بحساب تكاليف الإعلانات، التوصيل، والتغليف بشكل كامل لجميع الطلبات (الناجحة والفاشلة/المرتجعة). في حين يتم خصم "تكلفة المنتج" (رأس المال) فقط للطلبات الناجحة لأن المنتجات المرتجعة تعود إلى المخزون ويمكن إعادة بيعها. هذه الحسابات تُعطيك أدق تصور للربح المالي في التجارة الإلكترونية بنظام الدفع عند الاستلام.
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
