import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse, ChatbotMessage } from '../lib/api';

interface ChatAssistantProps {
  className?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m the ResQconnect assistant. How can I help you with disaster preparedness or emergency response today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(updatedMessages);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Get response from chatbot API
      const response = await getChatbotResponse(userMessage, messages);
      
      // Add assistant response to chat
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      // Add error message
      setMessages([
        ...updatedMessages,
        { 
          role: 'assistant', 
          content: 'I\'m sorry, I encountered an error. Please try again later.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md flex flex-col ${className}`}>
      <div className="bg-primary text-white p-3 rounded-t-lg">
        <h3 className="font-medium">Emergency Response Assistant</h3>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto max-h-80">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-3 ${message.role === 'assistant' ? 'mr-12' : 'ml-12'}`}
          >
            <div 
              className={`p-3 rounded-lg ${
                message.role === 'assistant' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-primary-100 text-primary-800'
              }`}
            >
              {message.content}
            </div>
            <div 
              className={`text-xs mt-1 text-gray-500 ${
                message.role === 'assistant' ? 'text-left' : 'text-right'
              }`}
            >
              {message.role === 'assistant' ? 'ResQconnect Assistant' : 'You'}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-3 mr-12">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            <div className="text-xs mt-1 text-gray-500 text-left">
              ResQconnect Assistant
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t p-3">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about disaster preparedness..."
            className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-r-md transition-colors"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          For emergencies, please call your local emergency number immediately.
        </p>
      </form>
    </div>
  );
};

export default ChatAssistant; 