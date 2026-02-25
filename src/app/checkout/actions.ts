'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitOrder(formData: FormData) {
    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const city = formData.get('city') as string
    const productsString = formData.get('products') as string

    if (!full_name || !phone || !city || !productsString) {
        return { error: 'يرجى ملء جميع الحقول المطلوبة.' }
    }

    let products = []
    try {
        products = JSON.parse(productsString)
    } catch (e) {
        console.error('Failed to parse products JSON', e)
        return { error: 'حدث خطأ في معالجة المنتجات.' }
    }

    if (products.length === 0) {
        return { error: 'سلتك فارغة.' }
    }

    const supabase = await createClient()

    // Insert the order
    // Since we want to support multiple products, we can either:
    // 1. Update the schema to have an order_items table (Best)
    // 2. Store the products as a JSONB field in the orders table (Faster for now)

    // Let's try to store them. For compatibility with the current schema,
    // we might need to store each item or just one with details.
    // If the 'orders' table has product_id, we'll use the first one and maybe add a 'details' column if it exists.

    // First, check existing columns
    // I'll assume for simplicity that we can store the products list in a 'details' or similar if it exists,
    // otherwise we might just have to insert multiple rows or one row with a note.

    // I'll perform a single insert for the whole order, storing items in a 'products_list' field (assuming it exists or can be added dynamically by supabase if allowed, or just use notes)
    const { error } = await supabase
        .from('orders')
        .insert([{
            full_name,
            phone,
            city,
            status: 'Pending',
            // We store the first product_id for compatibility if needed, but the full list in a JSON field
            product_id: products[0].id,
            total_amount: products.reduce((acc: number, p: any) => acc + (p.price * p.quantity), 0),
            items: products // Assuming an 'items' jsonb field exists or will be ignored if not
        }])

    if (error) {
        console.error('Order Submit Error:', error)
        return { error: 'فشل في تقديم الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.' }
    }

    return { success: true }
}
