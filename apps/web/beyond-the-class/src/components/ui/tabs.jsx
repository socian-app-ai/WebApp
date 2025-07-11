import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export const Tabs = ({ children, value, onValueChange, className = "" }) => {
    const [activeTab, setActiveTab] = useState(value);

    const handleTabChange = (newValue) => {
        setActiveTab(newValue);
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className = "" }) => {
    return (
        <div className={`flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 ${className}`}>
            {children}
        </div>
    );
};

export const TabsTrigger = ({ children, value, className = "" }) => {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 rounded-md transition-colors font-medium text-sm ${
                isActive 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            } ${className}`}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ children, value, className = "" }) => {
    const { activeTab } = useContext(TabsContext);

    if (activeTab !== value) {
        return null;
    }

    return (
        <div className={className}>
            {children}
        </div>
    );
}; 