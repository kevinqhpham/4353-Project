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

const router = createBrowserRouter([
  {path:"/",element:<App/>},
  {path:"/signup",element:<Signup/>},
  {path:"/login",element:<Login/>},
  {path:"/userpage",element:<UserPage/>},
  {path:"/profile",element:<Profile/>},
  {path:"/inbox",element:<Inbox/>}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>
);
