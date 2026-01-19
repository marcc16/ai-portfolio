// Simplified sanityFetch implementation without next-sanity/live dependency
import { client } from "./client";
import type { QueryParams } from "next-sanity";

export async function sanityFetch<QueryResponse>({
    query,
    params = {},
    tags,
}: {
    query: string | any;
    params?: QueryParams;
    tags?: string[];
}) {
    // Handle both string queries and defineQuery results
    // In next-sanity v9, defineQuery returns a string directly
    let queryString: string;
    
    if (typeof query === 'string') {
        queryString = query;
    } else if (query && typeof query === 'object' && 'query' in query) {
        // Handle defineQuery result which is an object with query property
        queryString = query.query;
    } else if (query && typeof query === 'object') {
        // Fallback: try to get query property or stringify
        queryString = (query.query || String(query)) as string;
    } else {
        queryString = String(query);
    }
    
    try {
        const data = await client.fetch<QueryResponse>(
            queryString, 
            params,
            {
                next: {
                    revalidate: process.env.NODE_ENV === "development" ? 30 : 3600,
                    tags,
                },
            }
        );
        
        // Return in the format expected by the components: { data: ... }
        return { data };
    } catch (error) {
        console.error('[Sanity Fetch Error]', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            query: queryString?.substring(0, 100),
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        });
        
        // Return empty result instead of throwing to prevent app crash
        // Components check for null and return null themselves
        return { data: null } as { data: QueryResponse | null };
    }
}

// Empty component for SanityLive - not needed without live preview
export function SanityLive() {
    return null;
}
