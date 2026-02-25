import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Truck, ShieldCheck, RefreshCcw, ArrowRight, Star } from 'lucide-react'

export const revalidate = 0 // Opt out of static rendering for products fetch

export default async function Home() {
  const supabase = await createClient()

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .limit(4)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-navy text-white pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Image Background */}
        <img
          src="https://images.pexels.com/photos/4464887/pexels-photo-4464887.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury Packaging Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/40 to-navy/90 z-0"></div>
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        {/* Abstract decorative elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-light-gray blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-medium mb-6 border border-gold/20 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              جديد وحصري
            </div>
            <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight mb-6 md:mb-8 leading-tight animate-slide-up [animation-delay:200ms]">
              أفضل المنتجات، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gold/80 to-white animate-shimmer">
                حتى باب بيتك.
              </span>
            </h1>
            <p className="text-base md:text-xl text-gray-300 md:text-gray-400 mb-8 md:10 max-w-xl leading-relaxed animate-slide-up [animation-delay:400ms]">
              اختر ما تريد وادفع فقط عند الاستلام. الدفع عند التوصيل مضمون ومجرب في جميع أنحاء المغرب.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up [animation-delay:600ms]">
              <Link
                href="/products"
                className="bg-gold text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group"
              >
                تصفح المنتجات
                <ArrowRight className="group-hover:-translate-x-1 transition-transform rotate-180" />
              </Link>
              <Link
                href="#features"
                className="bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all border border-white/20 text-center"
              >
                اعرف المزيد
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section id="features" className="py-16 bg-cream border-b border-gold/10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white hover:bg-light-gray transition-colors border border-gold/10 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold mb-2 text-navy">الدفع عند التوصيل</h3>
                <p className="text-gray-500 leading-relaxed">ادفع نقداً عند استلام المنتج في بيتك كما تريد.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white hover:bg-light-gray transition-colors border border-gold/10 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold mb-2 text-navy">توصيل سريع</h3>
                <p className="text-gray-500 leading-relaxed">نوصله لك في أقرب وقت إلى جميع المدن في المغرب.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white hover:bg-light-gray transition-colors border border-gold/10 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                <RefreshCcw size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold mb-2 text-navy">إرجاع سهل</h3>
                <p className="text-gray-500 leading-relaxed">المنتج لم يعجبك؟ لديك الحق في إرجاعه خلال 7 أيام.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-light-gray">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4 text-navy">مختارات المتجر</h2>
              <p className="text-gray-500 text-lg">الأكثر مبيعاً في المغرب.</p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-navy font-semibold hover:text-gold transition-colors group"
            >
              جميع المنتجات
              <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featuredProducts?.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gold/10 flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-navy/80 backdrop-blur-md text-[8px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full text-gold shadow-sm border border-gold/20">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-3 md:p-6 flex flex-col flex-1">
                    <h3 className="font-bold font-serif text-sm md:text-lg mb-1 md:mb-2 text-navy group-hover:text-gold transition-colors line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-0.5 md:gap-1 mb-2 md:mb-4 text-gold shrink-0">
                      <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                      <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                      <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                      <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                      <Star size={10} fill="currentColor" className="md:w-4 md:h-4" />
                      <span className="text-[10px] md:text-xs text-gray-500 mr-1">(50+)</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="font-black text-sm md:text-2xl text-navy">
                          {product.price} <span className="text-[10px] md:text-sm font-bold">د.م</span>
                        </span>
                      </div>
                      <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300 border border-gold/20">
                        <ArrowRight size={14} className="rotate-180 md:w-[18px] md:h-[18px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-navy text-gold border border-gold/30 px-8 py-4 rounded-full font-semibold"
            >
              جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 bg-navy text-white border-t border-gold/10">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-16">
            عملاؤنا دائماً <span className="text-gold italic">سعداء</span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-gold/20 p-8 rounded-3xl text-right hover:bg-white/10 transition-colors">
              <div className="flex text-gold justify-end mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="text-lg text-gray-300 mb-6 italic leading-relaxed">
                "المنتج رائع جداً والتوصيل سريع. شكراً المتجر!"
              </p>
              <div className="font-bold font-serif text-lg text-gold">- ياسين ب.</div>
              <div className="text-sm text-gray-500">الدار البيضاء</div>
            </div>
            <div className="bg-white/5 border border-gold/20 p-8 rounded-3xl text-right hover:bg-white/10 transition-colors">
              <div className="flex text-gold justify-end mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="text-lg text-gray-300 mb-6 italic leading-relaxed">
                "الدفع عند الاستلام مريح حقاً، والتوصيل في الموعد."
              </p>
              <div className="font-bold font-serif text-lg text-gold">- فاطمة ز.</div>
              <div className="text-sm text-gray-500">الرباط</div>
            </div>
            <div className="bg-white/5 border border-gold/20 p-8 rounded-3xl text-right hover:bg-white/10 transition-colors">
              <div className="flex text-gold justify-end mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="text-lg text-gray-300 mb-6 italic leading-relaxed">
                "جودة ممتازة وفريق عمل محترف، لا توجد أي مشاكل."
              </p>
              <div className="font-bold font-serif text-lg text-gold">- كريم م.</div>
              <div className="text-sm text-gray-500">مراكش</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
