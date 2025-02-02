import { LoaderIcon } from 'react-hot-toast';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function DarkButton({ loading, text, className, ...inputProps }) {

    return (
        <button
            {...inputProps}
            className={`${className} bottom-20 flex justify-center items-center bg-black disabled:bg-[#262626] text-white w-20  border-2 rounded-md h-10 `}
            disabled={loading}
        >
            {loading ? <LoaderIcon /> : `${text}`}
        </button>
    );
}

export function DarkButtonElement({ disabled, loading, text, className, ...inputProps }) {

    return (
        <button
            {...inputProps}
            className={`${className} bottom-20 flex justify-center items-center bg-black disabled:bg-[#262626] text-white w-20  border-2 rounded-md h-10 `}
            disabled={loading || disabled}
        >
            {loading ? <LoaderIcon /> : text}
        </button>
    );
}


// eslint-disable-next-line react/prop-types
export function DarkButtonLink({ text, loading = false, className, ...inputProps }) {
    return (
        <Link
            {...inputProps}
            className={`${className} bottom-20 bg-black text-white w-20  border-2 rounded-md h-10 `}
            loading={loading}
        >
            {text}
        </Link>
    );
}
