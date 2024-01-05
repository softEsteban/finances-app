import AddSubcategoryForm from '@/components/AddSubcategoryForm';
import { Subcategory } from '@/interfaces/subcategory.interface';
import React, { useEffect, useState } from 'react';

const CategoriesIndex = () => {
    
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/subcategories');
                const data = await response.json();
                setSubcategories(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <main className="min-h-screen p-4 sm:p-8 bg-gray-100">
            <title>Categories</title>
            <section className="mt-8">
                <div className="container mx-auto">

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Add Subcategory
                    </button>

                    {/* Subcategories Table */}
                    <section className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">Name</th>
                                    <th className="text-left">Parent Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.map(subcategory => (
                                    <tr key={subcategory.id}>
                                        <td className="py-2">{subcategory.name}</td>
                                        <td className="py-2">{subcategory.categoryId?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    {/* Modal */}
                    {showModal && (
                        <AddSubcategoryForm handleCloseModal={handleCloseModal} />
                    )}

                </div>
            </section>
        </main>
    );
};

export default CategoriesIndex;
