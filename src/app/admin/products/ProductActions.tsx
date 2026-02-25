'use client'

import React, { useTransition } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

interface ProductActionsProps {
    productId: string
    title: string
    onDelete: (id: string) => Promise<void>
}

export default function ProductActions({ productId, title, onDelete }: ProductActionsProps) {
    const [isPending, startTransition] = useTransition()

    return (
        <DropdownMenu.Root dir="rtl">
            <DropdownMenu.Trigger asChild>
                <button
                    className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors outline-none"
                    aria-label={`Actions for ${title}`}
                >
                    <MoreHorizontal size={20} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[150px] bg-white rounded-xl shadow-lg border border-gray-100 p-1 animate-in fade-in zoom-in-95 data-[side=top]:slide-in-from-bottom-2 z-50 text-right font-sans"
                    sideOffset={5}
                >
                    <DropdownMenu.Item className="outline-none" asChild>
                        <Link
                            href={`/products/${productId}`}
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-navy hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                            <Eye size={16} className="text-gray-400" />
                            <span>عرض المنتج</span>
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="outline-none" asChild>
                        <Link
                            href={`/admin/products/${productId}/edit`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-navy hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                            <Edit size={16} className="text-blue-500" />
                            <span>تعديل</span>
                        </Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-gray-100 my-1 mx-2" />

                    <DropdownMenu.Item
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors outline-none"
                        onClick={(e) => {
                            e.preventDefault()
                            if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المنتج؟')) {
                                startTransition(async () => {
                                    await onDelete(productId)
                                })
                            }
                        }}
                    >
                        <Trash2 size={16} />
                        <span>{isPending ? 'جاري الحذف...' : 'حذف'}</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
