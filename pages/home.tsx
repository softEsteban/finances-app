import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../app/globals.css'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import AddTransactionForm from "@/components/AddTransactionForm";
import { useSelector } from "react-redux";
import { Transaction } from "@/interfaces/transaction.interface";
import { Account } from "@/interfaces/account.interface";
import AddUpdateAccountForm from "@/components/AddUpdateAccountForm";

const useFetchData = (url: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
};

export default function Home() {

  // Store
  const user = useSelector((state: any) => state.app.client.sessionUser);

  // Transactions data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useFetchData(`http://localhost:3000/api/transactions?userId=${user._id}&limit=5`, setTransactions);

  // Accounts data
  const [accounts, setAccounts] = useState<Account[]>([]);
  useFetchData(`http://localhost:3000/api/accounts?userId=${user._id}`, setAccounts);

  // Transactions modals
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('');

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddTransaction = (type: any) => {
    setTransactionType(type);
    setShowModal(true);
  };

  const handleAddTransactionAction = (newTransaction: Transaction) => {
    setTransactions(prevTransactions => {
      if (!Array.isArray(prevTransactions)) {
        return [newTransaction];
      }
      return [...prevTransactions, newTransaction];
    });
  };

  // Account modal actions
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [accountAction, setAccountAction] = useState<"create" | "update">("create");

  const handleAddAccount = () => {
    setAccountAction("create");
    setShowAddAccountModal(true);
  };

  const handleEditAccount = (account: Account) => {
    setAccountAction("update");
    setShowAddAccountModal(true);
    setSelectedAccount(account);
  };

  const handleCloseAddAccountModal = () => {
    setShowAddAccountModal(false);
  };

  const handleAddAccountAction = (newAccount: Account) => {
    setAccounts(prevAccounts => {
      if (!Array.isArray(prevAccounts)) {
        return [newAccount];
      }
      return [...prevAccounts, newAccount];
    });
  };

  const handleUpdateAccountAction = (updatedAccount: Account) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account._id === updatedAccount._id ? updatedAccount : account
      )
    );
  };

  const handleDeleteAccount = async (accountId: any) => {
    try {
      const response = await fetch(`http://localhost:3000/api/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setAccounts(prevAccounts => prevAccounts.filter(account => account._id !== accountId));
      } else {
        console.error(`Failed to delete account with ID ${accountId}.`);
      }
    } catch (error) {
      console.error(`Error deleting account with ID ${accountId}:`, error);
    }
  };


  // Graphics raw data
  const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 6000 },
    { name: 'May', value: 4000 },
    { name: 'Jun', value: 7000 },
    { name: 'Jul', value: 8000 },
  ];


  return (
    <main className="min-h-screen p-2 sm:p-8 bg-gray-100">
      <title>Dashboard</title>
      <section className="mt-8">
        <div className="container mx-auto">

          {/* User Profile Section */}
          <div className="flex items-center">
            <div className="bg-white rounded-full w-24 h-24 p-4 flex items-center justify-center shadow-lg">
              <img
                src="https://randomuser.me/api/portraits/men/11.jpg"
                alt="User Avatar"
                className="w-16 h-16 rounded-full"
              />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-semibold">Hola, {user.name}!</h2>
              <p className="text-gray-600">Welcome back to your account</p>
            </div>
          </div>

          {/* Add Account, Add Income and Add Outcome Buttons */}
          <section className="flex mt-8">
            <button onClick={handleAddAccount} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded mr-4">
              Add Account
            </button>
            <button onClick={() => handleAddTransaction('income')} className="bg-blue-300 hover:bg-blue-400 text-blue-700 font-semibold py-2 px-4 rounded mr-4">
              Add Income
            </button>
            <button onClick={() => handleAddTransaction('outcome')} className="bg-blue-300 hover:bg-blue-400 text-blue-700 font-semibold py-2 px-4 rounded mr-4">
              Add Outcome
            </button>
          </section>

          {/* Account Cards*/}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Accounts</h2>
            {accounts.length === 0 ? (
              <p>No data available for accounts</p>
            ) : (
              <div className="flex flex-wrap -mx-2">
                {Array.isArray(accounts) && accounts.map((account: Account) => (
                  <div
                    key={account._id}
                    className="bg-white rounded-lg p-4 shadow-md w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/6 mb-4 mx-2 relative"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-sm font-semibold">{account.name}</h3>
                        <p className="text-lg mt-2">{account.amount.toLocaleString()}</p>
                      </div>
                      <div><button className="mr-2" onClick={() => handleEditAccount(account)}>
                        <FaEdit className="text-gray-500 hover:text-gray-700" />
                      </button></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Last Movements Table */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Last Movements</h2>
            {transactions.length === 0 ? (
              <p>No data available for last movements</p>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(transactions) && transactions.map((transaction: Transaction) => (
                    <tr key={transaction._id} className="border-b">
                      <td className="py-2">{transaction.description}</td>
                      <td className="py-2">{transaction.subcategoryId?.name}</td>
                      <td className="py-2">
                        <span className={`${transaction.type === 'outcome' ? 'text-red-500' : 'text-green-500'}`}>
                          ${transaction.type === 'outcome' ? '-' + transaction.amount.toLocaleString() : '+' + transaction.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* {transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b">
                      <td className="py-2">{transaction.description}</td>
                      <td className="py-2">{transaction.subcategoryId?.name}</td>
                      <td className="py-2">
                        <span className={`${transaction.type === 'outcome' ? 'text-red-500' : 'text-green-500'}`}>
                          ${transaction.type === 'outcome' ? '-' + transaction.amount.toLocaleString() : '+' + transaction.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            )}
          </section>

          {/* Recharts Line Chart */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Monthly Data</h2>
            <LineChart width={300} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </section>

        </div>
      </section>

      {/* Modals */}
      {showModal && (
        <AddTransactionForm
          handleCloseModal={handleCloseModal}
          handleAddTransactionAction={handleAddTransactionAction}
          type={transactionType} />
      )}

      {showAddAccountModal && (
        <AddUpdateAccountForm
          handleCloseAddAccountModal={handleCloseAddAccountModal}
          handleAddAccountAction={handleAddAccountAction}
          handleUpdateAccountAction={handleUpdateAccountAction}
          accountAction={accountAction}
          selectedAccount={selectedAccount} />
      )}
    </main>
  );
}
