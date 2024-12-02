import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import RadialBar from './RadialBar'; // RadialBar import

const Dashboard = () => {
    const [totalStudentData, setTotalStudentData] = useState(null);
    const [proTutorData, setProTutorData] = useState(null);
    const [referrerData, setReferrerData] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [inactiveUserData, setInactiveUserData] = useState(null);
    const [activeUserData, setActiveUserData] = useState(null);
    const [chartPercentages, setChartPercentages] = useState({
        totalStudent: 0,
        proTutor: 0,
        referrer: 0,
        payment: 0,
        inactiveUser: 0,
        activeUser: 0,
    });

    // API Data Fetching
    useEffect(() => {
        axios.get('https://tutorwise-backend.vercel.app/api/admin/total-student-number/')
            .then((response) => {
                setTotalStudentData(response.data);
                animatePercentage("totalStudent", response.data.student_percentage);
            })
            .catch((error) => console.error('Error fetching Total Student data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/total-pro-tutor-number/')
            .then((response) => {
                setProTutorData(response.data);
                animatePercentage("proTutor", response.data.pro_tutor_percentage);
            })
            .catch((error) => console.error('Error fetching Pro Tutor data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/total-referrer-number/')
            .then((response) => {
                setReferrerData(response.data);
                animatePercentage("referrer", response.data.referer_percentage);
            })
            .catch((error) => console.error('Error fetching Referrer data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/total-payment-number/')
            .then((response) => {
                setPaymentData(response.data);
                animatePercentage("payment", response.data.apply_limit_percentage);
            })
            .catch((error) => console.error('Error fetching Payment data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/active-inactive-user-percentage/')
            .then((response) => {
                setActiveUserData(response.data);
                animatePercentage("activeUser", response.data.active_percentage);
            })
            .catch((error) => console.error('Error fetching Active User data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/active-inactive-user-percentage/')
            .then((response) => {
                setInactiveUserData(response.data);
                animatePercentage("inactiveUser", response.data.inactive_percentage);
            })
            .catch((error) => console.error('Error fetching Inactive User data:', error));
    }, []);

    // Percentage Animation Logic
    const animatePercentage = (key, targetPercentage) => {
        let currentPercentage = 0;
        const interval = setInterval(() => {
            currentPercentage += 1;
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
                clearInterval(interval);
            }
            setChartPercentages((prev) => ({ ...prev, [key]: currentPercentage }));
        }, 1);
    };

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Student Card */}
                <Card
                    title="Total Student"
                    value={totalStudentData ? totalStudentData.total_student : '0'}
                    percentage={chartPercentages.totalStudent}
                />
                {/* Pro Tutor Card */}
                <Card
                    title="Pro Tutor"
                    value={proTutorData ? proTutorData.total_pro_tutor : '0'}
                    percentage={chartPercentages.proTutor}
                />
                {/* Referrer Card */}
                <Card
                    title="Referrer"
                    value={referrerData ? referrerData.total_referer : '0'}
                    percentage={chartPercentages.referrer}
                />
                {/* Payment Card */}
                <Card
                    title="Payment"
                    value={paymentData ? paymentData.total_payment_number : '0'}
                    percentage={chartPercentages.payment}
                />
                {/* active User Card */}
                <Card
                    title="Active User"
                    value={activeUserData ? activeUserData.active_user : '0'}
                    percentage={chartPercentages.activeUser}
                />

                {/* Inactive User Card */}
                <Card
                    title="Inactive User"
                    value={inactiveUserData ? inactiveUserData.inactive_user : '0'}
                    percentage={chartPercentages.inactiveUser}
                />
            </div>
        </div>
    );
};

// Card Component
const Card = ({ title, value, percentage }) => {
    return (
        <div className="card bg-white shadow-md rounded-lg px-2">
            <div className='flex justify-around items-center'>
                <div className='flex flex-col justify-end'>
                    <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
                    <h2 className="text-xl font-bold">{value}</h2>
                    <span className="text-sm text-gray-500">{title}</span>
                </div>
                {/* Right Section: RadialBar Chart */}
                <div className="w-32 h-32 sm:w-32 sm:h-32">
                    <RadialBar percentage={percentage} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
