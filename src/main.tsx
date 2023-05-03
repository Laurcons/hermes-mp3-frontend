import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/home';
import ChatPage from './pages/chat';
import AdminLoginPage from './pages/admin/login';
import AdminPage from './pages/admin/admin';

import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import VolunteerPage from './pages/admin/volunteer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chat',
    element: <ChatPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/volunteer',
    element: <VolunteerPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  </React.StrictMode>,
);
