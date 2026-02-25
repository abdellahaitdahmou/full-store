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
    <div className="flex flex-col min-h-screen bg-[#FFFBF7]">
      {/* Quick Drop Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="order-2 lg:order-1 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6600]/10 text-[#FF6600] text-xs font-bold mb-6 border border-[#FF6600]/20 animate-fade-in uppercase tracking-wider">
                Cash on Delivery Available
              </div>
              <h1 className="text-4xl md:text-7xl font-sans font-black tracking-tight mb-6 md:mb-8 leading-[1.1] text-navy animate-slide-up">
                Cash on Delivery <br />
                <span className="text-[#FF6600]">Made Easy.</span>
              </h1>
              <p className="text-base md:text-xl text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up [animation-delay:200ms]">
                Shop your favorite products with confidence. Pay only when your order arrives at your doorstep. Fast, secure, and hassle-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up [animation-delay:400ms]">
                <Link
                  href="/products"
                  className="bg-[#FF6600] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#e65c00] transition-all shadow-[0_10px_30px_rgba(255,102,0,0.3)] flex items-center justify-center gap-2 group"
                >
                  Shop Now
                  <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                </Link>
                <Link
                  href="#features"
                  className="bg-transparent text-navy px-10 py-4 rounded-full font-bold text-lg hover:bg-navy/5 transition-all border-2 border-navy/20 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Image/Graphic */}
            <div className="order-1 lg:order-2 animate-fade-in [animation-delay:300ms]">
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.pexels.com/photos/4464887/pexels-photo-4464887.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Featured Products"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Sale Badge Graphic (Simulating the 50% Sale in the placeholder) */}
                <div className="absolute bottom-6 right-6 bg-white rounded-3xl p-6 shadow-xl animate-float">
                  <div className="text-navy font-black text-2xl mb-1">SALE</div>
                  <div className="text-[#FF6600] font-black text-4xl">50%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern 4-Item Trust Badges section */}
      <section id="features" className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#FFFBF7] flex items-center justify-center text-[#FF6600] mb-4 shadow-sm border border-[#FF6600]/10">
                <Truck size={28} />
              </div>
              <h4 className="font-bold text-navy text-sm md:text-base mb-1">Pay on Delivery</h4>
              <p className="text-[10px] md:text-xs text-gray-400">Trusted in Morocco</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#FFFBF7] flex items-center justify-center text-[#FF6600] mb-4 shadow-sm border border-[#FF6600]/10">
                <Truck size={28} />
              </div>
              <h4 className="font-bold text-navy text-sm md:text-base mb-1">Fast Shipping</h4>
              <p className="text-[10px] md:text-xs text-gray-400">All cities coverage</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#FFFBF7] flex items-center justify-center text-[#FF6600] mb-4 shadow-sm border border-[#FF6600]/10">
                <RefreshCcw size={28} />
              </div>
              <h4 className="font-bold text-navy text-sm md:text-base mb-1">Easy Returns</h4>
              <p className="text-[10px] md:text-xs text-gray-400">7-day guarantee</p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#FFFBF7] flex items-center justify-center text-[#FF6600] mb-4 shadow-sm border border-[#FF6600]/10">
                <ShieldCheck size={28} />
              </div>
              <h4 className="font-bold text-navy text-sm md:text-base mb-1">Secure Shopping</h4>
              <p className="text-[10px] md:text-xs text-gray-400">Best quality assured</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white/50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight mb-4 text-navy">Featured Products</h2>
              <div className="w-20 h-1.5 bg-[#FF6600] rounded-full mx-auto md:mx-0"></div>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-navy font-bold hover:text-[#FF6600] transition-colors group text-lg"
            >
              Shop All Products
              <ArrowRight size={22} className="group-hover:-translate-x-1 transition-transform rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts?.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9]">
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
                    <div className="absolute top-4 left-4 bg-[#FF6600] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
                      New
                    </div>
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      {product.category}
                    </span>
                    <h3 className="font-black text-sm md:text-xl mb-3 text-navy group-hover:text-[#FF6600] transition-colors line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <span className="font-black text-lg md:text-2xl text-[#FF6600]">
                        {product.price} <span className="text-sm font-bold opacity-70">MAD</span>
                      </span>
                      <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center group-hover:bg-[#FF6600] transition-colors shadow-lg shadow-navy/20 group-hover:shadow-[#FF6600]/40">
                        <ArrowRight size={18} className="rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Testimonials */}
      <section className="py-24 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6600]/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px]"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 text-center">
          <h2 className="text-3xl md:text-6xl font-sans font-black tracking-tight mb-20 text-center">
            Happy Customers <br />
            <span className="text-[#FF6600]">Feedback.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Yassine B.", city: "Casablanca", text: "The quality is amazing and delivery was super fast. Highly recommended!" },
              { name: "Fatima Z.", city: "Rabat", text: "Cash on delivery is so convenient. Great service!" },
              { name: "Karim M.", city: "Marrakech", text: "Professional team and authentic products. Very satisfied." }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[40px] text-center hover:bg-white/10 transition-all group">
                <div className="flex text-[#FF6600] justify-center mb-6 gap-1">
                  {[1, 2, 3, 4, 5].map(j => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-xl text-gray-300 mb-8 font-medium leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="text-white font-black text-xl">{t.name}</div>
                <div className="text-[#FF6600] text-sm font-bold uppercase tracking-widest mt-1">{t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
