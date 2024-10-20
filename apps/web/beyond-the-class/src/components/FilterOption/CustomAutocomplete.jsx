import { Autocomplete, TextField, useMediaQuery } from "@mui/material";



// eslint-disable-next-line react/prop-types
export default function CustomAutocomplete({ onBlur, onInputChange, filterOptions, options, label, ...props }) {
    const isMobile = useMediaQuery('(max-width:500px)');
    const inputWidth = isMobile ? '100%' : '300px';
    return (
        <Autocomplete
            className="w-full mb-2 text-sm font-medium text-gray-900 dark:text-white"
            {...props}
            onInputChange={onInputChange}
            onBlur={onBlur}
            id={label}
            options={options}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
            sx={{ minWidth: 100, width: inputWidth, height: 50 }}
            renderInput={(params) =>
                <TextField
                    sx={{ minWidth: 100, width: inputWidth, height: 50 }}
                    className=" bg-gray-50 border  border-gray-300 text-gray-900 
                    text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                        dark:bg-gray-700 dark:border-gray-600
                      dark:placeholder-gray-400  dark:text-white dark:focus:ring-blue-500
                       dark:focus:border-blue-500"
                    {...params}
                    label={label}
                />}
        />
    );
}
