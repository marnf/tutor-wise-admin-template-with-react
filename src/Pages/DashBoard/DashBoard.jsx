import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'chart.js/auto'; // Chart.js auto register
import RadialBar from './RadialBar'; // RadialBar import
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { Box, LinearProgress } from "@mui/material";
import { MdViewList } from "react-icons/md";
import { BiSolidMessageDetail } from "react-icons/bi";
import { TbListDetails } from "react-icons/tb";
import BASE_URL from '../../Api/baseUrl';

const Dashboard = () => {
    const [totalStudentData, setTotalStudentData] = useState(null);
    const [totalTutorData, setTotalTutorData] = useState(null);
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
        axios.get(`${BASE_URL}/api/admin/total-student-number/`)
            .then((response) => {
                setTotalStudentData(response.data);
                animatePercentage('totalStudent', response.data.student_percentage);
            })
            .catch((error) => console.error('Error fetching Total Student data:', error));

        axios.get(`${BASE_URL}/api/admin/total-pro-tutor-number/`)
            .then((response) => {
                setProTutorData(response.data);
                animatePercentage('proTutor', response.data.pro_tutor_percentage);
            })
            .catch((error) => console.error('Error fetching Pro Tutor data:', error));

        axios.get(`${BASE_URL}/api/admin/total-referrer-number/`)
            .then((response) => {
                setReferrerData(response.data);
                animatePercentage('referrer', response.data.referer_percentage);
            })
            .catch((error) => console.error('Error fetching Referrer data:', error));

        axios.get(`${BASE_URL}/api/admin/total-tutor-number/`)
            .then((response) => {
                setTotalTutorData(response.data);
                animatePercentage('totalTutor', response.data.tutor_percentage);
            })
            .catch((error) => console.error('Error fetching Total Tutor data:', error));

        axios.get(`${BASE_URL}/api/admin/total-payment-number/`)
            .then((response) => {
                setPaymentData(response.data);
            })
            .catch((error) => console.error('Error fetching Payment data:', error));

        axios.get(`${BASE_URL}/api/admin/active-inactive-user-percentage/`)
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
        }, 10); // Increase interval time for smoother animation
    };

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 md:col-span-2">
                    <PaymentCard data={paymentData} />
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                    <InactiveUserCard
                        title="Inactive User"
                        value={inactiveUserData ? inactiveUserData.inactive_user : '0'}
                        percentage={chartPercentages.inactiveUser}
                    />
                </div>

                <Card
                    title="Total Student"
                    value={totalStudentData ? totalStudentData.total_student : '0'}
                    percentage={chartPercentages.totalStudent}
                    link="/student-list"
                />

                <Card
                    title="Pro Tutor"
                    value={proTutorData ? proTutorData.total_pro_tutor : '0'}
                    percentage={chartPercentages.proTutor}
                    link="/pro-tutor-list"
                />

                <Card
                    title="Referrer"
                    value={referrerData ? referrerData.total_referer : '0'}
                    percentage={chartPercentages.referrer}
                     link="/referrer-list"
                />

                <Card
                    title="Total Tutor"
                    value={totalTutorData ? totalTutorData.total_tutor : '0'}
                    percentage={chartPercentages.totalTutor}
                />

                <Card
                    title="Active User"
                    value={activeUserData ? activeUserData.active_user : '0'}
                    percentage={chartPercentages.activeUser}
                />
            </div>
        </div>
    );
};

const PaymentCard = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!data) return;

        const chartData = {
            labels: ['Apply Limit', 'Pro Tutor Subscription'],
            datasets: [
                {
                    label: 'Percentage Details',
                    data: [
                        data.apply_limit_percentage,
                        data.pro_tutor_subscription_percentage
                    ],
                    backgroundColor: ['#f0523a', '#0d2849'],
                    hoverOffset: 4,
                },
            ],
        };

        const config = {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { align: 'start' },
                    },
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const value = tooltipItem.raw;
                                return `${tooltipItem.label}: ${value}%`;
                            },
                        },
                    },
                },
            },
        };

        const chartInstance = new Chart(chartRef.current, config);

        return () => {
            chartInstance.destroy();
        };
    }, [data]);

    return (
        <div className="card bg-white shadow-xl rounded-lg p-6 flex flex-col gap-6">
            <h2 className="text-gray-700 mb-1 text-center font-bold">Payment Percentage Details</h2>
            {data ? (
                <div className="flex justify-between items-start">
                    <div className="w-48 h-48">
                        <canvas ref={chartRef}></canvas>
                    </div>
                    <div className="ml-6 flex flex-col space-y-5">
                        <div className="text-sm space-y-1">
                            <p className="font-medium"><strong className='text-gray-500'>Total Payment Number:</strong> {data.total_payment_number}</p>
                            <p className="font-medium"><strong className='text-gray-500'>Total Apply Limit:</strong> {data.total_apply_limit}</p>
                            <p className="font-medium"><strong className='text-gray-500'>Apply Limit Percentage:</strong> {data.apply_limit_percentage}%</p>
                            <p className="font-medium"><strong className='text-gray-500'>Total Pro Tutor Subscription:</strong> {data.total_pro_tutor_subscription}</p>
                            <p className="font-medium"><strong className='text-gray-500'>Pro Tutor Subscription Percentage:</strong> {data.pro_tutor_subscription_percentage}%</p>
                        </div>
                        <div className='flex justify-end'>
                            <Link to="/all-payment">
                                <TbListDetails size={40} color="#f0523a" className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer pb-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress sx={{ backgroundColor: "#0d2a4c", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#ef5239 ,#f9553c)" } }} />
                </Box>
            )}
        </div>
    );
};

const InactiveUserCard = ({ title, value, percentage }) => (
    <div className="card bg-white shadow-md rounded-lg p-6 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row lg:flex-row justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold">{value}</h2>
                <h4 className="text-xl font-semibold text-gray-700">{title}</h4>
            </div>
            <div className="w-40 h-40">
                <RadialBar percentage={percentage} size={200} />
            </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
            <Link to="/inactive-user"><MdViewList size={40} color="#0d2849" className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer pb-1" /></Link>
            <Link to="/send-message"><BiSolidMessageDetail size={40} color="#f0523a" className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer" /></Link>
        </div>
    </div>
);

const Card = ({ title, value, percentage, link }) => (
    <div className="card bg-white shadow-lg rounded-lg p-2 transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
        <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center">
                <div className="flex flex-col items-center space-x-2">
                    <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
                    <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
                </div>
            </div>
            <div className="w-32 h-32">
                <RadialBar percentage={percentage} />
            </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">view all the details --</p>
            <Link to={link}>
                <TbListDetails size={40} color="#f0523a" className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer pb-2" />
            </Link>
        </div>
        <div className="mt-1">
            <div className="h-1 w-full bg-gradient-to-r to-orange-700 from-blue-700 rounded-full"></div>
        </div>
    </div>
);

export default Dashboard;
