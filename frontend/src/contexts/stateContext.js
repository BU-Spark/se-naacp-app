// Date Service (TEMPORARY, maybe think of Redux)
import React from "react";

const modify = (currentState, customLabel, data) => {
    return (currentState[customLabel] === undefined ? Object.assign(currentState, { [customLabel]: data }) : currentState[customLabel] = data)
}

const equalStateLabel = (currentState, customLabel, data) => {
    return (currentState[customLabel] === undefined ? false : (JSON.stringify(currentState[customLabel]) === JSON.stringify(data)) ? true : false);
}

const stateMethods = {
    modify : modify ,
    equalStateLabel: equalStateLabel
}

const StateContext = React.createContext({
    currentState: {},
    setState: (s) => {}
});

export {stateMethods, StateContext};