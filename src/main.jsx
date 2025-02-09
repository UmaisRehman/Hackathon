import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
import Protectedroutes from './components/Protectedroutes';
import Feeds from './pages/Feeds';
import Profile from './pages/Profile';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Protectedroutes component={<Feeds />}/>
      },
      {
        path: "profile",
        element: <Protectedroutes component={<Profile />}/>
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <div>
    <RouterProvider router={router} />
    <ToastContainer /> 
  </div>
);
