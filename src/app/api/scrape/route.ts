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

        // Extract images with better heuristics
        const imageUrls = new Set<string>()
        const blacklist = ['icon', 'logo', 'avatar', 'button', 'banner', 'ad', 'shipping', 'delivery', 'trust', 'badge', 'payment', 'cart', 'app-download', 'flag', 'sprite', 'loading']

        // 1. Look for meta images (high quality)
        $('meta[property="og:image"], meta[name="twitter:image"], link[rel="image_src"]').each((_, el) => {
            const src = $(el).attr('content') || $(el).attr('href')
            if (src) imageUrls.add(src.startsWith('//') ? `https:${src}` : src)
        })

        // 2. Look for regular images, prioritizing gallery-like patterns
        $('img').each((_, el) => {
            let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('srcset') || $(el).attr('data-lazy-src')
            if (!src) return

            // Handle srcset (take the first/best one)
            if (src.includes(' ')) src = src.split(' ')[0]

            // Clean URL
            if (src.startsWith('//')) src = `https:${src}`

            if (src.startsWith('http')) {
                const lowerSrc = src.toLowerCase()

                // Blacklist common UI elements
                const isBlacklisted = blacklist.some(word => lowerSrc.includes(word))

                // Heuristic: Alibaba/AliExpress product images often have certain patterns
                const isLikelyProduct = lowerSrc.includes('alicdn.com') || lowerSrc.includes('slatic.net') || lowerSrc.includes('.jpg_') || lowerSrc.includes('.png_')

                if (!isBlacklisted && !lowerSrc.endsWith('.svg') && !lowerSrc.endsWith('.gif')) {
                    if (isLikelyProduct) {
                        imageUrls.add(src) // Prioritize
                    } else {
                        // Keep other candidates but they'll be processed later
                        imageUrls.add(src)
                    }
                }
            }
        })

        const possibleImages = Array.from(imageUrls).slice(0, 30)

        // 3. Prepare Image Parts for Gemini Vision (Top 5 only to save tokens)
        const imageCandidates = possibleImages.slice(0, 5)
        const imageParts = await Promise.all(
            imageCandidates.map(async (url) => {
                try {
                    const imgRes = await fetch(url)
                    if (imgRes.ok) {
                        const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
                        if (contentType.startsWith('image/')) {
                            const buffer = await imgRes.arrayBuffer()
                            return {
                                inlineData: {
                                    data: Buffer.from(buffer).toString('base64'),
                                    mimeType: contentType
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Fetch error: ${url}`)
                }
                return null
            })
        )
        const validImageParts = imageParts.filter(p => p !== null) as any[]

        // 4. Use Gemini Flash (latest) for quota stability
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })
        const prompt = `
        Analyze the provided text, JSON-LD, and attached images for this e-commerce product.
        
        CRITICAL GOAL: Extract data and translate to professional Moroccan Arabic.
        
        IMAGE SELECTION RULES (STRICT):
        - You are provided with 5 candidate images visually and their URLs in the list below.
        - Look at the ATTACHED IMAGES. ONLY select the ones that are CLEAR photographs of the actual physical product described in the title.
        - STERNLY REJECT: Logos, delivery trucks, flags, "Free Shipping" icons, checkmarks, trust badges, payment icons, or screenshots of text.
        - If an image only shows a brand name or a small UI fragment, REJECT IT.
        - From the candidate list below, extract ONLY the URLs that correspond to the valid product showcase photos you see in the attachments.
        
        Candidate URLs:
        ${imageCandidates.join(', ')}

        JSON FORMAT (REQUIRED):
        { "title": "Arabic Title", "description": "Arabic Description", "price": 0, "category": "Arabic Category", "images": ["valid_urls_from_list"] }

        PAGE CONTENT (DATA):
        ${structuredData}
        ${textContent.substring(0, 5000)}
        `

        const result = await model.generateContent([prompt, ...validImageParts])
        const responseText = result.response.text().trim()

        let jsonStr = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').replace(/^```\s*/, '').replace(/\s*```$/, '')

        const data = JSON.parse(jsonStr)

        return NextResponse.json({ success: true, data })

    } catch (error: any) {
        console.error('API Scrape Error:', error)
        return NextResponse.json({ error: error.message || 'حدث خطأ غير متوقع' }, { status: 500 })
    }
}
