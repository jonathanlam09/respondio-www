import React, { useState } from "react";
import { useAuthContext } from "../hooks/auth";
import { Outlet, useLocation } from "react-router-dom";

const Session = () => {
    const { user, ready } = useAuthContext();
    const location = useLocation();

    return (
        <div>
            <div className="wrapper">
                <Outlet/>
            </div>
        </div>
    )
}

export default Session