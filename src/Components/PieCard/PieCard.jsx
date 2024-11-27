import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';

const PieCard = ({ title, counterId, chartId, percentageId, apiEndpoint }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiEndpoint);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, [apiEndpoint]);

    useEffect(() => {
        if (data) {
            // Create radial chart after data is fetched
            const chartOptions = {
                series: [data.percentage],
                chart: {
                    height: 120,
                    type: 'radialBar',
                },
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            show: false,  // Hide the default data label from the chart
                        },
                    },
                },
                labels: ['Progress'],
            };

            const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
            chart.render();

            // Update counter and percentage text
            document.getElementById(counterId).textContent = data.counter;
            document.getElementById(percentageId).textContent = `${data.percentage}%`;
        }
    }, [data]);

    return (
        <div className="col s-xxl-3 box-col-4">
            <div className="card social-widget widget-hover">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <h2>{title}</h2>
                        </div>
                    </div>
                    <div className="social-content">
                        <div>
                            <h5 id={counterId} className="mb-1 counter">0</h5>
                            <span className="f-light">{title}</span>
                        </div>
                        <div className="social-chart">
                            <div id={chartId}></div>
                            <div className="percentage-center" id={percentageId}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PieCard;
