import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as cheerio from 'cheerio'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
    try {
        const { url } = await req.json()

        if (!url) {
            return NextResponse.json({ error: 'الرابط مطلوب' }, { status: 400 })
        }

        // 1. Fetch the raw HTML content
        // We use a robust User-Agent to help bypass basic bot protection
        console.log(`Scraping URL: ${url}`)
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
        })

        if (!response.ok) {
            console.error('Failed to fetch URL:', response.status, response.statusText)
            return NextResponse.json({ error: 'فشل في جلب الصفحة. يرجى التأكد من الرابط.' }, { status: 400 })
        }

        const html = await response.text()
        console.log(`Fetched HTML length: ${html.length}`)

        // 2. Parse HTML text to reduce token count for Gemini (Extract text and images)
        // We use cheerio to extract potentially useful text and image URLs to feed to Gemini, 
        // rather than sending the entire raw HTML which might exceed token limits.
        const $ = cheerio.load(html)

        // Remove scripts, styles, and SVG to clean up text
        $('script, style, svg, noscript, nav, footer').remove()

        // Get structured data if available (JSON-LD)
        let structuredData = ''
        $('script[type="application/ld+json"]').each((_, el) => {
            structuredData += $(el).html() + '\n'
        })

        const textContent = $('body').text().replace(/\s+/g, ' ').substring(0, 15000) // limit text size

        // Extract all images to help Gemini find the best ones
        const imageUrls = new Set<string>()
        $('img').each((_, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('srcset')
            if (src && src.startsWith('http') && !src.includes('icon') && !src.includes('logo')) {
                imageUrls.add(src)
            }
        })
        const possibleImages = Array.from(imageUrls).slice(0, 20).join('\n')

        // 3. Use Gemini to extract and translate details
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        const prompt = `
        You are an expert e-commerce product data extractor. 
        Analyze the following text content, structured JSON-LD (if any), and list of possible image URLs scraped from an e-commerce product page (like AliExpress, Alibaba, or Temu).
        
        Extract the following information and translate the text to well-written, professional Arabic suitable for a high-end Moroccan e-commerce store:
        1. "title": A concise, attractive product title in Arabic.
        2. "description": A detailed, persuasive product description in Arabic with bullet points for features.
        3. "price": Extract the numeric price. Convert it appropriately to Moroccan Dirhams (MAD) if it's in USD or EUR (Assume 1 USD = 10 MAD, 1 EUR = 11 MAD approx). Just return the number without currency symbols.
        4. "category": Categorize the product into one short Arabic category name (e.g., إلكترونيات, ملابس رجالية, ملابس نسائية, عطور, ديكور المنزل).
        5. "images": Select the top 1 to 4 highest quality, main product image URLs from the 'Possible Images' list. Ensure they are absolute, valid HTTP/HTTPS URLs.

        Return EXACTLY a JSON object with NO markdown formatting, NO backticks.
        {
            "title": "Title in Arabic",
            "description": "Description in Arabic",
            "price": 199.99,
            "category": "Category",
            "images": ["url1", "url2"]
        }

        ---
        STRUCTURED DATA:
        ${structuredData}
        
        ---
        TEXT CONTENT:
        ${textContent}

        ---
        POSSIBLE IMAGES:
        ${possibleImages}
        `

        const result = await model.generateContent(prompt)
        const responseText = result.response.text().trim()

        // Clean up markdown if Gemini returned it despite instructions
        let jsonStr = responseText
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }

        const data = JSON.parse(jsonStr)

        return NextResponse.json({ success: true, data })

    } catch (error: any) {
        console.error('API Scrape Error:', error)
        return NextResponse.json({ error: error.message || 'حدث خطأ غير متوقع' }, { status: 500 })
    }
}
