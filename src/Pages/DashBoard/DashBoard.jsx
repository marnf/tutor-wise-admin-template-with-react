import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2'; // Pie Chart import
import 'chart.js/auto'; // Chart.js auto register
import RadialBar from './RadialBar'; // RadialBar import
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';

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
        inactiveUser: 0,
        activeUser: 0,
    });

    // API Data Fetching
    useEffect(() => {
        axios.get('https://tutorwise-backend.vercel.app/api/admin/total-student-number/')
            .then((response) => {
                setTotalStudentData(response.data);
                animatePercentage('totalStudent', response.data.student_percentage);
            })
            .catch((error) => console.error('Error fetching Total Student data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/total-pro-tutor-number/')
            .then((response) => {
                setProTutorData(response.data);
                animatePercentage('proTutor', response.data.pro_tutor_percentage);
            })
            .catch((error) => console.error('Error fetching Pro Tutor data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/total-referrer-number/')
            .then((response) => {
                setReferrerData(response.data);
                animatePercentage('referrer', response.data.referer_percentage);
            })
            .catch((error) => console.error('Error fetching Referrer data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/total-payment-number/')
            .then((response) => {
                setPaymentData(response.data);
            })
            .catch((error) => console.error('Error fetching Payment data:', error));

        axios.get('https://tutorwise-backend.vercel.app/api/admin/active-inactive-user-percentage/')
            .then((response) => {
                setActiveUserData(response.data);
                animatePercentage('activeUser', response.data.active_percentage);
                setInactiveUserData(response.data);
                animatePercentage('inactiveUser', response.data.inactive_percentage);
            })
            .catch((error) => console.error('Error fetching Active/Inactive User data:', error));
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
                {/* Payment Card with Pie Chart */}
                <div className="lg:col-span-2 md:col-span-2">
                    <PaymentCard data={paymentData} />
                </div>

                {/* Inactive User Card (Smaller Size) */}
                <div className="md:col-span-1 lg:col-span-1">
                    <InactiveUserCard
                        title="Inactive User"
                        value={inactiveUserData ? inactiveUserData.inactive_user : '0'}
                        percentage={chartPercentages.inactiveUser}
                    />
                </div>

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

                {/* Active User Card */}
                <Card
                    title="Active User"
                    value={activeUserData ? activeUserData.active_user : '0'}
                    percentage={chartPercentages.activeUser}
                />
            </div>
        </div>
    );
};

// PaymentCard with Pie Chart
const PaymentCard = ({ data }) => {
    const chartData = data
        ? {
            labels: ['Red', 'Blue', 'Yellow'],
            datasets: [
                {
                    label: 'My First Dataset',
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                    ],
                    hoverOffset: 4,
                },
            ],
        }
        : null;

    return (
        <div className="card bg-white shadow-xl rounded-lg p-6 flex flex-col gap-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-6 text-center">Payment Details</h4>
            {data ? (
                <>
                    <div className="flex justify-between items-start">
                        {/* Pie Chart */}
                        <div className="w-48 h-48 ">
                            <Pie
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                align: 'start',  // This will left-align the legend text
                                            },
                                        },
                                        // Optional: You can enable tooltips to display extra info
                                        tooltip: {
                                            callbacks: {
                                                label: (tooltipItem) => {
                                                    const label = tooltipItem.label ;
                                                    const value = tooltipItem.raw;
                                                    return `${label}: ${value}`;
                                                },
                                            },
                                        },
                                    },
                                    cutoutPercentage: 50, // Hollow center
                                }}
                            />
                        </div>

                        {/* Right-side labels */}
                        <div className="ml-6 flex flex-col justify-start space-y-3">
                            <div className="text-sm space-y-1">
                                <p className="font-medium"><strong>Total Payment Number:</strong> {data.total_payment_number}</p>
                                <p className="font-medium"><strong>Total Apply Limit:</strong> {data.total_apply_limit}</p>
                                <p className="font-medium"><strong>Apply Limit Percentage:</strong> {data.apply_limit_percentage}%</p>
                                <p className="font-medium"><strong>Total Pro Tutor Subscription:</strong> {data.total_pro_tutor_subscription}</p>
                                <p className="font-medium"><strong>Pro Tutor Subscription Percentage:</strong> {data.pro_tutor_subscription_percentage}%</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500">Loading...</p>
            )}
        </div>
    );
};



// Inactive User Card Component
const InactiveUserCard = ({ title, value, percentage }) => {
    return (
        <div className="card bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-xl font-semibold text-gray-700">{title}</h4>
                    <h2 className="text-3xl font-bold">{value}</h2>
                </div>
                <div className="w-40 h-40">
                    <RadialBar percentage={percentage} size="200" />
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
                <button  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                   <Link to="/inactive-user">Show</Link>
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Send Message
                </button>
            </div>
        </div>
    );
};

// Card Component
const Card = ({ title, value, percentage }) => {
    return (
        <div className="card bg-white shadow-md rounded-lg px-2">
            <div className="flex justify-around items-center">
                <div className="flex flex-col justify-end">
                    <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
                    <h2 className="text-xl font-bold">{value}</h2>
                </div>
                <div className="w-32 h-32">
                    <RadialBar percentage={percentage} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;






