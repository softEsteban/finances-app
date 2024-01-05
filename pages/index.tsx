import Sidebar from '@/components/Sidebar';
import LandingPage from './landing';
import { useSelector } from 'react-redux';
import Home from './home';
import Transactions from './transactions';
import CategoriesIndex from './categories';
import BudgetIndex from './budget';
import { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';


const Layout = () => {
  const userToken = useSelector((state: any) => state.app.client.tokenUser);
  const isLoggedIn = !!userToken;

  //Selected component from the sidebar
  const selectedComponent = useSelector((state: any) => state.app.client.selectedComponent);

  let componentToRender = null;

  switch (selectedComponent) {
    case '/transactions':
      componentToRender = isLoggedIn ? <Transactions /> : null;
      break;
    case '/categories':
      componentToRender = isLoggedIn ? <CategoriesIndex /> : null;
      break;
    case '/budget':
      componentToRender = isLoggedIn ? <BudgetIndex /> : null;
      break;
    case '/home':
      componentToRender = isLoggedIn ? <Home /> : null;
      break;
    default:
      componentToRender = null;
  }

  // Toggle sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {isLoggedIn && (
        <>
          {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} />}
          <div className={`flex flex-col w-full ${isLoggedIn && isSidebarOpen ? 'ml-64' : ''}`}>
            <button onClick={toggleSidebar} className="ml-8 mt-4 rounded-full w-10 h-10 bg-blue-500 text-white flex items-center justify-center">
              {isSidebarOpen ? <FaArrowLeft className="text-white-500 hover:text-white-700" />:(
                <FaArrowRight className="text-white-500 hover:text-white-700" />
              )}

            </button>
            <main className="flex-1 p-8 overflow-y-auto">
              {componentToRender}
            </main>
          </div>
        </>
      )}
      {!isLoggedIn && <LandingPage />}
    </div>
  );
};

export default Layout;
