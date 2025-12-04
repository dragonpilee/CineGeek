'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Episode {
    id: number;
    name: string;
    episode_number: number;
}

interface Season {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
}

export default function WatchSeriesPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [episodes, setEpisodes] = useState<Episode[]>([]);

    const videoUrl = `https://vsrc.su/embed/tv/${params.id}/${season}/${episode}`;
    const [history, setHistory] = useLocalStorage<any[]>('watchHistory', []);

    useEffect(() => {
        // Fetch show details to get seasons
        const fetchShowDetails = async () => {
            try {
                const res = await fetch(`/api/tmdb/tv/${params.id}`);
                const data = await res.json();
                if (data.seasons) {
                    setSeasons(data.seasons.filter((s: Season) => s.season_number > 0)); // Filter out specials (season 0) usually
                }
            } catch (error) {
                console.error('Failed to fetch show details', error);
            }
        };

        fetchShowDetails();
    }, [params.id]);

    useEffect(() => {
        // Fetch episodes for the selected season
        const fetchEpisodes = async () => {
            try {
                const res = await fetch(`/api/tmdb/tv/${params.id}/season/${season}`);
                const data = await res.json();
                if (data.episodes) {
                    setEpisodes(data.episodes);
                }
            } catch (error) {
                console.error('Failed to fetch episodes', error);
            }
        };

        fetchEpisodes();
    }, [params.id, season]);

    useEffect(() => {
        // Add to history on mount
        const newItem = { id: params.id, type: 'tv', timestamp: Date.now() };
        setHistory((prev) => {
            const filtered = prev.filter(item => item.id !== params.id);
            return [newItem, ...filtered].slice(0, 10); // Keep last 10
        });

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://vsrc.su') return;
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
            <div className="absolute top-20 left-4 z-50 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="bg-black/50 p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex gap-2">
                    <select
                        value={season}
                        onChange={(e) => {
                            setSeason(Number(e.target.value));
                            setEpisode(1); // Reset episode when season changes
                        }}
                        className="bg-black/50 text-white border border-white/20 rounded px-3 py-2 outline-none focus:border-white/50"
                    >
                        {seasons.map((s) => (
                            <option key={s.id} value={s.season_number}>
                                Season {s.season_number}
                            </option>
                        ))}
                    </select>

                    <select
                        value={episode}
                        onChange={(e) => setEpisode(Number(e.target.value))}
                        className="bg-black/50 text-white border border-white/20 rounded px-3 py-2 outline-none focus:border-white/50"
                    >
                        {episodes.map((e) => (
                            <option key={e.id} value={e.episode_number}>
                                Ep {e.episode_number}: {e.name}
                            </option>
                        ))}
                    </select>
                </div>
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
