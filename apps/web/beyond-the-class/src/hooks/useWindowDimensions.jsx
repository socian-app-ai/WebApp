import { useLayoutEffect, useState } from "react";

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useLayoutEffect(() => {

        function handleResize() {
            // console.log("Resize event fired: ", window.innerWidth);
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        handleResize()
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
