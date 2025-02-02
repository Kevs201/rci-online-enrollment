import { redirect } from "next/navigation";
import useAuth from "./userAuth";
import React from "react";

interface ProtectProps{
    children: React.ReactNode;
}

export default function Protected({children}: ProtectProps){
    const isAuthenticated = useAuth();

    return isAuthenticated ? children : redirect("/");
}