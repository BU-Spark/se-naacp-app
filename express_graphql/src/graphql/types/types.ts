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