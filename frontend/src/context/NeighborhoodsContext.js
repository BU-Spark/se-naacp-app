import db from '../components/firebase/config';
import { ref, onValue} from "firebase/database";
import { createContext, useState, useEffect } from "react";

export const NeighborhoodsContext = createContext({})

export function NeighborhoodsProvider({children}){
    // neighborhood component
    const [neighborhoods, setNeighborhoods] = useState([""]);
    //const [minDate, setMindate] = useState(Date);
    //const [maxDate, setMaxdate] = useState(Date);

    // fetch the data
    useEffect(() => {
        //FetchNeighborhoods();
    }, []);

    // get neighborhoods data
    const FetchNeighborhoods = ()=>{
        const starCountRef = ref(db, '/neighborhoods');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            });
    }

    let neighborhoodsTestVal = "NeighborhoodsContext Works!"
    return (
        <NeighborhoodsContext.Provider value={{neighborhoods, neighborhoodsTestVal}}>
            {children}
        </NeighborhoodsContext.Provider>
    )
}