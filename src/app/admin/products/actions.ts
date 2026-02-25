'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addProduct(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string

    // Handle image upload with ordering
    const imageOrderJson = formData.get('imageOrder') as string
    const imageOrder = imageOrderJson ? JSON.parse(imageOrderJson) : null
    const imageFiles = formData.getAll('images') as File[]
    const finalImages: string[] = []

    const supabase = await createClient()

    if (imageOrder && Array.isArray(imageOrder)) {
        for (const item of imageOrder) {
            if (item.type === 'new' && typeof item.fileIndex === 'number') {
                const file = imageFiles[item.fileIndex]
                if (file && file.size > 0) {
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${Math.random()}.${fileExt}`
                    const { error } = await supabase.storage.from('products').upload(fileName, file)
                    if (!error) {
                        const { data } = supabase.storage.from('products').getPublicUrl(fileName)
                        finalImages.push(data.publicUrl)
                    }
                }
            }
        }
    } else {
        // Fallback if no order is provided
        for (const file of imageFiles) {
            if (file.size > 0) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const { error } = await supabase.storage.from('products').upload(fileName, file)
                if (!error) {
                    const { data } = supabase.storage.from('products').getPublicUrl(fileName)
                    finalImages.push(data.publicUrl)
                }
            }
        }
    }

    const { error } = await supabase
        .from('products')
        .insert([{ title, description, price, category, images: finalImages }])

    if (error) {
        console.error('Insert Error:', error)
        return { error: 'Failed to create product' }
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}

export async function updateProduct(formData: FormData) {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const imageOrderJson = formData.get('imageOrder') as string
    const imageOrder = imageOrderJson ? JSON.parse(imageOrderJson) : null
    const imageFiles = formData.getAll('images') as File[]
    const finalImages: string[] = []

    const supabase = await createClient()

    if (imageOrder && Array.isArray(imageOrder)) {
        for (const item of imageOrder) {
            if (item.type === 'existing' && item.url) {
                finalImages.push(item.url)
            } else if (item.type === 'new' && typeof item.fileIndex === 'number') {
                const file = imageFiles[item.fileIndex]
                if (file && file.size > 0) {
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${Math.random()}.${fileExt}`
                    const { error } = await supabase.storage.from('products').upload(fileName, file)
                    if (!error) {
                        const { data } = supabase.storage.from('products').getPublicUrl(fileName)
                        finalImages.push(data.publicUrl)
                    }
                }
            }
        }
    } else {
        // Fallback if no order is provided
        const existingImages = JSON.parse(formData.get('existingImages') as string || '[]')
        finalImages.push(...existingImages)
        for (const file of imageFiles) {
            if (file.size > 0) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const { error } = await supabase.storage.from('products').upload(fileName, file)
                if (!error) {
                    const { data } = supabase.storage.from('products').getPublicUrl(fileName)
                    finalImages.push(data.publicUrl)
                }
            }
        }
    }

    const { error } = await supabase
        .from('products')
        .update({ title, description, price, category, images: finalImages })
        .eq('id', id)

    if (error) {
        console.error('Update Error:', error)
        return { error: 'Failed to update product' }
    }

    revalidatePath('/admin/products')
    redirect('/admin/products')
}

export async function deleteProduct(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Delete Error:', error)
        return { error: 'Failed to delete product' }
    }

    revalidatePath('/admin/products')
}
