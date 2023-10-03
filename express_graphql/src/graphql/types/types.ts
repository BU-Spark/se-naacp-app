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
    _id: String;
    county_name: String;
    tract: String;
    geoid_tract: String;
    neighborhood: String;
    demographics: IDemographics;
    articles: String[];
}

export interface IDemographics {
    p2_001n: String
    p2_002n: String
    p2_003n: String
    p2_004n: String
    p2_005n: String
    p2_006n: String
    p2_007n: String
    p2_008n: String
    p2_009n: String
    p2_010n: String
}
