'use client';

import { Play, Info } from 'lucide-react';
import Link from 'next/link';

export default function Hero({ movie }: { movie: any }) {
    if (!movie) return null;

    return (
        <div className="relative w-full h-[80vh] mb-8 overflow-hidden group bg-zinc-900">
            {/* Background Image */}
            <div className="absolute inset-0">
                {movie.backdrop_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-[20%] left-0 p-12 w-full max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg text-white">
                    {movie.title}
                </h1>
                <p className="text-lg md:text-xl text-zinc-200 mb-8 line-clamp-3 drop-shadow-md">
                    {movie.overview}
                </p>

                <div className="flex gap-4">
                    <Link
                        href={`/movie/${movie.id}`}
                        id="hero-play"
                        data-focusable="true"
                        className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold text-xl hover:bg-zinc-200 focus:bg-red-600 focus:text-white transition-colors"
                    >
                        <Play fill="currentColor" /> Play
                    </Link>
                    <button
                        id="hero-info"
                        data-focusable="true"
                        className="flex items-center gap-2 bg-zinc-600/80 text-white px-8 py-3 rounded-lg font-bold text-xl hover:bg-zinc-600 focus:bg-white focus:text-black transition-colors"
                    >
                        <Info /> More Info
                    </button>
                </div>
            </div>
        </div>
    );
}
