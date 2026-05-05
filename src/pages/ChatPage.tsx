import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, User, Compass, Loader2, Volume2, VolumeX, Square, ArrowLeft, RotateCcw } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';
import { getChats, setChats, generateId, ChatConversation, ChatMessage, getSettings } from '../lib/storage';
import { speak, stopSpeaking, stripMarkdown } from '../lib/speech';
import { flows, getStartNode, getNode, FlowNode } from '../lib/conversationFlow';

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatConversation | null>(null);
  
  // Flow state
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [nodeHistory, setNodeHistory] = useState<string[]>([]);
  
  // Voice state
  const [isMuted, setIsMuted] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadedChats = getChats();
    setConversations(loadedChats);

    const mutedState = localStorage.getItem('nxraahnuma_voice_muted');
    if (mutedState === 'true') setIsMuted(true);

    if (chatId) {
      const chat = loadedChats.find((c) => c.id === chatId);
      if (chat) {
        setCurrentChat(chat);
        // If it's an existing chat, try to resume the flow state from the last node ID stored in local state?
        // For simplicity, we just keep the chat history. Active flow might be reset.
      } else {
        navigate('/chat');
      }
    } else {
      startNewChat();
    }
  }, [chatId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages, isTyping]);

  const startNewChat = () => {
    const newChat: ChatConversation = {
      id: generateId(),
      title: 'New Career Discussion',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedChats = [newChat, ...conversations];
    setConversations(updatedChats);
    setChats(updatedChats);
    navigate(`/chat/${newChat.id}`);
  };

  const saveChat = (updatedChat: ChatConversation) => {
    setCurrentChat(updatedChat);
    const updatedChats = conversations.map(c => c.id === updatedChat.id ? updatedChat : c);
    setConversations(updatedChats);
    setChats(updatedChats);
  };

  const handleFlowSelect = (flowId: string) => {
    setActiveFlowId(flowId);
    setNodeHistory([]);
    const startNode = getStartNode(flowId);
    if (startNode) {
      handleNodeTransition(startNode);
      if (currentChat) {
        const updatedChat = { ...currentChat, title: getFlowTitle(flowId) };
        saveChat(updatedChat);
      }
    }
  };

  const getFlowTitle = (flowId: string) => {
    switch (flowId) {
      case 'career_discovery': return 'Career Discovery';
      case 'scholarships': return 'Scholarship Finder';
      case 'resume_help': return 'Resume Builder Guide';
      case 'interview_prep': return 'Interview Preparation';
      case 'freelance_guide': return 'Freelancing Guide';
      default: return 'Career Discussion';
    }
  };

  const handleNodeTransition = (node: FlowNode) => {
    setIsTyping(true);
    setCurrentNode(null); // hide options while typing

    setTimeout(() => {
      setIsTyping(false);
      setCurrentNode(node);
      addMessage('ai', node.message, node.resultCard);
      
      if (!isMuted) {
        playVoice(node.id, node.message);
      }
    }, 800);
  };

  const addMessage = (role: 'user' | 'ai', content: string, resultCard?: any) => {
    if (!currentChat) return;
    
    // Store resultCard data as JSON string in content if needed, or just append it to content for simplicity
    // To keep the data structure simple, we'll append the result card info to the text content if it exists
    let finalContent = content;
    if (resultCard) {
       finalContent += `\n\n**RESULT CARD: ${resultCard.title}**\n- Salary: ${resultCard.salary}\n- Timeline: ${resultCard.timeToReady}\n- Skills: ${resultCard.skills.join(', ')}\n- First Step: ${resultCard.firstStep}`;
    }

    const newMessage: ChatMessage = {
      id: generateId(),
      role,
      content: finalContent,
      timestamp: new Date().toISOString(),
    };
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
      updatedAt: new Date().toISOString(),
    };
    saveChat(updatedChat);
  };

  const handleOptionClick = (option: { text: string, nextId: string }) => {
    if (!currentNode || !activeFlowId) return;
    
    stopVoice();
    
    // Check if it's a navigation command
    if (option.nextId.startsWith('nav_')) {
      const route = option.nextId.replace('nav_', '');
      navigate(`/${route}`);
      return;
    }

    addMessage('user', option.text);
    
    if (option.nextId === 'start') {
      setNodeHistory([]);
      const startNode = getStartNode(activeFlowId);
      if (startNode) handleNodeTransition(startNode);
      return;
    }

    setNodeHistory(prev => [...prev, currentNode.id]);
    const nextNode = getNode(activeFlowId, option.nextId);
    if (nextNode) {
      handleNodeTransition(nextNode);
    }
  };

  const goBack = () => {
    if (nodeHistory.length === 0 || !activeFlowId) return;
    stopVoice();
    const prevNodeId = nodeHistory[nodeHistory.length - 1];
    const prevNode = getNode(activeFlowId, prevNodeId);
    
    setNodeHistory(prev => prev.slice(0, -1));
    if (prevNode) {
      setCurrentNode(prevNode);
      // We don't re-add the message to chat history on 'back' to avoid clutter, 
      // just show the options for the previous node
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('nxraahnuma_voice_muted', newMuted.toString());
    if (newMuted) {
      stopVoice();
    }
  };

  const playVoice = (messageId: string, text: string) => {
    stopVoice();
    setPlayingMessageId(messageId);
    const settings = getSettings();
    speak(stripMarkdown(text), {
      voiceId: settings.voiceId,
      rate: settings.voiceSpeed,
      pitch: settings.voicePitch,
      onEnd: () => setPlayingMessageId(null)
    });
  };

  const stopVoice = () => {
    stopSpeaking();
    setPlayingMessageId(null);
  };

  const handleMessageVoiceToggle = (msgId: string, text: string) => {
    if (playingMessageId === msgId) {
      stopVoice();
    } else {
      playVoice(msgId, text);
    }
  };

  if (!currentChat) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] pt-16 pb-16 sm:pb-0 bg-[#f4f8fd] dark:bg-[#0a1220]">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={startNewChat}
            className="w-full py-2 px-4 bg-[#1673CA] hover:bg-[#0d4f8c] text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4" />
            New Career Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => { stopVoice(); navigate(`/chat/${chat.id}`); }}
              className={`w-full text-left px-3 py-2 rounded-lg truncate text-sm transition-colors ${
                chat.id === currentChat.id
                  ? 'bg-blue-50 dark:bg-[#1673CA]/10 text-[#1673CA] font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {chat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] flex items-center justify-between px-6">
          <h2 className="font-semibold text-gray-800 dark:text-white truncate">
            {currentChat.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${
                !isMuted 
                  ? 'bg-[#1673CA]/10 text-[#1673CA]' 
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {currentChat.messages.length === 0 && !activeFlowId ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-blue-100 dark:bg-[#1673CA]/20 rounded-full flex items-center justify-center">
                <Compass className="w-10 h-10 text-[#1673CA]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to NX RaahNuma
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Your AI-powered career counselor. Choose a topic to start your personalized journey.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                <button onClick={() => handleFlowSelect('career_discovery')} className="p-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-[#1673CA] dark:hover:border-[#1673CA] transition-colors text-left group">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#1673CA]">Career Discovery</h3>
                  <p className="text-sm text-gray-500 mt-1">Find your ideal career path based on your interests.</p>
                </button>
                <button onClick={() => handleFlowSelect('scholarships')} className="p-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-[#1673CA] dark:hover:border-[#1673CA] transition-colors text-left group">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#1673CA]">Find Scholarships</h3>
                  <p className="text-sm text-gray-500 mt-1">Discover funding opportunities worldwide.</p>
                </button>
                <button onClick={() => handleFlowSelect('resume_help')} className="p-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-[#1673CA] dark:hover:border-[#1673CA] transition-colors text-left group">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#1673CA]">Resume Help</h3>
                  <p className="text-sm text-gray-500 mt-1">Build or improve your professional resume.</p>
                </button>
                <button onClick={() => handleFlowSelect('interview_prep')} className="p-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-[#1673CA] dark:hover:border-[#1673CA] transition-colors text-left group">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#1673CA]">Interview Prep</h3>
                  <p className="text-sm text-gray-500 mt-1">Get ready for your big day.</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentChat.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
                  <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mt-1 ${
                    msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-[#1673CA]'
                  }`}>
                    {msg.role === 'user' ? (
                      profile?.photo ? <img src={profile.photo} alt="You" className="w-full h-full rounded-lg object-cover" /> : <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Compass className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-[#1673CA] text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm relative group'
                  }`}>
                    {msg.role === 'ai' && (
                      <button 
                        onClick={() => handleMessageVoiceToggle(msg.id, msg.content)}
                        className="absolute -right-10 top-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-[#1673CA] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {playingMessageId === msg.id ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed prose dark:prose-invert max-w-none text-sm sm:text-base">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-[#1673CA] flex items-center justify-center mt-1">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Options) */}
        {currentNode && !isTyping && currentNode.options && currentNode.options.length > 0 && (
          <div className="p-4 bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-3xl mx-auto flex flex-col gap-2">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Choose an option:</span>
                {nodeHistory.length > 0 && (
                  <button onClick={goBack} className="text-xs font-medium text-gray-500 hover:text-[#1673CA] flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {currentNode.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(opt)}
                    className="px-4 py-2 bg-blue-50 dark:bg-gray-800 text-[#1673CA] dark:text-blue-400 border border-blue-100 dark:border-gray-700 rounded-lg hover:bg-[#1673CA] hover:text-white transition-colors text-sm font-medium text-left"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
