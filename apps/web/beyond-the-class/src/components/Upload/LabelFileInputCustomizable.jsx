
// eslint-disable-next-line react/prop-types
export default function LabelFileInputCustomizable({ labelClassName, divClassName = 'my-4', className, label, onChange, resourceImage, ...inputProps }) {
    return (
        <div className={divClassName}>
            <label htmlFor={label} className={`${labelClassName} block mb-2 text-sm font-medium `} >
                {label}
            </label>
            <input
                type="file"
                id={`Upload Your ${label} `}
                className={`${className} border border-black h-5 rounded-md`}
                onChange={onChange}
                {...inputProps}

            />
            {resourceImage && <img src={resourceImage} alt={`${label}  Preview`} className="mt-2 w-32 h-32 object-cover" />}

        </div>
    );
}
