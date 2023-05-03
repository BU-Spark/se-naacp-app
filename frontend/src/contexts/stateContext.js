// Date Service (TEMPORARY, maybe think of Redux)
import React from "react";

// Helper, Not in methods
const updater = (currentState, customLabel, data) => {
    currentState[customLabel] = data
    return currentState;
}

// Adds or Modifies the current labels if it exists
const modify = (currentState, customLabel, data) => {
    return (currentState[customLabel] === undefined ? Object.assign(currentState, { [customLabel]: data }) : updater(currentState, customLabel, data));
}

// Checks if the Label currently is equal to the data
const equalStateLabel = (currentState, customLabel, data) => {
    return (currentState[customLabel] === undefined ? false : (JSON.stringify(currentState[customLabel]) === JSON.stringify(data)) ? true : false);
}

// This is just a deepcopy to update the useEffect Hook
const updateModified = (currentStateShallowCopy) => {
    return JSON.parse(JSON.stringify(currentStateShallowCopy));
}

const stateMethods = { 
    modify : modify ,
    equalStateLabel : equalStateLabel,
    updateModified : updateModified
}

const StateContext = React.createContext({
    currentState: {},
    setState: (s) => {}
});

export {stateMethods, StateContext};