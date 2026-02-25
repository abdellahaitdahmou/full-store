'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(formData: FormData) {
    const id = formData.get('id') as string
    const status = formData.get('status') as string

    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('Update Order Error:', error)
        return { error: 'Failed to update order status' }
    }

    revalidatePath('/admin/orders')
    revalidatePath('/admin/dashboard')
}
