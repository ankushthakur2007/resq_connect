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

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Get username from local storage or prompt
    const storedUsername = localStorage.getItem('disaster-chat-username')
    if (storedUsername) {
      setUsername(storedUsername)
    } else {
      const name = prompt('Enter your name for the chat:') || 'Anonymous'
      setUsername(name)
      localStorage.setItem('disaster-chat-username', name)
    }
    
    // Fetch previous messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(50)
      
      if (!error && data) {
        setMessages(data)
      }
    }
    
    fetchMessages()
    
    // Subscribe to new messages
    const channel = pusher.subscribe('chat')
    channel.bind('new-message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })
    
    return () => {
      pusher.unsubscribe('chat')
    }
  }, [])
  
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
    
    // Save to Supabase
    await supabase.from('chat_messages').insert([messageData])
    
    // Broadcast via Pusher
    await pusher.trigger('chat', 'new-message', messageData)
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg shadow-md">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Volunteer Chat</h2>
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