import TVLayout from "@/components/TVLayout";
import MovieRow from "@/components/MovieRow";
import { fetchFromTMDB } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

async function getData() {
    const trending = await fetchFromTMDB("/trending/tv/week");
    const topRated = await fetchFromTMDB("/tv/top_rated");
    const action = await fetchFromTMDB("/discover/tv", { with_genres: "10759" }); // Action & Adventure
    const comedy = await fetchFromTMDB("/discover/tv", { with_genres: "35" });
    const drama = await fetchFromTMDB("/discover/tv", { with_genres: "18" });
    const scifi = await fetchFromTMDB("/discover/tv", { with_genres: "10765" }); // Sci-Fi & Fantasy
    const animation = await fetchFromTMDB("/discover/tv", { with_genres: "16" });

    return {
        trending: trending.results,
        topRated: topRated.results,
        action: action.results,
        comedy: comedy.results,
        drama: drama.results,
        scifi: scifi.results,
        animation: animation.results,
    };
}

export default async function SeriesPage() {
    const data = await getData();

    return (
        <TVLayout>
            <main className="min-h-screen bg-black pb-12 pt-8 pl-4 md:pl-8">
                <div className="relative z-10 space-y-4">
                    <MovieRow title="Trending Series" movies={data.trending} isSeries={true} />
                    <MovieRow title="Top Rated TV" movies={data.topRated} isSeries={true} />
                    <MovieRow title="Action & Adventure" movies={data.action} isSeries={true} />
                    <MovieRow title="Sci-Fi & Fantasy" movies={data.scifi} isSeries={true} />
                    <MovieRow title="Comedy" movies={data.comedy} isSeries={true} />
                    <MovieRow title="Drama" movies={data.drama} isSeries={true} />
                    <MovieRow title="Animation" movies={data.animation} isSeries={true} />
                </div>
            </main>
        </TVLayout>
    );
}
