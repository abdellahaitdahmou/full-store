import Link from 'next/link'
import { CheckCircle, MessageCircle, ShoppingBag } from 'lucide-react'

export default function CheckoutSuccessPage() {
    const whatsappNumber = "+212600000000" // Replace with actual number
    const whatsappMessage = encodeURIComponent("مرحباً، لقد قمت للتو بتقديم طلب على المتجر. أرغب في الحصول على مزيد من المعلومات من فضلكم.")
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${whatsappMessage}`

    return (
        <div className="min-h-screen bg-cream flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-8 border border-gold/20 shadow-sm text-center">

                <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>

                <h2 className="text-3xl font-serif font-bold text-navy mb-4">تم تأكيد الطلب!</h2>

                <p className="text-navy mb-8 leading-relaxed">
                    شكراً لثقتكم. لقد تم تسجيل طلبكم بنجاح.
                    سيتصل بكم فريقنا قريباً جداً لتأكيد شحن طلبكم.
                </p>

                <div className="bg-light-gray border border-gold/10 p-6 rounded-2xl mb-8 text-right">
                    <h3 className="font-serif font-bold text-navy mb-4">الخطوات التالية:</h3>
                    <ul className="space-y-4 text-sm text-gray-600 list-none p-0">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-navy border border-gold text-gold flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                            نتصل بك لتأكيد العنوان.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-navy border border-gold text-gold flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                            شحن سريع إلى مدينتك.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-navy border border-gold text-gold flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                            الدفع عند الاستلام.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#20bd5a] transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                        <MessageCircle size={24} />
                        تواصل عبر واتساب
                    </a>

                    <Link
                        href="/"
                        className="w-full bg-white text-navy border-2 border-gold/30 py-4 px-6 rounded-xl font-bold font-serif text-lg hover:bg-light-gray transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                    >
                        <ShoppingBag size={20} className="text-gold" />
                        العودة للصفحة الرئيسية
                    </Link>
                </div>

            </div>
        </div>
    )
}
