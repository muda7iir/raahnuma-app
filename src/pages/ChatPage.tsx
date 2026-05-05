import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Compass, Plus, Search, Trash2, Send, Mic, MicOff, Volume2, VolumeX, Copy, ThumbsUp, ThumbsDown, Map, ClipboardCheck, GraduationCap, FileText, Download, Menu, X, ArrowLeft, Play, Pause, Square, Lightbulb, Sun, Moon, Settings } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import { createChatSession, sendSinglePrompt, SYSTEM_PROMPT } from '../lib/gemini';
import { getChats, setChats, generateId, getSettings, type ChatConversation, type ChatMessage } from '../lib/storage';
import { createRecognition, isSpeechRecognitionSupported, speak, stopSpeaking, stripMarkdown, isSpeechSynthesisSupported, getVoices } from '../lib/speech';
import { exportChatAsPDF } from '../lib/pdf';
import toast from 'react-hot-toast';
import type { ChatSession } from '@google/generative-ai';

const QUICK_PROMPTS = [
  'How do I become a Software Engineer?',
  'Best careers for creative people?',
  'How to get a scholarship abroad?',
  'High paying jobs without a degree?',
  'How to start freelancing in 2026?',
  'Job vs Business — which is better?',
  'Career change at 30 — is it possible?',
  'How to become a Data Scientist?',
];

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const settings = getSettings();

  const [conversations, setConversations] = useState<ChatConversation[]>(getChats());
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(!settings.autoPlayVoice);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [tipOfDay, setTipOfDay] = useState('');

  const chatSessionRef = useRef<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Load or create chat
  useEffect(() => {
    if (chatId) {
      const found = conversations.find(c => c.id === chatId);
      if (found) { setActiveChat(found); } else { navigate('/chat'); }
    } else { setActiveChat(null); }
  }, [chatId, conversations, navigate]);

  // Create Gemini session
  useEffect(() => {
    chatSessionRef.current = createChatSession();
    // Load tip
    sendSinglePrompt('Give me one short career tip in 1 sentence.').then(t => setTipOfDay(t)).catch(() => setTipOfDay('Always keep learning — the best investment is in yourself.'));
  }, []);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeChat?.messages]);

  const saveConversations = useCallback((convs: ChatConversation[]) => {
    setConversations(convs);
    setChats(convs);
  }, []);

  const startNewChat = () => {
    chatSessionRef.current = createChatSession();
    setActiveChat(null);
    navigate('/chat');
    setSidebarOpen(false);
  };

  const deleteChat = (id: string) => {
    const updated = conversations.filter(c => c.id !== id);
    saveConversations(updated);
    if (activeChat?.id === id) { setActiveChat(null); navigate('/chat'); }
    toast.success('Chat deleted');
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() };

    let currentChat = activeChat;
    if (!currentChat) {
      currentChat = {
        id: generateId(),
        title: text.trim().substring(0, 40),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const updatedMessages = [...currentChat.messages, userMsg];
    currentChat = { ...currentChat, messages: updatedMessages, updatedAt: new Date().toISOString() };
    setActiveChat(currentChat);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) chatSessionRef.current = createChatSession();

      // Build context from profile
      const profileContext = profile ? `User: ${profile.name}, Age: ${profile.age}, Country: ${profile.country}, Education: ${profile.educationLevel}, Interests: ${profile.interests.join(', ')}, Work Preference: ${profile.workPreferences.join(', ')}, Budget: ${profile.budget}, Dream: ${profile.dreamStatement}` : '';

      const fullPrompt = profileContext ? `${SYSTEM_PROMPT}\n\nUser Profile: ${profileContext}\n\nUser: ${text.trim()}` : `${SYSTEM_PROMPT}\n\nUser: ${text.trim()}`;

      const result = await chatSessionRef.current.sendMessage(fullPrompt);
      const aiText = result.response.text();

      const aiMsg: ChatMessage = { id: generateId(), role: 'ai', content: aiText, timestamp: new Date().toISOString() };
      const finalMessages = [...updatedMessages, aiMsg];
      currentChat = { ...currentChat, messages: finalMessages, updatedAt: new Date().toISOString() };
      setActiveChat(currentChat);

      // Save
      const existingIndex = conversations.findIndex(c => c.id === currentChat!.id);
      const updatedConvs = existingIndex >= 0
        ? conversations.map(c => c.id === currentChat!.id ? currentChat! : c)
        : [currentChat, ...conversations];
      saveConversations(updatedConvs);

      if (!chatId) navigate(`/chat/${currentChat.id}`, { replace: true });

      // Auto-play voice
      if (!isMuted && isSpeechSynthesisSupported()) {
        const plain = stripMarkdown(aiText);
        speak(plain, { voiceId: settings.voiceId, rate: settings.voiceSpeed, pitch: settings.voicePitch, onStart: () => setPlayingMsgId(aiMsg.id), onEnd: () => setPlayingMsgId(null) });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to get response');
      const errMsg: ChatMessage = { id: generateId(), role: 'ai', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date().toISOString() };
      currentChat = { ...currentChat, messages: [...updatedMessages, errMsg], updatedAt: new Date().toISOString() };
      setActiveChat(currentChat);
    }
    setIsLoading(false);
  };

  // Voice input
  const toggleRecording = () => {
    if (!isSpeechRecognitionSupported()) { toast.error('Voice input not supported in this browser. Use Chrome or Edge.'); return; }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const rec = createRecognition();
    if (!rec) return;
    recognitionRef.current = rec;
    rec.onresult = (e) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) { transcript += e.results[i][0].transcript; }
      setInput(transcript);
    };
    rec.onend = () => setIsRecording(false);
    rec.onerror = () => { setIsRecording(false); toast.error('Voice recognition error. Try again.'); };
    rec.start();
    setIsRecording(true);
  };

  const playMessage = (msg: ChatMessage) => {
    if (playingMsgId === msg.id) { stopSpeaking(); setPlayingMsgId(null); return; }
    const plain = stripMarkdown(msg.content);
    speak(plain, { voiceId: settings.voiceId, rate: settings.voiceSpeed, pitch: settings.voicePitch, onStart: () => setPlayingMsgId(msg.id), onEnd: () => setPlayingMsgId(null) });
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleFeedback = (msgId: string, feedback: 'up' | 'down') => {
    if (!activeChat) return;
    const updated = { ...activeChat, messages: activeChat.messages.map(m => m.id === msgId ? { ...m, feedback } : m) };
    setActiveChat(updated);
    const updatedConvs = conversations.map(c => c.id === updated.id ? updated : c);
    saveConversations(updatedConvs);
    toast.success(feedback === 'up' ? 'Thanks for the feedback!' : 'We\'ll improve. Thanks!');
  };

  const exportChat = () => {
    if (!activeChat) return;
    exportChatAsPDF(activeChat.title, activeChat.messages, `nxraahnuma-chat-${activeChat.id}.pdf`);
    toast.success('Chat exported as PDF');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const filteredConversations = conversations.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h4 class="font-bold text-base mt-3 mb-1">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 class="font-bold text-lg mt-3 mb-1">$1</h3>')
      .replace(/^# (.*$)/gim, '<h2 class="font-bold text-xl mt-3 mb-2">$1</h2>')
      .replace(/^\d+\.\s(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/^[-*]\s(.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="h-screen flex bg-[#f4f8fd] dark:bg-[#0a1220] overflow-hidden">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* LEFT SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button onClick={startNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1673CA] text-white rounded-lg hover:bg-[#0d4f8c] transition-colors text-sm font-semibold">
            <Plus className="w-4 h-4" /> New Chat
          </button>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search chats..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-[#1673CA]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filteredConversations.length === 0 && <p className="text-xs text-gray-400 text-center py-8">No conversations yet</p>}
          {filteredConversations.map(conv => (
            <div key={conv.id} onClick={() => { navigate(`/chat/${conv.id}`); setSidebarOpen(false); }} className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer mb-1 transition-colors ${activeChat?.id === conv.id ? 'bg-[#1673CA]/10 text-[#1673CA]' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{conv.title}</p>
                <p className="text-xs text-gray-400">{new Date(conv.updatedAt).toLocaleDateString()}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteChat(conv.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-[#1673CA] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-14 bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold truncate flex-1">{activeChat?.title || 'New Conversation'}</h2>
          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title={isMuted ? 'Unmute voice' : 'Mute voice'}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {activeChat && <button onClick={exportChat} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="Export as PDF"><Download className="w-4 h-4" /></button>}
          <button onClick={toggleTheme} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {(!activeChat || activeChat.messages.length === 0) ? (
            /* Empty State */
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#1673CA]/10 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-[#1673CA]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Hello{profile ? `, ${profile.name.split(' ')[0]}` : ''}!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">I'm NX RaahNuma, your AI career counselor. Ask me anything about careers, education, or skills.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => sendMessage(p)} className="text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] text-sm hover:border-[#1673CA] hover:text-[#1673CA] transition-all hover:shadow-md">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {activeChat.messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center shrink-0 mt-1">
                      <Compass className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] group ${msg.role === 'user' ? 'order-1' : ''}`}>
                    <div className={`px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-[#1673CA] text-white rounded-2xl rounded-tr-md'
                      : 'bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-md'
                    }`}>
                      {msg.role === 'ai' ? (
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      ) : msg.content}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-gray-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.role === 'ai' && (
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => copyMessage(msg.content)} className="p-1 hover:text-[#1673CA]" title="Copy"><Copy className="w-3 h-3" /></button>
                          <button onClick={() => playMessage(msg)} className="p-1 hover:text-[#1673CA]" title={playingMsgId === msg.id ? 'Stop' : 'Play'}>
                            {playingMsgId === msg.id ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </button>
                          <button onClick={() => handleFeedback(msg.id, 'up')} className={`p-1 ${msg.feedback === 'up' ? 'text-green-500' : 'hover:text-green-500'}`}><ThumbsUp className="w-3 h-3" /></button>
                          <button onClick={() => handleFeedback(msg.id, 'down')} className={`p-1 ${msg.feedback === 'down' ? 'text-red-500' : 'hover:text-red-500'}`}><ThumbsDown className="w-3 h-3" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1673CA] flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-md px-5 py-4">
                    <div className="flex gap-1.5"><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your career..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#1673CA] focus:border-transparent outline-none transition resize-none"
                  style={{ maxHeight: '120px' }}
                />
                <span className="absolute right-3 bottom-2 text-[10px] text-gray-400">{input.length}</span>
              </div>
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-[#1673CA] hover:bg-[#1673CA]/10'}`}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition-all ${input.trim() && !isLoading ? 'bg-[#1673CA] text-white hover:bg-[#0d4f8c] shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 mt-2 text-xs text-red-500 font-medium">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-1 bg-red-500 rounded-full" style={{ height: `${8 + Math.random() * 16}px`, animation: `waveform ${0.5 + i * 0.1}s ease-in-out infinite` }} />)}
                </div>
                Listening... speak now
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Quick Tools (desktop only) */}
      <aside className="hidden xl:flex w-60 bg-white dark:bg-[#111827] border-l border-gray-200 dark:border-gray-800 flex-col p-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500 uppercase tracking-wider">Quick Tools</h3>
        <div className="space-y-2">
          <Link to="/roadmap" className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-[#1673CA]/10 hover:text-[#1673CA] transition-colors">
            <Map className="w-4 h-4" /> Generate Roadmap
          </Link>
          <Link to="/assessment" className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-[#1673CA]/10 hover:text-[#1673CA] transition-colors">
            <ClipboardCheck className="w-4 h-4" /> Skills Assessment
          </Link>
          <Link to="/scholarships" className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-[#1673CA]/10 hover:text-[#1673CA] transition-colors">
            <GraduationCap className="w-4 h-4" /> Find Scholarships
          </Link>
          <Link to="/resume" className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-[#1673CA]/10 hover:text-[#1673CA] transition-colors">
            <FileText className="w-4 h-4" /> Build Resume
          </Link>
          {activeChat && (
            <button onClick={exportChat} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-[#1673CA]/10 hover:text-[#1673CA] transition-colors w-full text-left">
              <Download className="w-4 h-4" /> Export Chat PDF
            </button>
          )}
        </div>
        {tipOfDay && (
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-2"><Lightbulb className="w-4 h-4 text-amber-500" /><span className="text-xs font-semibold text-gray-500">Career Tip</span></div>
            <p className="text-xs text-gray-400 leading-relaxed">{tipOfDay.substring(0, 150)}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
