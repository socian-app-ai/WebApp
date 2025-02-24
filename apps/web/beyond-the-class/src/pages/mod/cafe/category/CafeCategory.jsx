
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { routesForApi } from "../../../../utils/routes/routesForLinks";
import { formatTimeDifference2 } from "../../../../utils/formatDate";
import axiosInstance from "../../../../config/users/axios.instance";

const CafeCategory = () => {
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
            <h2 className="text-2xl mb-5 font-bold dark:text-white text-gray-800">Category Manage</h2>
            <div className="dark:bg-[#3e3e3e] bg-[#f7f7f7] rounded-lg shadow overflow-hidden min-h-screen">
                <div className="">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="dark:bg-[#333] bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('name')}>
                                    Category Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Image-
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Creator
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

export default CafeCategory;




// import React, { useState } from 'react';

// const CafeDashboard = () => {
//     const [activeTab, setActiveTab] = useState('categories');
//     const [categories, setCategories] = useState([
//         { id: 1, name: 'Beverages', description: 'Hot and cold drinks', imageUrl: '/api/placeholder/100/100' },
//         { id: 2, name: 'Main Course', description: 'Delicious main dishes', imageUrl: '/api/placeholder/100/100' },
//     ]);

//     const [items, setItems] = useState([
//         {
//             id: 1,
//             name: 'Cappuccino',
//             description: 'Rich espresso with steamed milk foam',
//             price: 4.99,
//             category: 1,
//             imageUrl: '/api/placeholder/100/100',
//             flavours: ['Regular', 'Caramel'],
//             volume: '300ml',
//             discount: 0
//         },
//         {
//             id: 2,
//             name: 'Grilled Chicken',
//             description: 'Seasoned grilled chicken with vegetables',
//             price: 12.99,
//             category: 2,
//             imageUrl: '/api/placeholder/100/100',
//             flavours: ['Spicy', 'Regular'],
//             volume: '250g',
//             discount: 10
//         }
//     ]);

//     const [editingCategory, setEditingCategory] = useState(null);
//     const [editingItem, setEditingItem] = useState(null);

//     const handleDeleteCategory = (id) => {
//         setCategories(categories.filter(cat => cat.id !== id));
//     };

//     const handleDeleteItem = (id) => {
//         setItems(items.filter(item => item.id !== id));
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                 {/* Tabs */}
//                 <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
//                     <nav className="flex space-x-8">
//                         <button
//                             onClick={() => setActiveTab('categories')}
//                             className={`${activeTab === 'categories'
//                                 ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
//                                 : 'border-transparent text-gray-500 dark:text-gray-400'
//                                 } py-4 px-1 border-b-2 font-medium text-sm`}
//                         >
//                             Categories
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('items')}
//                             className={`${activeTab === 'items'
//                                 ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
//                                 : 'border-transparent text-gray-500 dark:text-gray-400'
//                                 } py-4 px-1 border-b-2 font-medium text-sm`}
//                         >
//                             Items
//                         </button>
//                     </nav>
//                 </div>

