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
      title: 'Understanding Neural Networks',
      messages: [
        { sender: 'user', name: 'Divya N', text: 'How does AI recognize images?' },
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: 'Great question! When neural networks learn to see, they extract simple features like edges first. Deeper layers combine these to recognize complex shapes like faces or cars!' },
        { sender: 'user', name: 'Divya N', text: 'Can you give me an example?' },
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: 'For instance, if an AI is identifying a cat: Layer 1 detects diagonal whiskers; Layer 2 recognizes triangular ears; Layer 3 combines them into a feline face score!' },
      ],
    },
    {
      id: 2,
      title: 'AI vs Machine Learning',
      messages: [
        { sender: 'user', name: 'Divya N', text: 'What is the difference between AI and Machine Learning?' },
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: 'Artificial Intelligence is the broader concept of machines being able to carry out tasks in a way that we would consider "smart". Machine Learning is an application of AI based around the idea that we should just give machines access to data and let them learn for themselves.' },
      ],
    },
    {
      id: 3,
      title: 'Prompt Writing Practice',
      messages: [
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: "Let's practice crafting high-precision prompts for LLMs! Give me a prompt that includes a clear task and a specific persona." },
        { sender: 'user', name: 'Divya N', text: 'Act as a 6th grade science teacher and explain how photosynthesis works in 3 simple sentences.' },
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: 'Perfect! You assigned a persona (6th grade teacher), a clear task (explain photosynthesis), and a constraint (3 simple sentences). That is a very strong prompt.' },
      ],
    },
    {
      id: 4,
      title: 'Math: Activation Functions',
      messages: [
        { sender: 'user', name: 'Divya N', text: 'I am stuck on activation functions. Can you give me a hint on why they are used?' },
        { sender: 'owl', name: 'Professor Owl', avatar: 'owl', text: '💡 Hint: Without activation functions, a neural network is just a giant linear regression model. Activation functions introduce "non-linearity", which allows the network to learn complex patterns!' },
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
  
  if (lower.includes('hello') || lower.includes('hi ') || lower === 'hi' || lower.includes('hey')) {
    return "Hello there! 👋 I'm Orin, your AI Tutor. How can I help you with your learning today?";
  }
  if (lower.includes('how are you')) {
    return "I'm just a simulated AI Tutor, but I'm doing perfectly fine! I'm ready to dive into some learning. What's on your mind?";
  }
  if (lower.includes('what can you do') || lower.includes('help')) {
    return "I can answer your questions, give you hints on complex topics, explain things simply, or provide real-world examples! Try asking me about neural networks, math, or tokenization.";
  }
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
  if (lower.includes('quiz') || lower.includes('test')) {
    return "📝 Pop Quiz! What function is typically used in the hidden layers of a neural network to introduce non-linearity? (Hint: It stands for Rectified Linear Unit)";
  }
  
  return "That's an interesting point! " + OWL_REPLY_DEFAULT;
}
