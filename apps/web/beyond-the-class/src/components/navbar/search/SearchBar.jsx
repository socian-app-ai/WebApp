import { Search } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hrefPathNames } from "../../../utils/routes/routesForLinks";
import { useState } from "react";
import useSearchStore from "../../../state_management/zustand/searchBar";

export default function SearchBar() {
    const location = useLocation();
    // const [searchAbility, setSearchAbility] = useState(null);
    const [searchAbilityText, setSearchAbilityText] = useState('Anything');

    const { searchQuery, setSearchQuery } = useSearchStore(); // Global Search Store


    useEffect(() => {
        // console.log("PATHNAME", location)
        if (location.pathname === hrefPathNames.student.teacherPage) {

            setSearchAbilityText('A Teacher');

        } else {
            setSearchAbilityText('Anything')
        }
    }, [location.pathname])


    return (
        <div className="hidden md:flex flex-1 mx-4 relative max-w-[50%]">
            <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                placeholder={`Search ${searchAbilityText}`}

                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-800 text-sm text-white rounded-lg py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            {/* dropdown */}
        </div>
    );
}