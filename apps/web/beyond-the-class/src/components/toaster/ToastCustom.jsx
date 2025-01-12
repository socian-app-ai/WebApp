import React, { createContext, useContext } from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
const ToastContext = createContext();

export const ToastProviders = ({ children }) => {
    const toastManager = useToastManager();

    return (
        <ToastContext.Provider value={toastManager}>
            {children}
            {toastManager.toasts.map((toast, index) => (
                <ToastCustom
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    index={index}
                    onClose={toastManager.removeToast}
                />
            ))}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);


export const useToastManager = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message) => {
        const newToast = {
            id: Date.now(),
            message,
            createdAt: Date.now()
        };

        setToasts(currentToasts => {
            const updatedToasts = currentToasts.length >= 3
                ? currentToasts.slice(-2)
                : currentToasts;
            return [...updatedToasts, newToast];
        });
    };

    const removeToast = (id) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    };

    return { toasts, addToast, removeToast };
};

const ToastCustom = ({ message, id, index, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const getTransform = (idx) => {
        const scale = 1 - (idx * 0.05);
        return `scale(${scale})`;
    };

    return (
        <div
            className="fixed right-4 top-4 z-50 transition-all duration-500 ease-in-out"
            style={{
                transform: getTransform(index),
                top: `${1 + (index * 0.75)}rem`,
                zIndex: 50 - index,
                opacity: 1 - (index * 0.2)
            }}
        >
            <div className="bg-white dark:border-gray-800 border border-gray-300 text-black dark:bg-black dark:text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between gap-4 min-w-[320px]">
                <p className="text-sm">{message}</p>
                <button
                    onClick={() => onClose(id)}
                    className="text-black dark:text-white dark:hover:text-gray-200 hover:text-gray-900 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ToastCustom;