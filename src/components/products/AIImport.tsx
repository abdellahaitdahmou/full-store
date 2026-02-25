'use client'

import { useState } from 'react'
import { Wand2, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AIImport() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleImport = async () => {
        if (!url) {
            setError('الرجاء إدخال رابط المنتج')
            return
        }

        try {
            setIsLoading(true)
            setError('')
            setSuccess(false)

            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            const responseText = await res.text()
            let result

            try {
                result = JSON.parse(responseText)
            } catch (e) {
                console.error("Failed to parse JSON response:", responseText)
                throw new Error("استجابة الخادم غير صالحة")
            }

            if (!res.ok) {
                throw new Error(result.error || 'فشل استيراد بيانات المنتج')
            }

            if (result.success && result.data) {
                const { title, description, price, category, images } = result.data

                // Auto-fill basic inputs
                const titleInput = document.getElementById('title') as HTMLInputElement
                if (titleInput) titleInput.value = title

                const descInput = document.getElementById('description') as HTMLTextAreaElement
                if (descInput) descInput.value = description

                const priceInput = document.getElementById('price') as HTMLInputElement
                if (priceInput) priceInput.value = price.toString()

                const categoryInput = document.getElementById('category') as HTMLInputElement
                if (categoryInput) categoryInput.value = category

                // We need to inject images into the ImageUploadPreview component.
                // Since ImageUploadPreview in this project manages its own state and reads Native Files, 
                // we'll pass the scraped image URLs to it via a hidden input or global custom event
                // This lets the NewProductPage actions.ts receive these remote URLs directly.

                // For simplicity without modifying ImageUploadPreview internals too much:
                // We will append a hidden input for the scraped images so the server action can read 'existingImages'
                let hiddenInput = document.getElementById('scraped-images') as HTMLInputElement
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input')
                    hiddenInput.type = 'hidden'
                    hiddenInput.id = 'scraped-images'
                    hiddenInput.name = 'existingImages'
                    document.querySelector('form')?.appendChild(hiddenInput)
                }
                // Also trigger a custom event so ImageUploadPreview can show them:
                window.dispatchEvent(new CustomEvent('ai-images-imported', { detail: images }))

                // Store the raw URLs into the hidden input so the server action picks them up instead of Files
                hiddenInput.value = JSON.stringify(images)

                setSuccess(true)
                setTimeout(() => setSuccess(false), 5000)
            } else {
                throw new Error('لم يتم العثور على بيانات')
            }

        } catch (err: any) {
            console.error('Import error:', err)
            setError(err.message || 'حدث خطأ أثناء الاتصال بالخادم')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-gradient-to-br from-[#FFFBF7] to-white rounded-2xl border-2 border-[#FF6600]/20 shadow-sm p-6 mb-6 relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6600]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#FF6600] text-white flex items-center justify-center shadow-lg shadow-[#FF6600]/20 ring-4 ring-[#FF6600]/10 shrink-0">
                    <Wand2 size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-serif font-black text-navy m-0 leading-none">استيراد المنتجات بالذكاء الاصطناعي</h2>
                    <p className="text-xs text-gray-500 mt-1 font-medium">ضع رابط علي إكسبريس، تيمو أو علي بابا لجلب تفاصيل المنتج فوراً</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        <LinkIcon size={18} />
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="أدخل رابط المنتج هنا... (مثال: https://aliexpress.com/item/...)"
                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#FF6600] focus:border-[#FF6600] block pr-12 p-3.5 shadow-sm transition-all"
                        dir="ltr"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleImport}
                    disabled={isLoading || !url}
                    className="sm:w-32 bg-navy text-white hover:bg-navy/90 focus:ring-4 focus:ring-navy/20 font-bold rounded-xl text-sm px-5 py-3.5 text-center flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md transition-all whitespace-nowrap"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>جاري...</span>
                        </>
                    ) : (
                        <>
                            <Wand2 size={18} />
                            <span>استيراد</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-start gap-2 border border-red-100 relative z-10">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="mt-3 text-sm text-green-600 bg-green-50 p-3 rounded-lg flex items-start gap-2 border border-green-100 relative z-10">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>تم استيراد بيانات المنتج بنجاح! تم ملء الحقول تلقائياً.</span>
                </div>
            )}
        </div>
    )
}
