import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../../../../config/users/axios.instance";
import { routesForApi } from "../../../../utils/routes/routesForLinks";
import { formatTimeDifference2 } from "../../../../utils/formatDate";
import { Link } from "react-router-dom";


const CafeCategoryItem = () => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });


    const [cafes, setCafes] = useState(null);
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, cafeId: null, cafeName: '' });

    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const response = await axiosInstance.get(routesForApi.mod.cafe.all);
                console.log("Cafes:", response.data.cafes);
                setCafes(response.data.cafes);
            } catch (error) {
                console.error("Error fetching cafes:", error);
            }
        };
        fetchCafes();
    }, []);

    const changeCafeStatus = async (cafeId, status) => {
        try {
            console.log("CAFEID", cafeId)
            // buildDynamicRoute(routesForApi.mod.cafe.update[`${cafeId}`].status, { cafeId: cafeId })
            const response = await axiosInstance.patch(`/api/mod/cafe/update/${cafeId}/status`, {
                status: status === 'active' ? 'deactive' : 'active'
            });
            console.log("Cafes:", response.data.cafe);
            const updatedCafe = response.data.cafe;

            setCafes((prevCafes) =>
                prevCafes.map((cafe) =>
                    cafe._id === updatedCafe._id ? { ...cafe, status: updatedCafe.status, updatedAt: updatedCafe.updatedAt } : cafe
                )
            );
        } catch (error) {
            console.error("Error fetching cafes:", error);
        }
    };



    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };



    const handleDeleteClick = (cafe) => {
        setDeleteConfirmation({
            isOpen: true,
            cafeId: cafe._id,
            cafeName: cafe.name
        });
        setSelectedCafe(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/api/mod/cafe/${deleteConfirmation.cafeId}/delete`);
            setCafes((prevCafes) =>
                prevCafes.filter(cafe => cafe._id !== deleteConfirmation.cafeId)
            );
            setDeleteConfirmation({ isOpen: false, cafeId: null, cafeName: '' });
        } catch (error) {
            console.error("Error deleting cafe:", error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({ isOpen: false, cafeId: null, cafeName: '' });
    };



    return (

        <div>
            <h2 className="text-2xl mb-5 font-bold dark:text-white text-gray-800">Food Item Manage</h2>
            <div className="dark:bg-[#3e3e3e] bg-[#f7f7f7] rounded-lg shadow overflow-hidden min-h-screen">

                <div className="">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="dark:bg-[#333] bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('name')}>
                                    Food Item Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Takeaway Price
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Creator
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Ratings
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Favourite Count
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="dark:bg-[#1b1b1b] bg-white divide-y divide-gray-200">
                            {cafes && cafes.map((cafe) => (
                                <tr key={cafe._id} className="dark:hover:bg-gray-500 hover:bg-gray-50  dark:border-[#adadad] border-[#b4b4b4] border-b">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium dark:text-white text-gray-900">{cafe.name}</div>
                                        <div className="text-sm dark:text-white text-gray-500">{cafe.categories?.join(", ")}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm dark:text-white text-gray-900 line-clamp-2">{cafe.information}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm dark:text-white text-gray-900">
                                            {cafe.accumulatedRating ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    {cafe.accumulatedRating} ★
                                                </span>
                                            ) : (
                                                <span className="dark:text-white text-gray-500">No rating</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cafe.status === 'active' ? 'bg-green-100 text-green-800' :
                                            cafe.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {cafe.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm dark:text-white text-gray-900">{cafe.user?.name}</div>
                                        <div className="text-xs dark:text-white text-gray-500">{cafe.user?.super_role}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white text-gray-500">
                                        {formatTimeDifference2(cafe.updatedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative">
                                            <button
                                                onClick={() => setSelectedCafe(selectedCafe === cafe._id ? null : cafe._id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Actions
                                            </button>

                                            {selectedCafe === cafe._id && (
                                                <div className="z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg dark:bg-[#1d1d1d] bg-white ring-1 ring-black ring-opacity-5">
                                                    <div className="py-1">
                                                        <Link to={`/mod/cafe/${cafe._id}`} className="block px-4 py-2 text-sm dark:text-white text-gray-700 dark:hover:bg-gray-500 hover:bg-gray-100 w-full text-left">
                                                            Edit Details
                                                        </Link>
                                                        <button onClick={() => changeCafeStatus(cafe._id, cafe.status)} className="block px-4 py-2 text-sm dark:text-white text-gray-700 dark:hover:bg-gray-500 hover:bg-gray-100 w-full text-left">
                                                            Change Status
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(cafe)}
                                                            className="block px-4 py-2 text-sm text-red-600 dark:hover:bg-red-100 hover:bg-red-50 w-full text-left">
                                                            Delete Cafe
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {deleteConfirmation.isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom dark:bg-[#1d1d1d] bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium dark:text-white text-gray-900">
                                            Delete Cafe
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm dark:text-gray-300 text-gray-500">
                                                Are you sure you want to delete <bold className="font-bold">&quot;{deleteConfirmation.cafeName}&quot;</bold>? <br />This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleDeleteCancel}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 dark:bg-gray-700 bg-white text-base font-medium dark:text-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CafeCategoryItem;