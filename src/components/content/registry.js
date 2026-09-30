import VideoRenderer from './renderers/VideoRenderer.jsx';
import MindmapRenderer from './renderers/MindmapRenderer.jsx';
import FlashcardsRenderer from './renderers/FlashcardsRenderer.jsx';
import LabRenderer from './renderers/LabRenderer.jsx';
import HtmlEmbedRenderer from './renderers/HtmlEmbedRenderer.jsx';
import GameRenderer from './renderers/GameRenderer.jsx';
import SummaryRenderer from './renderers/SummaryRenderer.jsx';
import QuizRenderer from './renderers/QuizRenderer.jsx';
import UnsupportedRenderer from './renderers/UnsupportedRenderer.jsx';

/**
 * One renderer per content type.
 * Adding a new type: create a renderer + add one line here. Nothing else in the app should change.
 */
export const CONTENT_RENDERERS = {
  video: VideoRenderer,
  mindmap: MindmapRenderer,
  flashcards: FlashcardsRenderer,
  lab: LabRenderer,
  html_embed: HtmlEmbedRenderer,
  game: GameRenderer,
  summary: SummaryRenderer,
  quiz: QuizRenderer,
};

export function getRenderer(type) {
  return CONTENT_RENDERERS[type] || UnsupportedRenderer;
}
