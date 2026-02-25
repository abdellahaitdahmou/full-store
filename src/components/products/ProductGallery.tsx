'use client'

import { useState } from 'react'

interface ProductGalleryProps {
    images: string[]
    title: string
    category: string
}

export default function ProductGallery({ images, title, category }: ProductGalleryProps) {
    const [mainImage, setMainImage] = useState(images?.[0] || '')
    const [isHovering, setIsHovering] = useState(false)

    // Additional skill: image zoom effect
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setMousePos({ x, y })
    }

    return (
        <div className="lg:w-1/2 p-4 md:p-12 bg-gray-50 flex flex-col justify-center items-center relative gap-4 rounded-t-[40px] lg:rounded-tr-none lg:rounded-l-[40px]">
            <div className="absolute top-6 left-6 z-10 hidden md:block">
                <div className="bg-[#FF6600] text-white text-[10px] sm:text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg uppercase tracking-wider backdrop-blur-sm bg-opacity-90">
                    {category}
                </div>
            </div>

            {mainImage ? (
                <div
                    className="relative w-full max-w-lg aspect-square overflow-hidden rounded-3xl cursor-zoom-in bg-white group shadow-sm ring-1 ring-black/5"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onMouseMove={handleMouseMove}
                >
                    <img
                        src={mainImage}
                        alt={title}
                        className={`w-full h-full object-contain transition-all duration-300 ${isHovering ? 'scale-[2] opacity-0' : 'scale-100 opacity-100'}`}
                        style={{
                            transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                        }}
                    />

                    {/* Zoom Overlay (visible on hover) */}
                    <div
                        className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            backgroundImage: `url(${mainImage})`,
                            backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                            backgroundSize: '200%',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>
            ) : (
                <div className="w-full max-w-lg aspect-square bg-white rounded-3xl flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200">
                    لا توجد صورة
                </div>
            )}

            {/* Thumbnails Showcase */}
            {images?.length > 1 && (
                <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-4 overflow-x-auto w-full justify-center pb-2 px-2 hide-scrollbar">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setMainImage(img)}
                            className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm flex-shrink-0 relative group p-1 bg-white
                                ${mainImage === img
                                    ? 'border-[#FF6600] scale-105 shadow-md shadow-[#FF6600]/10'
                                    : 'border-transparent hover:border-gray-300 hover:scale-105'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${i}`}
                                className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                            />
                            {/* Hover overlay for better UX */}
                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${mainImage === img ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />
                        </div>
                    ))}
                </div>
            )}

            {/* Interactive hint */}
            {images?.length > 1 && (
                <div className="text-xs text-gray-400 font-medium flex items-center justify-center gap-1.5 animate-pulse mt-2 hidden sm:flex">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                    مرر الماوس للتكبير، واضغط على الصور المصغرة للتغيير
                </div>
            )}
        </div>
    )
}
