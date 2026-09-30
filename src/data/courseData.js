/**
 * FutureMinds — Single Source of Truth for Course Content
 *
 * Hierarchy:  Course → Chapter → Unit → Subtopic → Asset[]
 *
 * Asset types (must match registry.js keys):
 *   'video' | 'summary' | 'game' | 'quiz' | 'mindmap' | 'flashcards' | 'lab'
 *
 * Asset.data shape matches exactly what each renderer expects under manifest.data.
 * Adding content = adding an entry here. No other file changes required.
 */
import LZString from 'lz-string';

export const DEFAULT_AI_MINDMAP_TREE = {
  text: "Artificial Intelligence (AI)",
  sourceLabel: "AI Foundations — Topic 1",
  children: [
    {
      text: "1. What is AI?",
      children: [
        {
          text: "Simple Definition",
          fact: "Artificial Intelligence, or AI, is technology that helps computers and machines learn, understand information, and make useful decisions in ways that can seem smart."
        },
        {
          text: "Everyday AI",
          fact: "You already use AI in daily life. Siri and Alexa answer questions, phones can unlock using your face, and apps recommend movies, videos, songs, or products."
        },
        {
          text: "Machine Learning",
          fact: "Machine Learning is one important area of AI. It helps computers learn patterns from examples and data instead of following only fixed rules."
        },
        {
          text: "Deep Learning",
          fact: "Deep Learning is a type of Machine Learning that can learn more complicated patterns. It is often used for things like recognizing faces and understanding speech."
        },
        {
          text: "Language & Vision",
          fact: "AI can work with language and pictures. Natural Language Processing helps computers understand words, while Computer Vision helps them understand images and video."
        },
        {
          text: "Chatbot Example",
          fact: "A chatbot uses AI to understand your question, find patterns in language, and create a useful answer."
        }
      ]
    },
    {
      text: "2. AI vs ML vs DL",
      children: [
        {
          text: "Artificial Intelligence",
          fact: "AI is the biggest area. Its goal is to help machines perform tasks that normally need human-like intelligence, such as understanding, deciding, or solving problems."
        },
        {
          text: "Machine Learning",
          fact: "Machine Learning, or ML, is a part of AI. A computer learns from data and examples instead of being told every single rule."
        },
        {
          text: "Deep Learning",
          fact: "Deep Learning, or DL, is a part of Machine Learning. It uses neural networks to learn difficult patterns, such as faces, voices, and speech."
        },
        {
          text: "Tree Example",
          fact: "Think of AI as a big tree. Machine Learning is one branch of that tree, and Deep Learning is a smaller branch growing from Machine Learning."
        }
      ]
    },
    {
      text: "3. AI Through Time",
      children: [
        {
          text: "1950s: AI Begins",
          fact: "In the mid-1950s, scientists began studying intelligent machines seriously. The term “Artificial Intelligence” became famous after the Dartmouth Conference."
        },
        {
          text: "Early Rule-Based AI",
          fact: "Early AI systems followed strict rules written by people. They could solve certain problems, but they could not easily learn from new examples."
        },
        {
          text: "AI Winters",
          fact: "AI progress slowed during periods called “AI winters.” Computers were not powerful enough, and there was not enough data to train smarter systems."
        },
        {
          text: "Machine Learning Era",
          fact: "As computers became faster and more data became available, Machine Learning helped AI improve by learning patterns from examples."
        },
        {
          text: "Deep Learning Era",
          fact: "Deep Learning later made AI much better at difficult tasks such as recognizing images, understanding speech, and finding complex patterns."
        },
        {
          text: "Generative AI",
          fact: "Today, Generative AI can create new content such as text, images, and music by learning patterns from large amounts of data."
        },
        {
          text: "Deep Blue, 1997",
          fact: "In 1997, IBM’s Deep Blue defeated the world chess champion. It showed how powerful AI can be when it is designed for one specific task."
        }
      ]
    },
    {
      text: "4. AI in Real Life",
      children: [
        {
          text: "Healthcare",
          fact: "AI can help doctors study medical scans and notice patterns that may point to a health problem. Important decisions still need human medical experts."
        },
        {
          text: "Finance",
          fact: "Banks can use AI to look for unusual transaction patterns that may be signs of fraud or mistakes."
        },
        {
          text: "Education",
          fact: "AI learning tools can provide personalized practice problems, hints, and explanations tailored to your learning pace."
        },
        {
          text: "Smart Assistants",
          fact: "Voice assistants use speech recognition and natural language processing to set timers, play music, and find answers."
        }
      ]
    }
  ]
};

