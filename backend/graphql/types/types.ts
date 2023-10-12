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



// Define output type for DemographicsByTracts
export interface ITracts {
    _id: string;
    county_name: string;
    tract: string;
    geoid_tract: string;
    neighborhood: string;
    demographics: IDemographics;
    articles: string[];
}

// Define output type for getAllArticles
export interface IArticles {
    neighborhoods: string[];
    position_section: string;
    tracts: string[];
    author: string;
    body: string;
    content_id: string;
    hl1: string;
    hl2: string;
    pub_date: string;
    pub_name: string;
    link: string;
    openai_labels: string[];
    dateSum: number
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
