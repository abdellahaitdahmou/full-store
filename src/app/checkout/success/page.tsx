import Link from 'next/link'
import { CheckCircle, MessageCircle, ShoppingBag } from 'lucide-react'

export default function CheckoutSuccessPage() {
    const whatsappNumber = "+212600000000" // Replace with actual number
    const whatsappMessage = encodeURIComponent("مرحباً، لقد قمت للتو بتقديم طلب على المتجر. أرغب في الحصول على مزيد من المعلومات من فضلكم.")
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${whatsappMessage}`

    return (
        <div className="min-h-screen bg-[#FFFBF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto bg-white rounded-[40px] p-10 border-2 border-gray-50 shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6600]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                <div className="w-24 h-24 bg-orange-50 text-[#FF6600] rounded-[30px] flex items-center justify-center mx-auto mb-8 border-2 border-orange-100 shadow-lg">
                    <CheckCircle size={48} />
                </div>

                <h2 className="text-4xl font-black text-navy mb-4 uppercase tracking-tight">تم بنجاح!</h2>

                <p className="text-gray-500 font-bold mb-10 leading-relaxed text-lg">
                    شكراً لثقتكم. لقد تم تسجيل طلبكم وسنتواصل بكم في أقرب وقت ممكن.
                </p>

                <div className="bg-gray-50 border-2 border-gray-100 p-8 rounded-[32px] mb-10 text-right">
                    <h3 className="font-black text-navy mb-6 uppercase tracking-wider text-sm flex items-center gap-2 justify-end">
                        <span>الخطوات التالية</span>
                        <span className="w-6 h-1 bg-[#FF6600] rounded-full"></span>
                    </h3>
                    <ul className="space-y-5 text-sm font-bold text-gray-600">
                        <li className="flex items-center gap-4 justify-end">
                            <span>نتصل بك لتأكيد العنوان</span>
                            <span className="w-8 h-8 rounded-xl bg-white border-2 border-gray-100 text-navy flex items-center justify-center flex-shrink-0 text-xs font-black shadow-sm">1</span>
                        </li>
                        <li className="flex items-center gap-4 justify-end">
                            <span>شحن مجاني إلى باب منزلك</span>
                            <span className="w-8 h-8 rounded-xl bg-white border-2 border-gray-100 text-navy flex items-center justify-center flex-shrink-0 text-xs font-black shadow-sm">2</span>
                        </li>
                        <li className="flex items-center gap-4 justify-end">
                            <span>الدفع كاش عند الاستلام</span>
                            <span className="w-8 h-8 rounded-xl bg-white border-2 border-gray-100 text-navy flex items-center justify-center flex-shrink-0 text-xs font-black shadow-sm">3</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] text-white py-5 px-6 rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-xl shadow-green-100 hover:-translate-y-1 flex items-center justify-center gap-3 uppercase"
                    >
                        <MessageCircle size={24} />
                        تواصل عبر واتساب
                    </a>

                    <Link
                        href="/"
                        className="w-full bg-white text-navy border-2 border-gray-100 py-5 px-6 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm uppercase"
                    >
                        <ShoppingBag size={22} className="text-[#FF6600]" />
                        الرجوع للمتجر
                    </Link>
                </div>

            </div>
        </div>
    )
}
