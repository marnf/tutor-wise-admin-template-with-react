import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import axios from 'axios'; // API কলের জন্য
import './Dashboard.css'

const Dashboard = () => {
    const [totalStudentData, setTotalStudentData] = useState(null);
    const [proTutorData, setProTutorData] = useState(null);
    const [referrerData, setReferrerData] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [inactiveUserData, setInactiveUserData] = useState(null);
    const [chartPercentages, setChartPercentages] = useState({
        totalStudent: 0,
        proTutor: 0,
        referrer: 0,
        payment: 0,
        inactiveUser: 0,
    });

    // API Data Fetching
    useEffect(() => {
        axios
            .get('https://tutorwise-backend.vercel.app/api/admin/total-student-number/')
            .then((response) => {
                setTotalStudentData(response.data);
                animatePercentage("totalStudent", response.data.student_percentage);
            })
            .catch((error) => console.error('Error fetching Total Student data:', error));

        axios
            .get('https://tutorwise-backend.vercel.app/api/admin/total-pro-tutor-number/')
            .then((response) => {
                setProTutorData(response.data);
                animatePercentage("proTutor", response.data.pro_tutor_percentage);
            })
            .catch((error) => console.error('Error fetching Pro Tutor data:', error));

        axios
            .get('https://tutorwise-backend.vercel.app/api/admin/total-referrer-number/')
            .then((response) => {
                setReferrerData(response.data);
                animatePercentage("referrer", response.data.referer_percentage);
            })
            .catch((error) => console.error('Error fetching Referrer data:', error));

        axios
            .get('https://tutorwise-backend.vercel.app/api/admin/total-payment-number/')
            .then((response) => {
                setPaymentData(response.data);
                animatePercentage("payment", response.data.apply_limit_percentage);
            })
            .catch((error) => console.error('Error fetching Payment data:', error));

        axios
            .get('https://tutorwise-backend.vercel.app/api/admin/active-inactive-user-percentage/')
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
            currentPercentage += 1; // Increase by 5 for faster counting
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage; // Stop at the target
                clearInterval(interval);
            }
            setChartPercentages((prev) => ({ ...prev, [key]: currentPercentage }));
        }, 1); // Delay set to 1ms for faster animation
    };


    // Helper function for radial chart configuration
    const createRadialChart = (percentage, color) => ({
        series: [percentage],
        chart: {
            height: 200,
            type: 'radialBar',
            animations: {
                enabled: true,
                easing: 'easeinout', // স্মুথ অ্যানিমেশন
                speed: 800, // স্পিড কাস্টমাইজ করা, যাতে অ্যানিমেশন স্মুথ চলে
              },
        },
        colors: [color],
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '60%', // Increase hollow size for better visibility
                },
                track: {
                    background: '#e7e7e7',
                    strokeWidth: '97%',
                },
                dataLabels: {
                    show: true,
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: '20px', // Adjusted font size
                        fontWeight: 700,
                        color: '#333',
                        offsetY: 5,
                        formatter: (val) => `${Math.round(val)}%`,
                    },
                },
            },
        },
    });


    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Total Student Card */}
                <Card
                    title="Total Student"
                    value={totalStudentData ? totalStudentData.total_student : '0'}
                    percentage={chartPercentages.totalStudent}
                    chartOptions={createRadialChart(chartPercentages.totalStudent, '#00aaff')}
                />
                {/* Pro Tutor Card */}
                <Card
                    title="Pro Tutor"
                    value={proTutorData ? proTutorData.total_pro_tutor : '0'}
                    percentage={chartPercentages.proTutor}
                    chartOptions={createRadialChart(chartPercentages.proTutor, '#ff7f00')}
                />
                {/* Referrer Card */}
                <Card
                    title="Referrer"
                    value={referrerData ? referrerData.total_referer : '0'}
                    percentage={chartPercentages.referrer}
                    chartOptions={createRadialChart(chartPercentages.referrer, '#ffd700')}
                />
                {/* Payment Card */}
                <Card
                    title="Payment"
                    value={paymentData ? paymentData.total_payment_number : '0'}
                    percentage={chartPercentages.payment}
                    chartOptions={createRadialChart(chartPercentages.payment, '#28a745')}
                />
                {/* Inactive User Card */}
                <Card
                    title="Inactive User"
                    value={inactiveUserData ? inactiveUserData.inactive_user : '0'}
                    percentage={chartPercentages.inactiveUser}
                    chartOptions={createRadialChart(chartPercentages.inactiveUser, '#dc3545')}
                />
            </div>
        </div>

    );
};

// Card Component
const Card = ({ title, value, percentage, chartOptions }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let currentCount = 0;
        const targetValue = parseInt(value, 10);
        const totalDuration = 1000;
        const steps = totalDuration / 30;

        const interval = setInterval(() => {
            if (currentCount < targetValue) {
                currentCount += Math.ceil(targetValue / steps);
                setCount(currentCount);
            } else {
                clearInterval(interval);
                setCount(targetValue);
            }
        }, 1);

        return () => clearInterval(interval);
    }, [value]);

    return (
        <div className="card bg-white shadow-md rounded-lg px-2  ">

            <div className='flex justify-around items-center'>
                <div className='flex flex-col justify-end'>
                    <h4 className="text-lg font-semibold text-gray-700 text-nowrap ">{title}</h4>
                    <h2 className="text-xl font-bold">{count}</h2>
                    <span className="text-sm text-gray-500">{title}</span>
                </div>
                {/* Right Section: Chart */}
                <div className="w-32 h-32 sm:w-32 sm:h-32 ">
                    <ApexCharts
                        options={chartOptions}
                        series={[percentage]}
                        type="radialBar"
                        height={150}
                    />
                </div>
            </div>
        </div>
    )

};

export default Dashboard;
