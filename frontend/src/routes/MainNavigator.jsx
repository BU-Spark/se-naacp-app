import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Pages
import Home from '../pages/Home'

export default function MainNavigatot() {
    return(
    <>
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </BrowserRouter>
    </>
    ); 
}