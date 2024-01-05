import React from 'react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="text-2xl text-white font-bold">
                    Finances App
                </a>
                <div className="hidden lg:flex">
                    <a href="#" className="text-white px-4">
                        Services
                    </a>
                    <a href="/sign-up" className="text-white">
                        SignUp
                    </a>
                    <a href="/login" className="text-white px-4">
                        Login
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

