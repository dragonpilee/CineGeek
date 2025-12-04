import { httpGet } from './http';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
    if (!TMDB_API_KEY) {
        console.warn('TMDB_API_KEY is not defined. Returning mock data.');
        return { results: [] };
    }

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);

    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });

    try {
        const data = await httpGet(url.toString());
        return data;
    } catch (error: any) {
        console.error('TMDB API Error:', error.message);
        throw new Error(`TMDB API Error: ${error.message}`);
    }
};
