/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../../../../config/users/axios.instance";
import { routesForApi } from "../../../../utils/routes/routesForLinks";
import { formatTimeDifference2 } from "../../../../utils/formatDate";
import { Link } from "react-router-dom";
import DarkButton from "../../../../components/Buttons/DarkButton";
import { useParams } from "react-router-dom";
import { startTransition } from "react";
import LabelInputCustomizable, { LabelDropDownSearchableInputCustomizable } from "../../../../components/TextField/LabelInputCustomizable";
import LabelFileInputCustomizable from "../../../../components/Upload/LabelFileInputCustomizable";
import { useTransition } from "react";
import { X } from "lucide-react";
import { useToast } from "../../../../components/toaster/ToastCustom";


const CafeCategoryItem = () => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });


    const { cafeId } = useParams()

    const {addToast} = useToast();

    const [foodItems, setFoodItems] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, name: '', foodItemId: '' });
    // const [categories, setCategories] = useState([]);


    const [foodItemDialog, setFoodItemDialog] = useState(false);
    const [newFoodItem, setNewFoodItem] = useState({
        categoryId: '',
        name: '',
        description: '',
        imageUrl: '',
        price: 0,
        takeAwayStatus: "false",
        takeAwayPrice: 0
        //   flavours,
        // volume,
        //  discount,
    });

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const response = await axiosInstance.get('/api/mod/cafe/' + cafeId + '/items');
                console.log("Items:", response.data.items);
                setFoodItems(response.data.items);
            } catch (error) {
                addToast(error?.response?.data?.error);
                console.error("Error fetching Items:", error);
            }
        };
        fetchFoodItems();
    }, [cafeId]);


    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/api/mod/cafe/' + cafeId + "/categories");
            console.log("Categories:", response.data.categories);
            // setCategories(response.data.categories);
            return response.data.categories;
        } catch (error) {
            addToast(error?.response?.data?.error);
            console.error("Error fetching categories:", error);
        }
    };

    const changeCafeStatus = async (itemId, status) => {
        try {
            console.log("CAFEID", itemId)
            // buildDynamicRoute(routesForApi.mod.cafe.update[`${cafeId}`].status, { cafeId: cafeId })
            const response = await axiosInstance.patch(`/api/mod/cafe/update/${cafeId}/item/${itemId}/status`, {
                status: status === 'active' ? 'deactive' : 'active'
            });
            console.log("Cafes:", response.data.item);
            const updatedItem = response.data.item;

            setFoodItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === updatedItem._id ? { ...item, status: updatedItem.status, updatedAt: updatedItem.updatedAt } : item
                )
            );

        } catch (error) {
            addToast(error?.response?.data?.error);
            console.error("Error fetching cafes:", error);
        }
    };



    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };



    const handleDeleteClick = (foodItem) => {
        setDeleteConfirmation({
            isOpen: true,
            foodItemId: foodItem._id,
            name: foodItem.name
        });
        setSelectedItem(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/api/mod/cafe/${cafeId}/item/${deleteConfirmation.foodItemId}/delete`);
            setFoodItems((foodItems) =>
                foodItems.filter(foodItem => foodItem._id !== deleteConfirmation.foodItemId)
            );
            setDeleteConfirmation({ isOpen: false, name: null, foodItemId: '' });
        } catch (error) {
            console.error("Error deleting cafe:", error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({ isOpen: false, name: null, foodItemId: '' });
    };


    const handleFoodItemDialog = () => {
        setFoodItemDialog(!foodItemDialog);
    }

    const handleFoodItemCreate = async () => {
        try {
            const foodItemBody = {
                name: newFoodItem.name,
                description: newFoodItem.description,
                imageUrl: newFoodItem.imageUrl,
                price: newFoodItem.price
            };
            if (newFoodItem.takeAwayStatus === 'true') {
                foodItemBody.takeAwayStatus = true,
                    foodItemBody.takeAwayPrice = newFoodItem.takeAwayPrice
            }


            const response = await axiosInstance.post(`/api/mod/cafe/${cafeId}/category/${newFoodItem.categoryId}/item/create`, foodItemBody)

            if (response.data) {
                startTransition(() => {
                    setFoodItems(prevFoodItem => [...prevFoodItem, response.data.item]);
                });
            }
            setFoodItemDialog(false);

        } catch (error) {
            console.error("Error in creating Cafe Category", error)
        }
    }


    return (

        <div>
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl mb-5 font-bold dark:text-white text-gray-800">Food Item Manage</h2>

                <DarkButton
                    onClick={handleFoodItemDialog}
                    className="w-max px-2"
                    text={"Add Food Item"}
                />


                {foodItemDialog
                    && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className=" flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                {/* Background overlay */}
                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>




                                {/* Modal panel */}
                                <div className="relative inline-block align-bottom dark:bg-[#1d1d1d] bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="absolute top-2 right-2">
                                        <X className="dark:text-white text-black" onClick={handleFoodItemDialog} />
                                    </div>
                                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h2>Add Category Detail here</h2>

                                        <div className="sm:flex sm:items-start flex-col">
                                            <LabelInputCustomizable
                                                required={true}
                                                value={newFoodItem.name}
                                                onChange={(e) => setNewFoodItem({ ...newFoodItem, name: e.target.value })}
                                                type="text"
                                                label={"Name"}
                                            />

                                            <LabelInputCustomizable
                                                required={true}
                                                value={newFoodItem.description}
                                                onChange={(e) => setNewFoodItem({ ...newFoodItem, description: e.target.value })}
                                                type="text"
                                                label={"Description"}
                                            />

                                            <LabelInputCustomizable
                                                required={true}
                                                value={newFoodItem.price}
                                                onChange={(e) => {
                                                    const value = Math.max(0, Number(e.target.value));
                                                    setNewFoodItem({ ...newFoodItem, price: value });
                                                }}
                                                type="number"
                                                min={0}
                                                label={"Price"}
                                            />
                                            <TakeAwayOption setTakeAway={setNewFoodItem} takeAway={newFoodItem} />
                                            {newFoodItem.takeAwayStatus === 'true' && <LabelInputCustomizable
                                                required={true}
                                                value={newFoodItem.takeAwayPrice}
                                                onChange={(e) => {
                                                    const value = Math.max(0, Number(e.target.value));
                                                    setNewFoodItem({ ...newFoodItem, takeAwayPrice: value });
                                                }}
                                                type="number"
                                                min={0}
                                                label={"TakeAway Price"}
                                            />}

                                            <LabelDropDownSearchableInputCustomizable
                                                fetchOptions={fetchCategories}
                                                value={newFoodItem.categoryId}
                                                onChange={(e) => setNewFoodItem({ ...newFoodItem, categoryId: e.target.value })}

                                                label="Categories"
                                            />
                                            <LabelFileInputCustomizable
                                                label={'imageUrl'}

                                            />
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <DarkButton
                                            text={'Create'}
                                            loading={isPending}
                                            onClick={handleFoodItemCreate}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



            </div>

            <div className="dark:bg-[#3e3e3e] bg-[#f7f7f7] rounded-lg shadow overflow-hidden min-h-screen ">

                <div className="overflow-x-scroll overflow-y-visible min-h-screen">
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
                            {foodItems && foodItems.map((foodItem) => (
                                <tr key={foodItem._id} className="dark:hover:bg-gray-500 hover:bg-gray-50  dark:border-[#adadad] border-[#b4b4b4] border-b">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium dark:text-white text-gray-900">{foodItem.name}</div>
                                        <div className="text-sm dark:text-white text-gray-500">{foodItem.categories?.join(", ")}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm dark:text-white text-gray-900 line-clamp-2">{foodItem.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm dark:text-white text-gray-900 line-clamp-2">{foodItem?.category?.name ?? 'None'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm dark:text-white text-gray-900 line-clamp-2">{foodItem.price[0]} Rs.</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm dark:text-white text-gray-900 line-clamp-2">{foodItem.takeAwayStatus ? foodItem.takeAwayPrice[0] : 'Nil'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${foodItem.status === 'active' ? 'bg-green-100 text-green-800' :
                                            foodItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {foodItem.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm dark:text-white text-gray-900">{foodItem.user?.name}</div>
                                        <div className="text-xs dark:text-white text-gray-500">{foodItem.user?.super_role}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm dark:text-white text-gray-900 line-clamp-2">{foodItem.discountStatus === 'active' ? foodItem.discount[0] : 'Nil'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm dark:text-white text-gray-900">
                                            {foodItem.accumulatedRating ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    {foodItem.accumulatedRating} ★
                                                </span>
                                            ) : (
                                                <span className="dark:text-white text-gray-500">No rating</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm dark:text-white text-gray-900 line-clamp-2">{foodItem.favouritebByUsersCount.size ? foodItem.favouritebByUsersCount.size : 0}</div>
                                    </td>


                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white text-gray-500">
                                        {formatTimeDifference2(foodItem.updatedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setSelectedItem((prev) => (prev === foodItem._id ? null : foodItem._id))

                                                }
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Actions
                                            </button>

                                            {selectedItem === foodItem._id && (
                                                <div className="z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg dark:bg-[#1d1d1d] bg-white ring-1 ring-black ring-opacity-5">
                                                    <div className="py-1">
                                                        <Link to={`/mod/foodItem/${foodItem._id}`} className="block px-4 py-2 text-sm dark:text-white text-gray-700 dark:hover:bg-gray-500 hover:bg-gray-100 w-full text-left">
                                                            Edit Details
                                                        </Link>
                                                        <button onClick={() => changeCafeStatus(foodItem._id, foodItem.status)} className="block px-4 py-2 text-sm dark:text-white text-gray-700 dark:hover:bg-gray-500 hover:bg-gray-100 w-full text-left">
                                                            Change Status
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(foodItem)}
                                                            className="block px-4 py-2 text-sm text-red-600 dark:hover:bg-red-100 hover:bg-red-50 w-full text-left">
                                                            Delete Item
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
                                                Are you sure you want to delete <bold className="font-bold">&quot;{deleteConfirmation.foodItemId}&quot;</bold>? <br />This action cannot be undone.
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





const TakeAwayOption = ({ takeAway, setTakeAway }) => {


    return (
        <div>
            <p>Has TakeAway Option</p>
            {/* {console.log(typeof takeAway.takeAwayStatus, takeAway)} */}
            <form>
                <label>
                    <input
                        type="radio"
                        name="takeAwayStatus"
                        value="true"
                        checked={takeAway.takeAwayStatus === "true"}
                        onChange={(e) => setTakeAway({ ...takeAway, takeAwayStatus: e.target.value })}

                    // onChange={(e) => setTakeAway(e.target.value)}
                    />
                    Yes
                </label>
                <label>
                    <input
                        type="radio"
                        name="takeAwayStatus"
                        value="false"
                        checked={takeAway.takeAwayStatus === "false"}
                        // onChange={(e) => setTakeAway(e.target.value)}
                        onChange={(e) => setTakeAway({ ...takeAway, takeAwayStatus: e.target.value })}

                    />
                    No
                </label>
            </form>
        </div>
    );
};

