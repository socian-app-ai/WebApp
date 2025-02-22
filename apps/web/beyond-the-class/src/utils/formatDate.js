function formatTimeDifference(createdAt) {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDifference = now - createdDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} ${years === 1 ? "year" : "years"} ago`;
    } else if (months > 0) {
        return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else if (days > 0) {
        return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (hours > 0) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
        return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    }
}

export default formatTimeDifference;



export function formatTimeDifference2(createdAt) {
    const now = new Date();

    // Remove ordinal suffixes (st, nd, rd, th) from the date string
    const cleanedDateStr = createdAt.replace(/\b(\d{1,2})(st|nd|rd|th)\b/, "$1");
    const createdDate = new Date(cleanedDateStr);

    if (isNaN(createdDate.getTime())) {
        return "Invalid date";
    }

    const timeDifference = now - createdDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} ${years === 1 ? "year" : "years"} ago`;
    if (months > 0) return `${months} ${months === 1 ? "month" : "months"} ago`;
    if (days > 0) return `${days} ${days === 1 ? "day" : "days"} ago`;
    if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    if (minutes > 0) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
}