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
import { dummyKPIs } from '../../data/dummyKPIs';

ChartJS.register(ChartDataLabels, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Overview = () => {
    // Extract staff-level metrics
    const staffMap = {};
    dummyKPIs.forEach(kpi => {
        const { staffId, name } = kpi.assignedTo;
        if (!staffMap[staffId]) {
            staffMap[staffId] = { name, totalProgress: 0, count: 0 };
        }
        staffMap[staffId].totalProgress += parseInt(kpi.progress);
        staffMap[staffId].count += 1;
    });

    const teamData = Object.values(staffMap).map(member => ({
        name: member.name,
        completion: member.count ? Math.round(member.totalProgress / member.count) : 0,
    }));

    // KPI status count for donut
    const statusCount = { Completed: 0, Pending: 0, 'In Progress': 0 };
    dummyKPIs.forEach(kpi => {
        const progress = parseInt(kpi.progress);
        if (progress === 100) {
            statusCount.Completed += 1;
        } else if (progress === 0) {
            statusCount.Pending += 1;
        } else {
            statusCount['In Progress'] += 1;
        }
    });

    // Card metrics
    const totalKPIs = dummyKPIs.length;
    const teamMembersCount = Object.keys(staffMap).length;
    const avgCompletion = Math.round(dummyKPIs.reduce((sum, kpi) => sum + parseInt(kpi.progress), 0) / totalKPIs);
    const actionRequired = dummyKPIs.filter(kpi => kpi.status === 'Pending').length;

    const chartData = {
        labels: teamData.map(member => member.name),
        datasets: [
            {
                label: 'Average Completion (%)',
                data: teamData.map(member => member.completion),
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
                max: 100,
                ticks: { stepSize: 25 },
                grid: { drawOnChartArea: false },
            },
            x: { grid: { drawOnChartArea: false } },
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
            datalabels: { display: false },
        },
    };

    const donutData = {
        labels: ['Completed', 'Pending', 'In Progress'],
        datasets: [
            {
                data: [
                    statusCount.Completed,
                    statusCount.Pending,
                    statusCount['In Progress'],
                ],
                backgroundColor: ['#FFB347', '#77DD77', '#84B6F4'],
                hoverOffset: 6,
            },
        ],
    };

    const donutOptions = {
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: { position: 'bottom' },
            datalabels: {
                color: '#ffffff',
                formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(0);
                    return `${percentage}%`;
                },
                font: { weight: 'bold', size: 14 },
            },
        },
    };

    return (
        <div className="overview-page">
            <div className="manager-cards-container">
                <div className="card">
                    <h3 className="manager-card-name">Team Members</h3>
                    <div className="manager-card-number">{teamMembersCount}</div>
                    <p className="manager-card-description">Staff with active KPIs</p>
                </div>
                <div className="card">
                    <h3 className="manager-card-name">Total KPIs</h3>
                    <div className="manager-card-number">{totalKPIs}</div>
                    <p className="manager-card-description">Across all team members</p>
                </div>
                <div className="card">
                    <h3 className="manager-card-name">Average Completion</h3>
                    <div className="manager-card-number">{avgCompletion}%</div>
                    <p className="manager-card-description">Team average performance</p>
                </div>
                <div className="card">
                    <h3 className="manager-card-name">Action Required</h3>
                    <div className="manager-card-number">{actionRequired}</div>
                    <p className="manager-card-description">KPIs pending review</p>
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