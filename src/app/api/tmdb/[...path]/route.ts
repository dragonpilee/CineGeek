import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/');
    const searchParams = request.nextUrl.searchParams;

    // Construct the TMDb URL
    const url = new URL(`${TMDB_BASE_URL}/${path}`);

    // Append the API Key (Server-side only)
    url.searchParams.append('api_key', TMDB_API_KEY || '');

    // Forward other query params
    searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });

    try {
        const res = await fetch(url.toString());
        const data = await res.json();

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch from TMDb' }, { status: 500 });
    }
}
