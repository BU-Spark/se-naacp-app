// Date Service (TEMPORARY, maybe think of Redux)
import React from "react";

const NeighborhoodMethods = {

};

const NeighborhoodContext2 = React.createContext({
    neighborhood: "fenway",
    setNeigh: (v) => {}
});

export { NeighborhoodContext2, NeighborhoodMethods }