//                 {/* Categories Table */}
//                 {activeTab === 'categories' && (
//                     <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
//                         <div className="px-4 py-5 sm:p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-lg font-medium text-gray-900 dark:text-white">Categories</h2>
//                                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
//                                     Add Category
//                                 </button>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                     <thead>
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Name
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Description
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Image
//                                             </th>
//                                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Actions
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                                         {categories.map((category) => (
//                                             <tr key={category.id}>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                                                     {category.name}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                                                     {category.description}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                                                     <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded-full" />
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                     <button
//                                                         onClick={() => setEditingCategory(category)}
//                                                         className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
//                                                     >
//                                                         Edit
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDeleteCategory(category.id)}
//                                                         className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Items Table */}
//                 {activeTab === 'items' && (
//                     <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
//                         <div className="px-4 py-5 sm:p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-lg font-medium text-gray-900 dark:text-white">Items</h2>
//                                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
//                                     Add Item
//                                 </button>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                     <thead>
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Name
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Category
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Price
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Volume
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Discount
//                                             </th>
//                                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                                 Actions
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                                         {items.map((item) => (
//                                             <tr key={item.id}>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
//                                                     {item.name}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                                                     {categories.find(cat => cat.id === item.category)?.name}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                                                     ${item.price}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                                                     {item.volume}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                                                     {item.discount}%
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                     <button
//                                                         onClick={() => setEditingItem(item)}
//                                                         className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
//                                                     >
//                                                         Edit
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDeleteItem(item.id)}
//                                                         className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CafeDashboard;


















// import React, { useState } from 'react';

// const CafeMenu = () => {
//   const [categories, setCategories] = useState([
//     { id: 1, name: 'Beverages', description: 'Hot and cold drinks', imageUrl: '/api/placeholder/100/100' },
//     { id: 2, name: 'Main Course', description: 'Delicious main dishes', imageUrl: '/api/placeholder/100/100' },
//   ]);

//   const [items, setItems] = useState([
//     {
//       id: 1,
//       name: 'Cappuccino',
//       description: 'Rich espresso with steamed milk foam',
//       price: 4.99,
//       category: 1,
//       imageUrl: '/api/placeholder/100/100',
//       flavours: ['Regular', 'Caramel'],
//       volume: '300ml',
//       discount: 0
//     },
//     {
//       id: 2,
//       name: 'Grilled Chicken',
//       description: 'Seasoned grilled chicken with vegetables',
//       price: 12.99,
//       category: 2,
//       imageUrl: '/api/placeholder/100/100',
//       flavours: ['Spicy', 'Regular'],
//       volume: '250g',
//       discount: 10
//     }
//   ]);

//   const [activeCategory, setActiveCategory] = useState(null);
//   const [showAddCategory, setShowAddCategory] = useState(false);
//   const [showAddItem, setShowAddItem] = useState(false);
//   const [newCategory, setNewCategory] = useState({ name: '', description: '', imageUrl: '' });
//   const [newItem, setNewItem] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     imageUrl: '',
//     flavours: '',
//     volume: '',
//     discount: ''
//   });

//   const handleCategorySubmit = (e) => {
//     e.preventDefault();
//     setCategories([...categories, { ...newCategory, id: categories.length + 1 }]);
//     setNewCategory({ name: '', description: '', imageUrl: '' });
//     setShowAddCategory(false);
//   };

//   const handleItemSubmit = (e) => {
//     e.preventDefault();
//     setItems([...items, { ...newItem, id: items.length + 1 }]);
//     setNewItem({
//       name: '',
//       description: '',
//       price: '',
//       category: '',
//       imageUrl: '',
//       flavours: '',
//       volume: '',
//       discount: ''
//     });
//     setShowAddItem(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cafe Menu Management</h1>
//           <div className="space-x-4">
//             <button
//               onClick={() => setShowAddCategory(true)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               Add Category
//             </button>
//             <button
//               onClick={() => setShowAddItem(true)}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//             >
//               Add Item
//             </button>
//           </div>
//         </div>

//         {/* Categories Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {categories.map(category => (
//             <div
//               key={category.id}
//               onClick={() => setActiveCategory(category.id)}
//               className={`p-4 rounded-lg cursor-pointer transition ${
//                 activeCategory === category.id
//                   ? 'bg-blue-100 dark:bg-blue-900'
//                   : 'bg-white dark:bg-gray-800'
//               }`}
//             >
//               <img
//                 src={category.imageUrl}
//                 alt={category.name}
//                 className="w-full h-48 object-cover rounded-lg mb-4"
//               />
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                 {category.name}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
//             </div>
//           ))}
//         </div>

//         {/* Items Section */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {items
//             .filter(item => !activeCategory || item.category === activeCategory)
//             .map(item => (
//               <div
//                 key={item.id}
//                 className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
//               >
//                 <img
//                   src={item.imageUrl}
//                   alt={item.name}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                       {item.name}
//                     </h3>
//                     <div className="flex items-center">
//                       {item.discount > 0 && (
//                         <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded dark:bg-red-900 dark:text-red-200">
//                           {item.discount}% OFF
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
//                     {item.description}
//                   </p>
//                   <div className="flex justify-between items-center">
//                     <span className="text-lg font-bold text-gray-900 dark:text-white">
//                       ${item.price}
//                     </span>
//                     <span className="text-sm text-gray-500 dark:text-gray-400">
//                       {item.volume}
//                     </span>
//                   </div>
//                   {item.flavours.length > 0 && (
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {item.flavours.map((flavour, index) => (
//                         <span
//                           key={index}
//                           className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
//                         >
//                           {flavour}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//         </div>

//         {/* Add Category Modal */}
//         {showAddCategory && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
//               <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//                 Add New Category
//               </h2>
//               <form onSubmit={handleCategorySubmit}>
//                 <div className="space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Category Name"
//                     value={newCategory.name}
//                     onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <textarea
//                     placeholder="Description"
//                     value={newCategory.description}
//                     onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Image URL"
//                     value={newCategory.imageUrl}
//                     onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-4 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddCategory(false)}
//                     className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                   >
//                     Add Category
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Add Item Modal */}
//         {showAddItem && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
//               <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Item</h2>
//               <form onSubmit={handleItemSubmit}>
//                 <div className="space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Item Name"
//                     value={newItem.name}
//                     onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <textarea
//                     placeholder="Description"
//                     value={newItem.description}
//                     onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Price"
//                     value={newItem.price}
//                     onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <select
//                     value={newItem.category}
//                     onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map(category => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="text"
//                     placeholder="Image URL"
//                     value={newItem.imageUrl}
//                     onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Flavours (comma-separated)"
//                     value={newItem.flavours}
//                     onChange={(e) => setNewItem({ ...newItem, flavours: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Volume"
//                     value={newItem.volume}
//                     onChange={(e) => setNewItem({ ...newItem, volume: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Discount %"
//                     value={newItem.discount}
//                     onChange={(e) => setNewItem({ ...newItem, discount: e.target.value })}
//                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-4 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddItem(false)}
//                     className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//                   >
//                     Add Item
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CafeMenu;