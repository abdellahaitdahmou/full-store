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
      <section className="relative bg-navy text-white pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-black z-0"></div>
        {/* Abstract decorative elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-light-gray blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium mb-6 border border-gold/20">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              جديد وحصري
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-8 leading-tight">
              أفضل المنتجات، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                حتى باب بيتك.
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
              اختر ما تريد وادفع فقط عند الاستلام. الدفع عند التوصيل مضمون ومجرب.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-gold text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 group"
              >
                تصفح المنتجات
                <ArrowRight className="group-hover:-translate-x-1 transition-transform rotate-180" />
              </Link>
              <Link
                href="#features"
                className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/10 text-center"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div className="bg-cream rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gold/10">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-navy shadow-sm">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold font-serif text-lg mb-2 text-navy group-hover:text-gold transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-4 text-gold">
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <Star size={16} fill="currentColor" />
                      <span className="text-xs text-gray-500 mr-1">(أكثر من 50)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-2xl text-navy">
                        {product.price.toFixed(2)} درهم
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-navy group-hover:bg-gold group-hover:text-white transition-colors border border-gold/20">
                        <ArrowRight size={18} className="rotate-180" />
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
