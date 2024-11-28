import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Pages/Home/Home.jsx';
import DashBoard from './Pages/DashBoard/DashBoard.jsx';
import UserList from './Pages/UserList/UserList.jsx';
import PendingTutorRequest from './Pages/PendingTutorRequest/PendingTutorRequest.jsx';




const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    children:[
      {
        path:"/",
        element:<DashBoard></DashBoard>
      },
      {
        path:"/userlist",
        element:<UserList></UserList>
      },
      {
        path:"/pending-tutor-request",
        element:<PendingTutorRequest></PendingTutorRequest>
      }
    ]
  },
]);




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
