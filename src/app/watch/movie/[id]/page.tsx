'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function WatchPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const videoUrl = `https://vidsrc.cc/v2/embed/movie/${params.id}`;
    const [history, setHistory] = useLocalStorage<any[]>('watchHistory', []);

    useEffect(() => {
        // Add to history on mount
        const newItem = { id: params.id, type: 'movie', timestamp: Date.now() };
        setHistory((prev) => {
            const filtered = prev.filter(item => item.id !== params.id);
            return [newItem, ...filtered].slice(0, 10); // Keep last 10
        });

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://vidsrc.cc') return;
            if (event.data && event.data.type === 'PLAYER_EVENT') {
                const { event: eventType, currentTime, duration } = event.data.data;
                console.log(`Player ${eventType} at ${currentTime}s of ${duration}s`);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [params.id]);

    return (
        <div className="w-screen h-screen bg-black flex flex-col">
            <div className="absolute top-20 left-4 z-50">
                <button
                    onClick={() => router.back()}
                    className="bg-black/50 p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="flex-1 w-full h-full relative">
                <iframe
                    src={videoUrl}
                    className="w-full h-full border-none"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                />
            </div>
        </div>
    );
}
