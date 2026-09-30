export const INITIAL_USER = {
  name: 'Divya N',
  alias: 'Aanya Sharma',
  email: 'divya@futureminds.demo',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Student',
  level: 'Level 12 Apprentice',
  levelNumber: 12,
  xp: 2450,
  streak: 12,
  grade: 'Grade 6',
  school: 'FutureMinds AI Labs, Delhi',
  learningGoal: 'Master Neural Networks & Python',
  darkThemeUnlocked: false,
  aiHoursUnlocked: 0,
  redeemedItems: [],
};

// INITIAL_CHAPTERS has been replaced by the full Chapter→Unit→Subtopic→Asset hierarchy in courseData.js

export const INITIAL_AI_TUTOR = {
  currentSessionId: 1,
  isTyping: false,
  sessions: [
    {
      id: 1,
      title: 'How Does AI Actually...',
      messages: [
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: 'When you look at a dog, do you identify the whole image instantly, or do you notice features like ears, eyes, fur, and shape first?' },
        { sender: 'user', name: 'Madhura', text: 'How does AI recognize images?' },
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: 'Interesting. If humans recognize features before identifying an object, how might an AI model approach the same problem?' },
      ],
    },
    {
      id: 2,
      title: 'Difference Between AI...',
      messages: [
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: 'Welcome back! What would you like to explore today? We can dive into the difference between Artificial Intelligence, Machine Learning, and Deep Learning!' },
      ],
    },
    {
      id: 3,
      title: 'Prompt Writing Practice',
      messages: [
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: "Let's practice crafting high-precision prompts for Large Language Models. Try giving me a prompt with a persona, clear task, and constraints!" },
      ],
    },
    {
      id: 4,
      title: 'Understanding Neural...',
      messages: [
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: 'In artificial neurons, inputs are weighted, summed, and passed through an activation function like ReLU or Sigmoid. Ready for a quick challenge?' },
      ],
    },
    {
      id: 5,
      title: 'Can AI Think Like Hum...',
      messages: [
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: "That touches on the classic Turing Test and Searle's Chinese Room argument! What are your thoughts on computational consciousness?" },
      ],
    },
  ],
};

export const INITIAL_VIDEO = {
  isPlaying: false,
  currentTime: 1222,
  duration: 2700,
  activeTab: 'overview',
  notes: '• Perceptrons compute y = σ(w·x + b)\n• Activation functions introduce non-linearity so the network can fit arbitrary complex curves.\n• ReLU is standard for hidden layers to avoid vanishing gradients.',
  discussion: [
    { author: 'Aris Thorne', time: '2h ago', text: "Remember to review the difference between step functions and continuous sigmoid curves before attempting tomorrow's lab!" },
    { author: 'Priya V.', time: '1h ago', text: 'The visual analogy with the light switch made activation functions finally click for me!' },
  ],
};

export const OWL_REPLY_DEFAULT =
  'Great question! When neural networks learn representations, they extract low-level features (edges, textures) in early layers, and compose them into high-level concepts (eyes, faces, whole objects) in deeper layers.';

export function generateOwlReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes('hint')) {
    return '💡 Hint: Think about how convolutional filters slide across pixels to calculate feature maps. Each filter specializes in detecting a specific pattern!';
  }
  if (lower.includes('simpler') || lower.includes('explain')) {
    return 'Imagine looking through a microscope: first you see tiny dots, then lines connecting dots, then shapes, and finally the whole puzzle comes together. Neural networks work layer by layer just like that!';
  }
  if (lower.includes('example')) {
    return 'For instance, if an AI is identifying a cat: Layer 1 detects diagonal whiskers; Layer 2 recognizes triangular ears; Layer 3 combines them into a feline face score!';
  }
  if (lower.includes('token')) {
    return "Tokens are the fundamental building blocks of LLMs! A token can be a single letter, a subword (like 'un' + 'breakable'), or an entire common word.";
  }
  return OWL_REPLY_DEFAULT;
}
