'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieRowProps {
    title: string;
    movies: any[];
}

export default function MovieRow({ title, movies, isSeries = false }: MovieRowProps & { isSeries?: boolean }) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const { clientWidth } = rowRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
            rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="mb-8 pl-4 md:pl-12 relative group/row">
            <h2 className="text-2xl font-bold mb-4 text-zinc-100">{title}</h2>

            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 focus:opacity-100 outline-none"
                    data-focusable="true"
                >
                    <ChevronLeft className="text-white w-12 h-12 drop-shadow-lg" />
                </button>

                <div
                    className="flex gap-4 overflow-x-auto py-8 px-4 md:px-12 scrollbar-hide scroll-smooth -my-8 -ml-4 md:-ml-12 w-[calc(100%+2rem)] md:w-[calc(100%+6rem)]"
                    ref={rowRef}
                >
                    {movies.map((movie) => {
                        // Determine link based on explicit prop or data
                        // Some TMDB endpoints return 'media_type', others don't.
                        // We rely on the parent passing `isSeries` for specific rows (like on Series page).
                        const type = isSeries || movie.media_type === 'tv' || movie.first_air_date ? 'tv' : 'movie';
                        const linkHref = type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;

                        return (
                            <Link
                                key={movie.id}
                                href={linkHref}
                                id={`row-${title.replace(/\s+/g, '-').toLowerCase()}-${movie.id}`}
                                data-focusable="true"
                                className="flex-none w-[160px] md:w-[200px] aspect-[2/3] relative rounded-md overflow-hidden transition-all duration-300 ease-out focus:scale-110 focus:z-10 border-[3px] border-transparent focus:border-white shadow-lg outline-none"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title || movie.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {/* Dark overlay that disappears on focus */}
                                <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-focus:opacity-0" />
                            </Link>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 focus:opacity-100 outline-none"
                    data-focusable="true"
                >
                    <ChevronRight className="text-white w-12 h-12 drop-shadow-lg" />
                </button>
            </div>
        </div>
    );
}
