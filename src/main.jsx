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
import AddFaq from './Pages/FAQ/AddFaq/AddFaq.jsx';
import FaqList from './Pages/FAQ/FaqList/FaqList.jsx';
import ProPayment from './Pages/Payment/ProPayment/ProPayment.jsx';
import Payment from './Pages/Payment/Payment/Payment.jsx';
import Review from './Pages/Review/Review.jsx';
import Testimonial from './Pages/Testimonial/Testimonial.jsx';
import TutorPostAction from './Pages/TutonPostAction/TutonPostAction.jsx';
import InactiveUser from './Pages/InactiveUser/InactiveUser.jsx'
import PrivateRoute from './../src/PrivateRoute/PrivateRoute.jsx'
import ProtectedRoute from './Components/ProtectedRoute .jsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute><Home /></ProtectedRoute>,
    children: [
      {
        path: "/",
        element:  <DashBoard />,
      },
      {
        path: "/userlist",
        element: <PrivateRoute allowedRoles={[1]}>
          <UserList />
        </PrivateRoute>
      },
      {
        path: "/pending-tutor-request",
        element: <PrivateRoute allowedRoles={[2]}> <PendingTutorRequest /> </PrivateRoute>
      },
      {
        path: "/approved-tutor-request",
        element: <PrivateRoute allowedRoles={[2]}> <ApprovedTutorRequest /> </PrivateRoute>
      },
      {
        path: "/pending-higher-tutor-request",
        element:<PrivateRoute allowedRoles={[2]}> <PendingHigherTutorRequest />,</PrivateRoute>
      },
      {
        path: "/approved-higher-tutor-request",
        element:<PrivateRoute allowedRoles={[2]}> <ApprovedHigherTutorRequest />,</PrivateRoute>
      },
      {
        path: "/pro-tutor-list",
        element:<PrivateRoute allowedRoles={[3]}> <Protutor />,</PrivateRoute>
      },
      {
        path: "/tutor-list",
        element:<PrivateRoute allowedRoles={[3]}> <Tutor />,</PrivateRoute>
      },
      {
        path: "/tutor-post",
        element:<PrivateRoute allowedRoles={[4]}> <TutorPostAction></TutorPostAction></PrivateRoute>
      },
      {
        path: "/inactive-user",
        element:<PrivateRoute allowedRoles={[5]}> <InactiveUser></InactiveUser></PrivateRoute>
      },
      {
        path: "/add-institution",
        element:<PrivateRoute allowedRoles={[6]}> <AddInstitution />,</PrivateRoute>
      },
      {
        path: "/institution-list",
        element:<PrivateRoute allowedRoles={[6]}><InstitutionList />,</PrivateRoute>
      },
      {
        path: "/add-faq",
        element: <PrivateRoute allowedRoles={[7]}> <AddFaq />,</PrivateRoute>
      },
      {
        path: "/faq-list",
        element:<PrivateRoute allowedRoles={[7]}> <FaqList />,</PrivateRoute>
      },
      {
        path: "/pro-payment",
        element:<PrivateRoute allowedRoles={[8]}> <ProPayment />,</PrivateRoute>
      },
      {
        path: "/payment",
        element:<PrivateRoute allowedRoles={[8]}> <Payment />,</PrivateRoute>
      },
      {
        path: "/review",
        element: <PrivateRoute allowedRoles={[9]}><Review />,</PrivateRoute>
      },
      {
        path: "/testimonial",
        element:<PrivateRoute allowedRoles={[10]}> <Testimonial />,</PrivateRoute>
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);