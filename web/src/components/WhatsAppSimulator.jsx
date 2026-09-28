import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, CheckCheck, User, MoreVertical, Mic, Paperclip } from 'lucide-react';
import VoicePill from './VoicePill';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export default function WhatsAppSimulator({ onMessageSent }) {
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

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser does not support SpeechRecognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = true;

    // Track the fully finalized text so we don't lose it on pauses
    let finalAccumulated = input; 
    
    recognition.onstart = () => {
      setIsRecording(true);
      if (!finalAccumulated) {
        setInput("");
      }
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalAccumulated += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      setInput(finalAccumulated + interimTranscript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsgText = input;
    const newMsg = { text: userMsgText, sender: "user", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    // Notify parent component to trigger dashboard animations
    if (onMessageSent) {
      onMessageSent(userMsgText);
    }

    setIsTyping(true);
    
    try {
      // Map UI state to API history array
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
    <div className="w-full max-w-[360px] h-[600px] bg-[#E5DDD5] rounded-[2.5rem] overflow-hidden border-[12px] border-gray-900 shadow-2xl flex flex-col relative font-sans">
      {/* Dynamic Island / Camera Cutout */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>

      {/* Header */}
      <div className="bg-[#075E54] text-white p-4 pt-8 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
            <User size={24} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075E54] rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1">
              Antim Rupee Gov AI 
              <span className="inline-block w-3.5 h-3.5 bg-green-500 text-white rounded-full text-[9px] text-center leading-3 shadow-sm">✓</span>
            </h3>
            <p className="text-[10px] text-green-100">{isTyping ? "typing..." : "Powered by Gemini 3.5"}</p>
          </div>
        </div>
        <MoreVertical size={20} className="text-green-100" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover relative">
        <div className="absolute inset-0 bg-white/40" /> {/* Overlay for readability */}
        
        <div className="flex justify-center relative z-10 mb-4">
          <span className="bg-[#E1F3FB] text-gray-600 text-[10px] font-medium px-3 py-1 rounded-lg shadow-sm">
            SECURE GOVERNMENT CHANNEL
          </span>
        </div>

        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            key={idx} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
          >
            <div className={`max-w-[85%] rounded-2xl p-2.5 px-3 shadow-sm relative ${msg.sender === 'user' ? 'bg-[#DCF8C6] rounded-br-sm' : 'bg-white rounded-bl-sm'}`}>
              {msg.image && <img src={msg.image} alt="upload" className="w-full h-auto max-h-48 object-cover rounded-lg mb-2 border border-black/5" />}
              <p className="text-gray-800 text-sm leading-snug whitespace-pre-wrap">{msg.text}</p>
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[10px] text-gray-500">{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck size={14} className="text-blue-500" />}
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
              <div className="bg-white rounded-2xl rounded-bl-sm p-3 shadow-sm flex items-center gap-1.5 w-16 h-10">
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
      <form onSubmit={handleSend} className="bg-[#F0F2F5] p-2 flex gap-2 items-center relative z-10">
        <div className="flex-1 bg-white rounded-full flex items-center px-2 py-1 shadow-sm border border-gray-200">
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping || isRecording}
            placeholder={isRecording ? "Listening..." : "Type your issue..."} 
            className={`flex-1 bg-transparent px-2 py-2 text-sm text-black placeholder-gray-500 focus:outline-none disabled:opacity-50 ${isRecording ? 'animate-pulse text-red-500' : ''}`}
          />
        </div>
        
        {input.trim() ? (
          <button 
            type="submit" 
            disabled={isTyping}
            className="p-3 rounded-full shadow-sm transition-colors bg-[#128C7E] text-white hover:bg-[#075E54]"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        ) : (
          <VoicePill
            accentColor="#ffffff"
            iconColor="#ffffff"
            background="#128C7E"
            size={44}
            reactive="mic"
            onStart={startSpeechRecognition}
            onStop={stopSpeechRecognition}
          />
        )}
      </form>
    </div>
  );
}
