import VideoCard from '../components/content/VideoCard.jsx';
import SummaryViewer from '../components/content/SummaryViewer.jsx';
import MindmapViewer from '../components/content/MindmapViewer.jsx';
import FlashcardDeck from '../components/content/FlashcardDeck.jsx';
import LabViewer from '../components/content/LabViewer.jsx';
import FallbackCard from '../components/content/FallbackCard.jsx';

/**
 * Content type registry.
 *
 * To add a brand-new type:
 *   1. Create a display component under src/components/content/
 *   2. Add an entry here with `fields` describing the admin form.
 * No other UI files should switch on type.
 */
export const CONTENT_REGISTRY = {
  video: {
    label: 'Video',
    Component: VideoCard,
    fields: [
      { name: 'url', label: 'Video URL (YouTube, Vimeo, or Drive)', type: 'url', required: true },
      { name: 'durationMinutes', label: 'Duration (minutes)', type: 'text' },
      { name: 'thumbnailUrl', label: 'Thumbnail', type: 'file', accept: 'image/*' },
    ],
  },
  summary: {
    label: 'Summary sheet',
    Component: SummaryViewer,
    fields: [
      { name: 'body', label: 'Summary (Markdown)', type: 'textarea', required: true },
      { name: 'attachmentUrl', label: 'Optional PDF', type: 'file', accept: 'application/pdf' },
    ],
  },
  mindmap: {
    label: 'Mindmap',
    Component: MindmapViewer,
    fields: [
      { name: 'imageUrl', label: 'Mindmap image', type: 'file', accept: 'image/*', required: true },
    ],
  },
  flashcards: {
    label: 'Flashcard deck',
    Component: FlashcardDeck,
    fields: [
      {
        name: 'cards',
        label: 'Cards',
        type: 'array-of-pairs',
        pairKeys: ['question', 'answer'],
        pairLabels: ['Question', 'Answer'],
        required: true,
      },
    ],
  },
  lab: {
    label: 'Lab',
    Component: LabViewer,
    fields: [
      { name: 'instructions', label: 'Instructions (Markdown)', type: 'textarea', required: true },
      {
        name: 'resourceLinks',
        label: 'Resource links',
        type: 'array-of-pairs',
        pairKeys: ['label', 'url'],
        pairLabels: ['Label', 'URL'],
      },
    ],
  },
};

export function getTypeEntry(type) {
  return CONTENT_REGISTRY[type] ?? {
    label: type || 'Unknown',
    Component: FallbackCard,
    fields: [],
  };
}

export const CONTENT_TYPE_OPTIONS = Object.entries(CONTENT_REGISTRY).map(([value, entry]) => ({
  value,
  label: entry.label,
}));

export const SUGGESTED_MODULES = [
  'Unit 1: Neural Foundations',
  'Unit 2: Large Language Models',
  'Intro to AI',
  'Tokens & Data',
  'Weights & Biases',
  'Neural Architectures',
  'Optimization',
  'Ethics & Safety',
];
