import { Category } from "@/interfaces/category.interface";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AddSubcategoryForm({ handleCloseModal }: any) {
    //Store
    const user = useSelector((state: any) => state.app.client.sessionUser);

    //Categories
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/categories`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    
    const [subcategoryData, setSubcategoryData] = useState({
        name: '',
        categoryId: '',
        userId: ''
    });

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { name, categoryId } = subcategoryData;

        try {
            const response = await fetch('http://localhost:3000/api/subcategories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, categoryId }),
            });

            if (response.ok) {
                console.log('Subcategory created successfully!');
                setSubcategoryData({
                    name: '',
                    categoryId: '',
                    userId: ''
                });
                handleCloseModal();
            } else {
                console.error('Subcategory creation failed.');
            }
        } catch (error) {
            console.error('Error creating subcategory:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSubcategoryData({
            ...subcategoryData,
            [name]: value,
        });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">Add a subcategory</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                            Subcategory Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={subcategoryData.name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="categoryId" className="block text-gray-700 font-semibold mb-2">
                            Parent Category
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={subcategoryData.categoryId}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            required
                        >
                            {Array.isArray(categories) ? (
                                <>
                                    <option value="">Select a category</option>
                                    {categories.map((category: Category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name} - {category.type}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <option value="">No categories available</option>
                            )}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCloseModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
