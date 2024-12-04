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
import ProtectedRoute from './Components/ProtectedRoute .jsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />, // Login page route
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ), // ProtectedRoute দিয়ে Home route wrap
    children: [
      {
        path: "/",
        element: <DashBoard />,
      },
      {
        path: "/userlist",
        element: <UserList />,
      },
      {
        path: "/pending-tutor-request",
        element: <PendingTutorRequest />,
      },
      {
        path: "/approved-tutor-request",
        element: <ApprovedTutorRequest />,
      },
      {
        path: "/pending-higher-tutor-request",
        element: <PendingHigherTutorRequest />,
      },
      {
        path: "/approved-higher-tutor-request",
        element: <ApprovedHigherTutorRequest />,
      },
      {
        path: "/pro-tutor-list",
        element: <Protutor />,
      },
      {
        path: "/tutor-list",
        element: <Tutor />,
      },
      {
        path: "/add-institution",
        element: <AddInstitution />,
      },
      {
        path: "/institution-list",
        element: <InstitutionList />,
      },
      {
        path: "/add-faq",
        element: <AddFaq />,
      },
      {
        path: "/faq-list",
        element: <FaqList />,
      },
      {
        path: "/pro-payment",
        element: <ProPayment />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/review",
        element: <Review />,
      },
      {
        path: "/testimonial",
        element: <Testimonial />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);