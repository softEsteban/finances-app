import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import '../app/globals.css';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setMenu, setUser, setToken, setSelectedComponent } from '@/redux/reducer';

const Login = () => {
  const router = useRouter();

  //Store
  const dispatch = useDispatch();
  
  const setUserSession = (user: any) => {
    dispatch(setUser(user));
  };
  const setMenuSession = (menu: any) => {
    dispatch(setMenu(menu));
  };
  const setTokenSession = (token: any) => {
    dispatch(setToken(token));
  };
  const setSelectedComponentMenu = (token: any) => {
    dispatch(setSelectedComponent(token));
  };

  const [user, setUserForm] = useState({ email: '', password: '' });

  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        }),
      });

      //Successful request
      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        if (token) {
          setUserSession(data.user);
          setMenuSession(data.menu);
          setTokenSession(data.token);
          setSelectedComponentMenu("/home")

          setLoginSuccess("Login successful!");
          setTimeout(() => {
            router.push('/');
          }, 1000);
        }

      } else {
        const data = await response.json();

        if (data && data.error) {
          setLoginError(data.error);
        } else {
          setLoginError('Failed to log in. Please try again later.');
        }

        setTimeout(() => {
          setLoginError('');
        }, 3000);

      }
    } catch (error) {
      setLoginError('There has been a server error trying to log in');
      setTimeout(() => {
        setLoginError('');
      }, 3000);
    }
  };

  const handleGoogleLogin = () => {
  };

  return (

    <div className="container mx-auto">
      <title>Login</title>

      <Navbar />
      <main className="flex items-center justify-center min-h-screen p-4 sm:p-8 md:p-16 lg:p-24 xl:p-32 bg-gray-100">
        <div className="bg-white shadow-lg rounded-md flex flex-col lg:flex-row justify-between w-full lg:w-2/3">
          <div className="p-8 lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-indigo-800">
              Login
            </h2>
            <div className="mb-4">
              <div className="flex items-center border rounded-full p-2">
                <FaUserCircle className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Email"
                  className="w-full outline-none text-gray-700"
                  value={user.email}
                  onChange={(e) => setUserForm({ ...user, email: e.target.value })}
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
                  onChange={(e) => setUserForm({ ...user, password: e.target.value })}
                />
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white rounded-full py-2 px-6 hover:bg-blue-700 w-full mb-4"
            >
              Login
            </button>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center bg-white text-gray-700 rounded-full py-2 px-6 border border-gray-300 hover:border-gray-400 w-full"
            >
              <FcGoogle className="text-xl mr-2" />
              Login with Google
            </button>

            <div className="mb-4 text-sm text-center pt-2">
              {/* Change Password link */}
              <a href="#" className="text-blue-500 hover:underline">
                Forgot your password?
              </a>
            </div>

            {/* Feedback messages */}
            {loginSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md my-4">
                {loginSuccess}
              </div>
            )}
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4">
                {loginError}
              </div>
            )}
          </div>
          <div className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat rounded-tr-md rounded-br-md" style={{ backgroundImage: `url("/login-image.jpg")` }}></div>
        </div>
      </main>
    </div>
  );
};

export default Login;
