// Define interface for static type checking

// Define input type for TractsByNeighborhood
export interface TractsByNeighborhoodArgs {
    neighborhood: string;
}

// Define output type for TractsByNeighborhood
export interface INeighborhoods {
    articles: string[];
    value: string;
    tracts: string[];
}

// Define input type for DemographicsByTracts
export interface DemographicsByTractsArgs {
    tract: string;
}

// *** Data Types derived from the collections ***

// Define output type for Resolver getAllTopics
export interface ITopics {
    articles?: string[];
    value: string;
}

// Define output type for DemographicsByTracts
export interface ITracts {
    county_name: string;
    tract: string;
    geoid_tract: string;
    neighborhood: string;
    demographics: IDemographics | null;
    articles: string[] | null;
}

// Define output type for getAllArticles
export interface IArticles {
    neighborhoods: string[];
    tracts: string[];
    author: string;
    body: string;
    content_id: string;
    hl1: string;
    pub_date: string;
    pub_name: string;
    link: string;
    openai_labels: string;
    dateSum: number
    userID: string
    coordinates?: [number, number][];
    locations?:[string]
}

export interface ILocations {
    coordinates: [number, number];
    articles: string[];
    value: string;
    city: string;
    tract: string;
    neighborhood: string;
}

export interface IDemographics {
    p2_001n: string
    p2_002n: string
    p2_003n: string
    p2_004n: string
    p2_005n: string
    p2_006n: string
    p2_007n: string
    p2_008n: string
    p2_009n: string
    p2_010n: string
}
