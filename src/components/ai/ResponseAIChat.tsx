import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Home, 
  Navigation 
} from 'lucide-react';
import { aiService, AIMessage, EMERGENCY_QUICK_CHIPS } from '../../services/aiService';
import { soundEffects } from '../../services/soundEffects';

interface ResponseAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap: () => void;
  onNavigateToShelters: () => void;
  onOpenReportModal: () => void;
}

export const ResponseAIChat: React.FC<ResponseAIChatProps> = ({
  isOpen,
  onClose,
  onNavigateToMap,
  onNavigateToShelters,
  onOpenReportModal
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'AI-INIT',
      sender: 'AI',
      text: `🤖 **Hello, I am Response AI.**\n\nI provide **instant, safety-first emergency guidance** during active disasters.\n\n*How can I assist you right now?* You can type your situation below or choose a quick prompt.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: AIMessage = {
      id: `USER-${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI response simulation with deterministic safety engine
    setTimeout(async () => {
      const aiReply = await aiService.getEmergencyResponse(query);
      soundEffects.playVerificationBlip();
      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionButton = (actionType: string) => {
    if (actionType === 'VIEW_MAP') {
      onClose();
      onNavigateToMap();
    } else if (actionType === 'VIEW_SHELTERS') {
      onClose();
      onNavigateToShelters();
    } else if (actionType === 'REPORT_INCIDENT') {
      onClose();
      onOpenReportModal();
    } else if (actionType === 'CALL_112') {
      window.location.href = 'tel:112';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[2100] w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-5rem)] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
      
      {/* Chat Header */}
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white font-mono">RESPONSE AI</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1 rounded border border-emerald-800">OFFLINE READY</span>
            </div>
            <p className="text-[11px] text-gray-400">Deterministic Safety Protocols</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-950/70">
        
        {messages.map((msg) => {
          const isUser = msg.sender === 'USER';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                </div>

                {/* Action Buttons in AI message */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-700/80 flex flex-wrap gap-1.5">
                    {msg.actionButtons.map((btn, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionButton(btn.actionType)}
                        className="px-2.5 py-1 bg-gray-700 hover:bg-blue-600 text-white text-[11px] font-semibold rounded-md border border-gray-600 transition"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-gray-500 font-mono mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 bg-gray-800 text-gray-400 px-3 py-2 rounded-xl text-xs max-w-[120px] border border-gray-700">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-3 py-2 bg-gray-900 border-t border-gray-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {EMERGENCY_QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] font-medium rounded-full border border-gray-700 whitespace-nowrap transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-gray-900 border-t border-gray-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Describe your situation or hazard..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-gray-950 border border-gray-700 rounded-xl text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
