
// eslint-disable-next-line react/prop-types
export default function CustomStarRating({ rating }) {

    const fillPercentage = (rating / 5) * 100;
    return (
        <div className="relative inline-block">
            {/* Star Background */}
            <svg
                className="w-14 h-14 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
            >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
            </svg>

            {/* Star Fill */}
            <svg
                className="absolute top-0 left-0 w-14 h-14 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
                style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
            >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center dark:text-white text-black text-sm">
                {rating.toFixed(1)}
            </span>
        </div>
    )
}
