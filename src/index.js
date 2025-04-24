import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import Signup from './pages/Signup.js'
import Login from './pages/Login.js'
import UserPage from './pages/UserPage.js'
import Inbox from './pages/Inbox.js'
import Profile from './pages/Profile.js'
import History from './pages/History.js'
import AdminPage from './pages/AdminPage.js'
import AdminEvents from './pages/AdminEvents.js'

const router = createBrowserRouter([
  {path:"/",element:<Login/>},
  {path:"/signup",element:<Signup/>},
  {path:"/login",element:<Login/>},
  {path:"/userpage",element:<UserPage/>},
  {path:"/profile",element:<Profile/>},
  {path:"/history",element:<History/>},
  {path:"/inbox",element:<Inbox/>},
  {path:"/adminpage",element:<AdminPage/>},
  {path:"/adminevents",element:<AdminEvents/>}

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>
);
