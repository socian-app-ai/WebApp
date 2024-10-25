/* eslint-disable react/prop-types */
import { Search } from "@mui/icons-material";
import { Autocomplete, TextField, useMediaQuery } from "@mui/material";



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


export function CustomAutocompleteSearchStyle({ onBlur, onInputChange, filterOptions, options, label, ...props }) {
    const isMobile = useMediaQuery('(max-width:500px)');
    const inputWidth = isMobile ? '100%' : '300px';

    return (
        <Autocomplete
            className="w-full text-sm font-medium text-gray-900 dark:text-white"
            {...props}
            onInputChange={onInputChange}
            onBlur={onBlur}
            id={label}
            options={options}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        border: "none", // Remove the border of the outlined input
                    },
                    "&:hover fieldset": {
                        border: "none", // Remove hover border
                    },
                    "&.Mui-focused fieldset": {
                        border: "none", // Remove focus border
                    },
                },
                minWidth: 100,
                width: inputWidth,
                height: 50,
            }}
            renderInput={(params) => (
                <div className="relative w-full">
                    <Search className="absolute top-[0.8rem] left-3 text-gray-500 dark:text-white z-10" />
                    <TextField
                        {...params}
                        label={label}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: null, // Remove MUI's default padding for the icon
                        }}
                        placeholder={label}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                pl: 5, // Padding to account for search icon
                                borderRadius: "9999px", // Rounded-full
                                border: 'none', // Ensures no visible border
                            },
                            minWidth: '5rem',
                            width: inputWidth,
                            height: 50,
                        }}
                        className=" bg-gray-300 dark:bg-gray-700 rounded-lg text-sm pl-10 text-black dark:text-white py-[0.6rem]  px-10   focus:outline-none"
                    />
                </div>
            )}
        />
    );
}
