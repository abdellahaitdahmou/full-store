'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, PackageSearch } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

type OrderNotification = {
    id: string;
    orderId: string;
    customerName: string;
    city: string;
    time: Date;
    read: boolean;
    imageUrl?: string | null;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<OrderNotification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const unreadCount = notifications.filter(n => !n.read).length

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    useEffect(() => {
        const supabase = createClient()

        // Helper to extract image
        const getFirstImageUrl = (productData: any) => {
            try {
                if (productData && productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
                    const img = productData.images[0]
                    if (img.startsWith('http')) return img
                    return supabase.storage.from('products').getPublicUrl(img).data.publicUrl
                }
            } catch (e) { }
            return null
        }

        // Fetch initial pending orders
        const fetchInitial = async () => {
            const { data } = await supabase
                .from('orders')
                .select(`
                    id, 
                    full_name, 
                    city, 
                    created_at,
                    products ( images )
                `)
                .eq('status', 'Pending')
                .order('created_at', { ascending: false })
                .limit(5)

            if (data) {
                setNotifications(data.map(order => ({
                    id: order.id,
                    orderId: order.id,
                    customerName: order.full_name,
                    city: order.city,
                    time: new Date(order.created_at),
                    read: false,
                    imageUrl: getFirstImageUrl(order.products)
                })))
            }
        }

        fetchInitial()

        // Listen for new inserts
        const channel = supabase
            .channel('orders-bell-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                async (payload) => {
                    const orderId = payload.new.id

                    // Fetch the full joined data for the new order to get the product image
                    const { data } = await supabase
                        .from('orders')
                        .select('id, full_name, city, created_at, products(images)')
                        .eq('id', orderId)
                        .single()

                    if (data) {
                        setNotifications(prev => [
                            {
                                id: data.id,
                                orderId: data.id,
                                customerName: data.full_name,
                                city: data.city,
                                time: new Date(data.created_at),
                                read: false,
                                imageUrl: getFirstImageUrl(data.products)
                            },
                            ...prev
                        ].slice(0, 10))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleOpen = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            // Mark all as read when opened
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className={`relative p-2 rounded-full transition-colors ${isOpen ? 'bg-gray-100 text-navy' : 'text-gray-400 hover:text-navy hover:bg-gray-50'}`}
            >
                <Bell size={22} className={unreadCount > 0 ? "animate-wiggle" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden" dir="rtl">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                        <h3 className="font-bold text-navy text-sm">الإشعارات</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full font-bold">
                                {unreadCount} جديد
                            </span>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto hide-scrollbar divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                لا توجد إشعارات جديدة.
                            </div>
                        ) : (
                            notifications.map(notify => (
                                <Link
                                    href="/admin/orders"
                                    key={notify.id}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 ${!notify.read ? 'bg-gold/5' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden relative ${!notify.read ? 'bg-gold/20 text-gold shadow-sm ring-2 ring-gold/20 ring-offset-1' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                                        {notify.imageUrl ? (
                                            <Image
                                                src={notify.imageUrl}
                                                alt="Product"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <PackageSearch size={18} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-navy">
                                            طلب جديد من <span className="font-bold">{notify.customerName}</span>
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-500">{notify.city}</span>
                                            <span className="text-[10px] text-gray-400" dir="ltr">#{notify.orderId.split('-')[0]}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                        <Link
                            href="/admin/orders"
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-gold hover:text-navy transition-colors inline-block py-1"
                        >
                            عرض كل الطلبات
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
