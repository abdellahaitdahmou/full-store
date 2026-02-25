import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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
            <form
                className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-navy"
                action={signIn}
            >
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gold/20 flex flex-col gap-2">
                    <h2 className="text-3xl font-serif font-bold mb-6 text-center text-navy">تسجيل الدخول للمسؤول</h2>

                    <label className="text-sm font-semibold text-navy mb-1" htmlFor="email">
                        البريد الإلكتروني
                    </label>
                    <input
                        className="rounded-xl px-4 py-3 bg-white border border-gold/30 mb-4 text-left focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all shadow-sm"
                        name="email"
                        placeholder="you@example.com"
                        required
                        dir="ltr"
                    />

                    <label className="text-sm font-semibold text-navy mb-1" htmlFor="password">
                        كلمة المرور
                    </label>
                    <input
                        className="rounded-xl px-4 py-3 bg-white border border-gold/30 mb-6 text-left focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all shadow-sm"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        dir="ltr"
                    />

                    <button className="w-full bg-gold text-white rounded-xl px-4 py-4 font-serif font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-gold/30 hover:-translate-y-1 flex items-center justify-center mb-2">
                        تسجيل الدخول
                    </button>

                    {message && (
                        <p className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-sm">
                            {message === 'Could not authenticate user' ? 'تعذر مصادقة المستخدم. يرجى التحقق من بياناتك.' : message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}
