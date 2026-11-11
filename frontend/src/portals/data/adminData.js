





















































































export const adminPortalData = {
  info: {
    name: 'Admin / System Admin',
    roleTitle: 'System Admin',
    platformName: 'FutureMinds Global Admin',
    status: 'Active',
    lastActive: 'Today, 10:30 AM'
  },
  kpis: {
    totalStudents: 1248,
    studentsGrowth: 8.4,
    totalTeachers: 86,
    teachersGrowth: 4.2,
    totalParents: 1016,
    parentsGrowth: 6.8,
    platformActivity: 87,
    activityGrowth: 5.3
  },
  activityChart: [
  { week: 'Wk 1', activity: 38 },
  { week: 'Wk 2', activity: 46 },
  { week: 'Wk 3', activity: 54 },
  { week: 'Wk 4', activity: 68 },
  { week: 'Wk 5', activity: 79 },
  { week: 'Wk 6', activity: 87 }],

  aiInsightText: 'Platform engagement is improving steadily across FutureMinds.',
  recommendedFocus: 'Continue monitoring Grade 8 and Grade 9 engagement and course completion.',

  // Platform Progress Page Data
  platformKpis: [
  { id: 'k1', title: 'STUDENT ENGAGEMENT', value: 87, growth: 6.4, unit: '%', iconType: 'student' },
  { id: 'k2', title: 'TEACHER ACTIVITY', value: 91, growth: 4.2, unit: '%', iconType: 'teacher' },
  { id: 'k3', title: 'PARENT ENGAGEMENT', value: 76, growth: 5.8, unit: '%', iconType: 'parent' },
  { id: 'k4', title: 'COURSE COMPLETION', value: 84, growth: 7.1, unit: '%', iconType: 'course' }],


  platformPerformance: [
  { label: 'Student Engagement', percentage: 87 },
  { label: 'Teacher Activity', percentage: 91 },
  { label: 'Parent Engagement', percentage: 76 },
  { label: 'Course Completion', percentage: 84 }],


  learningOverviewStats: [
  {
    value: '42',
    label: 'Active Courses',
    iconType: 'course',
    colorBg: 'bg-amber-50 dark:bg-amber-950/60',
    iconColor: 'text-[#ff8a00] dark:text-[#f97316]'
  },
  {
    value: '8,642',
    label: 'Lessons Completed',
    iconType: 'lesson',
    colorBg: 'bg-blue-50 dark:bg-blue-950/60',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    value: '5,318',
    label: 'Assessments Taken',
    iconType: 'assessment',
    colorBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    value: '84%',
    label: 'Average Completion',
    iconType: 'completion',
    colorBg: 'bg-amber-50 dark:bg-amber-950/60',
    iconColor: 'text-[#ff8a00] dark:text-[#f97316]'
  }],


  learningActivityChart: [
  { week: 'Week 1', activity: 25 },
  { week: 'Week 2', activity: 40 },
  { week: 'Week 3', activity: 53 },
  { week: 'Week 4', activity: 68 },
  { week: 'Week 5', activity: 84 },
  { week: 'Week 6', activity: 95 }],


  recentActivities: [
  {
    id: 'ra1',
    title: 'Teacher registered: Sarah Jenkins',
    details: 'Math Department • 10 mins ago',
    time: '10 mins ago',
    iconType: 'teacher'
  },
  {
    id: 'ra2',
    title: 'Students registered: 24 new accounts',
    details: 'Grade 8 • 1 hour ago',
    time: '1 hour ago',
    iconType: 'student'
  },
  {
    id: 'ra3',
    title: 'Parent accounts verified: 12 accounts',
    details: 'Linked accounts • 3 hours ago',
    time: '3 hours ago',
    iconType: 'parent'
  },
  {
    id: 'ra4',
    title: 'Course published: Grade 6 Artificial Intelligence',
    details: 'AI Department • 5 hours ago',
    time: '5 hours ago',
    iconType: 'course'
  }],


  pendingReviews: [
  { id: 'pr1', count: 12, label: 'Teacher approvals pending', actionText: 'Review', iconType: 'user' },
  { id: 'pr2', count: 8, label: 'Course content reviews', actionText: 'Review', iconType: 'file' },
  { id: 'pr3', count: 24, label: 'Parent identity verifications', actionText: 'Review', iconType: 'group' }],


  systemStatuses: [
  { id: 'ss1', service: 'Platform', description: 'Core platform services and application', status: 'Operational' },
  { id: 'ss2', service: 'Database', description: 'Data storage and management', status: 'Operational' },
  { id: 'ss3', service: 'Authentication', description: 'User authentication and security', status: 'Operational' },
  { id: 'ss4', service: 'Notifications', description: 'Email and system notifications', status: 'Operational' }],

  // Detailed analytics & chart datasets
  userDistribution: [
    { name: 'Students', value: 1248, fill: '#ff8a00', percentage: '53.1%' },
    { name: 'Parents', value: 1016, fill: '#10b981', percentage: '43.2%' },
    { name: 'Teachers', value: 86, fill: '#3b82f6', percentage: '3.7%' }
  ],

  departmentEnrollments: [
    { subject: 'AI & Robotics', enrolled: 420, capacity: 500, completionRate: 88 },
    { subject: 'Computer Sci', enrolled: 385, capacity: 450, completionRate: 82 },
    { subject: 'Mathematics', enrolled: 310, capacity: 350, completionRate: 79 },
    { subject: 'Science & Lab', enrolled: 275, capacity: 320, completionRate: 85 },
    { subject: 'Design & Arts', enrolled: 195, capacity: 250, completionRate: 91 }
  ],

  gradeEngagementComparison: [
    { grade: 'Grade 6', activeStudents: 280, completionScore: 78, avgHours: 14 },
    { grade: 'Grade 7', activeStudents: 315, completionScore: 84, avgHours: 18 },
    { grade: 'Grade 8', activeStudents: 340, completionScore: 89, avgHours: 21 },
    { grade: 'Grade 9', activeStudents: 313, completionScore: 85, avgHours: 19 }
  ],

  weeklyRoleTraffic: [
    { day: 'Mon', Students: 980, Teachers: 82, Parents: 450 },
    { day: 'Tue', Students: 1120, Teachers: 84, Parents: 520 },
    { day: 'Wed', Students: 1180, Teachers: 86, Parents: 610 },
    { day: 'Thu', Students: 1090, Teachers: 83, Parents: 580 },
    { day: 'Fri', Students: 1240, Teachers: 85, Parents: 690 },
    { day: 'Sat', Students: 740, Teachers: 42, Parents: 840 },
    { day: 'Sun', Students: 620, Teachers: 38, Parents: 790 }
  ],

  systemHealthMetrics: [
    { metric: 'API Response', value: '142ms', status: 'optimal', score: 98, target: '< 200ms' },
    { metric: 'Database Load', value: '34%', status: 'optimal', score: 92, target: '< 70%' },
    { metric: 'Storage Utilized', value: '1.2 TB / 2 TB', status: 'normal', score: 60, target: '60%' },
    { metric: 'Active Sessions', value: '1,894', status: 'high', score: 85, target: '2.5k peak' }
  ]

};