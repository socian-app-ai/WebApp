import { FcGoogle } from "react-icons/fc";

// eslint-disable-next-line no-unused-vars
export default function GoogleButton({ ...inputprops }) {
  return (
    <button {...inputprops} className="flex dark:bg-[#d8d1d1]  items-center w-full h-10 rounded-md bg-[#eeeeee]">
      <FcGoogle size="24" className="h-full m-2" />
      <p className="w-[85%] -ml-4 dark:text-black ">Google</p>
    </button>
  )
}
