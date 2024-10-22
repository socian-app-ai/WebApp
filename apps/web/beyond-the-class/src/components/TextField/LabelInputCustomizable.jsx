import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";


// eslint-disable-next-line react/prop-types
export default function LabelInputCustomizable({required=true, hideShowPass=false,isRequired=false,className = "my-4",inputClassName,value,placeholder, width,label,onChange , type = "text",...inputProps})   {
    
    const [showPassword, setShowPassword]=useState('password')
    return (
        <div className={`${className} relative`}>
            <label htmlFor={label} className="block mb-2 text-sm font-medium ">
                {label}  {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                type={hideShowPass ? showPassword :type}
                id={label}
                className={`${inputClassName} bg-gray-50 border  border-gray-300 text-gray-100 
                    text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                     ${width ? width : "w-[20rem]"}  p-2.5 dark:bg-gray-700 dark:border-gray-600
                      dark:placeholder-gray-400  dark:text-white dark:focus:ring-blue-500
                       dark:focus:border-blue-500`}
                placeholder={placeholder}
                value={value}
                onChange= {onChange}
                {...inputProps}
                required={required}
                
                
                
            />
            {hideShowPass ? <div className="absolute bottom-1 right-3">
                <button onClick={(e)=>{
                    e.preventDefault()
                    
                  if(showPassword === 'text'){
                    setShowPassword('password')
                  }else{
                    setShowPassword('text')
                  }
                }}>{(showPassword==='text')?<FaRegEyeSlash size={24}/>:<FaRegEye size={24}/>}</button>
            </div>: <></> }
        </div>
    );
}









// eslint-disable-next-line react/prop-types
export  function LabelInputUnderLineCustomizable({required=true, hideShowPass=false,isRequired=false,className = "my-4",inputClassName,value,placeholder, width,label,onChange , type = "text",...inputProps})   {
    
    const [showPassword, setShowPassword]=useState('password')
    return (
        <div className={`${className} relative`}>
            <label htmlFor={label} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}  {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                type={hideShowPass ? showPassword :type}
                id={label}
                className={`${inputClassName} ${width ? width : "w-[20rem]"}  border-b-2  border-black bg-transparent`}
                placeholder={placeholder}
                value={value}
                onChange= {onChange}
                {...inputProps}
                required={required}
                
                
                
            />
            {hideShowPass ? <div className="absolute bottom-1 right-3">
                <button onClick={(e)=>{
                    e.preventDefault()
                    
                  if(showPassword === 'text'){
                    setShowPassword('password')
                  }else{
                    setShowPassword('text')
                  }
                }}>{(showPassword==='text')?<FaRegEyeSlash size={24}/>:<FaRegEye size={24}/>}</button>
            </div>: <></> }
        </div>
    );
}







// // eslint-disable-next-line react/prop-types
// export default function LabelInputCustomizable({placeholder,label }) {
//     return (
//         <div>
//             <label htmlFor={label} className="block mb-2 text-sm font-medium text-gray-900
//                                             dark:text-white">{label}</label>

                                            
//             <input type="text" id={label} className="bg-gray-50 border
//                 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
//                 focus:border-blue-500 block w-[20rem] p-2.5 dark:bg-gray-700
//                 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
//                 dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 placeholder={placeholder} required />
//         </div>

//     )
// }
// eslint-disable-next-line react/prop-types