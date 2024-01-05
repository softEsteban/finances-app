import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AddUpdateAccountForm = ({ handleCloseAddAccountModal, handleAddAccountAction, handleUpdateAccountAction, accountAction, selectedAccount }: any) => {

    // Store
    const user = useSelector((state: any) => state.app.client.sessionUser);

    const isEditMode = accountAction === "update";

    const [accountData, setAccountData] = useState({
        name: '',
        amount: 0,
    });

    useEffect(() => {
        if (accountAction === "update" && selectedAccount) {
            setAccountData({
                name: selectedAccount.name,
                amount: selectedAccount.amount,
            });
        } else {
            setAccountData({
                name: '',
                amount: 0,
            });
        }
    }, [accountAction, selectedAccount]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = {
                ...accountData,
                userId: user._id,
            };
            let response;
            if (isEditMode) {
                response = await fetch(`http://localhost:3000/api/accounts/${selectedAccount._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            } else {
                response = await fetch('http://localhost:3000/api/accounts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            }
            if (response.ok) {
                handleCloseAddAccountModal();
                const responseData = await response.json();
                if (accountAction === "create") {
                    handleAddAccountAction(responseData);
                } else {
                    handleUpdateAccountAction(responseData)
                }
            } else {
                console.error(`Failed to ${isEditMode ? 'update' : 'add'} balance.`);
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'adding'} account:`, error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccountData({
            ...accountData,
            [name]: value,
        });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Account' : 'Add Account'}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={accountData.name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div>
                    {/* <div className="mb-4">
                        <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={balanceData.amount}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                        />
                    </div> */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
                        >
                            {isEditMode ? 'Update Account' : 'Add Account'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCloseAddAccountModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUpdateAccountForm;
