'use client'
import { useEffect, useState, useRef } from 'react'
import { pusher } from '@/lib/pusher'
import { supabase } from '@/lib/supabase'

type Message = {
  id: string;
  text: string;
  user: string;
  timestamp: string;
}

// Sample messages for GitHub Pages demo
const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Emergency response team dispatched to the flood zone in Manila.',
    user: 'Dispatcher',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    text: 'We need more volunteers at the evacuation center on Main Street.',
    user: 'Coordinator',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: '3',
    text: 'Medical supplies are running low at the earthquake site.',
    user: 'EMT1',
    timestamp: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: '4',
    text: 'Road to north district is blocked. Use alternate routes.',
    user: 'Police Officer',
    timestamp: new Date(Date.now() - 600000).toISOString()
  }
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [isGitHubPages, setIsGitHubPages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Check if on GitHub Pages
    if (typeof window !== 'undefined') {
      const isGitHub = window.location.hostname.includes('github.io');
      setIsGitHubPages(isGitHub);
      
      // Get username from local storage or prompt
      const storedUsername = localStorage.getItem('disaster-chat-username')
      if (storedUsername) {
        setUsername(storedUsername)
      } else {
        const defaultName = isGitHub ? 'Demo User' : 'Anonymous';
        const name = prompt('Enter your name for the chat:') || defaultName;
        setUsername(name)
        localStorage.setItem('disaster-chat-username', name)
      }
      
      // For GitHub Pages, use sample data
      if (isGitHub) {
        console.log('Using sample chat data for GitHub Pages demo');
        setMessages(SAMPLE_MESSAGES);
        return;
      }
    }
    
    // Regular functionality - fetch from Supabase
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .order('timestamp', { ascending: true })
          .limit(50)
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMessages(data)
        } else {
          // If no messages, fallback to sample data
          setMessages(SAMPLE_MESSAGES)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        // Fallback to sample data on error
        setMessages(SAMPLE_MESSAGES)
      }
    }
    
    fetchMessages()
    
    // Only set up Pusher if not on GitHub Pages
    if (!isGitHubPages) {
      const channel = pusher.subscribe('chat')
      channel.bind('new-message', (message: Message) => {
        setMessages(prev => [...prev, message])
      })
      
      return () => {
        pusher.unsubscribe('chat')
      }
    }
  }, [isGitHubPages])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const sendMessage = async () => {
    if (!newMessage.trim()) return
    
    const messageData = {
      id: Date.now().toString(),
      text: newMessage,
      user: username,
      timestamp: new Date().toISOString()
    }
    
    // Add to local state immediately for responsive UI
    setMessages(prev => [...prev, messageData])
    setNewMessage('')
    
    if (isGitHubPages) {
      console.log('Demo mode: Message would be saved to Supabase and broadcasted via Pusher');
      return;
    }
    
    try {
      // Save to Supabase
      await supabase.from('chat_messages').insert([messageData])
      
      // Broadcast via Pusher
      await pusher.trigger('chat', 'new-message', messageData)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg shadow-md">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Volunteer Chat</h2>
        {isGitHubPages && (
          <p className="text-xs text-blue-100 mt-1">Demo Mode: Messages won't be saved or broadcast</p>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={`mb-4 ${message.user === username ? 
                'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg ${message.user === username ? 
                  'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                <p>{message.text}</p>
                <div className="text-xs mt-1 opacity-70">
                  {message.user} • {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
} 