import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../Manager.css';

ChartJS.register(ChartDataLabels);
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Overview = () => {
    const teamData = [
        { name: 'John', completion: 80 },
        { name: 'Alice', completion: 90 },
        { name: 'Bob', completion: 70 },
        { name: 'David', completion: 85 },
    ];

    const chartData = {
        labels: teamData.map((member) => member.name),
        datasets: [
            {
                label: 'Completion (%)',
                data: teamData.map((member) => member.completion),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 25,
                    max: 100,
                    min: 0,
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
            x: {
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        plugins: {
            title: { display: false },
            tooltip: { enabled: true },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 20,
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    const donutData = {
        labels: ['Completed', 'Pending', 'In Progress'],
        datasets: [
            {
                data: [13, 13, 75],
                backgroundColor: ['#FFB347', '#77DD77', '#84B6F4'],
                hoverOffset: 6,
            },
        ],
    };

    const donutOptions = {
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom',
            },
            datalabels: {
                color: '#ffffff',
                formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(0);
                    return `${percentage}%`;
                },
                font: {
                    weight: 'bold',
                    size: 14,
                },
            },
        },
    };

    return (
        <div className="overview-page">
            <div className="manager-cards-container">
                <div className="card">
                    <h3 className="card-name">Team Members</h3>
                    <div className="card-number">4</div>
                    <p className="card-description">Staff with active KPIs</p>
                </div>
                <div className="card">
                    <h3 className="card-name">Total KPIs</h3>
                    <div className="card-number">8</div>
                    <p className="card-description">Across all team members</p>
                </div>
                <div className="card">
                    <h3 className="card-name">Average Completion</h3>
                    <div className="card-number">86%</div>
                    <p className="card-description">Team average performance</p>
                </div>
                <div className="card">
                    <h3 className="card-name">Action Required</h3>
                    <div className="card-number">1</div>
                    <p className="card-description">KPIs pending review</p>
                </div>
            </div>

            <div className="chart-row">
                <div className="chart-card chart-bar">
                    <h3 className="card-name">Team Performance at a Glance</h3>
                    <div className="chart-container">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className="chart-card chart-donut">
                    <div className="chart-container">
                        <Doughnut data={donutData} options={donutOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
