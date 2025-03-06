import { LoaderIcon } from "lucide-react";

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
