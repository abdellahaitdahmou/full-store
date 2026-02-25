'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Toaster, toast } from 'sonner'
import { BellRing, PackageSearch } from 'lucide-react'
import Link from 'next/link'

export default function OrderNotificationListener() {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

    // Setup an audio context on mount to avoid playing sounds before user interaction (browser policies)
    useEffect(() => {
        // Modern browsers require user interaction to play audio. 
        // We initialize AudioContext but playing a sound might still be blocked 
        // if they never clicked anywhere on the admin page.
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(ctx)

        const resumeAudio = () => {
            if (ctx.state === 'suspended') {
                ctx.resume()
            }
        }

        window.addEventListener('click', resumeAudio, { once: true })
        window.addEventListener('keydown', resumeAudio, { once: true })

        return () => {
            window.removeEventListener('click', resumeAudio)
            window.removeEventListener('keydown', resumeAudio)
        }
    }, [])

    const playNotificationSound = () => {
        // Generate a pleasant cash-register / bell sound using Web Audio API
        if (!audioContext) return

        try {
            const osc1 = audioContext.createOscillator()
            const osc2 = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            osc1.type = 'sine'
            osc2.type = 'triangle'

            osc1.frequency.setValueAtTime(880, audioContext.currentTime) // A5
            osc1.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)

            osc2.frequency.setValueAtTime(1100, audioContext.currentTime)
            osc2.frequency.exponentialRampToValueAtTime(1760, audioContext.currentTime + 0.2)

            gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6)

            osc1.connect(gainNode)
            osc2.connect(gainNode)
            gainNode.connect(audioContext.destination)

            osc1.start(audioContext.currentTime)
            osc2.start(audioContext.currentTime)
            osc1.stop(audioContext.currentTime + 0.6)
            osc2.stop(audioContext.currentTime + 0.6)
        } catch (e) {
            console.error("Audio playback failed", e)
        }
    }

    useEffect(() => {
        const supabase = createClient()

        // Subscribe to INSERTS on the 'orders' table
        const channel = supabase
            .channel('orders-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    const order = payload.new

                    // Play notification sound
                    playNotificationSound()

                    // Show Toast
                    toast.custom((t) => (
                        <div className="bg-white border-2 border-gold/30 p-4 w-80 rounded-2xl shadow-xl shadow-gold/10 flex flex-col gap-3 relative overflow-hidden" dir="rtl">
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-gold"></div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                                    <BellRing size={20} className="animate-wiggle" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-serif font-bold text-navy text-sm">طلب جديد!</h3>
                                    <p className="text-xs text-gray-500 mt-0.5" dir="ltr">{order.id.split('-')[0]}#</p>
                                </div>
                                <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-gray-600">
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">الزبون:</span>
                                    <span className="font-bold text-navy truncate max-w-[120px]">{order.full_name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">المدينة:</span>
                                    <span className="font-medium text-navy">{order.city}</span>
                                </div>
                            </div>
                            <Link
                                href="/admin/orders"
                                onClick={() => toast.dismiss(t)}
                                className="w-full py-2 bg-navy text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-navy/90 transition-colors mt-1"
                            >
                                <PackageSearch size={14} />
                                فتح الطلبات
                            </Link>
                        </div>
                    ), {
                        duration: 8000,
                        position: 'top-left', // Top left for RTL dashboard layout
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [audioContext]) // re-bind if audio context changes

    return <Toaster />
}
