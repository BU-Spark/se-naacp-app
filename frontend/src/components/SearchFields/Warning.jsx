import React from "react";

import Lottie from "react-lottie-player";
import { Tooltip } from 'react-tooltip'

import './Warning.css';

import warning from '../../assets/lottieFiles/warning.json';

const toolTipMessage = `
    Please choose dates within one month time span.
`

export default function Warning() {
    return(
        <>
            <div className="warning-container">
                <Lottie 
                    id="LottieWarning"
                    data-tooltip-id="my-tooltip" 
                    data-tooltip-content={toolTipMessage} 
                    data-tooltip-place="bottom" 
                    data-tooltip-offset= "-10"
                    loop={false}
                    animationData={warning} 
                    play style={{ width: "60px", height: "auto", marginLeft: "20px" }}/>
            </div>
            <Tooltip id="my-tooltip" anchorSelect="#LottieWarning" />
        </>
    );
}