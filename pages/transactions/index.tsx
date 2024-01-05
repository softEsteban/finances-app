import { Transaction } from "@/interfaces/transaction.interface";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const TransactionsIndex = () => {

  // Store
  const user = useSelector((state: any) => state.app.client.sessionUser);

  // Transactions data
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/transactions?userId=${user._id}`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Search input
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const includesSearchTerm = (value: string) =>
      typeof value === "string" &&
      value.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      Object.values(transaction).some(includesSearchTerm) ||
      transaction.amount.toString().includes(searchTerm)
    );
  });

  // Format date to remove time part
  const formatDate = (dateString: string): string => {
    const dateWithoutTime = dateString.split('T')[0];
    return dateWithoutTime;
  };




  // Date filters
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Function to filter transactions based on selected month and year
  const filterTransactions = (transaction: Transaction): boolean => {
    if (selectedMonth === "" && selectedYear === "") {
      return true; // No filter applied, show all transactions
    }

    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth() + 1; // Month is zero-indexed
    const transactionYear = transactionDate.getFullYear();

    return (
      (selectedMonth === "" || transactionMonth.toString() === selectedMonth) &&
      (selectedYear === "" || transactionYear.toString() === selectedYear)
    );
  };

  // const filteredTransactions = transactions.filter(filterTransactions);

  // Function to get unique months and years from transactions
  const getUniqueMonthsAndYears = (): { months: string[], years: string[] } => {
    const uniqueMonths = Array.from(new Set(transactions.map(transaction => {
      const transactionDate = new Date(transaction.date);
      return (transactionDate.getMonth() + 1).toString();
    })));

    const uniqueYears = Array.from(new Set(transactions.map(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear().toString();
    })));

    return { months: uniqueMonths, years: uniqueYears };
  };

  const { months, years } = getUniqueMonthsAndYears();


  const downloadTransactionsExcel = async () => {
    try {
      const response = await fetch(`/api/transactions/getTransactionsExcel?userId=${user._id}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transacctions_${user._id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };


  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-100">
      <title>Transactions</title>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

        {/* Buttons bar */}
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search transactions"
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 w-full md:w-96 focus:border-none focus:outline-none"
          />

          {/* Month Filter Dropdown */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 focus:border-none focus:outline-none"
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>

          {/* Year Filter Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-2 md:mb-0 md:mr-2 w-full md:w-auto focus:border-none focus:outline-none"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button onClick={downloadTransactionsExcel} className="bg-blue-300 hover:bg-blue-400 text-blue-700 font-semibold py-2 px-4 rounded mb-2 md:mb-0">
            Download
          </button>
        </div>

        {/* Transactions table */}
        <div className="container mx-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Amount</th>
                <th className="text-left">Description</th>
                <th className="text-left hidden md:table-cell">Category</th>
                <th className="text-left">Date</th>
                <th className="text-left hidden md:table-cell">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="py-2">
                    <span className={`${transaction.type === 'outcome' ? 'text-red-500' : 'text-green-500'}`}>
                      {transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2">{transaction.description}</td>
                  <td className="py-2 hidden md:table-cell">{transaction.subcategoryId?.name}</td>
                  <td className="py-2">{formatDate(transaction.date)}</td>
                  <td className="py-2 hidden md:table-cell">
                    {transaction.type === 'outcome' ? transaction.source?.description || 'N/A' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </section>
    </main>

  );
};

export default TransactionsIndex;
