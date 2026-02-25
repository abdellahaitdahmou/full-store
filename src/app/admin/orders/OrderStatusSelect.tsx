'use client'

import { startTransition } from 'react'
import { updateOrderStatus } from './actions'

interface OrderStatusSelectProps {
    orderId: string
    currentStatus: string
}

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value

        // We use a FormData object to pass to the server action
        const formData = new FormData()
        formData.append('id', orderId)
        formData.append('status', newStatus)

        startTransition(async () => {
            await updateOrderStatus(formData)
        })
    }

    return (
        <div className="relative">
            <select
                name="status"
                defaultValue={currentStatus}
                className="appearance-none border border-gray-200 rounded-xl text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white text-navy font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm w-40"
                onChange={handleChange}
            >
                <option value="Pending">قيد الانتظار</option>
                <option value="Confirmed">مؤكد</option>
                <option value="Delivered">تم التوصيل</option>
                <option value="Cancelled">ملغى</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    )
}
