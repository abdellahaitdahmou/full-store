'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function AIAutoCategorizeButton({
    titleId = 'title',
    descriptionId = 'description',
    categoryId = 'category'
}: {
    titleId?: string,
    descriptionId?: string,
    categoryId?: string
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAutoCategorize = async () => {
        setError(null)

        const titleElement = document.getElementById(titleId) as HTMLInputElement
        const descriptionElement = document.getElementById(descriptionId) as HTMLTextAreaElement
        const categoryElement = document.getElementById(categoryId) as HTMLInputElement

        if (!titleElement || !descriptionElement || !categoryElement) {
            setError('Error locating form fields')
            return
        }

        const title = titleElement.value.trim()
        const description = descriptionElement.value.trim()

        if (!title && !description) {
            setError('يرجى إدخال العنوان أو الوصف أولاً')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/categorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to categorize')
            }

            if (data.category) {
                categoryElement.value = data.category

                // Add a brief highlight animation to the category input
                categoryElement.classList.add('ring-2', 'ring-purple-400', 'bg-purple-50/50')
                setTimeout(() => {
                    categoryElement.classList.remove('ring-2', 'ring-purple-400', 'bg-purple-50/50')
                }, 1500)
            }
        } catch (err: any) {
            console.error(err)
            setError('حدث خطأ أثناء التصنيف')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-start w-full">
            <button
                type="button"
                onClick={handleAutoCategorize}
                disabled={isLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm border ${isLoading
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 text-indigo-700 border-purple-200 hover:border-purple-300 hover:shadow hover:from-purple-100 hover:to-pink-100'
                    }`}
            >
                {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                    <Sparkles size={16} className="text-purple-500" />
                )}
                {isLoading ? 'جاري التحليل...' : 'تصنيف ذكي ✨'}
            </button>
            {error && <span className="text-red-500 text-xs mt-2">{error}</span>}
        </div>
    )
}
