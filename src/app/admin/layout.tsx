import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrderNotificationListener from './OrderNotificationListener'
import AdminShell from './AdminShell'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const signOut = async () => {
        'use server'
        const supabaseAction = await createClient()
        await supabaseAction.auth.signOut()
        redirect('/admin/login')
    }

    return (
        <>
            {/* Global Order Real-time Listener */}
            <OrderNotificationListener />

            <AdminShell signOutAction={signOut}>
                {children}
            </AdminShell>
        </>
    )
}
