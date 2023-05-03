// Date Service (TEMPORARY, maybe think of Redux)
import React from "react";

const NeighborhoodMethods = {

};

const NeighborhoodContext = React.createContext({
    neighborhood: "boston_city",
    setNeigh: (v) => {}
});

export { NeighborhoodContext, NeighborhoodMethods }