export const COURSE_DATA = {
  id: 'ai-foundations',
  title: 'AI Foundations',
  chapters: [
    // ─────────────────────────────────────────────
    // CHAPTER 1
    // ─────────────────────────────────────────────
    {
      id: 'ch1',
      order: 1,
      number: '01',
      title: 'Introduction to AI',
      status: 'active', // 'completed' | 'active' | 'locked'
      tags: ['History', 'Turing Test', 'Modern AI'],
      units: [
        // ── Unit 1.1 ──────────────────────────────
        {
          id: 'ch1-u1',
          order: 1,
          title: 'Understanding AI',
          subtopics: [
            // ── Subtopic 1.1.1 ────────────────────
            {
              id: 'ch1-u1-s1',
              order: 1,
              title: 'What is AI?',
              assets: [
                {
                  id: 'ch1-u1-s1-a1',
                  order: 1,
                  title: 'What is Artificial Intelligence?',
                  type: 'video',
                  data: {
                    url: 'https://www.youtube.com/watch?v=ad79nYk2keg',
                    durationMinutes: 12,
                  },
                },
                {
                  id: 'ch1-u1-s1-a2',
                  order: 2,
                  title: 'AI Explained — Summary',
                  type: 'summary',
                  data: {
                    body: `## What is Artificial Intelligence?

Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to **think and learn** like humans.

### Key Branches of AI

- **Machine Learning** — Systems that learn from data without explicit programming
- **Natural Language Processing (NLP)** — Enabling computers to understand human language
- **Computer Vision** — Teaching machines to interpret visual information
- **Robotics** — Physical systems guided by AI decision-making

### The Turing Test

Alan Turing proposed in 1950 that a machine could be considered "intelligent" if a human evaluator could not distinguish its responses from those of a human.

> "Can machines think?" — Alan Turing, *Computing Machinery and Intelligence*, 1950

### Why AI Now?

Three forces converged to make modern AI possible:
1. **Data** — The internet created vast training datasets
2. **Compute** — GPUs enabled fast parallel processing
3. **Algorithms** — Breakthroughs like deep learning, transformers

### Key Takeaways
- AI is not a single technology but a collection of techniques
- Modern AI is *narrow* (specialized) not *general* (human-level)
- AI learns patterns from data rather than following rigid rules`,
                  },
                },
                {
                  id: 'ch1-u1-s1-a3',
                  order: 3,
                  title: 'The AI Landscape — Mindmap',
                  type: 'mindmap',
                  data: {
                    format: 'tree',
                    tree: DEFAULT_AI_MINDMAP_TREE,
                    outline: `Artificial Intelligence
  Machine Learning
    Supervised Learning
    Unsupervised Learning
    Reinforcement Learning
  Deep Learning
    Neural Networks
    Convolutional Networks (CNNs)
    Transformers
  Natural Language Processing
    Text Classification
    Translation
    Large Language Models
  Computer Vision
    Image Recognition
    Object Detection
  Robotics
    Autonomous Navigation
    Manipulation`,
                  },
                },
                {
                  id: 'ch1-u1-s1-a4',
                  order: 4,
                  title: 'What is AI? — Quiz',
                  type: 'quiz',
                  data: {
                    questions: [
                      {
                        id: 'q1',
                        question: 'What did Alan Turing propose in 1950 as a test for machine intelligence?',
                        options: [
                          'A machine that could solve mathematical equations',
                          'A machine whose responses a human evaluator cannot distinguish from a human\'s',
                          'A machine that could recognize faces',
                          'A machine that could learn from data',
                        ],
                        correct: 1,
                        explanation: 'The Turing Test, proposed in Turing\'s 1950 paper "Computing Machinery and Intelligence," evaluates whether a machine can exhibit intelligent behaviour indistinguishable from a human.',
                        hint: 'Think about conversation and human evaluation.',
                      },
                      {
                        id: 'q2',
                        question: 'Which THREE forces converged to enable modern AI breakthroughs?',
                        options: [
                          'Data, Compute, and Algorithms',
                          'Robots, Sensors, and Cameras',
                          'Software, Hardware, and Networking',
                          'Memory, Storage, and Processing',
                        ],
                        correct: 0,
                        explanation: 'The convergence of massive datasets (Data), GPU-powered parallel processing (Compute), and breakthroughs in deep learning (Algorithms) unlocked modern AI capabilities.',
                        hint: 'Think about what made deep learning possible.',
                      },
                      {
                        id: 'q3',
                        question: 'What does "narrow AI" mean?',
                        options: [
                          'AI that only works on small devices',
                          'AI that is human-level intelligent across all domains',
                          'AI that is specialized for a specific task',
                          'AI that uses only a narrow set of data',
                        ],
                        correct: 2,
                        explanation: 'Narrow AI (or Weak AI) is designed for a specific task, like playing chess or recognizing speech. It contrasts with Artificial General Intelligence (AGI), which doesn\'t yet exist.',
                        hint: 'Think about specialization vs. general capability.',
                      },
                    ],
                  },
                },
              ],
            },
            // ── Subtopic 1.1.2 ────────────────────
            {
              id: 'ch1-u1-s2',
              order: 2,
              title: 'AI in Everyday Life',
              assets: [
                {
                  id: 'ch1-u1-s2-a1',
                  order: 1,
                  title: 'AI Around You — Video',
                  type: 'video',
                  data: {
                    url: 'https://www.youtube.com/watch?v=mJeNghZXtMo',
                    durationMinutes: 8,
                  },
                },
                {
                  id: 'ch1-u1-s2-a2',
                  order: 2,
                  title: 'Prompt Builder Challenge',
                  type: 'game',
                  data: {
                    file: 'index.html',
                    _publicBase: '/content/game/prompt-builder-challenge',
                  },
                },
                {
                  id: 'ch1-u1-s2-a3',
                  order: 3,
                  title: 'AI Applications — Flashcards',
                  type: 'flashcards',
                  data: {
                    cards: [
                      { front: 'What AI technology powers voice assistants like Siri and Alexa?', back: 'Natural Language Processing (NLP) combined with Speech Recognition — they convert speech to text and understand intent.' },
                      { front: 'How does Netflix decide what to recommend to you?', back: 'Collaborative Filtering — an ML algorithm that finds patterns in what similar users watched and liked.' },
                      { front: 'What type of AI helps detect fraud in your credit card transactions?', back: 'Anomaly Detection — ML models trained on normal transaction patterns flag unusual behaviour in real-time.' },
                      { front: 'How do self-driving cars "see" the world?', back: 'Computer Vision using cameras, LiDAR sensors, and deep learning models trained on millions of hours of driving data.' },
                      { front: 'What makes spam filters smart?', back: 'Bayesian classifiers and neural networks trained on labelled email datasets to distinguish spam from legitimate email.' },
                    ],
                  },
                },
              ],
            },
          ],
        },
        // ── Unit 1.2 ──────────────────────────────
        {
          id: 'ch1-u2',
          order: 2,
          title: 'How AI Learns',
          subtopics: [
            {
              id: 'ch1-u2-s1',
              order: 1,
              title: 'Data and Learning',
              assets: [
                {
                  id: 'ch1-u2-s1-a1',
                  order: 1,
                  title: 'How Machines Learn from Data',
                  type: 'video',
                  data: {
                    url: 'https://www.youtube.com/watch?v=R9OHn5ZF4Uo',
                    durationMinutes: 14,
                  },
                },
                {
                  id: 'ch1-u2-s1-a2',
                  order: 2,
                  title: 'Training Data & Bias — Summary',
                  type: 'summary',
                  data: {
                    body: `## Training Data and Learning

AI models learn by finding **patterns in data**. The quality and diversity of training data directly determines what the model can and cannot do.

### How Supervised Learning Works

\`\`\`
Input Data → Model → Prediction → Compare with Label → Adjust weights → Repeat
\`\`\`

1. **Labelled examples** are fed to the model
2. The model makes a prediction
3. A **loss function** measures how wrong the prediction was
4. **Backpropagation** adjusts the model's parameters to reduce error
5. This repeats for thousands to billions of examples

### Types of ML by Learning Style

| Type | Training Data | Example Use Case |
|---|---|---|
| Supervised | Labelled (X → Y pairs) | Image classification, spam detection |
| Unsupervised | Unlabelled | Customer segmentation, anomaly detection |
| Reinforcement | Rewards from environment | Game-playing AI, robotic control |

### Why Bias in Data is Dangerous

If training data is biased:
- A facial recognition model trained on mostly light-skinned faces performs poorly on dark-skinned faces
- A hiring AI trained on historical data may perpetuate historical discrimination

**Garbage In → Garbage Out** — the model learns exactly what the data teaches it.

### Key Takeaways
- More data is not always better — **quality and diversity** matter most
- A model is only as good as its training data
- Understanding your data is the first step in building responsible AI`,
                  },
                },
                {
                  id: 'ch1-u2-s1-a3',
                  order: 3,
                  title: 'Data Science Lab — Explore a Dataset',
                  type: 'lab',
                  data: {
                    instructions: `## Lab: Exploring a Dataset with Python

In this lab, you'll practise loading and exploring a sample dataset — the first step in any ML pipeline.

**Goal:** Understand what a dataset looks like before training a model.`,
                    steps: [
                      'Load the dataset using pandas',
                      'Print the first 5 rows with df.head()',
                      'Check for missing values using df.isnull().sum()',
                      'Plot a histogram of the "age" column',
                      'Identify which columns are numerical vs. categorical',
                    ],
                    starterCode: `import pandas as pd
import matplotlib.pyplot as plt

# Step 1: Load the dataset
df = pd.read_csv('sample_data.csv')

# Step 2: Preview the data
print(df.head())

# Step 3: Check for missing values
print(df.isnull().sum())

# Step 4: Plot histogram
# TODO: Add your code here
# df['age'].hist()
# plt.show()

# Step 5: Identify column types
print(df.dtypes)
`,
                    hints: [
                      'Use df.describe() to get quick statistics (mean, min, max) for all numeric columns.',
                      'df.shape returns (rows, columns) — useful for understanding the size of your dataset.',
                      'To plot a histogram: df[\'column_name\'].hist(bins=20) then plt.show().',
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // CHAPTER 2
    // ─────────────────────────────────────────────
    {
      id: 'ch2',
      order: 2,
      number: '02',
      title: 'Machine Learning Basics',
      status: 'locked',
      tags: ['Supervised Learning', 'Models', 'Training'],
      units: [
        {
          id: 'ch2-u1',
          order: 1,
          title: 'Introduction to ML',
          subtopics: [
            {
              id: 'ch2-u1-s1',
              order: 1,
              title: 'What is Machine Learning?',
              assets: [
                {
                  id: 'ch2-u1-s1-a1',
                  order: 1,
                  title: 'Machine Learning in 5 Minutes',
                  type: 'video',
                  data: {
                    url: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
                    durationMinutes: 5,
                  },
                },
                {
                  id: 'ch2-u1-s1-a2',
                  order: 2,
                  title: 'ML Core Concepts — Summary',
                  type: 'summary',
                  data: {
                    body: `## Machine Learning Core Concepts

Machine Learning is a subset of AI where systems **learn from experience** without being explicitly programmed for each task.

### The ML Pipeline

\`\`\`
Problem → Data Collection → Data Cleaning → Feature Engineering
  → Model Selection → Training → Evaluation → Deployment → Monitoring
\`\`\`

### Key ML Concepts

**Features** — The input variables your model uses to make predictions (e.g., age, income, location).

**Labels** — The output value you want to predict (e.g., whether an email is spam or not spam).

**Model** — A mathematical function that maps features to predictions.

**Training** — The process of adjusting model parameters to minimize prediction error.

**Overfitting** — When a model memorizes training data but fails on new examples. Like a student who memorizes answers instead of understanding concepts.

**Generalization** — The goal: a model that performs well on data it has never seen before.

### Common ML Algorithms

| Algorithm | Type | Good For |
|---|---|---|
| Linear Regression | Supervised | Predicting numerical values |
| Decision Trees | Supervised | Classification with interpretability |
| K-Means | Unsupervised | Grouping similar items |
| Random Forest | Supervised | High-accuracy classification |
| Neural Networks | Supervised/Unsupervised | Complex patterns, images, text |`,
                  },
                },
                {
                  id: 'ch2-u1-s1-a3',
                  order: 3,
                  title: 'ML Concepts Quiz',
                  type: 'quiz',
                  data: {
                    questions: [
                      {
                        id: 'q1',
                        question: 'In machine learning, what is "overfitting"?',
                        options: [
                          'When a model trains too slowly',
                          'When a model performs well on training data but poorly on new data',
                          'When a dataset has too many features',
                          'When the learning rate is too high',
                        ],
                        correct: 1,
                        explanation: 'Overfitting occurs when a model learns the training data too specifically — including its noise — and loses the ability to generalize to unseen examples.',
                        hint: 'Think about memorizing vs. truly understanding.',
                      },
                      {
                        id: 'q2',
                        question: 'What is the purpose of a "loss function" in ML training?',
                        options: [
                          'To select which features to include',
                          'To measure how wrong the model\'s predictions are',
                          'To decide when to stop training',
                          'To visualize model performance',
                        ],
                        correct: 1,
                        explanation: 'A loss function quantifies the difference between the model\'s predictions and the correct answers. Training minimizes this loss through gradient descent.',
                        hint: 'It gives the model a "score" of how bad it is doing.',
                      },
                    ],
                  },
                },
                {
                  id: 'ch2-u1-s1-a4',
                  order: 4,
                  title: 'Train a Simple Classifier — Lab',
                  type: 'lab',
                  data: {
                    instructions: `## Lab: Train Your First Classifier

In this lab, you'll train a simple Decision Tree classifier on the Iris dataset — one of the classic starting points in machine learning.

**Goal:** Understand the train/test split workflow and evaluate model accuracy.`,
                    steps: [
                      'Load the Iris dataset from sklearn',
                      'Split data into training (80%) and test (20%) sets',
                      'Create and train a DecisionTreeClassifier',
                      'Make predictions on the test set',
                      'Calculate and print the accuracy score',
                    ],
                    starterCode: `from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Step 1: Load the dataset
iris = load_iris()
X, y = iris.data, iris.target

# Step 2: Split into train/test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Step 3: Create the model
model = DecisionTreeClassifier()

# Step 4: Train it
# TODO: model.fit(???, ???)

# Step 5: Predict and evaluate
# TODO: predictions = model.predict(???)
# TODO: print("Accuracy:", accuracy_score(???, ???))
`,
                    hints: [
                      'model.fit() takes two arguments: the training features and training labels.',
                      'model.predict() takes the test features (X_test) and returns predicted labels.',
                      'accuracy_score() compares your predictions to the actual labels (y_test). A perfect score is 1.0.',
                    ],
                  },
                },
              ],
            },
            {
              id: 'ch2-u1-s2',
              order: 2,
              title: 'Types of Machine Learning',
              assets: [
                {
                  id: 'ch2-u1-s2-a1',
                  order: 1,
                  title: 'Supervised vs. Unsupervised vs. Reinforcement',
                  type: 'video',
                  data: {
                    url: 'https://www.youtube.com/watch?v=1FZ0A1QCMWc',
                    durationMinutes: 10,
                  },
                },
                {
                  id: 'ch2-u1-s2-a2',
                  order: 2,
                  title: 'ML Types — Mindmap',
                  type: 'mindmap',
                  data: {
                    format: 'markdown',
                    outline: `Machine Learning Types
  Supervised Learning
    Classification
      Binary (Spam / Not Spam)
      Multi-class (Cat / Dog / Bird)
    Regression
      Predicting house prices
      Forecasting sales
  Unsupervised Learning
    Clustering
      K-Means
      DBSCAN
    Dimensionality Reduction
      PCA
      t-SNE
  Reinforcement Learning
    Agent acts in Environment
    Receives Rewards or Penalties
    Examples: AlphaGo, Game AI, Robotics
  Self-Supervised Learning
    Model creates its own labels
    Foundation of modern LLMs`,
                  },
                },
                {
                  id: 'ch2-u1-s2-a3',
                  order: 3,
                  title: 'ML Types — Flashcards',
                  type: 'flashcards',
                  data: {
                    cards: [
                      { front: 'What is Supervised Learning?', back: 'Learning from labelled training data — the model learns a mapping from inputs (X) to known outputs (Y). Examples: spam detection, image classification.' },
                      { front: 'What is Unsupervised Learning?', back: 'Learning from unlabelled data to find hidden patterns or groupings. Examples: customer segmentation, anomaly detection, topic modelling.' },
                      { front: 'What is Reinforcement Learning?', back: 'An agent learns by taking actions in an environment and receiving rewards or penalties. Examples: game-playing AI, robotic control.' },
                      { front: 'What is a Decision Boundary?', back: 'The line (or surface) that a classifier learns to separate different classes. Points on one side are predicted as Class A, on the other as Class B.' },
                      { front: 'What does "training set" vs. "test set" mean?', back: 'Training set: data used to fit the model. Test set: held-out data used to evaluate generalization. Never train on the test set!' },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // CHAPTER 3
    // ─────────────────────────────────────────────
    {
      id: 'ch3',
      order: 3,
      number: '03',
      title: 'Neural Networks',
      status: 'locked',
      tags: ['Perceptrons', 'Backpropagation', 'Deep Learning'],
      units: [
        {
          id: 'ch3-u1',
          order: 1,
          title: 'Building Blocks',
          subtopics: [
            {
              id: 'ch3-u1-s1',
              order: 1,
              title: 'Perceptrons and Neurons',
              assets: [
                {
                  id: 'ch3-u1-s1-a1',
                  order: 1,
                  title: 'How Artificial Neurons Work',
                  type: 'video',
                  data: {
                    url: 'https://www.youtube.com/watch?v=aircAruvnKk',
                    durationMinutes: 19,
                  },
                },
                {
                  id: 'ch3-u1-s1-a2',
                  order: 2,
                  title: 'Neural Network Concepts — Flashcards',
                  type: 'flashcards',
                  data: {
                    cards: [
                      { front: 'What is a perceptron?', back: 'The simplest artificial neuron: it takes weighted inputs, sums them, adds a bias, and passes the result through an activation function to produce an output.' },
                      { front: 'What is an activation function and why is it needed?', back: 'A non-linear function applied to a neuron\'s output. Without it, stacking layers is equivalent to a single linear transformation — no non-linearity means no ability to learn complex patterns.' },
                      { front: 'What does ReLU stand for and what does it do?', back: 'Rectified Linear Unit. ReLU(x) = max(0, x). It zeroes out negative values and passes positive values unchanged. It\'s the most common activation for hidden layers.' },
                      { front: 'What are weights in a neural network?', back: 'Learnable parameters that scale the importance of each input to a neuron. During training, weights are adjusted to minimize prediction error.' },
                      { front: 'What is backpropagation?', back: 'The algorithm for training neural networks. It computes how much each weight contributed to the error (via the chain rule of calculus) and adjusts them in the direction that reduces error.' },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Find a chapter by id */
export function findChapter(data, chapterId) {
  return data.chapters.find((ch) => ch.id === chapterId) ?? null;
}

/** Find a unit by id within a chapter */
export function findUnit(chapter, unitId) {
  return chapter?.units?.find((u) => u.id === unitId) ?? null;
}

/** Find a subtopic by id within a unit */
export function findSubtopic(unit, subtopicId) {
  return unit?.subtopics?.find((s) => s.id === subtopicId) ?? null;
}

/** Find an asset by id within a subtopic */
export function findAsset(subtopic, assetId) {
  return subtopic?.assets?.find((a) => a.id === assetId) ?? null;
}

/** Get sorted assets for a subtopic (by order field) */
export function getSortedAssets(subtopic) {
  if (!subtopic?.assets) return [];
  return [...subtopic.assets].sort((a, b) => a.order - b.order);
}

/** Get sorted subtopics for a unit */
export function getSortedSubtopics(unit) {
  if (!unit?.subtopics) return [];
  return [...unit.subtopics].sort((a, b) => a.order - b.order);
}

/** Get sorted units for a chapter */
export function getSortedUnits(chapter) {
  if (!chapter?.units) return [];
  return [...chapter.units].sort((a, b) => a.order - b.order);
}

/** Get sorted chapters for a course */
export function getSortedChapters(data) {
  if (!data?.chapters) return [];
  return [...data.chapters].sort((a, b) => a.order - b.order);
}

/** Get all asset IDs in the course (for progress tracking) */
export function getAllAssetIds(data) {
  const ids = [];
  for (const chapter of data.chapters) {
    for (const unit of chapter.units) {
      for (const subtopic of unit.subtopics) {
        for (const asset of subtopic.assets) {
          ids.push(asset.id);
        }
      }
    }
  }
  return ids;
}

/** Get total assets in a subtopic */
export function countSubtopicAssets(subtopic) {
  return subtopic?.assets?.length ?? 0;
}

/** Get total assets in a unit (across all subtopics) */
export function countUnitAssets(unit) {
  return unit?.subtopics?.reduce((total, s) => total + (s.assets?.length ?? 0), 0) ?? 0;
}

/** Get total assets in a chapter (across all units and subtopics) */
export function countChapterAssets(chapter) {
  return chapter?.units?.reduce((total, u) => total + countUnitAssets(u), 0) ?? 0;
}

/** Get the first available asset in a chapter (for default navigation) */
export function getFirstAsset(data, chapterId) {
  const chapter = findChapter(data, chapterId);
  const unit = chapter?.units?.[0];
  const subtopic = unit?.subtopics?.[0];
  const asset = subtopic?.assets?.[0];
  if (!chapter || !unit || !subtopic || !asset) return null;
  return { chapterId: chapter.id, unitId: unit.id, subtopicId: subtopic.id, assetId: asset.id };
}

/** Local-storage key for CMS overrides */
export const COURSE_LS_KEY = 'futureminds_course_data_v3';
export const COURSE_LS_KEY_LEGACY = 'futureminds_course_data_v2';
export const COURSE_LS_KEY_V1 = 'futureminds_course_data_v1';

/** Load course data: initialize with default data on first load, persist CMS changes */
export function loadCourseData() {
  try {
    const raw = localStorage.getItem(COURSE_LS_KEY);
    if (raw) {
      const decompressed = LZString.decompressFromUTF16(raw);
      if (decompressed) {
        const parsed = JSON.parse(decompressed);
        if (parsed && Array.isArray(parsed.chapters) && parsed.chapters.length > 0) {
          return parsed;
        }
      }
    }
    // Fallback to uncompressed legacy
    const rawLegacy = localStorage.getItem(COURSE_LS_KEY_LEGACY) || localStorage.getItem(COURSE_LS_KEY_V1);
    if (rawLegacy) {
      const parsed = JSON.parse(rawLegacy);
      if (parsed && Array.isArray(parsed.chapters) && parsed.chapters.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[courseData] Failed to load course data from storage, initializing defaults:', err);
  }
  // First load: initialize default/sample course data into storage
  saveCourseData(COURSE_DATA);
  return COURSE_DATA;
}

/** Persist CMS-edited course data to localStorage */
export function saveCourseData(data) {
  if (!data || !Array.isArray(data.chapters)) return;
  try {
    const jsonStr = JSON.stringify(data);
    const compressed = LZString.compressToUTF16(jsonStr);
    localStorage.setItem(COURSE_LS_KEY, compressed);
  } catch (err) {
    console.warn('[courseData] Failed to save course data to localStorage:', err);
  }
}

/** Reset to built-in course data */
export function resetCourseData() {
  try {
    localStorage.removeItem(COURSE_LS_KEY);
    localStorage.removeItem(COURSE_LS_KEY_LEGACY);
    localStorage.removeItem(COURSE_LS_KEY_V1);
    const jsonStr = JSON.stringify(COURSE_DATA);
    const compressed = LZString.compressToUTF16(jsonStr);
    localStorage.setItem(COURSE_LS_KEY, compressed);
  } catch {
    // ignore
  }
  return COURSE_DATA;
}
