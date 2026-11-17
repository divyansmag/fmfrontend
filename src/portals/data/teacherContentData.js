// FutureMinds Institute — Teacher Training Curriculum
// Structured just like the Student Course (Units -> Subtopics -> Multi-type Assets:
// Video, Summary, Teaching Tips, Flashcards, Quiz)

export const TEACHER_TRAINING_COURSE = {
  id: 'teacher-course-1',
  number: '01',
  title: 'Teaching AI Foundations & Pedagogy',
  units: [
    {
      id: 'tc-u1',
      order: 1,
      title: 'Intro to AI & How to Teach It',
      subtopics: [
        {
          id: 'tc-u1-s1',
          title: '1.1 What is AI? (Concept & Delivery)',
          assets: [
            {
              id: 'tc-u1-s1-a1',
              type: 'video',
              title: 'Institute Video: Explaining AI to Middle-Schoolers',
              description:
                'Watch how our master educators introduce Artificial Intelligence vs. regular software in the first 10 minutes of class, plus the 3 pillars behind modern AI (Data, Compute, Algorithms).',
              data: {
                url: 'https://www.youtube.com/watch?v=ad79nYk2keg',
                durationMinutes: 12,
              },
            },
            {
              id: 'tc-u1-s1-a2',
              type: 'summary',
              title: 'Material Summary: AI vs. Traditional Programming',
              description: 'Core concepts the institute wants every teacher to master before class.',
              data: {
                body: `## What the Institute Teaches You in Topic 1

Before stepping into the classroom, make sure you can clearly distinguish **Automation (Rule-Based Code)** from **Artificial Intelligence (Pattern Learning)**.

### 1. Rule-Based Code vs. AI
- **Traditional Programming**: A human programmer writes exact \`if / else\` rules (e.g., a calculator or an automatic sliding door sensor).
- **Artificial Intelligence**: The system learns patterns from examples and data to make predictions or decisions (e.g., Face Unlock, YouTube recommendations, voice assistants).

### 2. Narrow AI vs. General AI
- **Narrow AI (ANI)**: Every AI that exists today is *Narrow AI*—engineered for one specific task (playing chess, translating text, detecting spam).
- **General AI (AGI)**: Human-level intelligence across any subject. Reassure students that AGI exists only in movies and science fiction.

### 3. The 3 Forces Behind AI Today
1. **Data** — Billions of text, image, and video examples online
2. **Compute** — Fast GPU processors capable of parallel math
3. **Algorithms** — Deep Learning and Neural Networks`,
              },
            },
            {
              id: 'tc-u1-s1-a3',
              type: 'tips',
              title: 'Teaching Tips & Board Analogies',
              description: 'Classroom hooks, analogies, and common student misconceptions to watch for.',
              data: {
                analogies: [
                  {
                    title: 'The Recipe vs. The Tasting Chef',
                    body: 'Tell students: "Traditional coding is like following a strict cake recipe step by step. Machine Learning is like a chef tasting 100 soups and figuring out what makes a soup taste good."',
                  },
                  {
                    title: 'Nested Russian Dolls (AI → ML → Deep Learning)',
                    body: 'Draw 3 circles inside each other on the board: AI is the big outer circle, Machine Learning is inside AI, and Deep Learning is the core inside ML.',
                  },
                ],
                tips: [
                  'Start with a 3-minute "Stand Up / Sit Down" game: call out Calculator, Face Unlock, Automatic Sliding Door, and YouTube Home Feed. Have students stand up if it uses AI.',
                  'Watch out for the "Automatic Door" trap! Explain that a motion sensor follows one fixed rule (if motion → open door), whereas Face Unlock adapts to lighting and angles.',
                  'Invite two students to the front to act out a 2-minute live "Turing Test" where the class guesses which response came from an AI.',
                ],
                misconceptions: [
                  {
                    myth: '"Calculators are AI because they do math faster than humans."',
                    fix: 'Clarify that calculators follow fixed math rules and never learn from experience.',
                  },
                  {
                    myth: '"AI has feelings and thinks like a human brain."',
                    fix: 'Remind students that AI calculates mathematical probabilities from data.',
                  },
                ],
              },
            },
            {
              id: 'tc-u1-s1-a4',
              type: 'flashcards',
              title: 'Teacher Prep Flashcards',
              description: 'Quick-flip cards to rehearse definitions and student Q&A before class.',
              data: {
                cards: [
                  {
                    front: 'Student asks: "Why isn\'t an automatic sliding door considered AI?"',
                    back: 'Because its motion sensor follows a single fixed rule (motion = open). It does not learn patterns from data or improve over time.',
                  },
                  {
                    front: 'What is the best classroom analogy for Rules vs. Machine Learning?',
                    back: 'Following a fixed cake recipe (Rules) vs. a chef tasting 100 soups to learn flavor patterns (Machine Learning).',
                  },
                  {
                    front: 'What did Alan Turing\'s 1950 "Turing Test" propose?',
                    back: 'If a human judge having a text conversation cannot tell whether replies come from a machine or a person, the machine demonstrates intelligent behavior.',
                  },
                  {
                    front: 'What are the 3 pillars that enabled the modern AI boom?',
                    back: '1. Big Data, 2. Fast GPU Compute, and 3. Better Algorithms (Deep Learning).',
                  },
                ],
              },
            },
            {
              id: 'tc-u1-s1-a5',
              type: 'quiz',
              title: 'Pedagogy & Concept Check Quiz',
              description: 'Quick 3-question check on Topic 1 concepts and teaching approach.',
              data: {
                questions: [
                  {
                    id: 'tq1',
                    question:
                      'During the opening class hook, a student says a washing machine timer is AI. What is the best pedagogical response?',
                    options: [
                      'Tell them they are wrong and move on to the next slide',
                      'Ask whether the timer learns from past laundry loads or follows a fixed pre-programmed rule',
                      'Agree that all electronic appliances use AI',
                      'Explain backpropagation math on the board',
                    ],
                    correct: 1,
                    explanation:
                      'Guiding students with a question ("Does it learn from examples or follow a fixed rule?") helps them discover the difference between automation and AI themselves.',
                    hint: 'Think about rules vs. learning from data.',
                  },
                  {
                    id: 'tq2',
                    question:
                      'How do Artificial Intelligence (AI), Machine Learning (ML), and Deep Learning (DL) relate to one another?',
                    options: [
                      'They are three completely separate technologies',
                      'DL is the largest field, and AI is a small part of DL',
                      'AI is the broadest field, ML is a subset of AI, and DL is a subset of ML',
                      'ML only applies to robotics',
                    ],
                    correct: 2,
                    explanation:
                      'Think of nested circles: AI is the outer umbrella, Machine Learning is inside AI, and Deep Learning is a specialized subset inside ML.',
                    hint: 'Remember the nested circles diagram on the board.',
                  },
                  {
                    id: 'tq3',
                    question: 'Which of the following is an example of Narrow AI (ANI)?',
                    options: [
                      'A sci-fi robot with human emotions and general wisdom',
                      'All real-world AI systems today, such as Siri, spam filters, and chess engines',
                      'A standard pocket calculator',
                      'A light switch',
                    ],
                    correct: 1,
                    explanation:
                      'Every real-world AI deployed today is Narrow AI—designed to excel at a specific task.',
                    hint: 'Every AI today is specialized.',
                  },
                ],
              },
            },
          ],
        },
        {
          id: 'tc-u1-s2',
          title: '1.2 Teaching Data Concepts (Features & Quality)',
          assets: [
            {
              id: 'tc-u1-s2-a1',
              type: 'video',
              title: 'Institute Video: Making Data Visual in Class',
              description:
                'How to teach structured vs. unstructured data, features vs. labels, and "Garbage In, Garbage Out".',
              data: {
                url: 'https://www.youtube.com/watch?v=aircAruvnKk',
                durationMinutes: 10,
              },
            },
            {
              id: 'tc-u1-s2-a2',
              type: 'summary',
              title: 'Material Summary: Data, Features & Labels',
              description: 'Key data literacy concepts to cover before Machine Learning.',
              data: {
                body: `## Teaching Data Concepts to Students

Students hear "AI learns from data" everywhere, so your goal is to make data concrete and visual.

### 1. Structured vs. Unstructured Data
- **Structured Data**: Organized neatly in rows and columns (attendance tables, weather logs, exam marks).
- **Unstructured Data**: Free-form media like photos, voice notes, videos, and paragraphs of text.

### 2. Features vs. Labels
- **Features (The Clues)**: The measurable inputs we feed the model (e.g., fruit color, weight, shape).
- **Label (The Answer)**: The target category we want the AI to predict (e.g., "Apple" or "Banana").

### 3. Garbage In, Garbage Out (GIGO)
If training data contains errors, missing values, or biased samples, the AI's predictions will also be flawed—no matter how powerful the computer is.`,
              },
            },
            {
              id: 'tc-u1-s2-a3',
              type: 'tips',
              title: 'Teaching Tips: Live Classroom Dataset Activity',
              description: 'How to turn your whiteboard into a live dataset in 5 minutes.',
              data: {
                analogies: [
                  {
                    title: 'Kitchen Ingredients (Garbage In, Garbage Out)',
                    body: 'Data is the ingredients; the AI algorithm is the oven. Spoiled milk in the finest oven still makes a bad cake.',
                  },
                  {
                    title: 'Detective Clues vs. Verdict (Features vs. Labels)',
                    body: 'Features are the detective\'s clues (footprints, time of day); the Label is the final verdict.',
                  },
                ],
                tips: [
                  'Survey 5 student volunteers live on the board (Favorite Subject, Hours of Sleep, Pet) to build a real table in front of the class.',
                  'Write one silly outlier on the board (e.g., "Hours of Sleep: 95 hours") and ask students how that single typo affects the class average.',
                  'Show a zoomed-in photo grid so students see that computers read images as grids of RGB pixel numbers.',
                ],
                misconceptions: [
                  {
                    myth: '"Data only means numbers in a math spreadsheet."',
                    fix: 'Show that photos, voice recordings, and emojis are all data once converted into numbers.',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'tc-u2',
      order: 2,
      title: 'Machine Learning & Classroom Labs',
      subtopics: [
        {
          id: 'tc-u2-s1',
          title: '2.1 Training, Testing & Overfitting',
          assets: [
            {
              id: 'tc-u2-s1-a1',
              type: 'video',
              title: 'Institute Video: Running the Classifier Lesson',
              description:
                'How to explain Training Data vs. Testing Data and run a live image classification demo without technical hiccups.',
              data: {
                url: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
                durationMinutes: 14,
              },
            },
            {
              id: 'tc-u2-s1-a2',
              type: 'summary',
              title: 'Material Summary: Train/Test Split & Overfitting',
              description: 'Essential ML concepts for Grades 6–8.',
              data: {
                body: `## How Machines Learn From Examples

### 1. Supervised Learning
In Supervised Learning, we train the model using **labeled examples**—just like showing flashcards with the answer written on the back.

### 2. Why Split Training Data and Testing Data?
- **Training Data**: The examples the model studies to find patterns.
- **Testing Data**: Brand-new, unseen examples held back to verify the model truly learned general patterns rather than memorizing.

### 3. Overfitting (The "Memorization Trap")
If you train an image classifier with 30 photos of a pen against a bright sunny window, the AI might learn *"bright window = pen"* instead of recognizing the pen itself! Always train with varied angles and backgrounds.`,
              },
            },
            {
              id: 'tc-u2-s1-a3',
              type: 'tips',
              title: 'Teaching Tips: Live Webcam Demo Tricks',
              description: 'Proven classroom tips for making the Machine Learning lesson unforgettable.',
              data: {
                analogies: [
                  {
                    title: 'Practice Homework vs. Final Exam (Train vs. Test)',
                    body: 'Training data is the practice problems in your workbook. Testing data is the unseen exam questions that prove you didn\'t just memorize page 12!',
                  },
                ],
                tips: [
                  'Intentionally train Class A in front of a bright window and Class B against a dark wall—then let students catch how the AI "cheated" by learning the background!',
                  'Assign 3 clear roles per student group during the lab: Camera Operator, Object Holder, and Tester/Recorder.',
                  'Have students watch the confidence percentage bars change live as they tilt an object sideways.',
                ],
                misconceptions: [
                  {
                    myth: '"100% training accuracy means the model will never make a mistake."',
                    fix: 'Test the model with a different student holding the object under different lighting to show why real-world testing matters.',
                  },
                ],
              },
            },
            {
              id: 'tc-u2-s1-a4',
              type: 'quiz',
              title: 'ML Teaching Check Quiz',
              description: 'Quick check on facilitating the Machine Learning lesson.',
              data: {
                questions: [
                  {
                    id: 'mlq1',
                    question:
                      'Why should you never test an AI model using the exact same photos used to train it?',
                    options: [
                      'Because computers delete training photos after training',
                      'Because it only checks memorization, not whether the AI can generalize to new unseen photos',
                      'Because webcams cannot take duplicate photos',
                      'Because training data has no labels',
                    ],
                    correct: 1,
                    explanation:
                      'Just like a student memorizing answers to a practice sheet, testing on training data hides overfitting.',
                    hint: 'Think of the Practice Worksheet vs. Final Exam analogy.',
                  },
                  {
                    id: 'mlq2',
                    question:
                      'During a webcam lab, a student\'s classifier mistakes a blue water bottle for a blue pencil case. Why did this likely happen?',
                    options: [
                      'The webcam is broken',
                      'The model relied heavily on color patterns because training examples lacked varied colors and angles',
                      'The AI became self-aware',
                      'Classifiers can only recognize pencils',
                    ],
                    correct: 1,
                    explanation:
                      'Models latch onto the easiest visual pattern (like blue pixels) unless given diverse training examples.',
                    hint: 'What pattern did the two objects share?',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'tc-u3',
      order: 3,
      title: 'NLP, Generative AI & Ethics',
      subtopics: [
        {
          id: 'tc-u3-s1',
          title: '3.1 Prompting, LLMs & Responsible AI',
          assets: [
            {
              id: 'tc-u3-s1-a1',
              type: 'video',
              title: 'Institute Video: Teaching GenAI & Ethics Safely',
              description:
                'How Large Language Models predict tokens, how to teach the R-T-C-F prompt formula, and how to run an AI Ethics debate.',
              data: {
                url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
                durationMinutes: 15,
              },
            },
            {
              id: 'tc-u3-s1-a2',
              type: 'summary',
              title: 'Material Summary: NLP, Prompts & Algorithmic Bias',
              description: 'Core concepts for teaching Generative AI and Ethics.',
              data: {
                body: `## Teaching Language AI & Digital Responsibility

### 1. How Large Language Models (LLMs) Work
LLMs work like **super-powered autocomplete**: they predict the most likely next word (token) based on patterns across billions of sentences. Because they predict probable words rather than looking up verified facts, they can sometimes **hallucinate** (invent plausible-sounding errors).

### 2. The 4-Part Student Prompt Formula (R-T-C-F)
- **R — Role**: *"Act as a middle-school science coach..."*
- **T — Task**: *"Explain how eclipses happen..."*
- **C — Context**: *"For a 7th grader who loves football..."*
- **F — Format**: *"In 4 short bullet points."*

### 3. Algorithmic Bias & Human-in-the-Loop
AI systems can produce unfair results if certain groups were under-represented in the training data (**Sampling Bias**). High-stakes decisions always require a **Human-in-the-Loop**.`,
              },
            },
            {
              id: 'tc-u3-s1-a3',
              type: 'tips',
              title: 'Teaching Tips: Sarcasm, Prompts & Ethics Debate',
              description: 'Interactive classroom activities for NLP and AI Ethics.',
              data: {
                analogies: [
                  {
                    title: 'Left-Handed Scissors (Sampling Bias)',
                    body: 'If a scissor factory only tests scissors with right-handed testers, left-handed students struggle—not out of malice, but because they were left out of the test group!',
                  },
                  {
                    title: 'Airplane Autopilot (Human-in-the-Loop)',
                    body: 'AI is a helpful co-pilot, but a trained human pilot must always stay in the cockpit to verify and make final safety calls.',
                  },
                ],
                tips: [
                  'Write a sarcastic review on the board ("Oh great, extra homework on Friday! Just what I wanted!") to show why simple word-counting gets tricked.',
                  'Show an AI-generated paragraph about your city with 2 subtle factual mistakes and let students play "Hallucination Detective".',
                  'Run a 5-minute "Four Corners Debate" where students move to Agree/Disagree corners on prompts like "Should AI referee school sports?"',
                ],
                misconceptions: [
                  {
                    myth: '"Everything an AI chatbot writes is 100% factual because it comes from a computer."',
                    fix: 'Demonstrate how next-word prediction can confidently invent a fake historical date, and teach students to verify sources.',
                  },
                ],
              },
            },
            {
              id: 'tc-u3-s1-a4',
              type: 'flashcards',
              title: 'NLP & Ethics Flashcards',
              description: 'Review key terms and classroom prompts.',
              data: {
                cards: [
                  {
                    front: 'What does the R-T-C-F prompt framework stand for?',
                    back: 'Role · Task · Context · Format',
                  },
                  {
                    front: 'What is an AI "Hallucination"?',
                    back: 'When a generative AI model confidently produces false or made-up information because it is predicting probable words rather than checking facts.',
                  },
                  {
                    front: 'How does the "Left-Handed Scissors" analogy explain AI bias?',
                    back: 'It shows how leaving a group out of the training/testing dataset leads to a product that doesn\'t work fairly for everyone.',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
