// Date Service (TEMPORARY, maybe think of Redux)
import React from "react";

// Useful Date methods
const isEmpty = (d) => {
    return ((d === undefined) ? (true) : ((d[0] === null && d[1] === null) ? true : false));
};
const fromEmpty = (d) => {
    return ((isEmpty(d) === true) ? (true) : ((d[0] === null) ? true : false));
};
const toEmpty = (d) => {
    return ((isEmpty(d) === true) ? (true) : ((d[1] === null) ? true : false));
};

const dateValidation = (from, to) => {
    if (fromEmpty(from) || toEmpty(to)) {
        return false;
    } else if ( 
        (true)
    ) {
        return true
    } else {
        return false;
    }
}

const DateMethods = {
    isEmpty : isEmpty,
    fromEmpty : fromEmpty,
    toEmpty : toEmpty
};

const DateContext = React.createContext({
    dates: [null, null],
    setDates: (v) => {}
});

export { DateContext, DateMethods }