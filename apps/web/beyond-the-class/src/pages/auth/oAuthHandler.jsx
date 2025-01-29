import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function OAuthRedirectHandler() {
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");


        if (code) {
            window.location.href = `${import.meta.env.VITE_BACKEND_API_URL}/api/oauth?code=${code}`;
        }
    }, [location]);

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-none">
            <h2>Redirecting...</h2>
        </div>
    );
}