import { useEffect } from "react";
import {  Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Unauthorized() {
    const { authUser, isLoading } = useAuthContext();

    useEffect(() => {
        if (!isLoading && authUser) {
            window.location.href = '/';
        }
    }, [authUser, isLoading]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
            <p className="text-2xl">Hmm... you found a hidden address, but you're not authorized to view this page.</p>
            <Link className="text-xl font-bold underline mt-4" to="/" reloadDocument>Return to Home</Link>
        </div>
    );
}
