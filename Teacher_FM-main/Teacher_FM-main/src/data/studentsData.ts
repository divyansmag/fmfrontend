import defaultStudentAvatar from '../assets/avatars/default_student.png';

export interface RecentModule {
  id: string;
  title: string;
  score: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Needs Review';
}

export interface ProgressDataPoint {
  period: string;
  value: number;
  isDrop?: boolean;
}

export interface StudentDetail {
  id: string;
  name: string;
  initials: string;
  initialsBg: string;
  initialsText: string;
  avatarUrl: string;
  grade: string;
  overallProgress: number;
  progressColor: string;
  modules: string;
  avgQuiz: string;
  quizColor?: string;
  lastActive: string;
  status: 'Excellent' | 'On Track' | 'Needs Support' | 'Needs Attention';
  streak: string;
  nameColor?: string;
  strengths: string;
  areasToImprove: string;
  recentModules: RecentModule[];
  progressHistory: ProgressDataPoint[];
}

export const studentsData: StudentDetail[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    initials: 'AS',
    initialsBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    initialsText: 'text-emerald-700 dark:text-emerald-300',
    avatarUrl: defaultStudentAvatar,
    grade: 'Grade 6 – Section A',
    overallProgress: 92,
    progressColor: 'bg-[#15ab5d]',
    modules: '18/20',
    avgQuiz: '94%',
    quizColor: 'text-[#15ab5d] font-bold',
    lastActive: 'Today',
    status: 'Excellent',
    streak: '12 Days',
    strengths: 'Pattern Recognition, Image Classification, Rapid problem solving with AI models.',
    areasToImprove: 'Good Prompts vs Poor Prompts and prompt engineering practices.',
    recentModules: [
      { id: 't5-s4', title: 'Object Recognition', score: '96%', date: 'Yesterday', status: 'Completed' },
      { id: 't7-s5', title: 'Prompt Basics', score: '92%', date: '3 days ago', status: 'Completed' },
    ],
    progressHistory: [
      { period: 'W1', value: 75 },
      { period: 'W2', value: 80 },
      { period: 'W3', value: 85 },
      { period: 'W4', value: 88 },
      { period: 'W5', value: 90 },
      { period: 'W6', value: 92 },
    ],
  },
  {
    id: '2',
    name: 'Ananya Patel',
    initials: 'AP',
    initialsBg: 'bg-blue-100 dark:bg-blue-950/60',
    initialsText: 'text-blue-700 dark:text-blue-300',
    avatarUrl: defaultStudentAvatar,
    grade: 'Grade 6 – Section A',
    overallProgress: 86,
    progressColor: 'bg-[#15ab5d]',
    modules: '17/20',
    avgQuiz: '89%',
    quizColor: 'text-[#15ab5d] font-bold',
    lastActive: 'Today',
    status: 'On Track',
    streak: '8 Days',
    strengths: 'Computer Vision, Image Classification, solid understanding of Training & Testing Data.',
    areasToImprove: 'Pacing under time constraints in Machine Learning quizzes.',
    recentModules: [
      { id: 't4-s3', title: 'Training Data', score: '88%', date: 'Today', status: 'Completed' },
      { id: 't5-s3', title: 'Image Classification', score: '90%', date: '2 days ago', status: 'Completed' },
    ],
    progressHistory: [
      { period: 'W1', value: 68 },
      { period: 'W2', value: 72 },
      { period: 'W3', value: 78 },
      { period: 'W4', value: 82 },
      { period: 'W5', value: 84 },
      { period: 'W6', value: 86 },
    ],
  },
  {
    id: '3',
    name: 'Rohan Mehta',
    initials: 'RM',
    initialsBg: 'bg-pink-100 dark:bg-pink-950/60',
    initialsText: 'text-pink-700 dark:text-pink-300',
    avatarUrl: defaultStudentAvatar,
    grade: 'Grade 6 – Section A',
    overallProgress: 71,
    progressColor: 'bg-pink-500',
    modules: '14/20',
    avgQuiz: '76%',
    lastActive: '2 days ago',
    status: 'Needs Support',
    streak: '3 Days',
    strengths: 'Natural Language Processing, Chatbot interaction logic, enthusiasm for Generative AI projects.',
    areasToImprove: 'Voice Assistants architecture, Sentiment analysis logic flow.',
    recentModules: [
      { id: 't6-s4', title: 'Chatbots', score: '74%', date: '3 days ago', status: 'In Progress' },
      { id: 't7-s1', title: 'What is Generative AI?', score: '78%', date: '4 days ago', status: 'Completed' },
    ],
    progressHistory: [
      { period: 'W1', value: 60 },
      { period: 'W2', value: 65 },
      { period: 'W3', value: 70 },
      { period: 'W4', value: 68, isDrop: true },
      { period: 'W5', value: 70 },
      { period: 'W6', value: 71 },
    ],
  },
  {
    id: '4',
    name: 'Priya Nair',
    initials: 'PN',
    initialsBg: 'bg-red-100 dark:bg-red-950/60',
    initialsText: 'text-red-700 dark:text-red-300',
    avatarUrl: defaultStudentAvatar,
    grade: 'Grade 6 – Section A',
    overallProgress: 68,
    progressColor: 'bg-red-500',
    modules: '13/20',
    avgQuiz: '72%',
    quizColor: 'text-red-600 dark:text-red-400 font-bold',
    lastActive: '3 days ago',
    status: 'Needs Attention',
    streak: '4 Days',
    nameColor: 'text-red-700 dark:text-red-400 font-bold',
    strengths: 'Pattern Recognition, Data Collection, Quick completion of AI Ethics & Safety modules.',
    areasToImprove: 'Bias in AI, Fairness concepts. Spending too long on quiz sections without finishing.',
    recentModules: [
      { id: 't8-s6', title: 'Bias in AI', score: '65%', date: '3 days ago', status: 'Needs Review' },
      { id: 't8-s1', title: 'What is Responsible AI?', score: '70%', date: '5 days ago', status: 'Completed' },
      { id: 't3-s2', title: 'Identifying Patterns', score: '58%', date: '1 week ago', status: 'In Progress' },
    ],
    progressHistory: [
      { period: 'W1', value: 72 },
      { period: 'W2', value: 76 },
      { period: 'W3', value: 80 },
      { period: 'W4', value: 65, isDrop: true },
      { period: 'W5', value: 66, isDrop: true },
      { period: 'W6', value: 68, isDrop: true },
    ],
  },
  {
    id: '5',
    name: 'Aditya Kulkarni',
    initials: 'AK',
    initialsBg: 'bg-red-100 dark:bg-red-950/60',
    initialsText: 'text-red-700 dark:text-red-300',
    avatarUrl: defaultStudentAvatar,
    grade: 'Grade 6 – Section A',
    overallProgress: 54,
    progressColor: 'bg-red-600',
    modules: '10/20',
    avgQuiz: '61%',
    quizColor: 'text-red-600 dark:text-red-400 font-bold',
    lastActive: '5 days ago',
    status: 'Needs Attention',
    streak: '1 Day',
    strengths: 'Understanding AI in Daily Life and visual AI concepts.',
    areasToImprove: 'Understanding Data Organization, Data Representation, and testing AI models.',
    recentModules: [
      { id: 't2-s4', title: 'Data Organization', score: '60%', date: '5 days ago', status: 'Needs Review' },
      { id: 't1-s1', title: 'Meaning of AI', score: '62%', date: '1 week ago', status: 'In Progress' },
    ],
    progressHistory: [
      { period: 'W1', value: 65 },
      { period: 'W2', value: 62, isDrop: true },
      { period: 'W3', value: 58, isDrop: true },
      { period: 'W4', value: 55, isDrop: true },
      { period: 'W5', value: 53, isDrop: true },
      { period: 'W6', value: 54 },
    ],
  },
];
