import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, CheckCheck, User, MoreVertical, Mic, Paperclip, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export default function TelegramSimulator({ onMessageSent }) {
  const [messages, setMessages] = useState([
    { 
      text: "Namaste 🙏! Main Antim Rupee (Government of India) ka AI Sahayak hoon. Kripya apni samasya (problem) ya suzhaav (suggestion) darj karein.", 
      sender: "bot", 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const newMsg = { text: "📷 Image Uploaded for Analysis", image: base64String, sender: "user", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      setMessages(prev => [...prev, newMsg]);
      setIsTyping(true);

      try {
        const response = await fetch(`${API_BASE_URL}/upload_evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_b64: base64String.split(',')[1] })
        });
        const data = await response.json();
        
        setIsTyping(false);
        setMessages(prev => [...prev, {
          text: `🚨 AI Vision Analysis Complete:\nIssue: ${data.issue}\nSeverity: ${data.severity}\nConfidence: ${(data.confidence * 100).toFixed(1)}%\n\nPlease provide the exact location (Village/Ward) so I can log this ticket.`,
          sender: "bot",
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
      } catch (err) {
        setIsTyping(false);
        setMessages(prev => [...prev, { text: "Error connecting to Gemini Vision API.", sender: "bot", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      }
    };
    reader.readAsDataURL(file);
  };

  const recognitionRef = useRef(null);

  const startVoiceRecording = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInput("Ward 15 mein paani ki pipe buri tarah toot gayi hai");
      }, 2500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      setInput("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscript + interimTranscript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsgText = input;
    const newMsg = { text: userMsgText, sender: "user", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    if (onMessageSent) {
      onMessageSent(userMsgText);
    }

    setIsTyping(true);
    
    try {
      const history = messages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsgText,
          history: history
        })
      });
      
      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: data.reply || "Error: Bot response empty.",
        sender: "bot",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: "Kshama karein, server connection fail ho gaya. Please ensure the backend is running (uvicorn main:app).",
        sender: "bot",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }
  };

  return (
    <div className="w-full max-w-[360px] h-[600px] bg-[#9BBCE3] rounded-[2.5rem] overflow-hidden border-[12px] border-gray-900 shadow-2xl flex flex-col relative font-sans">
      {/* Dynamic Island / Camera Cutout */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>

      {/* Header */}
      <div className="bg-[#3390EC] text-white p-4 pt-8 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2 w-full">
          <ChevronLeft size={24} className="text-white cursor-pointer" />
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0">
             <User size={24} />
          </div>
          <div className="flex-1 overflow-hidden ml-1">
            <h3 className="font-semibold text-[15px] flex items-center gap-1 leading-tight">
              Antim Rupee Gov AI 
              <span className="text-[10px] bg-white/20 px-1 py-0.5 rounded text-white font-medium ml-1">bot</span>
            </h3>
            <p className="text-[12px] text-blue-100">{isTyping ? "typing..." : "online"}</p>
          </div>
          <div className="flex gap-3">
             <MoreVertical size={20} className="text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#9BBCE3] relative">
        <div className="flex justify-center relative z-10 mb-4">
          <span className="bg-black/20 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </span>
        </div>

        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            key={idx} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
          >
            <div className={`max-w-[85%] rounded-[1.2rem] p-2.5 px-3 shadow-sm relative ${msg.sender === 'user' ? 'bg-[#EEFFDE] rounded-br-sm' : 'bg-white rounded-bl-sm'}`}>
              {msg.image && <img src={msg.image} alt="upload" className="w-full h-auto max-h-48 object-cover rounded-lg mb-2 border border-black/5" />}
              <p className="text-gray-900 text-[15px] leading-snug whitespace-pre-wrap">{msg.text}</p>
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className={`text-[11px] ${msg.sender === 'user' ? 'text-[#43A160]' : 'text-gray-400'}`}>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck size={14} className="text-[#43A160]" />}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start relative z-10"
            >
              <div className="bg-white rounded-[1.2rem] rounded-bl-sm p-3 shadow-sm flex items-center gap-1.5 w-16 h-10">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="bg-white p-2 flex gap-2 items-end relative z-10">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-400 p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 mb-0.5">
          <Paperclip size={22} className="transform rotate-45" />
        </button>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping || isRecording}
          placeholder={isRecording ? "Listening..." : "Message"} 
          rows={1}
          className={`flex-1 bg-transparent px-1 py-3 text-[15px] text-black placeholder-gray-400 focus:outline-none disabled:opacity-50 resize-none self-center max-h-24 ${isRecording ? 'animate-pulse text-red-500' : ''}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        
        {input.trim() ? (
          <button 
            type="submit" 
            disabled={isTyping}
            className="p-3 rounded-full text-[#3390EC] hover:bg-[#F4F4F5] transition-colors flex-shrink-0 mb-0.5"
          >
            <Send size={24} />
          </button>
        ) : (
          <button 
            type="button" 
            onClick={startVoiceRecording}
            disabled={isTyping}
            className={`p-3 rounded-full transition-colors flex-shrink-0 mb-0.5 ${isRecording ? 'text-red-500 animate-pulse bg-red-50' : 'text-[#3390EC] hover:bg-[#F4F4F5]'}`}
          >
            <Mic size={24} />
          </button>
        )}
      </form>
    </div>
  );
}
