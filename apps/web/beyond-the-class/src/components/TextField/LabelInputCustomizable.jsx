/* eslint-disable react/prop-types */
import React from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";


export default function LabelInputCustomizable({
    required = true,
    hideShowPass = false,
    isRequired = false,
    className = "my-4",
    inputClassName,
    value,
    placeholder,
    width,
    label,
    errorMessage = "",
    onChange,
    type = "text",
    ...inputProps
}) {
    const [showPassword, setShowPassword] = React.useState("password");
    return (
        <div className={`${className} relative`}>
            <label htmlFor={label} className="block mb-2 text-sm font-medium ">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                type={hideShowPass ? showPassword : type}
                id={label}
                className={`${inputClassName} [&&]:text-gray-900  [&&]:dark:text-white  text-sm
                     [&&]:bg-gray-100 dark:[&&]:bg-gray-700 border 
                     border-gray-300   dark:border-gray-600
                     focus:ring-blue-500 focus:border-blue-500 block 
                     ${width ? width : "w-[20rem]"} p-2.5  rounded-lg   
                      [&&]:placeholder-gray-600   [&&]:dark:placeholder-gray-400   dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...inputProps}
                required={required}
            />
            {hideShowPass ? (
                <div className="absolute bottom-1 right-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();

                            if (showPassword === "text") {
                                setShowPassword("password");
                            } else {
                                setShowPassword("text");
                            }
                        }}
                    >
                        {showPassword === "text" ? (
                            <FaRegEyeSlash size={24} />
                        ) : (
                            <FaRegEye size={24} />
                        )}
                    </button>
                </div>
            ) : (
                <></>
            )}
            <div className=" px-2 font-normal text-sm text-red-500">{errorMessage !== "" && errorMessage}</div>

        </div>
    );
}


export function LabelInputUnderLineCustomizable({
    required = true,
    hideShowPass = false,
    isRequired = false,
    className = "my-4",
    inputClassName,
    value,
    placeholder,
    width,
    label,
    onChange,
    type = "text",
    ...inputProps
}) {
    const [showPassword, setShowPassword] = React.useState("password");
    return (
        <div className={`${className} relative`}>
            <label
                htmlFor={label}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                type={hideShowPass ? showPassword : type}
                id={label}
                className={`${inputClassName} ${width ? width : "w-[20rem]"
                    }  border-b-2  border-black dark:border-white bg-transparent`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...inputProps}
                required={required}
            />
            {hideShowPass ? (
                <div className="absolute bottom-1 right-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();

                            if (showPassword === "text") {
                                setShowPassword("password");
                            } else {
                                setShowPassword("text");
                            }
                        }}
                    >
                        {showPassword === "text" ? (
                            <FaRegEyeSlash size={24} />
                        ) : (
                            <FaRegEye size={24} />
                        )}
                    </button>
                </div>
            ) : (
                <></>
            )}
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


// // eslint-disable-next-line react/prop-types, no-unused-vars
// export function LabelDropDownSearchableInputCustomizable({ required = true, hideShowPass = false, isRequired = false, className = "my-4", inputClassName, value, placeholder, width, label, onChange, type = "text", fetchOptions,
//     ...inputProps
// }) {
//     const [showPassword, setShowPassword] = React.useState("password");
//     const [options, setOptions] = React.useState([]); // For dropdown options
//     const [filteredOptions, setFilteredOptions] = React.useState([]); // For search
//     const [searchTerm, setSearchTerm] = React.useState("");

//     React.useEffect(() => {
//         if (fetchOptions) {
//             fetchOptions()
//                 .then((data) => {
//                     setOptions(data);
//                     setFilteredOptions(data);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching data:", error);
//                 });
//         }
//     }, [fetchOptions]);

//     const handleSearch = (e) => {
//         const term = e.target.value.toLowerCase();
//         setSearchTerm(term);
//         setFilteredOptions(
//             options.filter((option) =>
//                 option.toLowerCase().includes(term)
//             )
//         );
//     };

//     const handleSelect = (selectedOption) => {
//         onChange({ target: { value: selectedOption } });
//         setSearchTerm(selectedOption);
//         setFilteredOptions(options);
//     };

//     return (
//         <div className={`${className} relative`}>
//             <label htmlFor={label} className="block mb-2 text-sm font-medium">
//                 {label} {isRequired && <span className="text-red-500">*</span>}
//             </label>
//             <input
//                 type={hideShowPass ? showPassword : type}
//                 id={label}
//                 className={`${inputClassName} text-gray-900 dark:text-white text-sm
//             bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600
//             focus:ring-blue-500 focus:border-blue-500 block
//             ${width ? width : "w-[20rem]"} p-2.5 rounded-lg
//             placeholder-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
//                 placeholder={placeholder}
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 {...inputProps}
//                 required={required}
//             />
//             {hideShowPass && (
//                 <div className="absolute bottom-1 right-3">
//                     <button
//                         onClick={(e) => {
//                             e.preventDefault();
//                             setShowPassword((prev) =>
//                                 prev === "text" ? "password" : "text"
//                             );
//                         }}
//                     >
//                         {showPassword === "text" ? (
//                             <FaRegEyeSlash size={24} />
//                         ) : (
//                             <FaRegEye size={24} />
//                         )}
//                     </button>
//                 </div>
//             )}
//             <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-2 max-h-60 overflow-y-auto">
//                 {filteredOptions.map((option, index) => (
//                     <div
//                         key={index}
//                         onClick={() => handleSelect(option)}
//                         className="p-2 hover:bg-blue-100 cursor-pointer"
//                     >
//                         {option}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }



export function LabelDropDownSearchableInputCustomizable({
    required = true,
    hideShowPass = false,
    isRequired = false,
    className = "my-4",
    inputClassName,
    value,
    placeholder,
    width,
    label,
    onChange,
    setUniversityPlusCampusDomain,
    type = "text",
    fetchOptions,
    ...inputProps
}) {
    const [showPassword, setShowPassword] = React.useState("password");
    const [options, setOptions] = React.useState([]); // For dropdown options
    const [filteredOptions, setFilteredOptions] = React.useState([]); // For search
    const [searchTerm, setSearchTerm] = React.useState(value || ""); // Default to passed value
    const [showDropDown, setShowDropDown] = React.useState(false)

    // Fetch data when component mounts
    React.useEffect(() => {
        if (fetchOptions) {
            fetchOptions()
                .then((data) => {
                    setOptions(data); // Save fetched options
                    setFilteredOptions(data); // Initialize filtered options
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [fetchOptions]);

    // Handle search term changes
    const handleSearch = (e) => {
        setShowDropDown(true)
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        setFilteredOptions(
            options.filter((option) => option.name.toLowerCase().includes(term))
        );
    };

    // Handle option selection
    const handleSelect = (selectedOption) => {
        console.log("selected opyion", selectedOption)
        onChange({ target: { value: selectedOption._id } }); // Pass _id as value
        setSearchTerm(selectedOption.name); // Display name in input
        setUniversityPlusCampusDomain(selectedOption.domain)
        setFilteredOptions(options); // Reset filtered options
        setShowDropDown(false)
    };

    return (
        <div className={`${className} relative`}>
            <label htmlFor={label} className="block mb-2 text-sm font-medium">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                type={hideShowPass ? showPassword : type}
                id={label}
                className={`${inputClassName} text-gray-900 dark:text-white text-sm
                    bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                    focus:ring-blue-500 focus:border-blue-500 block 
                    ${width ? width : "w-[20rem]"} p-2.5 rounded-lg 
                    placeholder-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder={placeholder}
                value={searchTerm}
                // onChange={handleSearch}
                {...inputProps}
                required={required}
                onChange={handleSearch}
                onFocus={() => setShowDropDown(true)}
                // onBlur={() => setShowDropDown(false)}
                onBlur={() => setTimeout(() => setShowDropDown(false), 200)}

            />
            {hideShowPass && (
                <div className="absolute bottom-1 right-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPassword((prev) =>
                                prev === "text" ? "password" : "text"
                            );
                        }}
                    >
                        {showPassword === "text" ? (
                            <FaRegEyeSlash size={24} />
                        ) : (
                            <FaRegEye size={24} />
                        )}
                    </button>
                </div>
            )}
            {showDropDown && filteredOptions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md  max-h-60 overflow-y-auto">
                    {filteredOptions.map((option) => (
                        <div
                            key={option._id}
                            onClick={() => handleSelect(option)}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
