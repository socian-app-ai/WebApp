const logWithFileLocation = (message, data) => {
    // console.log(import.meta.env.VITE_DEVELOPMENT)
    if (import.meta.env.VITE_DEVELOPMENT === "developement") {
        console.groupCollapsed(message);
        console.trace();
        console.log(data);
        console.groupEnd();
    }
};

export default logWithFileLocation;