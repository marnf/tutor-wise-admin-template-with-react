import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';

const Dashboard = () => {
    const [data, setData] = useState({
        totalTutor: 0,
        totalStudent: 0,
        proTutor: 0,
        referrer: 0,
        payment: 0,
        activeUser: 0,
        inactiveUser: 0,
    });

    // Fetching data from API
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = () => {
        Promise.all([
            fetch('https://tutorwise-backend.vercel.app/api/admin/total-tutor-number/'),
            fetch('https://tutorwise-backend.vercel.app/api/admin/total-student-number/'),
            fetch('https://tutorwise-backend.vercel.app/api/admin/total-pro-tutor-number/'),
            fetch('https://tutorwise-backend.vercel.app/api/admin/total-referrer-number/'),
            fetch('https://tutorwise-backend.vercel.app/api/admin/total-payment-number/'),
            fetch('https://tutorwise-backend.vercel.app/api/admin/active-inactive-user-percentage/'),
        ])
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(data => {
                processData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    // Processing fetched data
    const processData = (data) => {
        setData({
            totalTutor: data[0].total_tutor,
            tutorPercentage: data[0].tutor_percentage, // Separate value for percentage
            totalStudent: data[1].total_student,
            studentPercentage: data[1].student_percentage, // Separate value for percentage
            proTutor: data[2].total_pro_tutor,
            proTutorPercentage: data[2].pro_tutor_percentage, // Separate value for percentage
            referrer: data[3].total_referer,
            referrerPercentage: data[3].referer_percentage, // Separate value for percentage
            payment: data[4].total_payment_number,
            paymentPercentage: data[4].apply_limit_percentage, // Separate value for percentage
            activeUser: data[5].active_user,
            activeUserPercentage: data[5].active_percentage, // Separate value for percentage
            inactiveUser: data[5].inactive_user,
            inactiveUserPercentage: data[5].inactive_percentage,
        });
    };

    // ApexCharts configuration for radial chart
    const createRadialChart = (percentage) => ({
        series: [percentage],
        chart: {
            height: 150,
            type: 'radialBar',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 1000,
            },
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    show: false,
                },
            },
        },
        labels: ['Progress'],
    });

    return (
        <div className="row">
            
            

            <div className="col s-xxl-3 box-col-4">
                <div className="card social-widget widget-hover">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <h2>Total Student</h2>
                            </div>
                        </div>
                        <div className="social-content">
                            <div>
                                {/* Dynamic Value for Total Student */}
                                <h5 id="student-counter" className="mb-1 counter">{data.totalStudent}</h5>
                               
                            </div>
                            <div className="social-chart">
                                <ApexCharts
                                    options={createRadialChart(data.totalStudent)}
                                    series={[data.totalStudent]}
                                    type="radialBar"
                                    height={90}
                                />
                                <div className="percentage-center">{data.totalStudent}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col s-xxl-3 box-col-4">
                <div className="card social-widget widget-hover">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <h2>Pro Tutor</h2>
                            </div>
                        </div>
                        <div className="social-content">
                            <div>
                                {/* Dynamic Value for Pro Tutor */}
                                <h5 id="pro-tutor-counter" className="mb-1 counter">{data.proTutor}</h5>
                                <span className="f-light">Pro Tutors</span>
                            </div>
                            <div className="social-chart">
                                <ApexCharts
                                    options={createRadialChart(data.proTutor)}
                                    series={[data.proTutor]}
                                    type="radialBar"
                                    height={150}
                                />
                                <div className="percentage-center">{data.proTutor}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col s-xxl-3 box-col-4">
                <div className="card social-widget widget-hover">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <h2>Referrer Number</h2>
                            </div>
                        </div>
                        <div className="social-content">
                            <div>
                                {/* Dynamic Value for Referrer */}
                                <h5 id="referrer-counter" className="mb-1 counter">{data.referrer}</h5>
                                <span className="f-light">Referrers</span>
                            </div>
                            <div className="social-chart">
                                <ApexCharts
                                    options={createRadialChart(data.referrer)}
                                    series={[data.referrer]}
                                    type="radialBar"
                                    height={150}
                                />
                                <div className="percentage-center">{data.referrer}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col s-xxl-3 box-col-4">
                <div className="card social-widget widget-hover">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <h2>Payment Number</h2>
                            </div>
                        </div>
                        <div className="social-content">
                            <div>
                                {/* Dynamic Value for Payment */}
                                <h5 id="payment-counter" className="mb-1 counter">{data.payment}</h5>
                                <span className="f-light">Payments</span>
                            </div>
                            <div className="social-chart">
                                <ApexCharts
                                    options={createRadialChart(data.payment)}
                                    series={[data.payment]}
                                    type="radialBar"
                                    height={150}
                                />
                                <div className="percentage-center">{data.payment}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col s-xxl-3 box-col-4">
                <div className="card social-widget widget-hover">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <h2>Active User</h2>
                            </div>
                        </div>
                        <div className="social-content">
                            <div>
                                {/* Dynamic Value for Active User */}
                                <h5 id="active-user-counter" className="mb-1 counter">{data.activeUser}</h5>
                                <span className="f-light">Active Users</span>
                            </div>
                            <div className="social-chart">
                                <ApexCharts
                                    options={createRadialChart(data.activeUser)}
                                    series={[data.activeUser]}
                                    type="radialBar"
                                    height={150}
                                />
                                <div className="percentage-center">{data.activeUser}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col s-xxl-3 box-col-4">
                <div className="card social-widget widget-hover shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <h2>Inactive User</h2>
                            </div>
                        </div>
                        <div className="social-content">
                            <div>
                                {/* Dynamic Value for Inactive User */}
                                <h5 id="inactive-user-counter" className="mb-1 counter">{data.inactiveUser}</h5>
                                <span className="f-light">Inactive Users</span>
                            </div>
                            <div className="social-chart">
                                <ApexCharts
                                    options={createRadialChart(data.inactiveUser)}
                                    series={[data.inactiveUser]}
                                    type="radialBar"
                                    height={150}
                                />
                                <div className="percentage-center">{data.inactiveUser}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Dashboard;
