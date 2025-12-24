
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { getLivestockAdvice } from '../services/geminiService';
import { translations } from '../i18n';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface AIChatProps {
  lang: 'en' | 'ar';
}

const AIChat: React.FC<AIChatProps> = ({ lang }) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: t.expert.welcome, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getLivestockAdvice(input);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), text: aiResponse || "Sorry, I'm a bit lost. Can you rephrase?", sender: 'ai' };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-surface rounded-card overflow-hidden shadow-level-1 border border-border-dabeeha">
      <div className="bg-primary p-4 text-white flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-card">
          <Bot className="w-6 h-6 text-accent-gold" />
        </div>
        <div className="text-start">
          <h2 className="font-bold text-base leading-tight">{t.expert.title}</h2>
          <p className="text-[10px] text-accent-gold uppercase tracking-widest font-black">{t.expert.tagline}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-dabeeha/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-card text-sm leading-relaxed text-start ${
              msg.sender === 'user' 
                ? 'bg-primary text-white shadow-level-1' 
                : 'bg-surface text-text-main border border-border-dabeeha'
            }`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface p-4 rounded-card border border-border-dabeeha">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border-dabeeha bg-surface">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={t.expert.placeholder}
            className="dabeeha-input w-full pr-12 text-sm"
            style={{ paddingLeft: lang === 'en' ? '16px' : '48px', paddingRight: lang === 'ar' ? '16px' : '48px' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`absolute ${lang === 'ar' ? 'left-2' : 'right-2'} p-2 bg-primary text-white rounded-card hover:bg-primary-variant transition-colors disabled:opacity-50 shadow-level-1`}
          >
            <Send className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
