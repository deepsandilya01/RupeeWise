import { useEffect, useState } from 'react';
import {
  Sparkles,
  X,
  PieChart,
  ThumbsUp,
  Calendar,
  Lightbulb,
  CheckCircle2,
  MessageSquare,
  Paperclip,
  ArrowRight,
  Loader2,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { useAppDispatch, useAppSelector } from '../../app/hooks.js';
import { askAICoach, fetchAiStatus } from '../../features/ai/aiThunks.js';
import { addLocalUserMessage, setSelectedProvider } from '../../features/ai/aiSlice.js';
import MarkdownMessage from '../common/MarkdownMessage.jsx';

export const AIMoneyCoachWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chatMessages, coachLoading, aiStatus, selectedProvider } = useAppSelector((state) => state.ai);

  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    dispatch(fetchAiStatus());
  }, [dispatch]);

  const quickPrompts = [
    { id: 'analyze', text: 'Where is most of my money going?', icon: <PieChart className="w-3.5 h-3.5" /> },
    { id: 'tips', text: 'How can I save ₹2,000 every month?', icon: <ThumbsUp className="w-3.5 h-3.5" /> },
    { id: 'purchase', text: 'Can I afford a major purchase?', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'invest', text: 'How much could I save in 12 months?', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: 'budget', text: 'Help me create a monthly budget', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'ask', text: 'Which expenses increased this month?', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || coachLoading) return;

    dispatch(addLocalUserMessage(query.trim()));
    dispatch(askAICoach({ message: query.trim(), provider: selectedProvider }));
    setInputMessage('');
  };

  const formatProviderLabel = (p) => {
    if (p === 'gemini') return 'Gemini Flash';
    if (p === 'mistral') return 'Mistral AI';
    if (p === 'rules-based') return 'Rules Engine';
    return 'RupeeWise AI';
  };

  return (
    <div className="bg-white rounded-[24px] p-5 border border-gray-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full select-none text-left">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
            <h3 className="text-sm font-extrabold text-[#0B1D33] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-coral-500" />
              <span>AI Money Coach</span>
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Provider Pill Selector */}
            <select
              value={selectedProvider}
              onChange={(e) => dispatch(setSelectedProvider(e.target.value))}
              className="text-[10px] font-semibold bg-[#FAF6EE] text-[#073746] border border-[#E7DFD0] rounded-lg px-1.5 py-0.5 outline-none cursor-pointer"
              title="Select active AI Provider"
            >
              <option value="auto">Auto (Smart)</option>
              <option value="gemini">Google Gemini</option>
              <option value="mistral">Mistral AI</option>
              <option value="rules-based">Rules Engine</option>
            </select>

            <button
              onClick={() => navigate('/ai-coach')}
              className="text-gray-400 hover:text-[#0C3846] transition-colors p-1 rounded-lg hover:bg-gray-100"
              title="Open Full AI Coach Workspace"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-1 mb-3">
          Personalized financial advice grounded in your transactions
        </p>

        {/* Chat Stream Area */}
        <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
          {chatMessages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-[#0C3846] text-white flex items-center justify-center text-[10px] flex-shrink-0 font-bold shadow-2xs">
                  RW
                </div>
              )}
              <div
                className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${
                  m.sender === 'user'
                    ? 'bg-[#0C3846] text-white rounded-tr-none'
                    : 'bg-[#FFF8F4] border border-[#FFE5D4] text-[#0B1D33] rounded-tl-none'
                }`}
              >
                {m.sender === 'user' ? (
                  <p className="whitespace-pre-line">{m.text}</p>
                ) : (
                  <MarkdownMessage content={m.text} className="text-[#0B1D33]" />
                )}
                {m.sender === 'ai' && (
                  <div className="mt-2 pt-1.5 border-t border-[#FFE5D4]/60 text-[9px] font-semibold text-gray-400 flex flex-wrap items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{formatProviderLabel(m.provider || m.source)}</span>
                    {m.model && <span className="text-gray-400 font-normal">({m.model})</span>}
                  </div>
                )}
                {m.fallbackReason && (
                  <div className="mt-1.5 text-[9px] font-medium text-amber-800 bg-amber-50/90 px-2 py-1 rounded-lg border border-amber-200/70 flex items-center gap-1">
                    <span>⚡</span>
                    <span>{m.fallbackReason.includes('Switched to') ? 'Switched to RupeeWise Financial Rules Engine' : m.fallbackReason}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {coachLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 italic py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-coral-500" />
              <span>Analyzing your cashflow records...</span>
            </div>
          )}
        </div>

        {/* 6 Quick Action Prompts */}
        <div className="grid grid-cols-2 gap-1.5 mt-4">
          {quickPrompts.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSend(p.text)}
              disabled={coachLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200/90 bg-[#FFFDF9] hover:bg-peach-50/80 text-[10px] font-semibold text-gray-700 transition-colors text-left"
            >
              <span className="text-coral-500">{p.icon}</span>
              <span className="truncate">{p.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Interactive Message Bar */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={() => navigate('/ai-coach')}
          className="p-2 text-gray-400 hover:text-gray-600"
          title="Full Coach View"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 bg-gray-50 border border-gray-200/80 rounded-full px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-coral-400 text-gray-800 placeholder-gray-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={coachLoading || !inputMessage.trim()}
          className="w-8 h-8 rounded-full bg-[#F35C48] text-white flex items-center justify-center hover:bg-coral-600 disabled:opacity-50 transition-colors flex-shrink-0 shadow-sm"
          aria-label="Send message"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AIMoneyCoachWidget;
