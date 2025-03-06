import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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
    options = [],
    ...inputProps
}) {
    const [showPassword, setShowPassword] = useState("password");

    return (
        <div className={`${className} relative`}>
            <label htmlFor={label} className="block mb-2 text-sm font-medium">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>

            {type === "select" ? (
                // Render a dropdown when type is 'select'
                <select
                    id={label}
                    className={`${inputClassName} text-gray-900 dark:text-white text-sm 
                        bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 
                        focus:ring-blue-500 focus:border-blue-500 block 
                        ${width ? width : "w-[20rem]"} p-2.5 rounded-lg 
                        placeholder-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    value={value}
                    onChange={onChange}
                    {...inputProps}
                    required={required}
                >
                    <option value="" disabled>
                        {placeholder || "Select an option"}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                // Render a text input or password input
                <input
                    type={hideShowPass ? showPassword : type}
                    id={label}
                    className={`${inputClassName} text-gray-900 dark:text-white text-sm 
                        bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 
                        focus:ring-blue-500 focus:border-blue-500 block 
                        ${width ? width : "w-[20rem]"} p-2.5 rounded-lg 
                        placeholder-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    {...inputProps}
                    required={required}
                />
            )}

            {hideShowPass && type !== "select" && (
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
                            <Eye size={24} />
                        ) : (
                            <EyeOff size={24} />
                        )}
                    </button>
                </div>
            )}

            <div className="px-2 font-normal text-sm text-red-500">
                {errorMessage && errorMessage}
            </div>
        </div>
    );
}