import React, { useEffect, useState } from 'react';
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

ChartJS.register(ChartDataLabels, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Overview = () => {
    const [kpis, setKpis] = useState([]);

    useEffect(() => {
        fetch('/api/kpi')
            .then(res => res.json())
            .then(data => setKpis(data))
            .catch(err => console.error('Failed to fetch KPI data:', err));
    }, []);

    // Map staff to total progress and count
    const staffMap = {};
    kpis.forEach(kpi => {
        const assigned = kpi.assignedTo || {};
        const staffId = assigned.staffId;
        const name = assigned.name;

        if (!staffId || !name) return;

        if (!staffMap[staffId]) {
            staffMap[staffId] = { name, totalProgress: 0, count: 0 };
        }

        staffMap[staffId].totalProgress += parseInt(kpi.progress || 0);
        staffMap[staffId].count += 1;
    });

    const teamData = Object.values(staffMap).map(member => ({
        name: member.name,
        completion: member.count ? Math.round(member.totalProgress / member.count) : 0,
    }));

    // Donut chart categorization
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;

    kpis.forEach(kpi => {
        const progress = parseInt(kpi.progress || 0);
        const { status, submitted, verifyStatus } = kpi;

        const isCompleted = progress === 100 && status === 'Completed' && submitted && verifyStatus === 'Accepted';
        const isPending = progress === 0;
        const isInProgress = !isCompleted && !isPending;

        if (isCompleted) completedCount++;
        else if (isPending) pendingCount++;
        else inProgressCount++;
    });

    // Key metrics
    const totalKPIs = kpis.length;

    const staffWithActiveKPIs = new Set(
        kpis
            .filter(kpi => kpi.verifyStatus !== 'Accepted')
            .map(kpi => kpi.assignedTo?.staffId)
    ).size;

    const completedKPI = kpis.filter(
        kpi =>
            kpi.progress === 100 &&
            kpi.status === 'Completed' &&
            kpi.submitted === true &&
            kpi.verifyStatus === 'Accepted'
    ).length;

    const avgCompletion = totalKPIs ? Math.round((completedKPI / totalKPIs) * 100) : 0;

    const actionRequired = kpis.filter(
        kpi =>
            kpi.progress === 100 &&
            kpi.status === 'Completed' &&
            kpi.submitted === true &&
            kpi.verifyStatus === 'Pending'
    ).length;

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
                data: [completedCount, pendingCount, inProgressCount],
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
                    const percentage = total ? ((value / total) * 100).toFixed(0) : 0;
                    return `${percentage}%`;
                },
                font: { weight: 'bold', size: 14 },
            },
        },
    };

    return (
        <div className="overview-page">
            <div className="manager-cards-container">
                <div className="aliff-card">
                    <h3 className="manager-card-name">Staff with Active KPIs</h3>
                    <div className="manager-card-number">{staffWithActiveKPIs}</div>
                    <p className="manager-card-description">Not yet verified (Pending/Rejected)</p>
                </div>
                <div className="aliff-card">
                    <h3 className="manager-card-name">Total KPIs</h3>
                    <div className="manager-card-number">{totalKPIs}</div>
                    <p className="manager-card-description">Across all team members</p>
                </div>
                <div className="aliff-card">
                    <h3 className="manager-card-name">Average Completion</h3>
                    <div className="manager-card-number">{avgCompletion}%</div>
                    <p className="manager-card-description">Completed / Total KPIs</p>
                </div>
                <div className="aliff-card">
                    <h3 className="manager-card-name">Action Required</h3>
                    <div className="manager-card-number">{actionRequired}</div>
                    <p className="manager-card-description">KPIs pending verification</p>
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
