import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import '../app/globals.css';
import SuccessRegister from '@/components/SuccessRegister';

const SignUp = () => {
  const [user, setUser] = useState({ username: '', password: '', password_confirm: '', name: '', lastname: '', email: '' });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [registerError, setRegisterError] = useState('');

  const handleRegister = async () => {
    try {
      if (user.password !== user.password_confirm) {
        console.error('Las contraseñas no coinciden.');
        return;
      }

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          password: user.password
        }),
      });

      //Successful request
      if (response.ok) {
        setRegistrationSuccess(true);
        //Error scenarios 
      } else {
        const data = await response.json();

        if (data && data.error) {
          setRegisterError(data.error);
        } else {
          setRegisterError('Failed to register. Please try again later.');
        }

        setTimeout(() => {
          setRegisterError('');
        }, 3000);
      }
    } catch (error) {
      setRegisterError('There has been a server error trying to register');
      setTimeout(() => {
        setRegisterError('');
      }, 3000);
    }
  };

  const handleGoogleRegister = () => {
  };

  return (
    <>
    <title>Register</title>
      <Navbar />
      {registrationSuccess ? (
        <div className="container mx-auto">
          <SuccessRegister />
        </div>
      ) : (
        <div className="container mx-auto">
          <Navbar />
          <main className="flex items-center justify-center min-h-screen p-4 sm:p-8 md:p-16 lg:p-24 xl:p-32 bg-gray-100">
            <div className="bg-white shadow-lg rounded-md flex flex-col lg:flex-row justify-between w-full lg:w-2/3">
              <div className="p-8 lg:w-1/2">
                <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-indigo-800">
                Sign Up
                </h2>
                <div className="mb-4">
                  <div className="flex items-center border rounded-full p-2">
                    <FaUserCircle className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full outline-none text-gray-700"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center border rounded-full p-2">
                    <FaUserCircle className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Lastname"
                      className="w-full outline-none text-gray-700"
                      value={user.lastname}
                      onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center border rounded-full p-2">
                    <FaUserCircle className="text-gray-500 mr-2" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full outline-none text-gray-700"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center border rounded-full p-2">
                    <FaLock className="text-gray-500 mr-2" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full outline-none text-gray-700"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center border rounded-full p-2">
                    <FaLock className="text-gray-500 mr-2" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className="w-full outline-none text-gray-700"
                      value={user.password_confirm}
                      onChange={(e) => setUser({ ...user, password_confirm: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  onClick={handleRegister}
                  className="bg-blue-500 text-white rounded-full py-2 px-6 hover:bg-blue-700 w-full mb-4"
                >
                  Register
                </button>
                <button
                  onClick={handleGoogleRegister}
                  className="flex items-center justify-center bg-white text-gray-700 rounded-full py-2 px-6 border border-gray-300 hover:border-gray-400 w-full"
                >
                  <FcGoogle className="text-xl mr-2" />
                  Register with Google
                </button>

                {/* Feedback messages */}
                {registerError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4">
                    {registerError}
                  </div>
                )}

              </div>
              <div className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat rounded-tr-md rounded-br-md" style={{ backgroundImage: `url("/register-image.jpg")` }}></div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default SignUp;
