'use client'

import { useState, useEffect, useRef } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type ImageItem = {
    id: string;
    type: 'existing' | 'new';
    url: string;
    file?: File;
}

function SortableImage({ item, onRemove, isCover }: { item: ImageItem, onRemove: (id: string) => void, isCover: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="relative group flex-shrink-0 touch-none">
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <img
                    src={item.url}
                    alt="Preview"
                    className={`w-28 h-28 object-cover rounded-xl border-2 transition-all ${isCover ? 'border-gold shadow-md scale-[1.02]' : 'border-gray-200 shadow-sm hover:border-gold/50'}`}
                />
            </div>
            {isCover && (
                <div className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 pointer-events-none">
                    الغلاف
                </div>
            )}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove(item.id)
                }}
                className="absolute -top-2 -left-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600 focus:outline-none z-10"
                title="حذف الصورة"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    )
}

export default function ImageUploadPreview({ existingImages = [] }: { existingImages?: string[] }) {
    const [items, setItems] = useState<ImageItem[]>(() =>
        existingImages.map((url, i) => ({
            id: `existing-${i}`,
            type: 'existing',
            url
        }))
    )

    const fileInputRef = useRef<HTMLInputElement>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            const newItems: ImageItem[] = files.map(file => ({
                id: `new-${Math.random().toString(36).substring(7)}`,
                type: 'new',
                url: URL.createObjectURL(file),
                file
            }))
            setItems(prev => [...prev, ...newItems])
        }
        // Reset so same files can be selected again
        e.target.value = ''
    }

    const handleRemove = (id: string) => {
        setItems(prev => {
            const item = prev.find(i => i.id === id)
            if (item && item.type === 'new') {
                URL.revokeObjectURL(item.url)
            }
            return prev.filter(i => i.id !== id)
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id)
                const newIndex = items.findIndex(item => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    // Sync the unified item list to the hidden actual file input
    useEffect(() => {
        if (fileInputRef.current) {
            const dt = new DataTransfer()
            items.filter(item => item.type === 'new').forEach(item => {
                if (item.file) dt.items.add(item.file)
            })
            fileInputRef.current.files = dt.files
        }
    }, [items])

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            items.forEach(item => {
                if (item.type === 'new') {
                    URL.revokeObjectURL(item.url)
                }
            })
        }
    }, [])

    // Listen for AI imported images
    useEffect(() => {
        const handleAIImages = (event: any) => {
            const imageUrls = event.detail
            if (Array.isArray(imageUrls)) {
                const newItems: ImageItem[] = imageUrls.map((url, i) => ({
                    id: `ai-${Math.random().toString(36).substring(7)}-${i}`,
                    type: 'existing', // Treat scraped URLs as 'existing' so they are saved as URLs
                    url
                }))
                setItems(prev => [...prev, ...newItems])
            }
        }

        window.addEventListener('ai-images-imported', handleAIImages)
        return () => window.removeEventListener('ai-images-imported', handleAIImages)
    }, [])

    const imageOrderMetadata = items.map(item => {
        if (item.type === 'existing') {
            return { type: 'existing', url: item.url }
        } else {
            const newFilesOnly = items.filter(i => i.type === 'new')
            const fileIndex = newFilesOnly.findIndex(i => i.id === item.id)
            return { type: 'new', fileIndex }
        }
    })

    return (
        <div>
            {/* Hidden inputs to send metadata and actual files to Server Action */}
            <input type="hidden" name="imageOrder" value={JSON.stringify(imageOrderMetadata)} />
            <input type="file" name="images" multiple className="hidden" ref={fileInputRef} />

            {items.length > 0 && (
                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-3">اسحب الصور لترتيبها. الصورة الأولى ستكون هي الغلاف الأساسي للمنتج.</p>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map(i => i.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar pt-2 px-2 -mx-2">
                                {items.map((item, index) => (
                                    <SortableImage
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemove}
                                        isCover={index === 0}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            <label htmlFor="image-upload" className="block text-sm font-bold text-navy mb-3">
                {items.length > 0 ? 'إضافة المزيد من الصور' : 'صور العرض'}
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50/50 transition-colors focus-within:ring-2 focus-within:ring-gold/30 focus-within:border-gold group cursor-pointer relative">
                <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    </div>
                    <p className="text-navy font-bold text-sm mb-1">انقر للرفع أو اسحب الصور</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP حتى 5 ميجابايت</p>
                </div>
            </div>
        </div>
    )
}
