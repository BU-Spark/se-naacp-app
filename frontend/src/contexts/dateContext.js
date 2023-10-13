// Date Service (TEMPORARY, maybe think of Redux)
import React from "react";

// Dayjs
import dayjs from 'dayjs';

// Useful Date methods
const isEmpty = (d) => {
    return ((d === undefined || d === null) ? (true) : ((d[0] === null && d[1] === null) ? true : false));
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
        } else if  (dayjs(from).isAfter(to) ) {
            return false
        } else {
            return true;
        }
    }

const DateMethods = {
    isEmpty : isEmpty,
    fromEmpty : fromEmpty,
    toEmpty : toEmpty,
    dateValidation : dateValidation,
};
const minDate = dayjs("2020-11-01"); // November 2020
const maxDate = dayjs("2023-01-09"); // February 2021
const DateContext = React.createContext({

  
    dates: [minDate, maxDate],
    setDates: (v) => {}
});

export { DateContext, DateMethods }