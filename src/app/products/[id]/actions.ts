'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitOrder(formData: FormData) {
    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const city = formData.get('city') as string
    const product_id = formData.get('product_id') as string

    const supabase = await createClient()

    // Basic validation
    if (!full_name || !phone || !city || !product_id) {
        return { error: 'Please fill out all fields' }
    }

    const { error } = await supabase
        .from('orders')
        .insert([{ full_name, phone, city, product_id, status: 'Pending' }])

    if (error) {
        console.error('Order Submit Error:', error)
        return { error: 'Failed to submit order. Please try again or contact us on WhatsApp.' }
    }

    return { success: true }
}
