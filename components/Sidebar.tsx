import { setUser, setMenu, setToken, setSelectedComponent } from '@/redux/reducer';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars } from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen }: any) => {

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
    const setSelectedComponentMenu = (menu: any) => {
        dispatch(setSelectedComponent(menu));
    };

    const menu = useSelector((state: any) => state.app.client.menuUser);
    const user = useSelector((state: any) => state.app.client.sessionUser);

    // Menu

    const renderMenuItems = (items: any) => {
        return items.map((item: any) => (
            <div key={item.name} className="py-2">
                <div
                    className="flex items-center text-gray-800"
                    style={{ paddingLeft: !item.icon ? '20px' : '0' }}
                    onClick={() => handleMenuItemClick(item.link)}
                    role="button"
                >
                    {item.icon && (
                        <span className="mr-2">
                            {/* <img src={item.icon} alt={item.name} className="w-4 h-4" /> */}
                            <FaBars></FaBars>
                        </span>
                    )}
                    {item.name}
                </div>
                {item.submenu && item.submenu.length > 0 && (
                    <div className="ml-4">{renderMenuItems(item.submenu)}</div>
                )}
            </div>
        ));
    };

    const handleMenuItemClick = (menuUrl: any) => {
        setSelectedComponentMenu(menuUrl);
    };

    const tagUserType = (userType: string) => {
        if (userType === "USER") {
            return "Usuario";
        } else if (userType === "ADMIN") {
            return "Administrador";
        } else if (userType === "OWNER") {
            return "Propietario";
        }
        return "";
    };

    const handleLogout = () => {
        setUserSession({});
        setTokenSession("");
        setMenuSession({});
    }

    const userTag = tagUserType(user?.userType || "");

    return (
        <div className="flex h-screen">
            <aside
                className={`bg-white text-gray-800 w-64 flex flex-col shadow-md ${isSidebarOpen ? 'block' : 'hidden'} md:block`}
                style={{
                    position: 'fixed',
                    height: '100vh',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}
            >

                {/* Styled text logo */}
                <div className="pb-2 pt-4 px-4 font-bold text-2xl text-blue-600">
                    Finances<span className="text-gray-600 ml-2">App</span>
                </div>

                {/* Sidebar header */}
                <div className="pb-2 pt-4 px-4 flex items-start">
                    <div className="flex-shrink-0 mr-4">
                        <img
                            // src={sessionUser.avatar}
                            src="https://randomuser.me/api/portraits/men/11.jpg"
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full"
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <p className="text-xl font-bold">{`${user?.name} ${user?.lastname}`}</p>
                            <p className="text-gray-500">{user?.type}</p>
                        </div>
                        <div className="mt-2 flex items-center">
                            <span className="bg-gray-200 rounded-md py-1 px-2 text-sm text-gray-600">
                                {userTag}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="ml-2 text-gray-600 focus:outline-none"
                                style={{ color: 'inherit', transition: 'color 0.3s' }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'red'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar menu */}
                <div className="p-4 border-r border-gray-300 h-full">
                    <div className='text-sm'>
                        {menu && menu.length > 0 && renderMenuItems(menu)}
                    </div>
                </div>

            </aside>
        </div >
    );
};

export default Sidebar;
