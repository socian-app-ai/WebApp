import { FcGoogle } from "react-icons/fc";


export default function GoogleButton({ ...inputprops }) {
  return (
    <button {...inputprops} className="flex dark:bg-[#181818] dark:border-[#ffffff33] border-[0.01rem]   items-center w-full h-10 rounded-md border-[#b4b4b4] bg-[#e6e6e6]">
      <FcGoogle size="24" className="h-full m-2" />
      <p className="w-[85%] -ml-4 dark:text-white text-black ">Google</p>
    </button>
  )
}
