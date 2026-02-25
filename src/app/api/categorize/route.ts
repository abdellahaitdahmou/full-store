import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API Key is not configured.' }, { status: 500 })
        }

        const body = await request.json()
        const { title, description } = body

        if (!title && !description) {
            return NextResponse.json({ error: 'Product title or description is required.' }, { status: 400 })
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: 'أنت خبير تصنيف منتجات لمتاجر التجارة الإلكترونية. دائمًا رد فقط باسم القسم أو التصنيف الأنسب (مثلاً: إلكترونيات، ملابس، عطور، ساعات، المنزل، ديكور، إلخ). لا تضف أي شرح إضافي أو جمل أخرى فقط اكتب اسم القسم ككلمة أو كلمتين باللغة العربية.',
            generationConfig: {
                temperature: 0.2, // Low temperature for consistent classification
            }
        })

        const prompt = `صنف المنتج التالي بأفضل قسم ممكن:
العنوان: ${title || 'غير متوفر'}
الوصف: ${description || 'غير متوفر'}`

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        // Clean up the response just in case
        const category = responseText.trim().replace(/^['"*\-.]+/, '').replace(/['"*\-.]+$/, '').trim()

        return NextResponse.json({ category })

    } catch (error: any) {
        console.error('Categorization error:', error)
        return NextResponse.json({ error: error.message || 'Failed to categorize product' }, { status: 500 })
    }
}
