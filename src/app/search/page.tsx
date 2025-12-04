'use client';

import { useState, useEffect } from 'react';
import TVLayout from '@/components/TVLayout';
import { Search as SearchIcon } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Link from 'next/link';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [history] = useLocalStorage<any[]>('watchHistory', []);

    // Fetch recommendations based on last watched item
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (history.length > 0) {
                const lastWatched = history[0]; // Most recent
                try {
                    const endpoint = lastWatched.type === 'tv'
                        ? `/api/tmdb/tv/${lastWatched.id}/recommendations`
                        : `/api/tmdb/movie/${lastWatched.id}/recommendations`;

                    const res = await fetch(endpoint);
                    const data = await res.json();
                    setRecommendations(data.results || []);
                } catch (error) {
                    console.error('Error fetching recommendations:', error);
                }
            }
        };

        if (query.length === 0) {
            fetchRecommendations();
        }
    }, [history, query]);

    useEffect(() => {
        const searchMovies = async () => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/tmdb/search/multi?query=${encodeURIComponent(query)}`);
                const data = await res.json();
                const filtered = (data.results || []).filter((item: any) => item.media_type !== 'person');
                setResults(filtered);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchMovies, 500);
        return () => clearTimeout(debounce);
    }, [query]);

    const displayItems = query.length >= 3 ? results : recommendations;
    const title = query.length >= 3 ? 'Search Results' : (recommendations.length > 0 ? 'Recommended for You' : 'Search');

    return (
        <TVLayout>
            <main className="flex min-h-screen flex-col p-8">
                <h1 className="text-4xl font-bold mb-8">{title}</h1>

                <div className="relative mb-8 max-w-xl">
                    <input
                        type="text"
                        id="search-input"
                        data-focusable="true"
                        placeholder="Search movies..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-zinc-800 text-white px-6 py-4 rounded-xl pl-12 focus:bg-zinc-700 focus:ring-2 focus:ring-white outline-none text-xl"
                        autoFocus
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={24} />
                </div>

                {loading && <p className="text-zinc-400">Searching...</p>}

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {displayItems.map((item: any) => (
                        <Link
                            key={item.id}
                            href={item.media_type === 'tv' || item.first_air_date ? `/tv/${item.id}` : `/movie/${item.id}`}
                            id={`search-${item.id}`}
                            data-focusable="true"
                            className="group relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-transparent focus:border-white transition-all duration-200 focus:scale-105 outline-none"
                        >
                            {item.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                    alt={item.title || item.name}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                    <span className="text-zinc-500 text-sm p-2 text-center">{item.title || item.name}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-focus:opacity-100 transition-opacity flex items-end p-4">
                                <p className="text-sm font-semibold">{item.title || item.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </TVLayout>
    );
}
