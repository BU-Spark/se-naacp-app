import { createContext, useState, useEffect, useContext } from "react";
import { ArticlesContext, ArticlesProvider } from "./ArticlesContext";
import { NeighborhoodsContext, NeighborhoodsProvider } from "./NeighborhoodsContext";
import { SubneighborhoodsContext ,SubneighborhoodsProvider } from "./SubneighborhoodsContext";


export const NeighborhoodsContext = createContext({})

export function NeighborhoodsProvider({children}){
    const {articles} = useContext(ArticlesContext)
    const {neighborhoods} = useContext(NeighborhoodsContext)
    const {subneighborhoods} = useContext(SubneighborhoodsContext)

    
}