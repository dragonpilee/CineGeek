import TVLayout from "@/components/TVLayout";
import MovieRow from "@/components/MovieRow";
import { fetchFromTMDB } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

async function getData() {
    const trending = await fetchFromTMDB("/trending/movie/week");
    const topRated = await fetchFromTMDB("/movie/top_rated");
    const action = await fetchFromTMDB("/discover/movie", { with_genres: "28" });
    const comedy = await fetchFromTMDB("/discover/movie", { with_genres: "35" });
    const horror = await fetchFromTMDB("/discover/movie", { with_genres: "27" });
    const scifi = await fetchFromTMDB("/discover/movie", { with_genres: "878" });
    const romance = await fetchFromTMDB("/discover/movie", { with_genres: "10749" });

    return {
        trending: trending.results,
        topRated: topRated.results,
        action: action.results,
        comedy: comedy.results,
        horror: horror.results,
        scifi: scifi.results,
        romance: romance.results,
    };
}

export default async function MoviesPage() {
    const data = await getData();

    return (
        <TVLayout>
            <main className="min-h-screen bg-black pb-12 pt-8 pl-4 md:pl-8">
                <div className="relative z-10 space-y-4">
                    <MovieRow title="Trending Movies" movies={data.trending} />
                    <MovieRow title="Top Rated" movies={data.topRated} />
                    <MovieRow title="Action" movies={data.action} />
                    <MovieRow title="Sci-Fi" movies={data.scifi} />
                    <MovieRow title="Comedy" movies={data.comedy} />
                    <MovieRow title="Horror" movies={data.horror} />
                    <MovieRow title="Romance" movies={data.romance} />
                </div>
            </main>
        </TVLayout>
    );
}
