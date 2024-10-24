import { Link } from "react-router-dom";


export default function Unauthorized() {

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
            <p className="text-2xl ">Hmm.. you found a hidden address but still you&apos;re UnAuthorized</p>
            <br />
            <Link p className="text-xl font-bold underline" to="/" >Home</Link>
        </div>
    )
}
