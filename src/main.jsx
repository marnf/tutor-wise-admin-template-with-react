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

import InactiveUser from './Pages/InactiveUser/InactiveUser.jsx'
import PrivateRoute from './../src/PrivateRoute/PrivateRoute.jsx'
import ProtectedRoute from './Components/ProtectedRoute .jsx';
import StudentList from './Pages/StudentList/StudentList.jsx';
import AssignedList from './Pages/AssignedList/AssignedList.jsx'
import SendMessagePage from './Pages/SendMessagePage/SendMessagePage.jsx';
import AllTutorList from './Pages/TutorList/AllTutor/AllTutorList.jsx';
import AllPayment from './Pages/Payment/AllPayment/AllPayment.jsx';
import ReferrerPage from './Pages/ReferrerPages/ReferrerPage.jsx';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import TutorPosts from './Pages/TeachersTuitionPost/TutorPosts/TutorPosts.jsx';
import TutorPostStatus from './Pages/TeachersTuitionPost/TutorPostStatus/TutorPostStatus.jsx';
import AllTuition from './Pages/StudentsTuitionPosts/AllTuition/AllTuition.jsx';
import TuitionStatus from './Pages/StudentsTuitionPosts/TuitionStatus/TuitionStatus.jsx';
import HireTutor from './Pages/HireTutor/HireTutor.jsx';
import WithDraw from './Pages/WithDraw/WithDraw.jsx';
import ProSubscription from './Pages/DynamicPricing/ProSubscription/ProSubscription.jsx';
import LimitSubscription from './Pages/DynamicPricing/LimitSubscription/LimitSubscription.jsx';
import TuitionPercentage from './Pages/DynamicPricing/TuitionPercentage/TuitionPercentage.jsx';
import CreateUser from './Pages/CreateUser/CreateUser.jsx';
import { AuthProvider } from './Contexts/AuthProvider.jsx';




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
        element: <DashBoard />,
      },
      {
        path: "/userlist",
        element: <PrivateRoute allowedRoles={[1]}>
          <UserList />
        </PrivateRoute>
      },
      {
        path: "/create-user",
        element: <PrivateRoute allowedRoles={[1]}>
          <CreateUser />
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
        element: <PrivateRoute allowedRoles={[2]}> <PendingHigherTutorRequest />,</PrivateRoute>
      },
      {
        path: "/approved-higher-tutor-request",
        element: <PrivateRoute allowedRoles={[2]}> <ApprovedHigherTutorRequest />,</PrivateRoute>
      },
      {
        path: "/all-tutor-list",
        element: <PrivateRoute allowedRoles={[3]}> <AllTutorList />,</PrivateRoute>
      },
      {
        path: "/pro-tutor-list",
        element: <PrivateRoute allowedRoles={[3]}> <Protutor />,</PrivateRoute>
      },
      {
        path: "/tutor-list",
        element: <PrivateRoute allowedRoles={[3]}> <Tutor />,</PrivateRoute>
      },
      {
        path: "/add-institution",
        element: <PrivateRoute allowedRoles={[4]}> <AddInstitution />,</PrivateRoute>
      },
      {
        path: "/institution-list",
        element: <PrivateRoute allowedRoles={[4]}><InstitutionList />,</PrivateRoute>
      },
      {
        path: "/add-faq",
        element: <PrivateRoute allowedRoles={[5]}> <AddFaq />,</PrivateRoute>
      },
      {
        path: "/faq-list",
        element: <PrivateRoute allowedRoles={[5]}> <FaqList />,</PrivateRoute>
      },
      {
        path: "/all-payment",
        element: <PrivateRoute allowedRoles={[6]}> <AllPayment />,</PrivateRoute>
      },
      {
        path: "/pro-payment",
        element: <PrivateRoute allowedRoles={[6]}> <ProPayment />,</PrivateRoute>
      },
      {
        path: "/payment",
        element: <PrivateRoute allowedRoles={[6]}> <Payment />,</PrivateRoute>
      },
      {
        path: "/review",
        element: <PrivateRoute allowedRoles={[7]}><Review />,</PrivateRoute>
      },
      {
        path: "/testimonial",
        element: <PrivateRoute allowedRoles={[8]}> <Testimonial />,</PrivateRoute>
      },
      {
        path: "/send-message",
        element: <PrivateRoute allowedRoles={[9]}> <SendMessagePage></SendMessagePage> </PrivateRoute>
      },
      {
        path: "/withdraw",
        element: <PrivateRoute allowedRoles={[9]}> <WithDraw></WithDraw> </PrivateRoute>
      },
      {
        path: "/connected-list",
        element: <PrivateRoute allowedRoles={[10]}> <AssignedList /> </PrivateRoute>
      },
      {
        path: "/student-list",
        element: <PrivateRoute allowedRoles={[11]}> <StudentList /> </PrivateRoute>
      },
      {
        path: "/hire-tutor",
        element: <PrivateRoute allowedRoles={[11]}> <HireTutor></HireTutor> </PrivateRoute>
      },
      {
        path: "/referrer-list",
        element: <PrivateRoute allowedRoles={[11]}> <ReferrerPage /> </PrivateRoute>
      },
      {
        path: "/inactive-user",
        element: <PrivateRoute allowedRoles={[12]}> <InactiveUser></InactiveUser> </PrivateRoute>
      },
      {
        path: "/students-tuition-posts",
        element: <PrivateRoute allowedRoles={[13]}> <AllTuition></AllTuition> </PrivateRoute>
      },
      {
        path: "/students-tuition-status",
        element: <PrivateRoute allowedRoles={[13]}> <TuitionStatus></TuitionStatus> </PrivateRoute>
      },
      {
        path: "/teachers-tuition-post",
        element: <PrivateRoute allowedRoles={[13]}> <TutorPosts></TutorPosts> </PrivateRoute>
      },
      {
        path: "/teachers-post-status",
        element: <PrivateRoute allowedRoles={[13]}> <TutorPostStatus></TutorPostStatus> </PrivateRoute>
      },
      {
        path: "/pro-subscription",
        element: <PrivateRoute allowedRoles={[10]}> <ProSubscription></ProSubscription> </PrivateRoute>
      },
      {
        path: "/limit-subscription",
        element: <PrivateRoute allowedRoles={[10]}> <LimitSubscription></LimitSubscription> </PrivateRoute>
      },
      {
        path: "/tuition-percentage",
        element: <PrivateRoute allowedRoles={[10]}> <TuitionPercentage></TuitionPercentage> </PrivateRoute>
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>
      
      <RouterProvider router={router} />

    </AuthProvider>
  </StrictMode>,
);