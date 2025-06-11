// Dummy data for KPIs (Key Performance Indicators) for 2025  
export const dummyKPIs = [
    {
      id: "KPI-2025-001",
      title: "Increase Website Traffic",
      description: "Grow traffic by 20% in Q3 through targeted ad campaigns.",
      category: "Performance",
      priority: "High",
      progress: 80,
      status: "On Track",
      submitted: false,
      verifyStatus: "Pending",
      startDate: "2025-07-01",
      dueDate: "2025-09-30",
      assignedTo: { name: "Afiq", staffId: "EMP-201", department: "Marketing" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" },
      evidence: "/files/revenue-report.pdf"
    },
    {
      id: "KPI-2025-002",
      title: "Social Media Engagement",
      description: "Boost Instagram engagement by 15% through reels.",
      category: "Performance",
      priority: "Medium",
      progress: 20,
      status: "Behind",
      submitted: false,
      verifyStatus: "Pending",
      startDate: "2025-07-01",
      dueDate: "2025-09-15",
      assignedTo: { name: "Afiq", staffId: "EMP-201", department: "Marketing" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" },
      evidence: "/files/doc-policy.pdf"
    },
    {
      id: "KPI-2025-003",
      title: "Develop Landing Page",
      description: "Design and launch product landing page for campaign.",
      category: "Documentation",
      priority: "Low",
      progress: 80,
      status: "On Track",
      submitted: false,
      verifyStatus: "Pending",
      startDate: "2025-07-10",
      dueDate: "2025-08-31",
      assignedTo: { name: "Afiq", staffId: "EMP-201", department: "Marketing" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" }
    },
    {
      id: "KPI-2025-004",
      title: "Complete Financial Audit",
      description: "Ensure Q2 financial audit is completed and submitted.",
      category: "Compliance",
      priority: "Medium",
      progress: 40,
      status: "At Risk",
      submitted: false,
      verifyStatus: "Pending",
      startDate: "2025-07-05",
      dueDate: "2025-08-15",
      assignedTo: { name: "Alif", staffId: "EMP-202", department: "Finance" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" },
      evidence: "/files/revenue-report.pdf"
    },
    {
      id: "KPI-2025-005",
      title: "Create Forecasting Model",
      description: "Develop a predictive model for Q4 budgeting.",
      category: "Performance",
      priority: "High",
      progress: 100,
      status: "Completed",
      submitted: true,
      verifyStatus: "Accepted",
      startDate: "2025-07-10",
      dueDate: "2025-09-25",
      assignedTo: { name: "Alif", staffId: "EMP-202", department: "Finance" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" },
      evidence: "/files/report.pdf"
    },
    {
      id: "KPI-2025-006",
      title: "Revise Company Policy",
      description: "Update internal policy documents and publish to portal.",
      category: "Documentation",
      priority: "Low",
      progress: 80,
      status: "On Track",
      submitted: false,
      verifyStatus: "Pending",
      startDate: "2025-07-01",
      dueDate: "2025-08-20",
      assignedTo: { name: "Amira", staffId: "EMP-203", department: "HR" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" }
    },
    {
      id: "KPI-2025-007",
      title: "Improve Ticket Response Time",
      description: "Reduce average support response to under 1 hour.",
      category: "Performance",
      priority: "High",
      progress: 20,
      status: "Behind",
      submitted: false,
      verifyStatus: "Pending",
      startDate: "2025-07-10",
      dueDate: "2025-09-25",
      assignedTo: { name: "Marsya", staffId: "EMP-204", department: "IT" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" }
    },
    {
      id: "KPI-2025-008",
      title: "Deploy Helpdesk System",
      description: "Implement and onboard staff to new helpdesk tool.",
      category: "Compliance",
      priority: "Medium",
      progress: 40,
      status: "At Risk",
      submitted: false,
      verifyStatus: "Pending",
      startDate: "2025-07-15",
      dueDate: "2025-08-30",
      assignedTo: { name: "Marsya", staffId: "EMP-204", department: "IT" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" }
    },
    {
      id: "KPI-2025-009",
      title: "Standardize Financial Templates",
      description: "Create unified templates for all quarterly reports.",
      category: "Documentation",
      priority: "Medium",
      progress: 100,
      status: "Completed",
      submitted: true,
      verifyStatus: "Pending",
      startDate: "2025-07-12",
      dueDate: "2025-09-15",
      assignedTo: { name: "Zikri", staffId: "EMP-205", department: "Finance" },
      assignedBy: { name: "Priya Patel", managerId: "MGR-110" },
      evidence: "/files/report.pdf"
    }
  ];


  export const getStaffKpiCount = (kpis) => {
    const map = {};
    kpis.forEach(kpi => {
      const id = kpi.assignedTo.staffId;
      if (!map[id]) {
        map[id] = {
          name: kpi.assignedTo.name,
          department: kpi.assignedTo.department,
          staffId: id,
          kpiCount: 0
        };
      }
      map[id].kpiCount += 1;
    });
    return Object.values(map);
  };