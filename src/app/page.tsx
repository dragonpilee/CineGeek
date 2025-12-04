import TVLayout from "@/components/TVLayout";
import MovieRow from "@/components/MovieRow";
import { fetchFromTMDB } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

async function getData() {
    // Sequential fetching to avoid network congestion/TLS errors
    const trending = await fetchFromTMDB("/trending/movie/week");
    const topRated = await fetchFromTMDB("/movie/top_rated");
    const action = await fetchFromTMDB("/discover/movie", { with_genres: "28" });
    const comedy = await fetchFromTMDB("/discover/movie", { with_genres: "35" });
    const horror = await fetchFromTMDB("/discover/movie", { with_genres: "27" });
    const scifi = await fetchFromTMDB("/discover/movie", { with_genres: "878" });

    return {
        trending: trending.results,
        topRated: topRated.results,
        action: action.results,
        comedy: comedy.results,
        horror: horror.results,
        scifi: scifi.results,
    };
}

export default async function Home() {
    const data = await getData();

    return (
        <TVLayout>
            <main className="min-h-screen bg-black pb-12 pt-8 pl-4 md:pl-8">
                <div className="relative z-10 space-y-4">
                    <MovieRow title="Trending Now" movies={data.trending} />
                    <MovieRow title="Top Rated" movies={data.topRated} />
                    <MovieRow title="Sci-Fi & Fantasy" movies={data.scifi} />
                    <MovieRow title="Action Thrillers" movies={data.action} />
                    <MovieRow title="Comedies" movies={data.comedy} />
                    <MovieRow title="Horror" movies={data.horror} />
                </div>
            </main>
        </TVLayout>
    );
}
