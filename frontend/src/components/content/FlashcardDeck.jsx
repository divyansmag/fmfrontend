import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function FlashcardDeck({ item }) {
  const cards = Array.isArray(item.metadata?.cards) ? item.metadata.cards.filter((card) => card.question || card.answer) : [];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const total = cards.length;

  const go = (nextIndex) => {
    setFlipped(false);
    setIndex((nextIndex + total) % total);
  };

  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">Flashcards</span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{item.title}</h3>
        </div>
        {total > 0 && (
          <span className="text-[11px] font-bold text-slate-400">
            {index + 1} / {total}
          </span>
        )}
      </header>

      {total === 0 ? (
        <p className="text-sm text-slate-400">This deck has no cards yet.</p>
      ) : (
        <>
          <button type="button" onClick={() => setFlipped((value) => !value)} className="w-full [perspective:1200px]">
            <div className={`flashcard-inner ${flipped ? 'is-flipped' : ''}`}>
              <div className="flashcard-face bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 rounded-2xl p-8 min-h-[180px] flex flex-col items-center justify-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-500 mb-2">Question</span>
                <p className="text-base font-semibold text-slate-900 dark:text-white text-center">{card.question}</p>
              </div>
              <div className="flashcard-face flashcard-back bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 min-h-[180px] flex flex-col items-center justify-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 mb-2">Answer</span>
                <p className="text-base font-semibold text-slate-900 dark:text-white text-center">{card.answer}</p>
              </div>
            </div>
          </button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setFlipped((value) => !value)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Flip card
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </article>
  );
}
