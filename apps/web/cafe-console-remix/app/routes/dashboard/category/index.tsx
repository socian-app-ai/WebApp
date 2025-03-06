import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
import axiosInstance from "~/lib/axios.instance";
import DarkButton from "~/components/custom_c/dark-button";
import LabelInputCustomizable from "~/components/custom_c/label-file-input";
import LabelFileInputCustomizable from "~/components/custom_c/label-input";
import { formatTimeDifference2 } from "~/lib/utils";
import { Link } from "@remix-run/react";

interface Category {
    _id: string;
    name: string;
    description: string;
    status: string;
    categories?: string[];
    itemsInIt?: any[];
    updatedAt: string;
}

const CategoryIndex = () => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, name: null, categoryId: '' });
    const [isPending, startTransition] = useTransition();

    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        imageUrl: ''
    });

    const [categoryDialog, setCategoryDialog] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/api/categories');
                setCategories(response.data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const changeCategoryStatus = async (categoryId: string, status: string) => {
        try {
            const response = await axiosInstance.put(`/api/categories/${categoryId}/status`, {
                status: status === 'active' ? 'deactive' : 'active'
            });
            const updatedCategory = response.data.category;

            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category._id === categoryId ? { ...category, status: updatedCategory.status, updatedAt: updatedCategory.updatedAt } : category
                )
            );
        } catch (error) {
            console.error("Error updating category status:", error);
        }
    };

    const handleSort = (key: string) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const handleDeleteClick = (category: Category) => {
        setDeleteConfirmation({
            isOpen: true,
            categoryId: category._id,
            name: category.name
        });
        setSelectedCategory(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/api/categories/${deleteConfirmation.categoryId}`);

            setCategories((prevCategories) =>
                prevCategories.filter(category => category._id !== deleteConfirmation.categoryId)
            );

            setDeleteConfirmation({ isOpen: false, name: null, categoryId: '' });
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({ isOpen: false, name: null, categoryId: '' });
    };

    const handleCategoryDialog = () => {
        setCategoryDialog(!categoryDialog);
    };

    const handleCategoryCreate = async () => {
        try {
            const response = await axiosInstance.post('/api/categories', {
                name: newCategory.name,
                description: newCategory.description,
                imageUrl: newCategory.imageUrl,
            });

            if (response.data) {
                startTransition(() => {
                    setCategories(prevCategory => [...prevCategory, response.data.category]);
                });
            }

        } catch (error) {
            console.error("Error creating category:", error);
        } finally {
            setCategoryDialog(false);
        }
    };

    return (
        <div>
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl mb-5 font-bold dark:text-white text-gray-800">Categories</h2>

                <DarkButton
                    className="w-max px-2"
                    text={"Add Category"}
                    onClick={handleCategoryDialog}
                    loading={false}
                />

                {categoryDialog && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className=" flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            <div className="relative inline-block align-bottom dark:bg-[#1d1d1d] bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="absolute top-2 right-2">
                                    <X className="dark:text-white text-black" onClick={handleCategoryDialog} />
                                </div>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h2>Add Category Details</h2>
                                    <div className="sm:flex sm:items-start flex-col">
                                        <LabelInputCustomizable
                                            required={true}
                                            value={newCategory.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory({ ...newCategory, name: e.target.value })}
                                            type="text"
                                            label={"Name"}
                                            inputClassName=""
                                            placeholder=""
                                            width=""
                                        />

                                        <LabelFileInputCustomizable
                                            required={true}
                                            value={newCategory.description}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory({ ...newCategory, description: e.target.value })}
                                            type="text"
                                            label={"Description"}
                                            labelClassName=""
                                            className=""
                                            resourceImage=""
                                        />
                                        <LabelFileInputCustomizable
                                            label={'Image URL'}
                                            labelClassName=""
                                            className=""
                                            onChange={() => {}}
                                            resourceImage=""
                                        />
                                    </div>
                                </div>
                                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <DarkButton
                                        text={'Create'}
                                        loading={isPending}
                                        onClick={handleCategoryCreate}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                    Items
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
                            {categories && categories.map((category) => (
                                <tr key={category._id} className="dark:hover:bg-gray-500 hover:bg-gray-50  dark:border-[#adadad] border-[#b4b4b4] border-b">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium dark:text-white text-gray-900">{category.name}</div>
                                        <div className="text-sm dark:text-white text-gray-500">{category.categories?.join(", ")}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm dark:text-white text-gray-900 line-clamp-2">{category.description}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800' :
                                            category.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {category.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm dark:text-white text-gray-900">{category?.itemsInIt?.length ?? 0}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white text-gray-500">
                                        {formatTimeDifference2(category.updatedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setSelectedCategory(selectedCategory === category._id ? null : category._id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Actions
                                            </button>

                                            {selectedCategory === category._id && (
                                                <div className="z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg dark:bg-[#1d1d1d] bg-white ring-1 ring-black ring-opacity-5">
                                                    <div className="py-1">
                                                        <Link to={`/category/${category._id}`} className="block px-4 py-2 text-sm dark:text-white text-gray-700 dark:hover:bg-gray-500 hover:bg-gray-100 w-full text-left">
                                                            Edit Details
                                                        </Link>
                                                        <button onClick={() => changeCategoryStatus(category._id, category.status)} className="block px-4 py-2 text-sm dark:text-white text-gray-700 dark:hover:bg-gray-500 hover:bg-gray-100 w-full text-left">
                                                            Change Status
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(category)}
                                                            className="block px-4 py-2 text-sm text-red-600 dark:hover:bg-red-100 hover:bg-red-50 w-full text-left">
                                                            Delete Category
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
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

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
                                            Delete Category
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm dark:text-gray-300 text-gray-500">
                                                Are you sure you want to delete <strong className="font-bold">&quot;{deleteConfirmation.name}&quot;</strong>? <br />This action cannot be undone.

                                                If parent category is deleted, All items will be set <strong className="font-semibold">Deactived</strong>
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

export default CategoryIndex;