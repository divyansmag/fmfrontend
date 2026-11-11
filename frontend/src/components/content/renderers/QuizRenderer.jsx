import { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, RotateCcw, XCircle } from 'lucide-react';

export default function QuizRenderer({ manifest }) {
  const questions = Array.isArray(manifest.data?.questions) ? manifest.data.questions : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState({}); // questionId → optionIndex
  const [showHint, setShowHint] = useState({});  // questionId → bool
  const [submitted, setSubmitted] = useState(false);

  const current = questions[currentIndex];
  const total = questions.length;
  const isAnswered = current && selected[currentIndex] !== undefined;
  const isCorrect = current && selected[currentIndex] === current.correct;

  const allAnswered = questions.every((q, i) => selected[i] !== undefined);
  const score = questions.filter((q, i) => selected[i] === q.correct).length;

  const handleSelect = (optionIndex) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleSubmit = () => setSubmitted(true);

  const handleReset = () => {
    setSelected({});
    setShowHint({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  const goTo = (index) => setCurrentIndex(Math.max(0, Math.min(total - 1, index)));

  const optionLetters = ['A', 'B', 'C', 'D'];

  if (total === 0) {
    return (
      <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 text-center text-sm text-slate-400">
        No questions in this quiz yet.
      </article>
    );
  }

  // Results screen
  if (submitted) {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 70;
    return (
      <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
        <header>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">Quiz</span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{manifest.title}</h3>
        </header>

        {/* Score Banner */}
        <div className={`rounded-2xl p-6 text-center border ${passed ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'}`}>
          <div className="text-4xl font-extrabold font-display mb-1" style={{ color: passed ? '#10B981' : '#EF4444' }}>
            {score}/{total}
          </div>
          <div className={`text-sm font-bold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {pct}% — {passed ? '🎉 Passed!' : 'Keep practising!'}
          </div>
        </div>

        {/* Answer Review */}
        <div className="space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Review</div>
          {questions.map((q, qi) => {
            const userAnswer = selected[qi];
            const correct = userAnswer === q.correct;
            return (
              <div key={qi} className={`rounded-2xl p-4 border ${correct ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {correct
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      : <XCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Q{qi + 1}. {q.question}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Your answer: <span className="font-bold">{q.options[userAnswer] ?? '(not answered)'}</span>
                    </div>
                    {!correct && (
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                        Correct: <span className="font-bold">{q.options[q.correct]}</span>
                      </div>
                    )}
                    {q.explanation && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 italic">{q.explanation}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>
      </article>
    );
  }

  // Question screen
  return (
    <article className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">Quiz</span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{manifest.title}</h3>
        </div>
        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap">
          {currentIndex + 1} / {total}
        </span>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-purple-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-5 border border-amber-100 dark:border-amber-900/50">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">Question {currentIndex + 1}</div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">{current.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {current.options.map((option, idx) => {
          const isSelected = selected[currentIndex] === idx;
          const revealed = isAnswered;
          const isCorrectOption = idx === current.correct;

          let style = 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30';
          if (revealed && isSelected && isCorrect) {
            style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200';
          } else if (revealed && isSelected && !isCorrect) {
            style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 dark:border-rose-600 text-rose-800 dark:text-rose-200';
          } else if (revealed && isCorrectOption) {
            style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300';
          } else if (isSelected) {
            style = 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 dark:border-purple-500 text-purple-800 dark:text-purple-200 shadow-sm shadow-purple-600/10';
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${style}`}
            >
              <span className={`w-7 h-7 rounded-xl text-[11px] font-black flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}>
                {optionLetters[idx]}
              </span>
              {option}
              {revealed && isCorrectOption && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" />
              )}
              {revealed && isSelected && !isCorrectOption && (
                <XCircle className="w-4 h-4 text-rose-500 ml-auto flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation after answering */}
      {isAnswered && current.explanation && (
        <div className={`rounded-2xl p-4 border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60'}`}>
          <div className="flex items-start gap-2.5">
            {isCorrect
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              : <XCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />}
            <div>
              <div className="text-xs font-bold mb-0.5">{isCorrect ? '✓ Correct!' : '✗ Not quite'}</div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{current.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      {current.hint && !isAnswered && (
        <div>
          {showHint[currentIndex] ? (
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl p-4 border border-purple-100 dark:border-purple-900/50">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-300">{current.hint}</p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint((prev) => ({ ...prev, [currentIndex]: true }))}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Show hint
            </button>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {currentIndex < total - 1 ? (
          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            disabled={!isAnswered}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-600/20 transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit Quiz
          </button>
        )}
      </div>
    </article>
  );
}
