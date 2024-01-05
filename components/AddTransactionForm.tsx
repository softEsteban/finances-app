import { Account } from "@/interfaces/account.interface";
import { Subcategory } from "@/interfaces/subcategory.interface";
import { Transaction } from "@/interfaces/transaction.interface";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type TransactionPayload = {
    description: string;
    amount: number;
    type: string;
    subcategoryId: string;
    date: string;
    userId: any;
    accountId: string;
};

export default function AddTransactionForm({ handleCloseModal, handleAddTransactionAction, type }: any) {

    //Store
    const user = useSelector((state: any) => state.app.client.sessionUser);

    //Categories
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/subcategories?type=${type}`);
                const data = await response.json();
                setSubcategories(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Accounts by user 
    const [accounts, setAccounts] = useState<Account[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/accounts?userId=${user._id}`);
                const data = await response.json();
                setAccounts(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    //Transaction form
    const [transactionData, setTransactionData] = useState({
        description: '',
        amount: 0,
        selectedCategory: '',
        selectedAccount: '',
        date: ''
    });

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { description, amount, selectedCategory, date, selectedAccount } = transactionData;

        // Construct the payload based on the transaction type
        let payload: TransactionPayload = {
            description,
            amount,
            type,
            subcategoryId: selectedCategory,
            date,
            userId: user._id,
            accountId: selectedAccount
        };
    
        try {
            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Transaction created successfully!');
                setTransactionData({
                    description: '',
                    amount: 0,
                    selectedCategory: '',
                    selectedAccount: '',
                    date: '',
                });
                handleCloseModal();
                const responseData = await response.json();
                handleAddTransactionAction(responseData);
            } else {
                console.error('Transaction creation failed.');
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setTransactionData({
            ...transactionData,
            [name]: value,
        });
    };

    const handleCategoryChange = (e: any) => {
        const selectedCategory = e.target.value;
        setTransactionData({
            ...transactionData,
            selectedCategory,
        });
    };

    const handleSourceChange = (e: any) => {
        const selectedAccount = e.target.value;
        setTransactionData({
            ...transactionData,
            selectedAccount,
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setTransactionData({
            ...transactionData,
            date,
        });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">{type === 'income' ? 'Add Income' : 'Add Outcome'}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                            Transaction Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={transactionData.description}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={transactionData.date}
                            onChange={handleDateChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={transactionData.amount}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={transactionData.selectedCategory}
                            onChange={handleCategoryChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                            required
                        >
                            {Array.isArray(subcategories) ? (
                                <>
                                    <option value="">Select a category</option>
                                    {subcategories.map((category: Subcategory) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <option value="">No subcategories available</option>
                            )}
                        </select>
                    </div>
                    {type === 'outcome' ? (
                        <div className="mb-4">
                            <label htmlFor="account" className="block text-gray-700 font-semibold mb-2">
                                Source account
                            </label>
                            <select
                                id="account"
                                name="account"
                                value={transactionData.selectedAccount}
                                onChange={handleSourceChange}
                                className="border border-gray-300 rounded-md p-2 w-full"
                                required
                            >
                                {Array.isArray(accounts) ? (
                                    <>
                                        <option value="">Select a source account</option>
                                        {accounts.map((account: Account) => (
                                            <option key={account._id} value={account._id}>
                                                {account.name}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value="">No accounts available</option>
                                )}
                            </select>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <label htmlFor="account" className="block text-gray-700 font-semibold mb-2">
                                Target account
                            </label>
                            <select
                                id="account"
                                name="account"
                                value={transactionData.selectedAccount}
                                onChange={handleSourceChange}
                                className="border border-gray-300 rounded-md p-2 w-full"
                                required
                            >
                                {Array.isArray(accounts) ? (
                                    <>
                                        <option value="">Select a target account</option>
                                        {accounts.map((account: Account) => (
                                            <option key={account._id} value={account._id}>
                                                {account.name}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value="">No accounts available</option>
                                )}
                            </select>
                        </div>
                    )
                    }
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
    )
}
