import React from "react";

const MasterListContext = React.createContext({
    masterList: [null, null, null],
    setMasterList: (v) => {}
});

export default MasterListContext