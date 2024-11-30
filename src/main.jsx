import { StrictMode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Pages/Home/Home.jsx';
import DashBoard from './Pages/DashBoard/DashBoard.jsx';
import UserList from './Pages/UserList/UserList.jsx';
import PendingTutorRequest from './Pages/PendingTutorRequest/PendingTutorRequest.jsx';
import LoginPage from './Pages/LoginPage/LoginPage.jsx';
import ApprovedTutorRequest from './Pages/ApprovedTutorRequest/ApprovedTutorRequest.jsx';
import PendingHigherTutorRequest from './Pages/PendingHigherTutorRequest/PendingHigherTutorRequest.jsx';
import ApprovedHigherTutorRequest from './Pages/ApprovedHigherTutorRequest/ApprovedHigherTutorRequest.jsx';
import Protutor from './Pages/TutorList/ProTutor/Protutor.jsx';
import Tutor from './Pages/TutorList/Tutor/Tutor.jsx';
import AddInstitution from './Pages/Institution/AddInstitution/AddInstitution.jsx'
import InstitutionList from './Pages/Institution/InstitutionList/InstitutionList.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <Home />, // Home component will be used for the dashboard
    children: [
      {
        path: "/home",
        element: <DashBoard />,
      },
      {
        path: "/home/userlist",
        element: <UserList />,
      },
      {
        path: "/home/pending-tutor-request",
        element: <PendingTutorRequest />,
      },
      {
        path: "/home/approved-tutor-request",
        element: <ApprovedTutorRequest></ApprovedTutorRequest>
      },
      {
        path: "/home/pending-higher-tutor-request",
        element: <PendingHigherTutorRequest></PendingHigherTutorRequest>
      },
      {
        path: "/home/approved-higher-tutor-request",
        element: <ApprovedHigherTutorRequest></ApprovedHigherTutorRequest>
      },
      {
        path: "/home/pro-tutor-list",
        element: <Protutor></Protutor>
      },
      {
        path: "/home/tutor-list",
        element: <Tutor></Tutor>
      },
      {
        path: "/home/add-institution",
        element: <AddInstitution></AddInstitution>
      },
      {
        path: "/home/institution-list",
        element: <InstitutionList></InstitutionList>
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
