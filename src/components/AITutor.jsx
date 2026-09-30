import { useEffect, useRef } from 'react';
import { Archive, HelpCircle, Image, MessageSquare, Mic, Plus, Search, Send, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function AITutor() {
  const {
    user,
    aiSearchQuery,
    setAiSearchQuery,
    aiInput,
    setAiInput,
    filteredSessions,
    currentSession,
    aiTutor,
    createNewSession,
    clearAllChatSessions,
    selectChatSession,
    deleteChatSession,
    deleteChatMessage,
    sendAiMessage,
    showToast,
  } = useApp();
  const streamRef = useRef(null);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [currentSession?.messages, aiTutor.isTyping]);

  return (
    <main id="view-ai-tutor" className="view-container p-4 sm:p-6 max-w-7xl mx-auto w-full h-[calc(100vh-5rem)] flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 h-full min-h-0 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
        <div className="p-5 border-r border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between h-full min-h-0 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden">
          <div className="space-y-4 flex flex-col flex-1 min-h-0 overflow-hidden">
            <button type="button" onClick={createNewSession} className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>New Session</span>
            </button>

            <div className="relative flex-shrink-0">
              <input
                type="text"
                id="ai-search-input"
                value={aiSearchQuery}
                onChange={(event) => setAiSearchQuery(event.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 text-slate-800 dark:text-slate-200"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            </div>

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">CHAT HISTORY</span>
                <button type="button" onClick={clearAllChatSessions} className="text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 transition-colors cursor-pointer" title="Delete all conversations">
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>
              <div id="ai-sessions-list" className="space-y-1 overflow-y-auto flex-1 pr-1 min-h-0">
                {filteredSessions.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    {aiSearchQuery ? 'No matching conversations' : 'No active chats. Click New Session!'}
                  </div>
                ) : (
                  filteredSessions.map((session) => {
                    const isActive = session.id === aiTutor.currentSessionId;
                    return (
                      <div
                        key={session.id}
                        className={`group relative flex items-center justify-between rounded-xl transition-all ${isActive
                          ? 'bg-purple-600 text-white font-semibold shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        <button type="button" onClick={() => selectChatSession(session.id)} className="flex-1 text-left px-3 py-2.5 text-xs flex items-center gap-2 truncate cursor-pointer">
                          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-75" />
                          <span className="truncate">{session.title}</span>
                        </button>
                        <button
                          type="button"
                          title="Delete conversation"
                          onClick={(event) => deleteChatSession(session.id, event)}
                          className="p-1.5 mr-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-black/20 text-current transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col justify-between h-full min-h-0 p-5 sm:p-6 bg-white dark:bg-slate-800 relative overflow-hidden">
          <div id="ai-messages-stream" ref={streamRef} className="flex-1 overflow-y-auto py-5 space-y-5 pr-2 min-h-0">
            {!currentSession || !currentSession.messages || currentSession.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center overflow-hidden shadow-inner">
                  <img
                    src="/assets/sage_aitutor.jpg"
                    alt="Orin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base font-black text-slate-800 dark:text-white font-display">Chat with Orin, your AI Tutor</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">Ask a question below, or pick a quick prompt like "Hint" or "Quiz Me" to start chatting!</p>
              </div>
            ) : (
              currentSession.messages.map((message, index) => {
                const isUser = message.sender === user.name || message.sender === 'user';

                return isUser ? (
                  <div key={`${message.sender}-${index}`} className="group relative flex flex-col items-end max-w-2xl ml-auto">
                    <div className="flex items-center gap-2 mb-1">
                      <button type="button" onClick={() => deleteChatMessage(index)} title="Delete message" className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{user.name}</span>
                    </div>
                    <div className="bg-purple-600 text-white rounded-3xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed shadow-md shadow-purple-600/20 whitespace-pre-wrap break-words">
                      {message.text}
                    </div>
                  </div>
                ) : (
                  <div key={`${message.sender}-${index}`} className="group relative flex items-start gap-3.5 max-w-2xl">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/60 flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                      <img
                        src="dist\assets\orin_aitutor.jpg"
                        alt="Orin"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Orin</span>
                        <button type="button" onClick={() => deleteChatMessage(index)} title="Delete message" className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/60 rounded-3xl rounded-tl-sm px-5 py-3.5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-sm whitespace-pre-wrap break-words">
                        {message.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {aiTutor.isTyping && (
              <div id="ai-typing-indicator" className="flex items-start gap-3.5 max-w-2xl">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/60 flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                  <img
                    src="/assets/orin.jpeg"
                    alt="Orin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/60 rounded-3xl rounded-tl-sm px-5 py-3.5 text-sm flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-purple-600 typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-purple-600 typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-purple-600 typing-dot" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button type="button" onClick={() => sendAiMessage('Give me a quick hint on how activation functions work!')} className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-300 font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
                Hint
              </button>
              <button type="button" onClick={() => sendAiMessage('Can you explain this simpler like I am in 6th grade?')} className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-300 font-semibold transition-all whitespace-nowrap cursor-pointer">
                Explain Simpler
              </button>
              <button type="button" onClick={() => sendAiMessage('Please provide a real-world example of word tokenization.')} className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-300 font-semibold transition-all whitespace-nowrap cursor-pointer">
                Give Example
              </button>
              <button type="button" onClick={() => sendAiMessage('Test me with a 1-question quiz on neural weights!')} className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-300 font-semibold transition-all whitespace-nowrap cursor-pointer">
                Quiz Me
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 px-3 shadow-inner">
              <button type="button" onClick={() => showToast('Microphone', 'Voice input listening...', 'info')} className="p-2 rounded-xl text-slate-400 hover:text-purple-600 transition-colors cursor-pointer">
                <Mic className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => showToast('Attachment', 'Image attachment supported (PNG, JPG)', 'info')} className="p-2 rounded-xl text-slate-400 hover:text-purple-600 transition-colors cursor-pointer">
                <Image className="w-5 h-5" />
              </button>
              <input
                type="text"
                id="ai-tutor-input"
                value={aiInput}
                onChange={(event) => setAiInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') sendAiMessage();
                }}
                placeholder="Ask Orin something, or say 'give me a hint'"
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button type="button" onClick={() => sendAiMessage()} className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-600/30 transition-all cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}