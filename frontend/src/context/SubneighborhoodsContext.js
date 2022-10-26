import db from '../components/firebase/config';
import { ref, onValue} from "firebase/database";
import { createContext, useState, useEffect } from "react";

export const SubneighborhoodsContext = createContext({})

export function SubneighborhoodsProvider({children}){
    const [subneighborhoods, setSubNeighborhoods] = useState([""]);

    // fetch the data
	useEffect(() => {
        //FetchSubNeighborhoods();
    }, []);

    const FetchSubNeighborhoods = ()=>{
		const starCountRef = ref(db, '/subneighborhood');
		onValue(starCountRef, (snapshot) => {
			const data = snapshot.val();
		});
	}

    let subneighborhoodsTestVal = "SubneighborhoodsContext Works!"

    return(
        <SubneighborhoodsContext.Provider value={{subneighborhoods, subneighborhoodsTestVal}}>
            {children}
        </SubneighborhoodsContext.Provider>
    )
}