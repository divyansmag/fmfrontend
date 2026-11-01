// Teacher Lab Guides — add more labs using the same shape.
export const GENERAL_INSTRUCTIONS = [
  { title: 'Before the lab', points: [
    'Run through the lab yourself at least once on a student device.',
    'Check that every device is logged in and the lab loads (no blocked sites / pop-ups).',
    'Write the learning objective and agenda on the board.',
  ] },
  { title: 'During the lab', points: [
    'Start with a 5-minute hook: a real-world example or a quick question.',
    'Demo the first step live, then let students try — "I do, we do, you do".',
    'Walk the room; ask "why" questions rather than giving answers.',
    'Pair faster students with those who are stuck.',
  ] },
  { title: 'Wrap-up', points: [
    'Reserve the last 5–10 minutes for sharing results and reflection.',
    'Ask 2–3 exit questions to check understanding.',
    'Note students who struggled for follow-up in the next class.',
  ] },
  { title: 'Safety & etiquette', points: [
    'Never upload personal photos or data of classmates without consent.',
    'Remind students that AI can be wrong — always verify outputs.',
  ] },
];

export const LAB_GUIDES = [
  {
    id: 'lab-teachable-machine',
    title: 'Train Your First Image Classifier',
    chapter: 'Chapter 2 · Machine Learning Basics',
    grade: 'Grades 6–8',
    duration: '45 min',
    difficulty: 'Beginner',
    color: 'from-emerald-500 to-teal-500',
    objectives: [
      'Understand what training data is and why it matters.',
      'Train a model to classify images into 2–3 classes.',
      'Observe how biased / too little data affects accuracy.',
    ],
    materials: ['Laptop with webcam', 'Chrome browser', '2–3 household objects per group'],
    steps: [
      { title: 'Hook (5 min)', detail: 'Show how a phone unlocks with your face. Ask: "How did it learn what you look like?"' },
      { title: 'Collect data (10 min)', detail: 'Groups pick 2–3 objects and capture ~30 images of each from different angles.' },
      { title: 'Train (5 min)', detail: 'Click Train. Explain the model is finding patterns that separate the classes.' },
      { title: 'Test (10 min)', detail: 'Test with new angles, lighting and a "trick" object. Record what fails.' },
      { title: 'Break it (10 min)', detail: 'Retrain with only 5 images per class, or all on one background. Compare results.' },
      { title: 'Reflect (5 min)', detail: 'Discuss: what made the model better or worse?' },
    ],
    tips: [
      'Encourage varied backgrounds — it makes the bias lesson obvious later.',
      'If webcams are limited, one device per group of 3 works well.',
      'Common misconception: "the AI understands the object". Stress it only sees pixel patterns.',
      'Fast finishers: add a third class or try sound classification.',
    ],
    questions: [
      'Why did the model fail on the trick object?',
      'What would happen if all training photos had the same background?',
      'Where else is image classification used in real life?',
    ],
  },
  {
    id: 'lab-chatbot',
    title: 'Build a Rule-Based Chatbot',
    chapter: 'Chapter 4 · Natural Language Processing',
    grade: 'Grades 7–9',
    duration: '60 min',
    difficulty: 'Intermediate',
    color: 'from-violet-500 to-fuchsia-500',
    objectives: [
      'Understand how computers match patterns in text.',
      'Design intents and responses for a simple chatbot.',
      'Compare rule-based bots with modern AI assistants.',
    ],
    materials: ['Laptop', 'FutureMinds Chatbot Lab', 'Worksheet: intent planning table'],
    steps: [
      { title: 'Hook (5 min)', detail: 'Chat with a bot live on the projector. Ask: "Is it really thinking?"' },
      { title: 'Plan intents (10 min)', detail: 'Groups choose a theme (school help desk, pizza shop) and list 5 intents on the worksheet.' },
      { title: 'Write rules (20 min)', detail: 'For each intent add 3+ example phrases and a response in the lab editor.' },
      { title: 'Swap & test (15 min)', detail: 'Groups test each other\'s bots and log questions it could not answer.' },
      { title: 'Improve & discuss (10 min)', detail: 'Add a fallback reply, then compare with how ChatGPT-style models work.' },
    ],
    tips: [
      'Model one intent fully on the board before groups start.',
      'Push students to think of spelling mistakes and slang users might type.',
      'Keep themes school-appropriate; review responses before swap-testing.',
      'Link back to ethics: should a bot pretend to be human?',
    ],
    questions: [
      'Why did the bot fail on some questions?',
      'How is a rule-based bot different from a large language model?',
      'What is a fallback response and why is it needed?',
    ],
  },
];
