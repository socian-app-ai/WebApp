/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const DropZone = ({ onFilesAdded }) => {
    // Accept only PDF files
    const onDrop = useCallback((acceptedFiles) => {
        const pdfFiles = acceptedFiles.filter((file) => file.type === 'application/pdf');
        if (pdfFiles.length > 0) {
            onFilesAdded(pdfFiles); // Call parent function with added files
        } else {
            alert('Only PDF files are allowed!');
        }
    }, [onFilesAdded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'], // Accept PDF only
        },
        multiple: true, // Set to false if you want to accept only one file
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 dark:bg-gray-900'
                }`}
        >
            <input {...getInputProps()} />
            <p className="text-gray-500">
                {isDragActive ? 'Drop the PDF files here...' : 'Drag & drop PDF files here, or click to select files'}
            </p>
            <span className="text-sm text-gray-400">Only PDF files are allowed</span>
        </div>
    );
};

export default DropZone;
















export const FileDropzone = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile({
                name: file.name,
                preview: URL.createObjectURL(file),
                type: file.type,
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
            "application/pdf": [],
        },
    });

    return (
        <div className="max-w-lg mx-auto p-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 flex justify-center items-center ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the file here...</p>
                ) : (
                    <p className="text-gray-500">Drag & drop a file here, or click to select one</p>
                )}
            </div>

            {selectedFile && (
                <div className="mt-4 bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-700">Uploaded File Preview</h2>
                    {selectedFile.type.startsWith("image/") ? (
                        <img
                            src={selectedFile.preview}
                            alt={selectedFile.name}
                            className="w-full h-48 object-cover rounded-md mt-2"
                        />
                    ) : selectedFile.type === "application/pdf" ? (
                        <iframe
                            src={selectedFile.preview}
                            className="w-full h-48 border rounded-md mt-2"
                            title={selectedFile.name}
                        ></iframe>
                    ) : (
                        <p className="text-gray-500 italic mt-2">Cannot preview this file type.</p>
                    )}
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">{selectedFile.name}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

