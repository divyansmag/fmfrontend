export interface SubTopic {
  id: string;
  title: string;
  description?: string;
}

export interface CurriculumTopic {
  id: string;
  topicNumber: number;
  title: string;
  description: string;
  subtopics: SubTopic[];
}

export const grade6Curriculum: CurriculumTopic[] = [
  {
    id: 'topic-1',
    topicNumber: 1,
    title: 'Introduction to Artificial Intelligence and Everyday Examples',
    description: 'Understand the meaning of AI, its applications in daily life, and how machine intelligence differs from human intelligence.',
    subtopics: [
      { id: 't1-s1', title: 'Meaning of AI' },
      { id: 't1-s2', title: 'AI in Daily Life' },
      { id: 't1-s3', title: 'Human Intelligence vs Machine Intelligence' },
      { id: 't1-s4', title: 'Types of Learning in AI' },
    ],
  },
  {
    id: 'topic-2',
    topicNumber: 2,
    title: 'Basic Data Concepts',
    description: 'Explore what data is, how data is collected, organized, represented, and used by AI systems.',
    subtopics: [
      { id: 't2-s1', title: 'What is Data?' },
      { id: 't2-s2', title: 'Types of Data' },
      { id: 't2-s3', title: 'Data Collection' },
      { id: 't2-s4', title: 'Data Organization' },
      { id: 't2-s5', title: 'Data Representation' },
      { id: 't2-s6', title: 'Data and AI' },
    ],
  },
  {
    id: 'topic-3',
    topicNumber: 3,
    title: 'Pattern Recognition and Decision Making',
    description: 'Discover how patterns are identified, classified, and used to make intelligent decisions in everyday scenarios.',
    subtopics: [
      { id: 't3-s1', title: 'What is a Pattern?' },
      { id: 't3-s2', title: 'Identifying Patterns' },
      { id: 't3-s3', title: 'Observation' },
      { id: 't3-s4', title: 'Classification of Simple Patterns' },
      { id: 't3-s5', title: 'Making Decisions Using Patterns' },
      { id: 't3-s6', title: 'Everyday Examples of AI Decisions' },
    ],
  },
  {
    id: 'topic-4',
    topicNumber: 4,
    title: 'Introduction to Machine Learning',
    description: 'Learn how machines learn from examples, training and testing data, classification, and prediction.',
    subtopics: [
      { id: 't4-s1', title: 'What is Machine Learning?' },
      { id: 't4-s2', title: 'Learning from Examples' },
      { id: 't4-s3', title: 'Training Data' },
      { id: 't4-s4', title: 'Testing Data' },
      { id: 't4-s5', title: 'Classification' },
      { id: 't4-s6', title: 'Prediction' },
      { id: 't4-s7', title: 'Simple Machine Learning Activities' },
    ],
  },
  {
    id: 'topic-5',
    topicNumber: 5,
    title: 'Computer Vision',
    description: 'Understand how AI interprets images, performs object and face recognition, and impacts daily life.',
    subtopics: [
      { id: 't5-s1', title: 'What is Computer Vision?' },
      { id: 't5-s2', title: 'How AI Understands Images' },
      { id: 't5-s3', title: 'Image Classification' },
      { id: 't5-s4', title: 'Object Recognition' },
      { id: 't5-s5', title: 'Face Recognition' },
      { id: 't5-s6', title: 'Computer Vision in Everyday Life' },
      { id: 't5-s7', title: 'Simple Computer Vision Activity' },
    ],
  },
  {
    id: 'topic-6',
    topicNumber: 6,
    title: 'Natural Language Processing',
    description: 'Learn how AI processes human language, powers chatbots, voice assistants, and sentiment analysis.',
    subtopics: [
      { id: 't6-s1', title: 'What is Natural Language Processing?' },
      { id: 't6-s2', title: 'How AI Understands Language' },
      { id: 't6-s3', title: 'Text Classification' },
      { id: 't6-s4', title: 'Chatbots' },
      { id: 't6-s5', title: 'Voice Assistants' },
      { id: 't6-s6', title: 'Sentiment and Emotion in Text' },
      { id: 't6-s7', title: 'NLP in Everyday Life' },
    ],
  },
  {
    id: 'topic-7',
    topicNumber: 7,
    title: 'Generative AI',
    description: 'Explore AI tools that generate text and images, learn prompt basics, and practice responsible use.',
    subtopics: [
      { id: 't7-s1', title: 'What is Generative AI?' },
      { id: 't7-s2', title: 'Text Generation' },
      { id: 't7-s3', title: 'Image Generation' },
      { id: 't7-s4', title: 'AI Chatbots' },
      { id: 't7-s5', title: 'Prompt Basics' },
      { id: 't7-s6', title: 'Good Prompts vs Poor Prompts' },
      { id: 't7-s7', title: 'Using Generative AI Responsibly' },
    ],
  },
  {
    id: 'topic-8',
    topicNumber: 8,
    title: 'AI Ethics and Digital Responsibility',
    description: 'Understand responsible AI, online safety, privacy, password safety, digital footprints, and bias in AI.',
    subtopics: [
      { id: 't8-s1', title: 'What is Responsible AI?' },
      { id: 't8-s2', title: 'Online Safety' },
      { id: 't8-s3', title: 'Privacy' },
      { id: 't8-s4', title: 'Password Safety' },
      { id: 't8-s5', title: 'Digital Footprints' },
      { id: 't8-s6', title: 'Bias in AI' },
      { id: 't8-s7', title: 'Fairness and Responsible Use' },
      { id: 't8-s8', title: 'Human Responsibility When Using AI' },
    ],
  },
  {
    id: 'topic-9',
    topicNumber: 9,
    title: 'AI in the Real World',
    description: 'Discover how AI transforms education, healthcare, transportation, agriculture, entertainment, sports, and smart cities.',
    subtopics: [
      { id: 't9-s1', title: 'AI in Education' },
      { id: 't9-s2', title: 'AI in Healthcare' },
      { id: 't9-s3', title: 'AI in Transportation' },
      { id: 't9-s4', title: 'AI in Agriculture' },
      { id: 't9-s5', title: 'AI in Entertainment' },
      { id: 't9-s6', title: 'AI in Sports' },
      { id: 't9-s7', title: 'AI in Smart Cities' },
      { id: 't9-s8', title: 'Future of AI' },
    ],
  },
  {
    id: 'topic-10',
    topicNumber: 10,
    title: 'AI Mini Project',
    description: 'Hands-on project identifying an AI problem, preparing data, building a simple model, evaluating, and presenting results.',
    subtopics: [
      { id: 't10-s1', title: 'Identifying an AI Problem' },
      { id: 't10-s2', title: 'Collecting Data' },
      { id: 't10-s3', title: 'Preparing Data' },
      { id: 't10-s4', title: 'Building a Simple AI Model' },
      { id: 't10-s5', title: 'Testing the Model' },
      { id: 't10-s6', title: 'Evaluating Results' },
      { id: 't10-s7', title: 'Improving the Model' },
      { id: 't10-s8', title: 'Presenting the AI Project' },
    ],
  },
];

export const getGrade6Topics = (): CurriculumTopic[] => grade6Curriculum;

export const getGrade6Subtopics = (): SubTopic[] => {
  return grade6Curriculum.flatMap((topic) => topic.subtopics);
};

export const searchCurriculum = (query: string): { topic: CurriculumTopic; subtopic?: SubTopic }[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: { topic: CurriculumTopic; subtopic?: SubTopic }[] = [];
  grade6Curriculum.forEach((topic) => {
    if (topic.title.toLowerCase().includes(q)) {
      results.push({ topic });
    }
    topic.subtopics.forEach((subtopic) => {
      if (subtopic.title.toLowerCase().includes(q)) {
        results.push({ topic, subtopic });
      }
    });
  });
  return results;
};
