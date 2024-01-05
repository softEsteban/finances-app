import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const LandingPage = () => {
    return (
        <div className="container mx-auto">
            <title>Finances App</title>
            <Navbar />

            <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 mt-10 justify-center items-center">
                    <div className="">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-800 mb-4">
                            Finances App
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600">
                            Track your expenses, incomes, budgets, and visualize your financial data.
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <img src="/undraw_digital_currency_qpak.svg" alt="Your Image" className="max-w-full max-h-64 md:max-h-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6">
                    <Link href="/expenses" className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Expense Tracking</h3>
                        <p>Track and manage your expenses efficiently.</p>
                    </Link>
                    <Link href="/incomes" className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Income Tracking</h3>
                        <p>Keep a record of your incomes for better financial planning.</p>
                    </Link>
                    <Link href="/budgets" className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Budgets</h3>
                        <p>Set and manage your budgets to control spending.</p>
                    </Link>
                    <Link href="/graphics" className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Graphics with Data</h3>
                        <p>Visualize your financial data for better insights.</p>
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2">
                        Ready to take control of your finances?
                    </h3>
                    <Link href="/signup" className="bg-indigo-800 text-white py-2 px-4 rounded-md">
                        Sign Up Now
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
