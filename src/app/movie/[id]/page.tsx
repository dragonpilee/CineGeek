'use client';

import { useState, useEffect } from 'react';
import TVLayout from '@/components/TVLayout';
import { Play, Star } from 'lucide-react';
import MovieRow from '@/components/MovieRow';
import Link from 'next/link';

export default function MovieDetailsPage({ params }: { params: { id: string } }) {
    const [movie, setMovie] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [credits, setCredits] = useState<any>(null);
    const [similar, setSimilar] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movieRes, videosRes, creditsRes, similarRes] = await Promise.all([
                    fetch(`/api/tmdb/movie/${params.id}`),
                    fetch(`/api/tmdb/movie/${params.id}/videos`),
                    fetch(`/api/tmdb/movie/${params.id}/credits`),
                    fetch(`/api/tmdb/movie/${params.id}/similar`)
                ]);

                const movieData = await movieRes.json();
                const videosData = await videosRes.json();
                const creditsData = await creditsRes.json();
                const similarData = await similarRes.json();

                setMovie(movieData);
                setVideos(videosData.results || []);
                setCredits(creditsData);
                setSimilar(similarData.results || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    if (loading) return <div className="text-white p-8">Loading...</div>;
    if (!movie) return <div className="text-white p-8">Movie not found</div>;

    // Find Trailer
    const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || videos[0];

    return (
        <TVLayout>
            <div className="relative w-full min-h-screen bg-zinc-900 pb-20">
                {/* Trailer / Hero Background */}
                <div className="relative w-full h-[60vh] lg:h-[70vh]">
                    {trailer ? (
                        <iframe
                            className="w-full h-full object-cover pointer-events-none"
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&modestbranding=1&rel=0`}
                            allow="autoplay; encrypted-media"
                            title="Trailer"
                        />
                    ) : (
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/60 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end pb-12 px-12 lg:px-24 pointer-events-none">
                    <div className="pointer-events-auto max-w-3xl mb-12 mt-[40vh]">
                        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">{movie.title}</h1>

                        <div className="flex items-center gap-4 text-zinc-300 mb-6 text-sm font-medium">
                            <span className="text-green-400 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span className="border border-zinc-600 px-2 py-0.5 rounded text-xs">HD</span>
                            <span>{movie.runtime} min</span>
                        </div>

                        <p className="text-lg text-zinc-200 mb-8 line-clamp-3 drop-shadow-md">{movie.overview}</p>

                        <div className="flex gap-4">
                            <Link
                                href={`/watch/movie/${movie.id}`}
                                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold text-xl hover:bg-zinc-200 focus:bg-red-600 focus:text-white transition-colors"
                            >
                                <Play fill="currentColor" /> Play
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {/* Description is already in the overlay, so we might not need this column if empty, 
                            but keeping the grid structure for the right-side info. 
                            If the user wants it completely empty on the left, we can adjust. 
                            For now, just removing Cast and Similar as requested. */}
                    </div>

                    <div className="text-zinc-400 text-sm space-y-4">
                        <div>
                            <span className="block text-zinc-500 mb-1">Genres</span>
                            <span className="text-white">{movie.genres?.map((g: any) => g.name).join(', ')}</span>
                        </div>
                        <div>
                            <span className="block text-zinc-500 mb-1">Original Language</span>
                            <span className="text-white uppercase">{movie.original_language}</span>
                        </div>
                        <div>
                            <span className="block text-zinc-500 mb-1">Production</span>
                            <span className="text-white">{movie.production_companies?.map((c: any) => c.name).join(', ')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </TVLayout>
    );
}
