import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ShieldCheck, ArrowRight } from 'lucide-react'

export default async function AdminLogin({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const signIn = async (formData: FormData) => {
        'use server'

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return redirect('/admin/login?message=Could not authenticate user')
        }

        return redirect('/admin/dashboard')
    }

    const { message } = await searchParams

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 min-h-screen mx-auto">
            <div className="flex flex-col items-center mb-8 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-[#FF6600]/10 flex items-center justify-center text-[#FF6600] mb-4 shadow-sm border border-[#FF6600]/10">
                    <ShieldCheck size={40} />
                </div>
                <h1 className="text-4xl font-sans font-black tracking-tight flex items-center gap-1 text-navy">
                    <span>كويك</span>
                    <span className="text-[#FF6600]">دروب</span>
                </h1>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">لوحة التحكم</p>
            </div>

            <form
                className="animate-slide-up flex-1 flex flex-col w-full justify-center gap-2 text-navy [animation-delay:200ms]"
                action={signIn}
            >
                <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-2">
                    <h2 className="text-2xl font-black mb-8 text-center text-navy leading-tight">تسجيل الدخول <br /><span className="text-[#FF6600]">للمسؤول</span></h2>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block text-right" htmlFor="email">
                                البريد الإلكتروني
                            </label>
                            <input
                                className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-[#FF6600]/10 focus:border-[#FF6600] outline-none transition-all text-left font-medium"
                                name="email"
                                placeholder="you@example.com"
                                required
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block text-right" htmlFor="password">
                                كلمة المرور
                            </label>
                            <input
                                className="w-full rounded-2xl px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-[#FF6600]/10 focus:border-[#FF6600] outline-none transition-all text-left font-medium"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <button className="w-full bg-[#FF6600] text-white rounded-2xl px-6 py-5 font-black text-lg hover:bg-[#e65c00] transition-all shadow-[0_10px_30px_rgba(255,102,0,0.3)] hover:-translate-y-1 flex items-center justify-center mt-8 group">
                        تسجيل الدخول
                        <ArrowRight size={20} className="mr-2 group-hover:-translate-x-1 transition-transform rotate-180" />
                    </button>

                    {message && (
                        <p className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center text-xs font-bold">
                            {message === 'Could not authenticate user' ? 'تعذر مصادقة المستخدم. يرجى التحقق من بياناتك.' : message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}
